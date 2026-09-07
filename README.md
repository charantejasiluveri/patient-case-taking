# Mediease

"Your Health Story, Made Simple."

Mediease is an AI-Powered Patient Case-Taking Platform designed as a beginner-friendly educational prototype for SIH. It enables patients to easily input their health history and allows doctors to efficiently review, verify, and confirm those cases.

---

## 1. Requirements
- Python 3.8+ installed on your system.
- A modern web browser (Chrome, Edge, Firefox, etc.).

## 2. Installation
1. Clone or download this project folder.
2. Open your terminal or command prompt in the project root (`Mediease`).
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

## 3. Database Setup (SQLite)
This project uses a simple local SQLite database (`mediease.db`). You do not need to install MySQL or MongoDB. 

To create the tables and seed them with initial demo accounts, run:
```bash
python seed_test_data.py
```
*Note: This script will reset the database and create default demo users for you to test with.*

## 4 & 5. Starting the Application
For a beginner-friendly startup, simply double-click the **`start.bat`** file in the project folder! This will automatically open two terminal windows (one for the backend, one for the frontend).

Alternatively, you can run them manually:
**Terminal 1 (Backend):**
```bash
uvicorn backend.main:app --port 8000 --reload
```
**Terminal 2 (Frontend):**
```bash
cd frontend
python -m http.server 5500
```

Once running, access the application here: [http://127.0.0.1:5500](http://127.0.0.1:5500)

## 6. Demo Accounts
Use these accounts to test the application (created by `seed_test_data.py`):

**Patient Demo 1:**
- Username/Mobile: `9000000001`
- Password: `testpass`

**Patient Demo 2:**
- Username/Mobile: `9000000002`
- Password: `testpass`

**Doctor Demo:**
- Username/Doctor ID: `9000000010`
- Password: `testpass`

## 7. How the Patient Flow Works
1. Navigate to the login page and ensure the "👤 Patient" role is selected.
2. Register a new patient account OR login using a demo account.
3. You will land on the **Patient Dashboard**. Click "Start New Case".
4. Select your preferred language (English, Hindi, Telugu).
5. Follow the step-by-step guided clinical intake forms (Consent, Details, Chief Complaint, History, Medications, Allergies, Review of Systems, etc.).
6. Review your answers on the final screen and click "Submit".
7. You will receive a success message and be redirected back to the dashboard. Your case is now pending Doctor review!

## 8. How the Doctor Flow Works
1. Navigate to the login page and click the "🩺 Doctor" role.
2. Login using the Doctor Demo credentials.
3. You will land on the **Doctor Dashboard**.
4. Use the "Search Patient" box to find the patient (e.g., search `9000000001`).
5. Open the patient's case.
6. As a doctor, you can read the patient's history, view uploaded documents, and read the AI-drafted summary.
7. You can *Correct* any mistakes in the patient's answers or add Doctor Notes.
8. Click "Verify & Confirm Case" to finalize the patient's record.

## 9. How to Reset the Demo Database
If you ever want to clear all data and start fresh, simply stop the servers and run:
```bash
python seed_test_data.py
```
This drops all tables and recreates the demo accounts.

## 10. Troubleshooting
- **`[WinError 10013] An attempt was made to access a socket...`**: This means port 8000 (Backend) or port 5500 (Frontend) is already in use by another program. Close any existing terminals running Mediease, or run `stop.bat`.
- **`CORS` or `Failed to fetch` errors in the browser**: Ensure the backend is actually running on port 8000. Open `http://127.0.0.1:8000/docs` in your browser to verify it's alive.
- **Changes in HTML/JS aren't showing up**: Hard refresh your browser using `Ctrl + F5` to clear the cache.

---
*Disclaimer: This is an educational prototype. AI-generated summaries are drafts requiring clinician verification. This system does not provide autonomous medical diagnosis or treatment.*
