from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import hashlib
import datetime
import uuid
import shutil
import os
from typing import Optional, List, Dict, Any

from backend.database import get_db_connection, init_db, UPLOADS_DIR

app = FastAPI(title="Mediease API")

# Setup CORS for development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded documents
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

ALLOWED_DOCUMENT_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

RED_FLAG_KEYWORDS = [
    "chest pain",
    "chest discomfort",
    "shortness of breath",
    "breathlessness",
    "difficulty breathing",
    "unconscious",
    "fainting",
    "seizure",
    "convulsion",
    "severe bleeding",
    "blood in stool",
    "blood in vomit",
    "very high fever",
    "severe headache",
    "one-sided weakness",
    "slurred speech",
    "suicidal",
]


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# -----------------
# Helpers
# -----------------

def get_history_map(cursor, session_id):
    """Return a dict of section_name -> answer_text for a session."""
    cursor.execute(
        "SELECT section_name, answer_text FROM history WHERE session_id = ?", (session_id,)
    )
    return {row["section_name"]: row["answer_text"] for row in cursor.fetchall()}


def detect_red_flags(text: str) -> List[str]:
    """Simple, non-diagnostic urgency flags based on keywords in the history."""
    if not text:
        return []
    lowered = text.lower()
    flags = []
    for kw in RED_FLAG_KEYWORDS:
        if kw in lowered:
            flags.append(kw)
    return flags


def build_chief_complaint_headers(flags: List[str]):
    """Build placeholder text mentioning which keyword triggered the flag."""
    if not flags:
        return []
    return [f"'{f}' appears in the submitted history." for f in flags]


def generate_clinical_summary(history_map: Dict[str, str]) -> str:
    """
    Template-based, clinically-worded draft summary built from the patient's
    actual answers. It never makes a diagnosis and clearly states that
    clinician verification is required.
    """

    def get(section):
        value = (history_map.get(section) or "").strip()
        return value

    cc = get("chief_complaint") or "Not provided"
    hpi = get("history_present_illness") or "Not provided"
    past_med = get("past_medical_history") or "No significant past medical history reported."
    past_surg = get("past_surgical_history") or "No significant past surgical history reported."
    meds = get("medications") or "No current medications reported."
    allergies = get("allergies") or "No known allergies reported."
    family = get("family_history") or "No significant family history reported."
    personal = get("personal_history") or "Not provided."
    ros = get("review_of_systems") or "No additional symptoms reported."
    dept = get("department") or "Not specified"
    language = history_map.get("language") or "English"

    lines = []
    lines.append("AI-ASSISTED CLINICAL SUMMARY (DRAFT)")
    lines.append("")
    lines.append(f"Department of consultation: {dept}")
    lines.append(f"Case-taking language: {language}")
    lines.append("")
    lines.append("Presenting Concern")
    lines.append("-" * 40)
    lines.append(f"The patient reports: \"{cc}\".")
    if hpi and hpi != "Not provided":
        lines.append(f"History of present illness as described by the patient: {hpi}")
    lines.append("")
    lines.append("Past Medical History")
    lines.append("-" * 40)
    lines.append(f"Past medical history information provided: {past_med}")
    if past_surg and past_surg != "No significant past surgical history reported.":
        lines.append(f"Past surgical history provided: {past_surg}")
    lines.append("")
    lines.append("Medications")
    lines.append("-" * 40)
    lines.append(f"Current medications reported by the patient: {meds}")
    lines.append("")
    lines.append("Allergies")
    lines.append("-" * 40)
    lines.append(f"Allergy information provided: {allergies}")
    lines.append("")
    lines.append("Relevant History")
    lines.append("-" * 40)
    lines.append(f"Family history provided: {family}")
    lines.append(f"Personal history provided: {personal}")
    lines.append("")
    lines.append("Review of Systems")
    lines.append("-" * 40)
    lines.append(f"Additional symptoms reported: {ros}")
    lines.append("")
    lines.append("Clinical Review Note")
    lines.append("-" * 40)
    lines.append(
        "This summary is generated from patient-provided information during case taking "
        "and is intended only as a structured DRAFT for clinician verification. "
        "It does not constitute a diagnosis, medical advice, or a treatment recommendation. "
        "The clinician must verify all information before clinical use."
    )
    return "\n".join(lines)


