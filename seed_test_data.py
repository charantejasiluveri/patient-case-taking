import os
from backend.database import reset_db, get_db_connection
from backend.main import hash_password

def seed_data():
    reset_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Patient 1
    patient1_id = "MED10001"
    cursor.execute("""
        INSERT INTO patients (patient_id, full_name, dob, age, gender, mobile)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (patient1_id, "Aarav Kumar", "1990-01-01", 36, "male", "9000000001"))
    
    cursor.execute("""
        INSERT INTO users (username, password_hash, role, patient_id)
        VALUES (?, ?, 'patient', ?)
    """, ("9000000001", hash_password("testpass"), patient1_id))

    # Patient 2
    patient2_id = "MED10002"
    cursor.execute("""
        INSERT INTO patients (patient_id, full_name, dob, age, gender, mobile)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (patient2_id, "Sneha Reddy", "1995-05-05", 31, "female", "9000000002"))
    
    cursor.execute("""
        INSERT INTO users (username, password_hash, role, patient_id)
        VALUES (?, ?, 'patient', ?)
    """, ("9000000002", hash_password("testpass"), patient2_id))

    # Doctor
    doctor_id = "DOC20001"
    cursor.execute("""
        INSERT INTO doctors (doctor_id, doctor_name, mobile, specialization, medical_registration_number)
        VALUES (?, ?, ?, ?, ?)
    """, (doctor_id, "Dr. Ananya Sharma", "9000000010", "General Medicine", "TEST-DOC-001"))
    
    cursor.execute("""
        INSERT INTO users (username, password_hash, role, doctor_id)
        VALUES (?, ?, 'doctor', ?)
    """, ("9000000010", hash_password("testpass"), doctor_id))

    conn.commit()
    conn.close()
    print("Database seeded with test accounts.")

if __name__ == "__main__":
    seed_data()
