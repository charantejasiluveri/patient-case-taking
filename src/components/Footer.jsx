import React from 'react';
import { ShieldCheck, Heart, Stethoscope, PhoneCall } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', padding: '2.5rem 1.5rem 1.5rem', fontSize: '0.85rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            PATIENT CASE-TAKING PLATFORM
          </div>
          <div>
            SIH 2026 High-Volume OPD Clinical History & Document Intelligence System.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem' }}>
            Designed for Ayushman Bharat Digital Mission (ABDM) & National Health Stack alignment.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setCurrentView('landing')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Overview</button>
          <button onClick={() => setCurrentView('kiosk')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Patient Kiosk</button>
          <button onClick={() => setCurrentView('doctor')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Doctor Workspace</button>
          <button onClick={() => setCurrentView('triage')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Triage Desk</button>
          <button onClick={() => setCurrentView('architecture')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Architecture</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', paddingTop: '1rem', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
        ⚠️ <strong>Clinical Notice:</strong> This AI system is designed to assist doctors with history-taking and document digitization. It does not replace clinical judgment or make autonomous diagnoses.
      </div>
    </footer>
  );
}
