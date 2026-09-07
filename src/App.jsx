import React, { useState, useEffect } from 'react';
import DemoBar from './components/DemoBar';
import HeaderNav from './components/HeaderNav';
import Footer from './components/Footer';
import VoiceInputModal from './components/VoiceInputModal';
import DocumentScannerModal from './components/DocumentScannerModal';

import LandingView from './views/LandingView';
import PatientKioskView from './views/PatientKioskView';
import DoctorWorkspaceView from './views/DoctorWorkspaceView';
import TriageDashboardView from './views/TriageDashboardView';
import AdminDashboardView from './views/AdminDashboardView';
import SystemArchitectureView from './views/SystemArchitectureView';
import TechStackView from './views/TechStackView';

import { storageService } from './services/storage/storageService';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-2026-001');
  const [auditLogs, setAuditLogs] = useState([]);

  // Simulation Modals
  const [isSimVoiceOpen, setIsSimVoiceOpen] = useState(false);
  const [isSimOcrOpen, setIsSimOcrOpen] = useState(false);

  // Load Initial Storage Data
  useEffect(() => {
    const loadedPatients = storageService.getPatients();
    setPatients(loadedPatients);
    setAuditLogs(storageService.getAuditLogs());
  }, []);

  const refreshData = () => {
    setPatients(storageService.getPatients());
    setAuditLogs(storageService.getAuditLogs());
  };

  // Select Demo Patient Trigger
  const handleSelectDemoPatient = (patientId) => {
    setSelectedPatientId(patientId);
    refreshData();
  };

  // Simulate Actions
  const handleSimulateAction = (actionType) => {
    if (actionType === 'simulate_voice') {
      setIsSimVoiceOpen(true);
    } else if (actionType === 'simulate_ocr') {
      setIsSimOcrOpen(true);
    }
  };

  // Update Patient
  const handleUpdatePatient = (updatedPatient) => {
    storageService.updatePatient(updatedPatient);
    refreshData();
  };

  // Triage Acknowledge
  const handleAcknowledgeTriage = (patientId) => {
    const p = patients.find(x => x.id === patientId);
    if (p) {
      const updated = { ...p, status: 'Transferred to Resuscitation ECG Room' };
      storageService.updatePatient(updated);
      storageService.addAuditLog({
        userRole: "Triage Nurse",
        userId: "STAFF-TRIAGE-03",
        action: "TRIAGE_ACKNOWLEDGED",
        patientId: p.id,
        details: `Red flag acknowledged for ${p.name}. Patient transferred to Emergency Resuscitation.`
      });
      refreshData();
    }
  };

  const redFlagCount = patients.filter(p => p.priority === 'RED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Demo Control Panel for SIH Judges */}
      <DemoBar
        onSelectDemoPatient={handleSelectDemoPatient}
        onSimulateAction={handleSimulateAction}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Navigation Header */}
      <HeaderNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        patientCount={patients.length}
        redFlagCount={redFlagCount}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingView
            onStartCase={() => setCurrentView('kiosk')}
            onDoctorLogin={() => setCurrentView('doctor')}
            onDashboardOpen={() => setCurrentView('admin')}
            onViewWorks={() => setCurrentView('architecture')}
          />
        )}

        {currentView === 'kiosk' && (
          <PatientKioskView
            onCaseSubmitted={(newPatient) => {
              refreshData();
              setSelectedPatientId(newPatient.id);
            }}
          />
        )}

        {currentView === 'doctor' && (
          <DoctorWorkspaceView
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={(id) => setSelectedPatientId(id)}
            onUpdatePatient={handleUpdatePatient}
          />
        )}

        {currentView === 'triage' && (
          <TriageDashboardView
            patients={patients}
            onAcknowledgeAlert={handleAcknowledgeTriage}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView auditLogs={auditLogs} />
        )}

        {currentView === 'architecture' && (
          <SystemArchitectureView />
        )}

        {currentView === 'tech' && (
          <TechStackView />
        )}
      </main>

      {/* Global Modals for Quick Simulation */}
      <VoiceInputModal
        isOpen={isSimVoiceOpen}
        onClose={() => setIsSimVoiceOpen(false)}
        onConfirm={(text) => alert(`Simulated Voice Transcript: "${text}"`)}
        questionPrompt="Simulating Speech-to-Text Conversion"
        lang="hi"
      />

      <DocumentScannerModal
        isOpen={isSimOcrOpen}
        onClose={() => setIsSimOcrOpen(false)}
        onDocumentProcessed={(doc) => alert(`OCR Document Scanned Successfully: ${doc.title}`)}
      />

      {/* Global Footer */}
      <Footer setCurrentView={setCurrentView} />

    </div>
  );
}