def case_to_red_flags(cursor, session_id):
    history_map = get_history_map(cursor, session_id)
    all_text = " ".join(
        [v for v in history_map.values() if isinstance(v, str)]
    )
    # Focus on clinically sensitive sections
    sensitive_text = " ".join(
        [
            history_map.get("chief_complaint", "") or "",
            history_map.get("history_present_illness", "") or "",
            history_map.get("review_of_systems", "") or "",
        ]
    )
    return detect_red_flags(sensitive_text)


def build_case_rows(cursor, case_id):
    """Return a combined case detail dict from the database."""
    cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,))
    session = cursor.fetchone()
    if not session:
        return None

    session_data = dict(session)

    cursor.execute(
        "SELECT * FROM patients WHERE patient_id = ?", (session_data["patient_id"],)
    )
    patient = cursor.fetchone()
    patient_data = dict(patient) if patient else {}

    cursor.execute("SELECT * FROM history WHERE session_id = ?", (case_id,))
    history = [dict(row) for row in cursor.fetchall()]

    cursor.execute(
        "SELECT * FROM summaries WHERE session_id = ?", (case_id,)
    )
    summary_row = cursor.fetchone()
    summary = dict(summary_row) if summary_row else None

    cursor.execute(
        "SELECT * FROM doctor_feedback WHERE session_id = ? ORDER BY created_at ASC", (case_id,)
    )
    feedback = [dict(row) for row in cursor.fetchall()]

    cursor.execute(
        "SELECT * FROM history_corrections WHERE session_id = ? ORDER BY created_at ASC", (case_id,)
    )
    corrections = [dict(row) for row in cursor.fetchall()]

    cursor.execute(
        "SELECT * FROM documents WHERE session_id = ? OR patient_id = ? ORDER BY uploaded_at DESC",
        (case_id, session_data["patient_id"]),
    )
    documents = [dict(row) for row in cursor.fetchall()]

    red_flags = case_to_red_flags(cursor, case_id)

    # Doctor name if reviewed
    doctor_name = None
    if session_data.get("doctor_id"):
        cursor.execute(
            "SELECT doctor_name FROM doctors WHERE doctor_id = ?",
            (session_data["doctor_id"],),
        )
        drow = cursor.fetchone()
        doctor_name = drow["doctor_name"] if drow else None

    return {
        "session": session_data,
        "patient": patient_data,
        "history": history,
        "summary": summary,
        "feedback": feedback,
        "corrections": corrections,
        "documents": documents,
        "red_flags": red_flags,
        "doctor_name": doctor_name,
    }


# -----------------
# Pydantic Models
# -----------------

class LoginRequest(BaseModel):
    username: str
    password: str


class PatientRegisterRequest(BaseModel):
    username: str
    password: str
    full_name: str
    dob: str
    age: int
    gender: str
    mobile: str
    email: Optional[str] = None
    abha_id: Optional[str] = None


class DoctorRegisterRequest(BaseModel):
    doctor_name: str
    mobile: str
    email: str
    medical_registration_number: str
    specialization: str
    password: str
    username: Optional[str] = None


class NewCaseRequest(BaseModel):
    patient_id: str
    language: str


class LanguageUpdateRequest(BaseModel):
    language: str


class AutoSaveRequest(BaseModel):
    section_name: str
    answer_text: str


class DoctorCorrectionRequest(BaseModel):
    doctor_id: str
    section_name: str
    original_value: str
    corrected_value: str
    doctor_note: str


class DoctorFeedbackRequest(BaseModel):
    doctor_id: str
    feedback: str


class DoctorSummaryEditRequest(BaseModel):
    doctor_id: str
    edited_summary: str


class VerifyCaseRequest(BaseModel):
    doctor_id: str
    verified_summary: str


