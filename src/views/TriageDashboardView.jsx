import React from 'react';
import { ShieldAlert, HeartPulse, UserCheck, ArrowRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import RedFlagAlertBanner from '../components/RedFlagAlertBanner';

export default function TriageDashboardView({ patients = [], onAcknowledgeAlert, onAssignDoctor }) {
  const redPatients = patients.filter(p => p.priority === 'RED');
  const yellowPatients = patients.filter(p => p.priority === 'YELLOW');
  const greenPatients = patients.filter(p => p.priority === 'GREEN');

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: 'calc(100vh - 100px)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-red" style={{ marginBottom: '0.4rem', fontSize: '0.8rem' }}>
              <ShieldAlert size={14} /> LIVE OPD EMERGENCY TRIAGE MONITOR
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800 }}>
              OPD Priority Triage & Emergency Queue
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', padding: '0.75rem 1.25rem', borderRadius: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fca5a5' }}>{redPatients.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#fecaca', fontWeight: 700 }}>🔴 RED ALERTS</div>
            </div>
            <div style={{ background: '#78350f', border: '1px solid #f59e0b', padding: '0.75rem 1.25rem', borderRadius: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fde68a' }}>{yellowPatients.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#fef3c7', fontWeight: 700 }}>🟡 NEEDS REVIEW</div>
            </div>
            <div style={{ background: '#064e3b', border: '1px solid #10b981', padding: '0.75rem 1.25rem', borderRadius: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6ee7b7' }}>{greenPatients.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#d1fae5', fontWeight: 700 }}>🟢 NORMAL OPD</div>
            </div>
          </div>
        </div>

        {/* URGENT RED ALERT BANNER SECTION */}
        {redPatients.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            {redPatients.map(rp => (
              <RedFlagAlertBanner
                key={rp.id}
                flags={rp.redFlags}
                patientName={rp.name}
                tokenNo={rp.tokenNo}
                onAcknowledge={() => onAcknowledgeAlert && onAcknowledgeAlert(rp.id)}
              />
            ))}
          </div>
        )}

        {/* 3 PRIORITY QUEUES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>

          {/* 🔴 RED PRIORITY QUEUE */}
          <div style={{ background: '#1e293b', borderRadius: '1rem', border: '2px solid #dc2626', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #334155' }}>
              <span className="badge badge-red" style={{ fontSize: '0.85rem' }}>
                🔴 HIGH PRIORITY (CRITICAL)
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{redPatients.length} Patients</span>
            </div>

            {redPatients.map(p => (
              <div key={p.id} style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #7f1d1d', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: '#fca5a5', fontSize: '1rem' }}>{p.tokenNo}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Queue Time: {p.timeInQueue}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>
                  {p.name} ({p.age} Yrs, {p.gender})
                </div>
                <div style={{ fontSize: '0.85rem', color: '#f87171', margin: '0.4rem 0', fontWeight: 600 }}>
                  ⚠️ {p.chiefComplaint?.complaint}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    onClick={() => onAcknowledgeAlert && onAcknowledgeAlert(p.id)}
                    className="btn btn-danger"
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <UserCheck size={14} /> Escalate to Resuscitation Room
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🟡 YELLOW PRIORITY QUEUE */}
          <div style={{ background: '#1e293b', borderRadius: '1rem', border: '2px solid #d97706', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #334155' }}>
              <span className="badge badge-yellow" style={{ fontSize: '0.85rem' }}>
                🟡 MODERATE PRIORITY (NEEDS REVIEW)
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{yellowPatients.length} Patients</span>
            </div>

            {yellowPatients.map(p => (
              <div key={p.id} style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #78350f', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: '#fde68a', fontSize: '1rem' }}>{p.tokenNo}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.timeInQueue}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>
                  {p.name} ({p.age} Yrs)
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fbbf24', margin: '0.4rem 0' }}>
                  {p.chiefComplaint?.complaint}
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: '#334155', color: '#fff', border: 'none' }}>
                  Assign to Fast-Track OPD
                </button>
              </div>
            ))}
          </div>

          {/* 🟢 GREEN NORMAL QUEUE */}
          <div style={{ background: '#1e293b', borderRadius: '1rem', border: '2px solid #059669', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #334155' }}>
              <span className="badge badge-green" style={{ fontSize: '0.85rem' }}>
                🟢 NORMAL OPD QUEUE
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{greenPatients.length} Patients</span>
            </div>

            {greenPatients.map(p => (
              <div key={p.id} style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #064e3b', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: '#6ee7b7', fontSize: '1rem' }}>{p.tokenNo}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.timeInQueue}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                  {p.name} ({p.age} Yrs)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.3rem 0' }}>
                  {p.chiefComplaint?.complaint}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Assigned: {p.assignedDoctor}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
