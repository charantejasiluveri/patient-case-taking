import sqlite3
import os
from pathlib import Path

# Database + uploads locations (relative to project root, so running from project root works)
DB_DIR = Path("database")
DB_PATH = DB_DIR / "mediease.db"
UPLOADS_DIR = Path("backend") / "uploads"


def _get_columns(conn, table):
    """Return set of existing column names for a table."""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table})")
    return {row[1] for row in cursor.fetchall()}


def _add_column(cursor, table, column_def):
    """Safely add a column if it does not already exist."""
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column_def}")
    except sqlite3.OperationalError:
        # Column already exists - nothing to do
        pass


def init_db():
    """Create all tables (and add missing columns for older databases)."""
    if not DB_DIR.exists():
        DB_DIR.mkdir(parents=True)

    if not UPLOADS_DIR.exists():
        UPLOADS_DIR.mkdir(parents=True)

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

    # 4. Sessions / Cases Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        language TEXT NOT NULL,
        status TEXT DEFAULT 'IN_PROGRESS',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP,
        doctor_id TEXT,
        reviewed_at TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (patient_id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id)
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
        session_id TEXT,
        patient_id TEXT,
        file_name TEXT,
        document_type TEXT,
        file_path TEXT NOT NULL,
        file_type TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions (session_id),
        FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
    )
    """)

    # 8. Summaries Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS summaries (
        summary_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        ai_draft_text TEXT,
        doctor_edited_text TEXT,
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

    # ---- Migrations for pre-existing databases ----
    # Add newer columns to existing tables if missing
    _add_column(cursor, "documents", "patient_id TEXT")
    _add_column(cursor, "documents", "file_name TEXT")
    _add_column(cursor, "documents", "document_type TEXT")
    _add_column(cursor, "sessions", "submitted_at TIMESTAMP")
    _add_column(cursor, "sessions", "doctor_id TEXT")
    _add_column(cursor, "sessions", "reviewed_at TIMESTAMP")
    _add_column(cursor, "summaries", "doctor_edited_text TEXT")

    # If the old `file_type` column exists but no `document_type`, use it as-is.
    # New databases already include both columns.

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")


def reset_db():
    """Delete the database file and recreate a fresh empty schema."""
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