class StatusUpdateRequest(BaseModel):
    status: str  # SUBMITTED / REVIEWED / CONFIRMED / IN_PROGRESS


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    abha_id: Optional[str] = None


# -----------------
# AUTH ENDPOINTS
# -----------------

@app.post("/api/auth/register/patient")
def register_patient(req: PatientRegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Username is the mobile number used at login
    existing = cursor.execute(
        "SELECT * FROM users WHERE username = ? OR patient_id = ?",
        (req.username, req.mobile),
    ).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this mobile number already exists. Please login instead.")

    # Also prevent the same mobile being used for two patients
    dup_mobile = cursor.execute(
        "SELECT * FROM patients WHERE mobile = ?", (req.mobile,)
    ).fetchone()
    if dup_mobile:
        conn.close()
        raise HTTPException(status_code=400, detail="This mobile number is already registered.")

    cursor.execute("SELECT COUNT(*) as count FROM patients")
    count = cursor.fetchone()["count"]
    patient_id = f"MED{10000 + count + 1}"

    try:
        cursor.execute(
            """
            INSERT INTO patients (patient_id, full_name, dob, age, gender, mobile, email, abha_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                patient_id,
                req.full_name,
                req.dob,
                req.age,
                req.gender,
                req.mobile,
                req.email,
                req.abha_id,
            ),
        )

        pwd_hash = hash_password(req.password)
        cursor.execute(
            """
            INSERT INTO users (username, password_hash, role, patient_id)
            VALUES (?, ?, 'patient', ?)
            """,
            (req.username, pwd_hash, patient_id),
        )

        conn.commit()
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Something went wrong while creating your account. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass

    return {"message": "Registration successful", "patient_id": patient_id, "role": "patient"}


@app.post("/api/auth/register/doctor")
def register_doctor(req: DoctorRegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    username = (req.username or "").strip() or req.mobile

    existing = cursor.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="This username / mobile number is already registered.")

    dup_mobile = cursor.execute(
        "SELECT * FROM doctors WHERE mobile = ?", (req.mobile,)
    ).fetchone()
    if dup_mobile:
        conn.close()
        raise HTTPException(status_code=400, detail="This mobile number is already registered for a doctor.")

    cursor.execute("SELECT COUNT(*) as count FROM doctors")
    count = cursor.fetchone()["count"]
    doctor_id = f"DOC{20000 + count + 1}"

    try:
        cursor.execute(
            """
            INSERT INTO doctors (doctor_id, doctor_name, mobile, email, medical_registration_number, specialization)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                doctor_id,
                req.doctor_name,
                req.mobile,
                req.email,
                req.medical_registration_number,
                req.specialization,
            ),
        )

        pwd_hash = hash_password(req.password)
        cursor.execute(
            """
            INSERT INTO users (username, password_hash, role, doctor_id)
            VALUES (?, ?, 'doctor', ?)
            """,
            (username, pwd_hash, doctor_id),
        )

        conn.commit()
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Something went wrong while creating your account. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass

    return {"message": "Registration successful", "doctor_id": doctor_id, "role": "doctor"}


