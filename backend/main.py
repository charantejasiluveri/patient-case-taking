from fastapi import FastAPI, HTTPException, Request, Response, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import hashlib
from typing import Optional, List, Dict, Any
import datetime

from backend.database import get_db_connection

app = FastAPI(title="Mediease API")

# Setup CORS for development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

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

class CaseSubmissionRequest(BaseModel):
    patient_id: str
    language: str
    answers: Dict[str, Any]

class NewCaseRequest(BaseModel):
    patient_id: str
    language: str

class AutoSaveRequest(BaseModel):
    section_name: str
    answer_text: str

class SubmitCaseRequest(BaseModel):
    pass

class DoctorCorrectionRequest(BaseModel):
    doctor_id: str
    section_name: str
    original_value: str
    corrected_value: str
    doctor_note: str

class DoctorFeedbackRequest(BaseModel):
    doctor_id: str
    feedback: str

class VerifyCaseRequest(BaseModel):
    doctor_id: str
    verified_summary: str

class StatusUpdateRequest(BaseModel):
    status: str # UNDER REVIEW, CORRECTION REQUIRED, CONFIRMED

class ProfileUpdateRequest(BaseModel):
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
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    cursor.execute("SELECT COUNT(*) as count FROM patients")
    count = cursor.fetchone()['count']
    patient_id = f"MED{10000 + count + 1}"

    try:
        cursor.execute("""
            INSERT INTO patients (patient_id, full_name, dob, age, gender, mobile, email, abha_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (patient_id, req.full_name, req.dob, req.age, req.gender, req.mobile, req.email, req.abha_id))

        pwd_hash = hash_password(req.password)
        cursor.execute("""
            INSERT INTO users (username, password_hash, role, patient_id)
            VALUES (?, ?, 'patient', ?)
        """, (req.username, pwd_hash, patient_id))

        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        conn.close()

    return {"message": "Registration successful", "patient_id": patient_id, "role": "patient"}

@app.post("/api/auth/register/doctor")
def register_doctor(req: DoctorRegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.mobile,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Mobile number already registered as username")

    cursor.execute("SELECT COUNT(*) as count FROM doctors")
    count = cursor.fetchone()['count']
    doctor_id = f"DOC{20000 + count + 1}"

    try:
        cursor.execute("""
            INSERT INTO doctors (doctor_id, doctor_name, mobile, email, medical_registration_number, specialization)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (doctor_id, req.doctor_name, req.mobile, req.email, req.medical_registration_number, req.specialization))

        pwd_hash = hash_password(req.password)
        cursor.execute("""
            INSERT INTO users (username, password_hash, role, doctor_id)
            VALUES (?, ?, 'doctor', ?)
        """, (req.mobile, pwd_hash, doctor_id))

        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

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
    
    if hash_password(req.password) != user['password_hash']:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Simple Token Mock (returning IDs directly for localStorage)
    return {
        "message": "Login successful",
        "role": user['role'],
        "patient_id": user['patient_id'],
        "doctor_id": user['doctor_id']
    }

# -----------------
# PATIENT ENDPOINTS
# -----------------

