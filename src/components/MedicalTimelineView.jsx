import React from 'react';
import { Calendar, FileText, Activity, Stethoscope, AlertCircle } from 'lucide-react';

export default function MedicalTimelineView({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '1rem' }}>
        No prior medical events on record.
      </div>
    );
  }

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Emergency Alert':
        return { bg: '#fee2e2', color: '#dc2626', icon: <AlertCircle size={14} /> };
      case 'Surgery':
        return { bg: '#e0e7ff', color: '#4338ca', icon: <Activity size={14} /> };
      case 'Hospitalization':
        return { bg: '#fef3c7', color: '#d97706', icon: <Activity size={14} /> };
      case 'Lab Test':
        return { bg: '#ccfbf1', color: '#0d9488', icon: <FileText size={14} /> };
      default:
        return { bg: '#e0f2fe', color: '#0284c7', icon: <Stethoscope size={14} /> };
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
      <h4 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={18} style={{ color: '#0284c7' }} /> Patient Longitudinal Medical Timeline
      </h4>

      <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px dashed #cbd5e1' }}>
        {timeline.map((item, idx) => {
          const badge = getCategoryBadge(item.category);
          return (
            <div key={idx} style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <div style={{
                position: 'absolute',
                left: '-2.05rem',
                top: '0.2rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: badge.color,
                border: '3px solid #ffffff',
                boxShadow: '0 0 0 2px #cbd5e1'
              }} />

              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b' }}>
                    {item.year}
                  </span>
                  <span className="badge" style={{ background: badge.bg, color: badge.color, fontSize: '0.68rem' }}>
                    {badge.icon} {item.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                  {item.event}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
