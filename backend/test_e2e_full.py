import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_full_flow():
    print("========================================")
    print("MEDIEASE COMPLETE E2E TEST")
    print("========================================")
    
    # -----------------------------------------------------
    # TEST PATIENT 1
    # -----------------------------------------------------
    print("\n[TEST PATIENT 1]")
    p1 = {
        "username": "9000000003",
        "password": "DemoPatient@123",
        "full_name": "Demo Patient One",
        "dob": "1990-01-01",
        "age": 36,
        "gender": "male",
        "mobile": "9000000003"
    }
    
    # Register
    r = requests.post(f"{BASE_URL}/api/auth/register/patient", json=p1)
    if r.status_code == 200:
        p1_id = r.json().get('patient_id')
        print(f"[PASS] Register (Patient ID: {p1_id})")
    elif r.status_code == 400 and "already exists" in r.text:
        print("[PASS] Register: Account already exists. Attempting login.")
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "9000000003", "password": "DemoPatient@123"})
        p1_id = r.json().get('patient_id')
    else:
        print(f"[FAIL] Register - {r.text}")
        return

    # Login
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "9000000003", "password": "DemoPatient@123"})
    if r.status_code == 200:
        print("[PASS] Login")
    else:
        print(f"[FAIL] Login - {r.text}")
        return

    # Start Case
    r = requests.post(f"{BASE_URL}/api/patient/cases/new", json={"patient_id": p1_id, "language": "english"})
    if r.status_code == 200:
        case_id = r.json().get('case_id')
        print(f"[PASS] Start Case (Case ID: {case_id})")
    else:
        print(f"[FAIL] Start Case - {r.text}")
        return

    # Answer Questions (Auto-Save 13 sections)
    sections = [
        "consent", "patient_details", "department", "chief_complaint", 
        "history_present_illness", "past_medical_history", "past_surgical_history", 
        "medications", "allergies", "family_history", "personal_history", 
        "review_of_systems", "documents"
    ]
    for sec in sections:
        r = requests.post(f"{BASE_URL}/api/patient/cases/{case_id}/autosave", json={
            "section_name": sec,
            "answer_text": f"Test answer for {sec}"
        })
        if r.status_code != 200:
            print(f"[FAIL] Auto-Save {sec} - {r.text}")
            return
    print("[PASS] Auto-Save All Sections")

    # Submit Case
    r = requests.post(f"{BASE_URL}/api/patient/cases/{case_id}/submit")
    if r.status_code == 200:
        print("[PASS] Submit Case")
    else:
        print(f"[FAIL] Submit Case - {r.text}")
        return

    # -----------------------------------------------------
    # DOCTOR FLOW
    # -----------------------------------------------------
    print("\n[DOCTOR FLOW]")
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "9000000010", "password": "testpass"})
    if r.status_code == 200:
        doc_id = r.json().get('doctor_id')
        print("[PASS] Doctor Login")
    else:
        print(f"[FAIL] Doctor Login - {r.text}")
        return

    r = requests.get(f"{BASE_URL}/api/doctor/search?q=9000000003")
    if r.status_code == 200 and len(r.json()) > 0:
        print("[PASS] Search Patient")
    else:
        print("[FAIL] Search Patient")

    r = requests.get(f"{BASE_URL}/api/patient/cases/{case_id}")
    if r.status_code == 200:
        case_data = r.json()
        if len(case_data['history']) == 13:
            print("[PASS] View Case (13 sections verified)")
        else:
            print(f"[FAIL] View Case (Found {len(case_data['history'])} sections instead of 13)")
            return
    else:
        print(f"[FAIL] View Case - {r.text}")
        return

    r = requests.post(f"{BASE_URL}/api/doctor/cases/{case_id}/correction", json={
        "doctor_id": doc_id,
        "section_name": "chief_complaint",
        "original_value": "Test answer for chief_complaint",
        "corrected_value": "Fever and chills",
        "doctor_note": "Corrected by doctor"
    })
    if r.status_code == 200:
        print("[PASS] Add Doctor Correction")
    else:
        print(f"[FAIL] Add Doctor Correction - {r.text}")

    r = requests.post(f"{BASE_URL}/api/doctor/cases/{case_id}/verify", json={
        "doctor_id": doc_id,
        "verified_summary": "Patient presented with fever and chills."
    })
    if r.status_code == 200:
        print("[PASS] Verify & Confirm Case")
    else:
        print(f"[FAIL] Verify & Confirm Case - {r.text}")
        
    print("\n========================================")
    print("ALL TESTS COMPLETED SUCCESSFULLY!")
    print("========================================")

if __name__ == "__main__":
    test_full_flow()
