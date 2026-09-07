import React, { useState } from 'react';
import { Leaf, Sparkles, CheckCircle } from 'lucide-react';
import { AYUSH_DASHAVIDHA_PARIKSHA } from '../mockData/clinicalOntology';

export default function AYUSHParikshaForm({ initialValues = {}, onChange }) {
  const [formData, setFormData] = useState(initialValues);

  const handleSelect = (id, value) => {
    const updated = { ...formData, [id]: value };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div style={{ background: '#f0fdf4', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #a7f3d0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Leaf size={22} style={{ color: '#059669' }} />
        <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700, color: '#064e3b' }}>
          Dashavidha Pariksha & AYUSH Case Parameters
        </h4>
      </div>
      <p style={{ fontSize: '0.82rem', color: '#047857', marginBottom: '1.25rem' }}>
        Captures Deha Prakriti, Vikriti, Sara, Samhanana, Agni, Koshtha, and Samprapti for Ayurvedic OPD consultation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {AYUSH_DASHAVIDHA_PARIKSHA.map((item) => (
          <div key={item.id} style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1fae5' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#064e3b', display: 'block', marginBottom: '0.35rem' }}>
              {item.label}:
            </label>
            <select
              value={formData[item.id] || item.options[0]}
              onChange={(e) => handleSelect(item.id, e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem',
                borderRadius: '6px',
                border: '1px solid #a7f3d0',
                background: '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#0f172a'
              }}
            >
              {item.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
