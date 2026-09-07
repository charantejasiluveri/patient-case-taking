import React from 'react';
import { Play, AlertTriangle, Leaf, RefreshCw, Mic, FileText } from 'lucide-react';
import { storageService } from '../services/storage/storageService';

export default function DemoBar({ onSelectDemoPatient, onSimulateAction, activeRole, setActiveRole, currentView, setCurrentView }) {
  const handleReset = () => {
    storageService.resetDemoData();
    window.location.reload();
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff',
      padding: '0.5rem 1rem',
      fontSize: '0.85rem',
      borderBottom: '2px solid #0284c7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      zIndex: 1000,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="badge" style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem' }}>
          SIH 2026 DEMO PANEL
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          Simulate clinical scenarios for judges:
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            onSelectDemoPatient('PAT-2026-001');
            setCurrentView('doctor');
          }}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', background: '#334155', color: '#fff', border: 'none' }}
        >
          <Play size={14} style={{ color: '#38bdf8' }} /> Patient A (GERD)
        </button>

        <button
          onClick={() => {
            onSelectDemoPatient('PAT-2026-002');
            setCurrentView('doctor');
          }}
          className="btn btn-danger"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
        >
          <AlertTriangle size={14} /> Patient B (🚨 RED FLAG)
        </button>

        <button
          onClick={() => {
            onSelectDemoPatient('PAT-2026-003');
            setCurrentView('doctor');
          }}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', background: '#064e3b', color: '#6ee7b7', border: '1px solid #047857' }}
        >
          <Leaf size={14} /> Patient C (AYUSH)
        </button>

        <span style={{ color: '#475569' }}>|</span>

        <button
          onClick={() => onSimulateAction && onSimulateAction('simulate_voice')}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', background: '#1e1b4b', color: '#c084fc', border: '1px solid #4338ca' }}
        >
          <Mic size={14} /> Sim Voice
        </button>

        <button
          onClick={() => onSimulateAction && onSimulateAction('simulate_ocr')}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', background: '#134e4a', color: '#2dd4bf', border: '1px solid #0f766e' }}
        >
          <FileText size={14} /> Sim OCR
        </button>

        <button
          onClick={handleReset}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', background: '#0f172a', color: '#94a3b8', border: '1px solid #334155' }}
          title="Reset sample data back to initial state"
        >
          <RefreshCw size={12} /> Reset Data
        </button>
      </div>
    </div>
  );
}
