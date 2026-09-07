import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_flow():
    print("--- Starting End-to-End Test (Auto-Save Version) ---")
    
    # 1. Register Patient
    p1 = {
        "username": "9000000099",
        "password": "testpassword",
        "full_name": "Demo Patient",
        "dob": "1996-01-01",
        "age": 30,
        "gender": "male",
        "mobile": "9000000099"
    }
    r = requests.post(f"{BASE_URL}/api/auth/register/patient", json=p1)
    print("Patient Register:", r.status_code, r.json())
    p1_id = r.json().get('patient_id')

    # 2. Login Patient
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "9000000099", "password": "testpassword"})
    print("Patient Login:", r.status_code, r.json())

    # 3. Patient Starts Case
    r = requests.post(f"{BASE_URL}/api/patient/cases/new", json={
        "patient_id": p1_id,
        "language": "english"
    })
    print("Patient Start Case:", r.status_code, r.json())
    case_id = r.json().get('case_id')

    # 4. Patient Auto-Saves a question
    r = requests.post(f"{BASE_URL}/api/patient/cases/{case_id}/autosave", json={
        "section_name": "chief_complaint",
        "answer_text": "Fever and cough for 3 days"
    })
    print("Patient Auto-Save:", r.status_code, r.json())

    # 5. Patient Submits Case
    r = requests.post(f"{BASE_URL}/api/patient/cases/{case_id}/submit")
    print("Patient Submit Case:", r.status_code, r.json())

    # 6. Login Doctor (using seeded credentials)
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "9000000010", "password": "testpass"})
    print("Doctor Login:", r.status_code, r.json())
    doc_id = r.json().get('doctor_id')

    # 7. Doctor Gets Case details
    r = requests.get(f"{BASE_URL}/api/patient/cases/{case_id}")
    print("Doctor Gets Case Details:", r.status_code)

    # 8. Doctor Verify
    r = requests.post(f"{BASE_URL}/api/doctor/cases/{case_id}/verify", json={
        "doctor_id": doc_id,
        "verified_summary": "Fever and cough x 3 days. Clinically stable."
    })
    print("Doctor Verify Case:", r.status_code, r.json())

    # 9. Verify Final Case Status
    r = requests.get(f"{BASE_URL}/api/patient/cases/{case_id}")
    final_case = r.json()
    status = final_case['session']['status']
    print(f"Final Case Status for {case_id}:", status)
    if status == 'CONFIRMED':
        print("--- END TO END TEST PASSED ---")
    else:
        print("--- END TO END TEST FAILED ---")

if __name__ == "__main__":
    test_flow()
