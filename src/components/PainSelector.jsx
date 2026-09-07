import React, { useState } from 'react';

export default function PainSelector({ value = 5, onChange, onSelectLocation }) {
  const [selectedBodyPart, setSelectedBodyPart] = useState('Chest / Epigastrium');

  const painLevels = [
    { score: 0, label: "0 — No Pain", color: "#10b981", emoji: "😊" },
    { score: 2, label: "1-3 — Mild Pain", color: "#84cc16", emoji: "😐" },
    { score: 5, label: "4-6 — Moderate Pain", color: "#f59e0b", emoji: "😣" },
    { score: 8, label: "7-9 — Severe Pain", color: "#ef4444", emoji: "😫" },
    { score: 10, label: "10 — Unbearable Emergency Pain", color: "#b91c1c", emoji: "😱" }
  ];

  const bodyParts = [
    "Head & Neck", "Chest / Heart", "Epigastrium (Upper Abdomen)", "Lower Abdomen",
    "Back / Spine", "Left Shoulder & Arm", "Right Shoulder & Arm", "Both Knees / Joints", "Full Body"
  ];

  return (
    <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
      <h4 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
        Select Pain Severity & Location (Touch Alternative)
      </h4>

      {/* Pain Severity Scale */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700 }}>
          <span>Pain Severity Level:</span>
          <span style={{ color: value >= 7 ? '#dc2626' : (value >= 4 ? '#d97706' : '#059669') }}>
            {value} / 10 ({value === 0 ? 'No Pain' : value <= 3 ? 'Mild' : value <= 6 ? 'Moderate' : 'Severe'})
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange && onChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '12px',
            borderRadius: '6px',
            accentColor: value >= 7 ? '#dc2626' : (value >= 4 ? '#d97706' : '#059669'),
            cursor: 'pointer'
          }}
        />

        {/* Pain Face Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', gap: '0.25rem', flexWrap: 'wrap' }}>
          {painLevels.map((pl) => (
            <button
              key={pl.score}
              onClick={() => onChange && onChange(pl.score)}
              style={{
                background: value === pl.score ? pl.color : '#ffffff',
                color: value === pl.score ? '#ffffff' : '#334155',
                border: `1px solid ${pl.color}`,
                borderRadius: '0.5rem',
                padding: '0.4rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span>{pl.emoji}</span>
              <span>{pl.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body Part Selector */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
          Body Location of Pain:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {bodyParts.map((bp) => (
            <button
              key={bp}
              onClick={() => {
                setSelectedBodyPart(bp);
                if (onSelectLocation) onSelectLocation(bp);
              }}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                border: selectedBodyPart === bp ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: selectedBodyPart === bp ? '#e0f2fe' : '#ffffff',
                color: selectedBodyPart === bp ? '#0284c7' : '#334155',
                fontWeight: selectedBodyPart === bp ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {bp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