@app.post("/api/auth/login")
def login(req: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    if hash_password(req.password) != user["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Simple token mock (IDs stored in localStorage for this prototype)
    return {
        "message": "Login successful",
        "role": user["role"],
        "patient_id": user["patient_id"],
        "doctor_id": user["doctor_id"],
    }


# -----------------
# PATIENT ENDPOINTS
# -----------------

@app.get("/api/patient/{patient_id}/profile")
def get_patient_profile(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT patient_id, full_name, dob, age, gender, mobile, email, abha_id, created_at
        FROM patients WHERE patient_id = ?
        """,
        (patient_id,),
    )
    patient = cursor.fetchone()
    conn.close()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {"success": True, "data": dict(patient)}


@app.put("/api/patient/{patient_id}/profile")
def update_patient_profile(patient_id: str, req: ProfileUpdateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM patients WHERE patient_id = ?", (patient_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    updates = []
    params = []
    if req.full_name is not None:
        updates.append("full_name = ?")
        params.append(req.full_name)
    if req.age is not None:
        updates.append("age = ?")
        params.append(req.age)
    if req.gender is not None:
        updates.append("gender = ?")
        params.append(req.gender)
    if req.mobile is not None:
        updates.append("mobile = ?")
        params.append(req.mobile)
    if req.email is not None:
        updates.append("email = ?")
        params.append(req.email)
    if req.abha_id is not None:
        updates.append("abha_id = ?")
        params.append(req.abha_id)

    if updates:
        params.append(patient_id)
        query = f"UPDATE patients SET {', '.join(updates)} WHERE patient_id = ?"
        cursor.execute(query, tuple(params))
        conn.commit()

    # Also update the username (login) if the mobile number changed
    if req.mobile is not None:
        cursor.execute(
            "UPDATE users SET username = ? WHERE patient_id = ? AND role = 'patient'",
            (req.mobile, patient_id),
        )
        conn.commit()

    conn.close()
    return {"success": True, "message": "Profile updated successfully."}


@app.post("/api/patient/cases/new")
def create_new_case(req: NewCaseRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verify patient exists
    p = cursor.execute("SELECT * FROM patients WHERE patient_id = ?", (req.patient_id,)).fetchone()
    if not p:
        conn.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    cursor.execute("SELECT COUNT(*) as count FROM sessions")
    count = cursor.fetchone()["count"]
    session_id = f"CASE{1001 + count}"

    try:
        cursor.execute(
            """
            INSERT INTO sessions (session_id, patient_id, language, status)
            VALUES (?, ?, ?, 'IN_PROGRESS')
            """,
            (session_id, req.patient_id, req.language),
        )
        conn.commit()
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Could not start a new case. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass

    return {"message": "Case started successfully", "case_id": session_id}


@app.put("/api/patient/cases/{case_id}/language")
def update_case_language(case_id: str, req: LanguageUpdateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")
    cursor.execute(
        "UPDATE sessions SET language = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?",
        (req.language, case_id),
    )
    conn.commit()
    conn.close()
    return {"message": "Language updated", "language": req.language}


@app.post("/api/patient/cases/{case_id}/autosave")
def autosave_case(case_id: str, req: AutoSaveRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,))
        if not cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=404, detail="Case not found")

        # If not yet submitted, save; once submitted, patient answers are locked.
        cursor.execute(
            "SELECT status FROM sessions WHERE session_id = ?", (case_id,)
        )
        status = cursor.fetchone()["status"]
        if status and status.upper() in ("SUBMITTED", "REVIEWED", "CONFIRMED"):
            conn.close()
            raise HTTPException(status_code=400, detail="This case has already been submitted and can no longer be edited.")

        cursor.execute(
            "SELECT history_id FROM history WHERE session_id = ? AND section_name = ?",
            (case_id, req.section_name),
        )
        row = cursor.fetchone()

        if row:
            cursor.execute(
                "UPDATE history SET answer_text = ? WHERE history_id = ?",
                (req.answer_text, row["history_id"]),
            )
        else:
            cursor.execute(
                "INSERT INTO history (session_id, section_name, answer_text) VALUES (?, ?, ?)",
                (case_id, req.section_name, req.answer_text),
            )

        cursor.execute(
            "UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = ?", (case_id,)
        )
        conn.commit()
    except HTTPException:
        conn.close()
        raise
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Could not save your answer. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return {"message": "Saved successfully"}


@app.post("/api/patient/cases/{case_id}/submit")
def submit_case(case_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,))
        session = cursor.fetchone()
        if not session:
            conn.close()
            raise HTTPException(status_code=404, detail="Case not found")

        if session["status"].upper() in ("SUBMITTED", "REVIEWED", "CONFIRMED"):
            conn.close()
            return {"message": "Case already submitted", "case_id": case_id, "already_submitted": True}

        history_map = get_history_map(cursor, case_id)
        ai_draft = generate_clinical_summary(history_map)

        # Upsert summary
        cursor.execute("SELECT summary_id FROM summaries WHERE session_id = ?", (case_id,))
        exists = cursor.fetchone()
        if exists:
            cursor.execute(
                "UPDATE summaries SET ai_draft_text = ? WHERE session_id = ?",
                (ai_draft, case_id),
            )
        else:
            cursor.execute(
                "INSERT INTO summaries (session_id, ai_draft_text, is_verified) VALUES (?, ?, 0)",
                (case_id, ai_draft),
            )

        cursor.execute(
            "UPDATE sessions SET status = 'SUBMITTED', submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?",
            (case_id,),
        )
        conn.commit()
    except HTTPException:
        conn.close()
        raise
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Could not submit the case. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return {"message": "Case submitted successfully", "case_id": case_id}


@app.get("/api/patient/{patient_id}/cases")
def get_patient_cases(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT
            s.session_id as case_id,
            s.status,
            s.created_at,
            s.submitted_at,
            s.reviewed_at,
            s.language,
            (SELECT h.answer_text FROM history h
              WHERE h.session_id = s.session_id AND h.section_name = 'chief_complaint' LIMIT 1) as chief_complaint,
            (SELECT h.answer_text FROM history h
              WHERE h.session_id = s.session_id AND h.section_name = 'department' LIMIT 1) as department,
            (SELECT COUNT(*) FROM doctor_feedback f WHERE f.session_id = s.session_id) as feedback_count,
            (SELECT COUNT(*) FROM documents d WHERE d.session_id = s.session_id) as document_count
        FROM sessions s
        WHERE s.patient_id = ?
        ORDER BY s.created_at DESC
        """,
        (patient_id,),
    )
    cases = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"success": True, "data": cases}


@app.get("/api/patient/cases/{case_id}")
def get_case_details(case_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        result = build_case_rows(cursor, case_id)
    finally:
        conn.close()

    if not result:
        raise HTTPException(status_code=404, detail="Case not found. The case may have been removed.")

    return {"success": True, "data": result}


@app.get("/api/patient/cases/{case_id}/view")
def get_case_details_alias(case_id: str):
    """Alias used by older pages - points to the same data."""
    return get_case_details(case_id)


# -----------------
# DOCUMENT ENDPOINTS
# -----------------

@app.post("/api/documents/upload")
async def upload_document(
    patient_id: str = Form(...),
    case_id: Optional[str] = Form(None),
    document_type: str = Form("Other"),
    file: UploadFile = File(...),
):
    filename = file.filename or "document"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG or PNG files are allowed.",
        )

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="File is too large. Maximum allowed size is 10 MB.",
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    p = cursor.execute("SELECT * FROM patients WHERE patient_id = ?", (patient_id,)).fetchone()
    if not p:
        conn.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    if case_id:
        s = cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,)).fetchone()
        if not s:
            conn.close()
            raise HTTPException(status_code=404, detail="Case not found")

    # Save file to uploads directory with a unique name
    safe_name = f"{uuid.uuid4().hex[:8]}_{filename.replace(' ', '_')}"
    dest = UPLOADS_DIR / safe_name
    with open(dest, "wb") as out:
        out.write(contents)

    try:
        cursor.execute(
            """
            INSERT INTO documents (session_id, patient_id, file_name, document_type, file_path, file_type)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (case_id, patient_id, filename, document_type, safe_name, ext.lstrip(".")),
        )
        conn.commit()
    except Exception:
        conn.rollback()
        conn.close()
        if dest.exists():
            dest.unlink()
        raise HTTPException(status_code=500, detail="Could not save the document. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass

    return {
        "message": "Document uploaded successfully.",
        "document": {
            "document_id": cursor.lastrowid,
            "file_name": filename,
            "document_type": document_type,
            "file_path": safe_name,
            "uploaded_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
    }


@app.get("/api/patient/{patient_id}/documents")
def get_patient_documents(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT document_id, session_id, file_name, document_type, file_path, uploaded_at
        FROM documents
        WHERE patient_id = ?
        ORDER BY uploaded_at DESC
        """,
        (patient_id,),
    )
    docs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"success": True, "data": docs}


