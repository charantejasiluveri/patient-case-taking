import React, { useState } from 'react';
import { BarChart3, Users, Globe, Lock, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storage/storageService';

export default function AdminDashboardView({ auditLogs = [] }) {
  const [activeTab, setActiveTab] = useState('Analytics');

  const stats = [
    { title: "Daily OPD Patient Volume", value: "348 Patients", sub: "+18% compared to last week", color: "#0284c7" },
    { title: "Avg Case-Taking Time", value: "2.8 Minutes", sub: "Reduced from 9.5 mins traditional", color: "#0d9488" },
    { title: "Avg Doctor Consultation Time", value: "4.2 Minutes", sub: "55% time saved per consultation", color: "#059669" },
    { title: "Document OCR Success Rate", value: "94.2%", sub: "1,240 documents digitized today", color: "#d97706" }
  ];

  const kiosks = [
    { id: "KIOSK-OPD-01", location: "Main OPD Gate 1", status: "ONLINE", session: "Active (Patient Intake)", battery: "100% AC", voiceRate: "72% Voice" },
    { id: "KIOSK-OPD-02", location: "Cardiology Block B", status: "ONLINE", session: "Active (Patient Intake)", battery: "100% AC", voiceRate: "64% Voice" },
    { id: "KIOSK-AYUSH-03", location: "AYUSH OPD Wing C", status: "ONLINE", session: "Idle (Ready)", battery: "98% Battery", voiceRate: "81% Voice" }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 100px)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={24} style={{ color: '#0284c7' }} /> Hospital Administrator Analytics & Kiosk Management
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Hospital: <strong>City OPD Central Facility</strong> | OPD Analytics & Security Audit Trail
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Analytics', 'Kiosk Fleet', 'Audit Logs & Security'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`btn ${activeTab === t ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* METRICS CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {s.title}
              </div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: s.color, margin: '0.35rem 0' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'Analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

            {/* Language & Input Distribution */}
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={18} color="#0284c7" /> OPD Kiosk Language & Input Breakdown
              </h4>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>Hindi (हिन्दी)</span>
                    <span>45% (156 Patients)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e0f2fe', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', background: '#0284c7' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>Telugu (తెలుగు)</span>
                    <span>30% (104 Patients)</span>
                  </div>
                  <div style={{ height: '8px', background: '#ccfbf1', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '30%', height: '100%', background: '#0d9488' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>English</span>
                    <span>15% (52 Patients)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e0e7ff', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '15%', height: '100%', background: '#4338ca' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>Gujarati & Others</span>
                    <span>10% (36 Patients)</span>
                  </div>
                  <div style={{ height: '8px', background: '#fef3c7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '10%', height: '100%', background: '#d97706' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Voice Input Preference: <strong>68%</strong></span>
                <span>Touch Input Preference: <strong>32%</strong></span>
              </div>
            </div>

            {/* Doctor Workload & Consult Time */}
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={18} color="#059669" /> Doctor OPD Consultation Performance
              </h4>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dr. Ananya Sharma (Internal Med)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>42 Consultations | Avg: 3.8 mins</div>
                  </div>
                  <span className="badge badge-green">98% Verified</span>
                </div>

                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dr. Vikram Seth (Emergency / Cardio)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>28 Consultations | Avg: 5.1 mins</div>
                  </div>
                  <span className="badge badge-green">100% Verified</span>
                </div>

                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dr. Vaidya Suresh Sharma (AYUSH)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>34 Consultations | Avg: 4.5 mins</div>
                  </div>
                  <span className="badge badge-green">96% Verified</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* KIOSK FLEET TAB */}
        {activeTab === 'Kiosk Fleet' && (
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Hospital OPD Kiosk Fleet Status
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {kiosks.map((k) => (
                <div key={k.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#0284c7' }}>{k.id}</span>
                    <span className="badge badge-green">{k.status}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{k.location}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem' }}>
                    Current Session: {k.session}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.78rem', color: '#334155' }}>
                    <span>Power: {k.battery}</span>
                    <span>Voice Intake: {k.voiceRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT LOGS & SECURITY TAB */}
        {activeTab === 'Audit Logs & Security' && (
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={20} color="#dc2626" /> Security Access & ABDM Audit Trail
                </h4>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Immutable log of all patient records accessed, consents recorded, and triage triggers.
                </div>
              </div>

              <span className="badge badge-green">
                <CheckCircle2 size={14} /> RBAC & Encryption Active
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '0.65rem' }}>Log ID</th>
                    <th style={{ padding: '0.65rem' }}>Timestamp</th>
                    <th style={{ padding: '0.65rem' }}>User / Role</th>
                    <th style={{ padding: '0.65rem' }}>Action</th>
                    <th style={{ padding: '0.65rem' }}>Patient Reference</th>
                    <th style={{ padding: '0.65rem' }}>Event Details</th>
                  </tr>
                </thead>
                <tbody>
                  {(auditLogs.length > 0 ? auditLogs : storageService.getAuditLogs()).map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.65rem', fontFamily: 'monospace', fontWeight: 700 }}>{log.id}</td>
                      <td style={{ padding: '0.65rem', color: '#64748b' }}>{log.timestamp}</td>
                      <td style={{ padding: '0.65rem', fontWeight: 600 }}>{log.userRole} ({log.userId})</td>
                      <td style={{ padding: '0.65rem' }}>
                        <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', fontSize: '0.68rem' }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem', fontWeight: 700, color: '#0369a1' }}>{log.patientId}</td>
                      <td style={{ padding: '0.65rem', color: '#334155' }}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
