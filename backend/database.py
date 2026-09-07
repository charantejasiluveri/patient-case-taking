import sqlite3
import os
from pathlib import Path

DB_DIR = Path("database")
DB_PATH = DB_DIR / "mediease.db"

def init_db():
    if not DB_DIR.exists():
        DB_DIR.mkdir(parents=True)
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        patient_id TEXT,
        doctor_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
    )
    """)

    # 2. Patients Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        patient_id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        dob TEXT NOT NULL,
        age INTEGER,
        gender TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT,
        abha_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Doctors Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctors (
        doctor_id TEXT PRIMARY KEY,
        doctor_name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT,
        medical_registration_number TEXT,
        specialization TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 4. Sessions (Cases) Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        language TEXT NOT NULL,
        status TEXT DEFAULT 'SUBMITTED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
    )
    """)

    # 5. History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        history_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        section_name TEXT NOT NULL,
        answer_text TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions (session_id)
    )
    """)

    # 6. History Corrections Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history_corrections (
        correction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        section_name TEXT NOT NULL,
        original_value TEXT,
        corrected_value TEXT,
        doctor_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions (session_id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id)
    )
    """)

    # 7. Documents Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        document_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions (session_id)
    )
    """)

    # 8. Summaries Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS summaries (
        summary_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        ai_draft_text TEXT,
        doctor_verified_text TEXT,
        is_verified INTEGER DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES sessions (session_id)
    )
    """)

    # 9. Doctor Feedback Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctor_feedback (
        feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions (session_id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id)
    )
    """)

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

def reset_db():
    if DB_PATH.exists():
        os.remove(DB_PATH)
        print(f"Removed old database at {DB_PATH}")
    init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == "__main__":
    init_db()