@app.get("/api/cases/{case_id}/documents")
def get_case_documents(case_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT document_id, patient_id, file_name, document_type, file_path, uploaded_at
        FROM documents
        WHERE session_id = ?
        ORDER BY uploaded_at DESC
        """,
        (case_id,),
    )
    docs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"success": True, "data": docs}


# -----------------
# DOCTOR ENDPOINTS
# -----------------

@app.get("/api/doctor/dashboard")
def get_doctor_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM patients")
    total_patients = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM sessions")
    total_cases = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM sessions WHERE status = 'SUBMITTED'")
    pending = cursor.fetchone()["count"]

    cursor.execute(
        "SELECT COUNT(*) as count FROM sessions WHERE status IN ('CONFIRMED', 'REVIEWED')"
    )
    reviewed = cursor.fetchone()["count"]

    # Priority = submitted cases where red-flag keywords appear in history
    priority = 0
    cursor.execute("SELECT session_id FROM sessions WHERE status = 'SUBMITTED'")
    for row in cursor.fetchall():
        flags = case_to_red_flags(cursor, row["session_id"])
        if flags:
            priority += 1

    cursor.execute(
        """
        SELECT s.session_id, s.status, s.created_at, p.patient_id, p.full_name, p.age, p.gender,
               (SELECT h.answer_text FROM history h
                WHERE h.session_id = s.session_id AND h.section_name = 'chief_complaint' LIMIT 1) as chief_complaint
        FROM sessions s
        JOIN patients p ON s.patient_id = p.patient_id
        ORDER BY s.created_at DESC
        LIMIT 20
        """
    )
    recent_cases = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return {
        "success": True,
        "data": {
            "stats": {
                "total_patients": total_patients,
                "total_cases": total_cases,
                "pending_cases": pending,
                "reviewed_cases": reviewed,
                "priority_cases": priority,
            },
            "recent_cases": recent_cases,
        },
    }


@app.get("/api/doctor/search")
def search_patients(q: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"%{q}%"
    cursor.execute(
        """
        SELECT p.patient_id, p.full_name, p.mobile, p.abha_id,
               (SELECT COUNT(*) FROM sessions s WHERE s.patient_id = p.patient_id) as case_count
        FROM patients p
        WHERE p.patient_id LIKE ? OR p.full_name LIKE ? OR p.mobile LIKE ? OR p.abha_id LIKE ?
        ORDER BY p.full_name
        """,
        (query, query, query, query),
    )

    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"success": True, "data": results}


@app.get("/api/doctor/patients/{patient_id}/summary")
def get_doctor_patient_summary(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT patient_id, full_name, dob, age, gender, mobile, email, abha_id, created_at
        FROM patients WHERE patient_id = ?
        """,
        (patient_id,),
    )
    patient = cursor.fetchone()
    if not patient:
        conn.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    cursor.execute(
        """
        SELECT
            s.session_id as case_id,
            s.status,
            s.created_at,
            s.submitted_at,
            s.reviewed_at,
            (SELECT h.answer_text FROM history h
              WHERE h.session_id = s.session_id AND h.section_name = 'chief_complaint' LIMIT 1) as chief_complaint,
            (SELECT COUNT(*) FROM doctor_feedback f WHERE f.session_id = s.session_id) as feedback_count
        FROM sessions s
        WHERE s.patient_id = ?
        ORDER BY s.created_at DESC
        """,
        (patient_id,),
    )
    cases = [dict(row) for row in cursor.fetchall()]
    d = dict(patient)
    d["total_cases"] = len(cases)
    d["last_visit"] = cases[0]["created_at"] if cases else None
    d["latest_case"] = cases[0] if cases else None
    conn.close()
    return {"success": True, "data": {"patient": d, "cases": cases}}


