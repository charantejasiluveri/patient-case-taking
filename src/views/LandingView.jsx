import React from 'react';
import { Stethoscope, ShieldCheck, Sparkles, FileText, Smartphone, HeartPulse, Clock, Lock, ArrowRight, Zap, CheckCircle2, Leaf, Globe, Network } from 'lucide-react';

export default function LandingView({ onStartCase, onDoctorLogin, onDashboardOpen, onViewWorks }) {
  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 1.5rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(2,132,199,0.2) 0%, rgba(13,148,136,0.05) 70%, transparent 100%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div className="badge" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', border: '1px solid #0284c7', padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <Sparkles size={14} /> SIH 2026 ADVANCED HEALTHCARE INNOVATION
        </div>

        <h1 style={{ fontFamily: 'Outfit', fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
          PATIENT CASE-TAKING
        </h1>

        <p style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 600, color: '#38bdf8', marginBottom: '1rem' }}>
          “Complete the patient's story before the consultation begins.”
        </p>

        <p style={{ maxWidth: '800px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6 }}>
          An AI-powered clinical history, document intelligence, and doctor assistance platform designed for high-volume Indian hospital OPDs. Reduces consultation bottlenecks and allows doctors to spend maximum time on reasoning and patient care.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onStartCase} className="btn btn-primary btn-kiosk-large">
            <Smartphone size={22} /> Start Patient Kiosk Session
          </button>

          <button onClick={onDoctorLogin} className="btn btn-teal btn-kiosk-large">
            <Stethoscope size={22} /> Open Doctor Workspace
          </button>

          <button onClick={onDashboardOpen} className="btn btn-secondary btn-kiosk-large" style={{ background: 'transparent', color: '#fff', border: '1px solid #334155' }}>
            <Zap size={22} style={{ color: '#f59e0b' }} /> Hospital Dashboard
          </button>
        </div>
      </section>

      {/* Interactive Workflow Banner */}
      <section style={{ background: '#1e293b', padding: '2.5rem 1.5rem', borderTop: '1px solid #334155', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            Seamless OPD Patient Flow
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {[
              { step: "1. Identify", desc: "ABHA / No-ABHA OTP" },
              { step: "2. Consent", desc: "Multilingual Audio" },
              { step: "3. Case-Take", desc: "Voice / Touch SOCRATES" },
              { step: "4. OCR Scan", desc: "Prescription AI" },
              { step: "5. Summarize", desc: "AI History Synthesis" },
              { step: "6. Verify", desc: "Doctor Sign-Off" },
              { step: "7. Consult", desc: "EMR / ABDM Linked" }
            ].map((s, idx) => (
              <div key={idx} style={{ background: '#0f172a', padding: '1rem 0.75rem', borderRadius: '1rem', border: '1px solid #334155', position: 'relative' }}>
                <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>{s.step}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem vs Solution Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* The Problem */}
          <div style={{ background: '#1e293b', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #ef4444' }}>
            <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              The OPD Problem in High-Volume Hospitals
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Doctors Spend 70% of OPD Time Typing History
            </h3>
            <ul style={{ display: 'grid', gap: '0.75rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              <li>❌ OPD doctors see 80-120 patients per day (under 3 mins per patient).</li>
              <li>❌ Important past history & chronic drugs are missed under severe rush.</li>
              <li>❌ Unstructured paper prescriptions remain unreadable.</li>
              <li>❌ Critical red-flag emergency symptoms are delayed in long queues.</li>
            </ul>
          </div>

          {/* Our Solution */}
          <div style={{ background: '#1e293b', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #0d9488' }}>
            <div style={{ color: '#0d9488', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Our AI-Assisted Solution
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              AI Prepares Case Story Before Consultation Starts
            </h3>
            <ul style={{ display: 'grid', gap: '0.75rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              <li>✅ Multilingual Kiosk allows patients to speak history in local dialect.</li>
              <li>✅ Document OCR converts past paper prescriptions into structured digital timelines.</li>
              <li>✅ Rule engine screens for life-threatening emergency symptoms & alerts triage.</li>
              <li>✅ Doctor receives a 10-second summary — decision making made faster & safer.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{ background: '#1e293b', padding: '4rem 1.5rem', borderTop: '1px solid #334155' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800 }}>
              Advanced Clinical Capabilities
            </h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
              Built strictly following doctor-in-the-loop and ABDM interoperability principles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Globe size={28} color="#38bdf8" />, title: "Multilingual Voice Engine", text: "Supports Indian languages (Hindi, Telugu, Tamil, etc.) with audio guidance & speech recognition." },
              { icon: <ShieldCheck size={28} color="#2dd4bf" />, title: "No-ABHA Session Security", text: "Secure temporary IDs for non-ABHA patients with zero auto-merging risk without doctor sign-off." },
              { icon: <HeartPulse size={28} color="#f87171" />, title: "Red-Flag Triage Engine", text: "Automatic detection of acute chest pain, dyspnea, or neuro symptoms dispatches priority alerts." },
              { icon: <FileText size={28} color="#facc15" />, title: "Prescription OCR Intelligence", text: "Medical OCR extracts medicines, dosages, and highlights abnormal laboratory test values." },
              { icon: <Leaf size={28} color="#4ade80" />, title: "Dedicated AYUSH Mode", text: "Integrated Dashavidha Pariksha, Prakriti-Vikriti, Agni, and Koshtha evaluation for Ayurvedic OPDs." },
              { icon: <Network size={28} color="#c084fc" />, title: "ABDM & FHIR R4 Ready", text: "Standardized JSON Composition bundles ready for Ayushman Bharat Digital Mission integration." }
            ].map((f, i) => (
              <div key={i} style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
                <div style={{ marginBottom: '1rem' }}>{f.icon}</div>
                <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
