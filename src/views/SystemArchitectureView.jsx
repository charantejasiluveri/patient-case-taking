import React from 'react';
import { Network, Shield, Cpu, Database, Server, Smartphone, Lock, ArrowDown, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function SystemArchitectureView() {
  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: 'calc(100vh - 100px)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge" style={{ background: 'rgba(2,132,199,0.2)', color: '#38bdf8', border: '1px solid #0284c7', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            SIH 2026 JUDGING DOCUMENTATION
          </span>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '2.4rem', fontWeight: 800, marginTop: '0.5rem' }}>
            System Architecture & Interoperability Design
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '750px', margin: '0.5rem auto 0' }}>
            End-to-end data flow, security boundary, ABDM/FHIR alignment, and doctor-in-the-loop clinical history engine.
          </p>
        </div>

        {/* INTERACTIVE ARCHITECTURAL DIAGRAM FLOW */}
        <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #334155', marginBottom: '2.5rem' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: '#38bdf8', textAlign: 'center' }}>
            Clinical & Data Intelligence Architecture Flow
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>

            {/* Step 1 */}
            <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #0284c7', textAlign: 'center' }}>
              <Smartphone size={32} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1rem' }}>Patient / OPD Kiosk</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Multilingual Audio & Voice (Bhashini ASR) | ABHA & Mobile OTP
              </div>
            </div>

            <div style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 800 }}>➔</div>

            {/* Step 2 */}
            <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #0d9488', textAlign: 'center' }}>
              <Server size={32} color="#2dd4bf" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 800, color: '#2dd4bf', fontSize: '1rem' }}>API Gateway & Auth</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                RBAC Security | Consent Revocation Layer | Temporary ID Generator
              </div>
            </div>

            <div style={{ textAlign: 'center', color: '#2dd4bf', fontWeight: 800 }}>➔</div>

            {/* Step 3 */}
            <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #d97706', textAlign: 'center' }}>
              <Cpu size={32} color="#facc15" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 800, color: '#facc15', fontSize: '1rem' }}>Clinical & AI Engine</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                SOCRATES HPI Ontology | Medical OCR Pipeline | Red-Flag Rule Intercept
              </div>
            </div>

            <div style={{ textAlign: 'center', color: '#facc15', fontWeight: 800 }}>➔</div>

            {/* Step 4 */}
            <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #059669', textAlign: 'center' }}>
              <Network size={32} color="#4ade80" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 800, color: '#4ade80', fontSize: '1rem' }}>ABDM & FHIR Gateway</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                FHIR R4 Composition Bundle | Hospital HIS / EMR Interoperability
              </div>
            </div>

          </div>
        </div>

        {/* CORE SECURITY & COMPLIANCE PILLARS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
            <h4 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={20} /> Security & Identity Architecture
            </h4>
            <ul style={{ fontSize: '0.88rem', color: '#94a3b8', display: 'grid', gap: '0.5rem', paddingLeft: '1.25rem' }}>
              <li>Strict enforcement against automatic medical record merging based on name/mobile matches alone.</li>
              <li>Encrypted temporary session IDs for walk-in non-ABHA patients.</li>
              <li>Role-Based Access Control (RBAC) separating Patient Kiosk, Doctor, Triage Staff, and Admin roles.</li>
              <li>Complete immutable audit trail recording every viewing & editing action.</li>
            </ul>
          </div>

          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
            <h4 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 700, color: '#2dd4bf', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={20} /> Doctor-in-the-Loop Safeguards
            </h4>
            <ul style={{ fontSize: '0.88rem', color: '#94a3b8', display: 'grid', gap: '0.5rem', paddingLeft: '1.25rem' }}>
              <li>The system does NOT issue autonomous diagnoses or change prescriptions automatically.</li>
              <li>All AI-generated clinical summaries bear the mandatory badge: "AI GENERATED — DOCTOR VERIFICATION REQUIRED".</li>
              <li>Red-flag rules handle urgent symptom detection purely for priority triage intercept, not diagnostic claims.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
