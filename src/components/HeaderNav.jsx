import React from 'react';
import { Stethoscope, ShieldAlert, BarChart3, Network, Cpu, Smartphone } from 'lucide-react';

export default function HeaderNav({ currentView, setCurrentView, patientCount, redFlagCount }) {
  return (
    <header style={{
      background: '#0f172a',
      color: '#ffffff',
      borderBottom: '1px solid #1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)'
          }}>
            <Stethoscope size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              PATIENT CASE-TAKING
              <span className="badge" style={{ background: 'rgba(2,132,199,0.2)', color: '#38bdf8', fontSize: '0.65rem', border: '1px solid #0284c7' }}>
                AI-CLINICAL OPD
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Doctor Assistance & ABDM-Ready Document Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentView('landing')}
            className={`btn ${currentView === 'landing' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            Overview
          </button>

          <button
            onClick={() => setCurrentView('kiosk')}
            className={`btn ${currentView === 'kiosk' ? 'btn-teal' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', position: 'relative' }}
          >
            <Smartphone size={16} /> Patient Kiosk
          </button>

          <button
            onClick={() => setCurrentView('doctor')}
            className={`btn ${currentView === 'doctor' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            <Stethoscope size={16} /> Doctor Workspace
          </button>

          <button
            onClick={() => setCurrentView('triage')}
            className={`btn ${currentView === 'triage' ? 'btn-danger' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', position: 'relative' }}
          >
            <ShieldAlert size={16} /> Triage Desk
            {redFlagCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#dc2626',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                {redFlagCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            <BarChart3 size={16} /> Admin Analytics
          </button>

          <button
            onClick={() => setCurrentView('architecture')}
            className={`btn ${currentView === 'architecture' ? 'btn-teal' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            title="System Architecture Diagram for SIH Judges"
          >
            <Network size={16} /> Architecture
          </button>

          <button
            onClick={() => setCurrentView('tech')}
            className={`btn ${currentView === 'tech' ? 'btn-secondary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            <Cpu size={16} /> Tech Stack
          </button>
        </nav>
      </div>
    </header>
  );
}
