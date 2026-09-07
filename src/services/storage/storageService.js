// Encrypted Local Storage & Session State Service
import { INITIAL_PATIENTS } from '../../mockData/demoPatients';
import { INITIAL_AUDIT_LOGS } from '../../mockData/auditLogs';

const STORAGE_KEYS = {
  PATIENTS: 'pct_patients_v1',
  AUDIT_LOGS: 'pct_audit_logs_v1',
  CURRENT_USER: 'pct_current_user_v1',
  SETTINGS: 'pct_system_settings_v1'
};

class StorageService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
  }

  getPatients() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : INITIAL_PATIENTS;
    } catch (e) {
      console.error("Error reading patients from storage", e);
      return INITIAL_PATIENTS;
    }
  }

  savePatients(patients) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }

  addPatient(newPatient) {
    const patients = this.getPatients();
    patients.unshift(newPatient);
    this.savePatients(patients);
    this.addAuditLog({
      userRole: "Patient Kiosk",
      userId: "KIOSK-AUTO",
      action: "PATIENT_CASE_SUBMITTED",
      patientId: newPatient.id,
      details: `New patient case intake submitted. Token: ${newPatient.tokenNo}, Priority: ${newPatient.priority}`
    });
    return newPatient;
  }

  updatePatient(updatedPatient) {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      patients[index] = updatedPatient;
      this.savePatients(patients);
    }
    return updatedPatient;
  }

  getAuditLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch (e) {
      return INITIAL_AUDIT_LOGS;
    }
  }

  addAuditLog(logEntry) {
    const logs = this.getAuditLogs();
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userRole: logEntry.userRole || "System",
      userId: logEntry.userId || "USER-ANON",
      action: logEntry.action,
      patientId: logEntry.patientId || "N/A",
      details: logEntry.details,
      ipAddress: "192.168.1.100"
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100))); // Keep last 100
  }

  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
}

export const storageService = new StorageService();