@app.get("/api/patient/{patient_id}/profile")
def get_patient_profile(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT patient_id, full_name, dob, age, gender, mobile, email, abha_id, created_at FROM patients WHERE patient_id = ?", (patient_id,))
    patient = cursor.fetchone()
    conn.close()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    return {"success": True, "data": dict(patient)}

@app.put("/api/patient/{patient_id}/profile")
def update_patient_profile(patient_id: str, req: ProfileUpdateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if patient exists
    cursor.execute("SELECT * FROM patients WHERE patient_id = ?", (patient_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Patient not found")
        
    updates = []
    params = []
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
        
    conn.close()
    return {"success": True, "message": "Profile updated successfully"}

@app.post("/api/patient/cases/new")
def create_new_case(req: NewCaseRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Generate Case ID (session_id)
    cursor.execute("SELECT COUNT(*) as count FROM sessions")
    count = cursor.fetchone()['count']
    session_id = f"CASE-{datetime.datetime.now().year}-{str(count + 1).zfill(5)}"
    
    try:
        cursor.execute("""
            INSERT INTO sessions (session_id, patient_id, language, status)
            VALUES (?, ?, ?, 'in_progress')
        """, (session_id, req.patient_id, req.language))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
        
    return {"message": "Case started successfully", "case_id": session_id}

@app.post("/api/patient/cases/{case_id}/autosave")
def autosave_case(case_id: str, req: AutoSaveRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if history exists for this section, if so update, else insert
        cursor.execute("SELECT history_id FROM history WHERE session_id = ? AND section_name = ?", (case_id, req.section_name))
        row = cursor.fetchone()
        
        if row:
            cursor.execute("""
                UPDATE history SET answer_text = ? WHERE history_id = ?
            """, (req.answer_text, row['history_id']))
        else:
            cursor.execute("""
                INSERT INTO history (session_id, section_name, answer_text)
                VALUES (?, ?, ?)
            """, (case_id, req.section_name, req.answer_text))
            
        cursor.execute("UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = ?", (case_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    return {"message": "Autosaved successfully"}

@app.post("/api/patient/cases/{case_id}/submit")
def submit_case(case_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Get chief complaint for summary
        cursor.execute("SELECT answer_text FROM history WHERE session_id = ? AND section_name = 'chief_complaint'", (case_id,))
        cc = cursor.fetchone()
        cc_text = cc['answer_text'] if cc else "No chief complaint provided."
        
        ai_draft = f"AI Draft Summary: Patient presented with {cc_text}. Please verify all history details."
        
        # Insert summary
        cursor.execute("SELECT summary_id FROM summaries WHERE session_id = ?", (case_id,))
        if cursor.fetchone():
            cursor.execute("UPDATE summaries SET ai_draft_text = ? WHERE session_id = ?", (ai_draft, case_id))
        else:
            cursor.execute("""
                INSERT INTO summaries (session_id, ai_draft_text, is_verified)
                VALUES (?, ?, 0)
            """, (case_id, ai_draft))
            
        # Update status
        cursor.execute("UPDATE sessions SET status = 'SUBMITTED' WHERE session_id = ?", (case_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    return {"message": "Case submitted successfully"}

@app.get("/api/patient/{patient_id}/cases")
def get_patient_cases(patient_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT session_id as case_id, created_at, status 
        FROM sessions 
        WHERE patient_id = ? 
        ORDER BY created_at DESC
    """, (patient_id,))
    cases = cursor.fetchall()
    conn.close()
    return {"success": True, "data": [dict(c) for c in cases]}

@app.get("/api/patient/cases/{case_id}")
def get_case_details(case_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (case_id,))
    session = cursor.fetchone()
    if not session:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")
        
    session_data = dict(session)
    
    cursor.execute("SELECT * FROM history WHERE session_id = ?", (case_id,))
    history = [dict(row) for row in cursor.fetchall()]
    
    cursor.execute("SELECT * FROM summaries WHERE session_id = ?", (case_id,))
    summary = cursor.fetchone()
    
    cursor.execute("SELECT * FROM doctor_feedback WHERE session_id = ?", (case_id,))
    feedback = [dict(row) for row in cursor.fetchall()]
    
    cursor.execute("SELECT * FROM history_corrections WHERE session_id = ?", (case_id,))
    corrections = [dict(row) for row in cursor.fetchall()]
    
    cursor.execute("""
        SELECT patients.full_name, patients.age, patients.gender 
        FROM patients WHERE patient_id = ?
    """, (session['patient_id'],))
    patient_info = cursor.fetchone()
    
    conn.close()
    return {
        "session": session_data,
        "patient": dict(patient_info) if patient_info else {},
        "history": history,
        "summary": dict(summary) if summary else None,
        "feedback": feedback,
        "corrections": corrections
    }

# -----------------
# DOCTOR ENDPOINTS
# -----------------

@app.get("/api/doctor/dashboard")
def get_doctor_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as count FROM sessions WHERE status = 'SUBMITTED'")
    pending = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM sessions WHERE status = 'CONFIRMED' OR status = 'REVIEWED'")
    reviewed = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM patients")
    patients_count = cursor.fetchone()['count']
    
    cursor.execute("""
        SELECT s.session_id, s.status, s.created_at, p.patient_id, p.full_name, p.age, p.gender 
        FROM sessions s
        JOIN patients p ON s.patient_id = p.patient_id
        ORDER BY s.created_at DESC
        LIMIT 10
    """)
    recent_cases = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return {
        "stats": {
            "pending_cases": pending,
            "reviewed_cases": reviewed,
            "total_patients": patients_count,
            "priority_cases": 0 # Stub
        },
        "recent_cases": recent_cases
    }

@app.get("/api/doctor/search")
def search_patients(q: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = f"%{q}%"
    cursor.execute("""
        SELECT patient_id, full_name, mobile, abha_id 
        FROM patients 
        WHERE patient_id LIKE ? OR full_name LIKE ? OR mobile LIKE ?
    """, (query, query, query))
    
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

@app.post("/api/doctor/cases/{case_id}/status")
def update_case_status(case_id: str, req: StatusUpdateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE sessions SET status = ? WHERE session_id = ?", (req.status, case_id))
    conn.commit()
    conn.close()
    return {"message": "Status updated successfully"}

@app.post("/api/doctor/cases/{case_id}/correction")
def add_case_correction(case_id: str, req: DoctorCorrectionRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO history_corrections (session_id, doctor_id, section_name, original_value, corrected_value, doctor_note)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (case_id, req.doctor_id, req.section_name, req.original_value, req.corrected_value, req.doctor_note))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    return {"message": "Correction added successfully"}

@app.post("/api/doctor/cases/{case_id}/feedback")
def add_case_feedback(case_id: str, req: DoctorFeedbackRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO doctor_feedback (session_id, doctor_id, feedback)
            VALUES (?, ?, ?)
        """, (case_id, req.doctor_id, req.feedback))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    return {"message": "Feedback added successfully"}

@app.post("/api/doctor/cases/{case_id}/verify")
def verify_case_summary(case_id: str, req: VerifyCaseRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE summaries 
            SET doctor_verified_text = ?, is_verified = 1 
            WHERE session_id = ?
        """, (req.verified_summary, case_id))
        
        cursor.execute("UPDATE sessions SET status = 'CONFIRMED' WHERE session_id = ?", (case_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    return {"message": "Case summary verified and confirmed"}

# StaticFiles serving removed to allow separate frontend server as requested
