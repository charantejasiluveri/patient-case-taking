import React from 'react';
import { ShieldAlert, HeartPulse, UserCheck } from 'lucide-react';

export default function RedFlagAlertBanner({ flags = [], patientName, tokenNo, onAcknowledge }) {
  if (!flags || flags.length === 0) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
      color: '#ffffff',
      padding: '1.25rem 1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(220, 38, 38, 0.35)',
      border: '2px solid #ef4444',
      marginBottom: '1.5rem',
      animation: 'pulse-red 2.5s infinite'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            background: '#ffffff',
            color: '#dc2626',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={28} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: '#ffffff', color: '#dc2626', fontWeight: 800 }}>
                🚨 URGENT TRIAGE RED FLAG
              </span>
              <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                Token: {tokenNo} | Patient: {patientName}
              </span>
            </div>

            <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.35rem' }}>
              Potentially Life-Threatening Emergency Symptoms Identified
            </h4>

            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', display: 'grid', gap: '0.25rem' }}>
              {flags.map((flag, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.6rem', borderRadius: '6px' }}>
                  <HeartPulse size={16} style={{ color: '#fca5a5' }} />
                  <span>{typeof flag === 'string' ? flag : flag.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {onAcknowledge && (
          <button
            onClick={onAcknowledge}
            className="btn"
            style={{
              background: '#ffffff',
              color: '#991b1b',
              fontWeight: 800,
              padding: '0.65rem 1.25rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <UserCheck size={18} /> Acknowledge & Transfer to Resuscitation
          </button>
        )}
      </div>
    </div>
  );
}
