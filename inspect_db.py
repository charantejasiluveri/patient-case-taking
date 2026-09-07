import sqlite3
conn = sqlite3.connect("database/mediease.db")
cur = conn.cursor()
rows = cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print("TABLES:", rows)
for (t,) in rows:
    print("---", t)
    print(cur.execute(f"PRAGMA table_info({t})").fetchall())
    print(cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone())
print("USERS:", cur.execute("SELECT user_id, username, role, patient_id, doctor_id FROM users").fetchall())
print("PATIENTS:", cur.execute("SELECT patient_id, full_name, mobile FROM patients").fetchall())
print("DOCTORS:", cur.execute("SELECT doctor_id, doctor_name FROM doctors").fetchall())
print("SESSIONS:", cur.execute("SELECT session_id, patient_id, status, created_at FROM sessions").fetchall())
conn.close()