@app.put("/api/doctor/cases/{case_id}/summary")
def save_doctor_summary_edit(case_id: str, req: DoctorSummaryEditRequest):
    """Store the doctor's edited summary WITHOUT marking the case verified."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,))
        if not cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=404, detail="Case not found")

        cursor.execute(
            "UPDATE summaries SET doctor_edited_text = ?, is_verified = 0 WHERE session_id = ?",
            (req.edited_summary, case_id),
        )
        if cursor.rowcount == 0:
            cursor.execute(
                """
                INSERT INTO summaries (session_id, ai_draft_text, doctor_edited_text, is_verified)
                VALUES (?, '', ?, 0)
                """,
                (case_id, req.edited_summary),
            )
        conn.commit()
    except HTTPException:
        conn.close()
        raise
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Could not save the summary. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return {"message": "Summary saved successfully."}


@app.post("/api/doctor/cases/{case_id}/status")
def update_case_status(case_id: str, req: StatusUpdateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    status = req.status.upper()
    if status not in ("SUBMITTED", "REVIEWED", "CONFIRMED", "IN_PROGRESS"):
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid status value.")
    cursor.execute("UPDATE sessions SET status = ? WHERE session_id = ?", (status, case_id))
    conn.commit()
    conn.close()
    return {"message": "Status updated successfully."}


@app.post("/api/doctor/cases/{case_id}/correction")
def add_case_correction(case_id: str, req: DoctorCorrectionRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO history_corrections (session_id, doctor_id, section_name, original_value, corrected_value, doctor_note)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (case_id, req.doctor_id, req.section_name, req.original_value, req.corrected_value, req.doctor_note),
        )
        conn.commit()
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Could not save the correction. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return {"message": "Correction saved successfully."}


@app.post("/api/doctor/cases/{case_id}/feedback")
def add_case_feedback(case_id: str, req: DoctorFeedbackRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Update the latest feedback if present, otherwise insert a new one
        cursor.execute(
            "SELECT feedback_id FROM doctor_feedback WHERE session_id = ? ORDER BY created_at DESC LIMIT 1",
            (case_id,),
        )
        existing = cursor.fetchone()
        if existing:
            cursor.execute(
                "UPDATE doctor_feedback SET feedback = ? WHERE feedback_id = ?",
                (req.feedback, existing["feedback_id"]),
            )
        else:
            cursor.execute(
                "INSERT INTO doctor_feedback (session_id, doctor_id, feedback) VALUES (?, ?, ?)",
                (case_id, req.doctor_id, req.feedback),
            )
        conn.commit()
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Could not save the feedback. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return {"message": "Feedback saved successfully."}


@app.post("/api/doctor/cases/{case_id}/verify")
def verify_case_summary(case_id: str, req: VerifyCaseRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,))
        if not cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=404, detail="Case not found")

        cursor.execute(
            """
            UPDATE summaries
            SET doctor_verified_text = ?, doctor_edited_text = ?, is_verified = 1
            WHERE session_id = ?
            """,
            (req.verified_summary, req.verified_summary, case_id),
        )
        if cursor.rowcount == 0:
            cursor.execute(
                """
                INSERT INTO summaries (session_id, ai_draft_text, doctor_verified_text, doctor_edited_text, is_verified)
                VALUES (?, '', ?, ?, 1)
                """,
                (case_id, req.verified_summary, req.verified_summary),
            )

        cursor.execute(
            """
            UPDATE sessions
            SET status = 'REVIEWED', doctor_id = ?, reviewed_at = CURRENT_TIMESTAMP
            WHERE session_id = ?
            """,
            (req.doctor_id, case_id),
        )
        conn.commit()
    except Exception:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail="Could not verify the case. Please try again.")
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return {"message": "Case verified and confirmed successfully."}


# -----------------
# DEMO DATA SEEDING (runs only when the database has no users)
# -----------------

def ensure_demo_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    count = cursor.execute("SELECT COUNT(*) FROM users").fetchone()["count"]
    conn.close()
    if count > 0:
        return
    from backend.seed_utils import seed_demo_data
    seed_demo_data()


init_db()
ensure_demo_data()