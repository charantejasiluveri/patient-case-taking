// System Security & Access Audit Log Initial Records

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-9001",
    timestamp: "2026-09-06 09:15:02",
    userRole: "Patient Kiosk",
    userId: "KIOSK-OPD-01",
    action: "CONSENT_RECORDED",
    patientId: "PAT-2026-001",
    details: "Patient Ramesh Kumar accepted Digital Consent v2.4 (Scope: OPD Case Taking & Document AI). Encrypted session initialized.",
    ipAddress: "192.168.1.104"
  },
  {
    id: "LOG-9002",
    timestamp: "2026-09-06 09:18:45",
    userRole: "Patient Kiosk",
    userId: "KIOSK-OPD-01",
    action: "OCR_DOCUMENT_PROCESSED",
    patientId: "PAT-2026-001",
    details: "Document DOC-102 (Lipid Profile) scanned & entities extracted. 2 abnormal lab values flagged.",
    ipAddress: "192.168.1.104"
  },
  {
    id: "LOG-9003",
    timestamp: "2026-09-06 09:28:15",
    userRole: "Clinical Rule Engine",
    userId: "SYSTEM_TRIAGE",
    action: "RED_FLAG_TRIAGE_TRIGGERED",
    patientId: "PAT-2026-002",
    details: "CRITICAL ALERT: Patient Sunita Devi reported 9/10 crushing retrosternal chest pain with left jaw radiation and diaphoresis. Dispatched RED alert to Triage Desk.",
    ipAddress: "127.0.0.1"
  },
  {
    id: "LOG-9004",
    timestamp: "2026-09-06 09:29:00",
    userRole: "Triage Staff",
    userId: "STAFF-TRIAGE-03",
    action: "TRIAGE_ACKNOWLEDGED",
    patientId: "PAT-2026-002",
    details: "Triage Nurse acknowledged RED ALERT for PAT-2026-002. Patient escorted to Resuscitation ECG Room. Assigned to Dr. Vikram Seth.",
    ipAddress: "192.168.1.112"
  },
  {
    id: "LOG-9005",
    timestamp: "2026-09-06 09:40:10",
    userRole: "Patient Kiosk",
    userId: "KIOSK-AYUSH-02",
    action: "AYUSH_CASE_INTAKE",
    patientId: "PAT-2026-003",
    details: "Patient Rajesh Patel completed Dashavidha Pariksha intake (Amavata / Knee joint stiffness).",
    ipAddress: "192.168.1.105"
  }
];
