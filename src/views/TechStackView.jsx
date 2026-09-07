import React from 'react';
import { Cpu, Code, Database, Shield, Globe, FileText, CheckCircle2, Server } from 'lucide-react';

export default function TechStackView() {
  const techItems = [
    { category: "Frontend Framework", detail: "Vite + React 18 SPA with Custom Vanilla CSS Design System Tokens" },
    { category: "Voice & Speech Engine", detail: "Provider-Independent Speech Service Layer (Web Speech API + Bhashini ASR/TTS abstraction)" },
    { category: "Medical OCR Pipeline", detail: "Document Intelligence Extraction Pipeline for Prescriptions, Labs & Summaries" },
    { category: "Clinical Rules Engine", detail: "SOCRATES Pain Framework Ontology + Red-Flag Triage Symptom Evaluator" },
    { category: "AYUSH Integration", detail: "Dashavidha Pariksha, Deha Prakriti, Agni, & Koshtha Intake Engine" },
    { category: "Interoperability", detail: "ABDM Health ID (ABHA) Sandbox Gateway + FHIR R4 JSON Composition Bundler" },
    { category: "Security & Privacy", detail: "RBAC Controls + Encrypted Storage + No-Auto-Merge Identity Boundary + Audit Logger" }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 100px)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
            Technology Stack & API Specifications
          </h2>
          <p style={{ color: '#64748b' }}>
            SIH 2026 Production-Ready Technical Specifications & Integration Endpoints.
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Core System Specifications
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {techItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.95rem' }}>{item.category}</span>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modular Service API Endpoints */}
        <div style={{ background: '#ffffff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={22} color="#0284c7" /> Modular REST API Routes Architecture
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {[
              "/api/v1/auth/login",
              "/api/v1/patients/abha-verify",
              "/api/v1/patients/temp-session",
              "/api/v1/case-taking/intake",
              "/api/v1/speech/stt",
              "/api/v1/documents/ocr",
              "/api/v1/ai/summarize",
              "/api/v1/triage/red-flags",
              "/api/v1/ayush/pariksha",
              "/api/v1/abdm/fhir-bundle",
              "/api/v1/admin/audit-logs"
            ].map((route, i) => (
              <div key={i} style={{ background: '#f1f5f9', padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 600 }}>
                {route}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
