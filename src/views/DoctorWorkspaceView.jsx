import React, { useState } from 'react';
import { Stethoscope, FileText, CheckCircle2, Edit3, Search, Sparkles, Check, Leaf } from 'lucide-react';
import RedFlagAlertBanner from '../components/RedFlagAlertBanner';
import MedicalTimelineView from '../components/MedicalTimelineView';

export default function DoctorWorkspaceView({ patients = [], selectedPatientId, onSelectPatient, onUpdatePatient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('Overview');

  // Currently open patient case
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const [summaryText, setSummaryText] = useState(currentPatient ? currentPatient.aiSummary : '');
  const [doctorNotes, setDoctorNotes] = useState(currentPatient ? currentPatient.doctorNotes : '');
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  // Sync state when patient changes
  React.useEffect(() => {
    if (currentPatient) {
      setSummaryText(currentPatient.aiSummary || '');
      setDoctorNotes(currentPatient.doctorNotes || '');
      setIsEditingSummary(false);
    }
  }, [selectedPatientId, currentPatient]);

  // Filtered Patients List
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tokenNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || p.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Handle Verify & Finalize Consultation
  const handleFinalizeConsultation = () => {
    if (!currentPatient) return;
    const updated = {
      ...currentPatient,
      aiSummary: summaryText,
      doctorNotes: doctorNotes,
      isVerifiedByDoctor: true,
      status: 'Consultation Completed'
    };
    onUpdatePatient(updated);
    alert(`Consultation finalized for ${currentPatient.name}. Case record saved & ABDM composition bundle signed.`);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 100px)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Doctor Header Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={24} style={{ color: '#0284c7' }} /> Doctor OPD Clinical Workspace
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Logged in: <strong>Dr. Ananya Sharma</strong> (Internal Medicine & Cardiology) | MCI-2015-88412
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
              Queue Total: <strong>{patients.length}</strong>
            </div>
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#dc2626', fontWeight: 700 }}>
              🔴 Priority Alerts: {patients.filter(p => p.priority === 'RED').length}
            </div>
          </div>
        </div>

        {/* Grid Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT COLUMN: OPD QUEUE LIST */}
          <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Today's Patient Queue
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search Patient / Token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.5rem 0.45rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {['ALL', 'RED', 'YELLOW', 'GREEN'].map(pf => (
                  <button
                    key={pf}
                    onClick={() => setPriorityFilter(pf)}
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: priorityFilter === pf ? '1px solid #0284c7' : '1px solid #cbd5e1',
                      background: priorityFilter === pf ? '#e0f2fe' : '#ffffff',
                      color: priorityFilter === pf ? '#0284c7' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {pf}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Cards List */}
            <div style={{ display: 'grid', gap: '0.6rem', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              {filteredPatients.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectPatient(p.id)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '0.75rem',
                    border: currentPatient?.id === p.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: currentPatient?.id === p.id ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{p.tokenNo}</span>
                    <span className={`badge badge-${p.priority === 'RED' ? 'red' : (p.priority === 'YELLOW' ? 'yellow' : 'green')}`}>
                      {p.priority}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1' }}>
                    {p.name} ({p.age} {p.gender[0]})
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.chiefComplaint?.complaint || "Case intake complete"}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: '#94a3b8' }}>
                    <span>{p.hasAbha ? '🛡 ABHA Linked' : '🔑 Temp Session'}</span>
                    <span>{p.documents?.length || 0} Docs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN & RIGHT COLUMN: CASE DETAILS & VERIFICATION */}
          {currentPatient ? (
            <div style={{ display: 'grid', gap: '1.25rem' }}>

              {/* Emergency Red-Flag Banner */}
              {currentPatient.redFlags && currentPatient.redFlags.length > 0 && (
                <RedFlagAlertBanner
                  flags={currentPatient.redFlags}
                  patientName={currentPatient.name}
                  tokenNo={currentPatient.tokenNo}
                />
              )}

              {/* Patient Profile Card */}
              <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={currentPatient.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                    alt="Patient"
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                        {currentPatient.name}
                      </h3>
                      {currentPatient.hasAbha ? (
                        <span className="badge badge-green">ABHA: {currentPatient.abhaId}</span>
                      ) : (
                        <span className="badge badge-yellow">Temp ID: {currentPatient.tempId}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {currentPatient.age} Yrs / {currentPatient.gender} | Mobile: {currentPatient.mobile} | Language: {currentPatient.language}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {currentPatient.isVerifiedByDoctor ? (
                    <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      <CheckCircle2 size={16} /> Doctor Verified & Signed
                    </span>
                  ) : (
                    <button onClick={handleFinalizeConsultation} className="btn btn-teal">
                      <CheckCircle2 size={18} /> Verify & Complete Consultation
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>
                {['Overview', 'History Summary', 'Documents', 'Timeline', 'AYUSH Mode'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px 8px 0 0',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: 'none',
                      background: activeTab === tab ? '#0284c7' : 'transparent',
                      color: activeTab === tab ? '#ffffff' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}

              {/* OVERVIEW / SUMMARY EDIT */}
              {(activeTab === 'Overview' || activeTab === 'History Summary') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>

                  {/* Center: AI Clinical Summary */}
                  <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={20} color="#0284c7" />
                        <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                          AI Clinical History Summary
                        </h4>
                      </div>

                      <span className="badge" style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }}>
                        AI GENERATED — DOCTOR VERIFICATION REQUIRED
                      </span>
                    </div>

                    {isEditingSummary ? (
                      <div>
                        <textarea
                          rows={12}
                          value={summaryText}
                          onChange={(e) => setSummaryText(e.target.value)}
                          style={{ width: '100%', padding: '1rem', fontFamily: 'monospace', fontSize: '0.9rem', borderRadius: '0.75rem', border: '2px solid #0284c7' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <button onClick={() => setIsEditingSummary(false)} className="btn btn-teal">
                            <Check size={16} /> Save Edited Summary
                          </button>
                          <button onClick={() => setIsEditingSummary(false)} className="btn btn-secondary">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <pre style={{
                          fontFamily: 'inherit',
                          whiteSpace: 'pre-wrap',
                          background: '#f8fafc',
                          padding: '1.25rem',
                          borderRadius: '0.75rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          color: '#0f172a'
                        }}>
                          {summaryText || currentPatient.aiSummary}
                        </pre>

                        <button onClick={() => setIsEditingSummary(true)} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                          <Edit3 size={16} /> Edit Summary Text
                        </button>
                      </div>
                    )}

                    {/* Doctor Clinical Notes Section */}
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Add Doctor Consultation Notes / Prescription:
                      </h4>
                      <textarea
                        rows={3}
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        placeholder="Type clinical diagnosis, advice, or prescription notes here..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Right Side Cards */}
                  <div style={{ display: 'grid', gap: '1.25rem' }}>

                    {/* Extracted Document Intelligence Card */}
                    <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                      <h4 style={{ fontFamily: 'Outfit', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={18} color="#0d9488" /> Document OCR Insights
                      </h4>

                      {currentPatient.documents && currentPatient.documents.length > 0 ? (
                        currentPatient.documents.map((doc, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{doc.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                              Diagnoses: {doc.extractedData?.diagnoses?.join(', ') || 'None'}
                            </div>

                            {doc.extractedData?.abnormalValues?.length > 0 && (
                              <div style={{ marginTop: '0.4rem', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>
                                ⚠️ {doc.extractedData.abnormalValues.join(' | ')}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No past medical documents uploaded.</div>
                      )}
                    </div>

                    {/* Longitudinal Timeline Summary */}
                    <MedicalTimelineView timeline={currentPatient.timeline} />

                  </div>
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === 'Timeline' && (
                <MedicalTimelineView timeline={currentPatient.timeline} />
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'Documents' && (
                <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                  <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Uploaded Medical Documents & OCR Extraction
                  </h4>

                  {currentPatient.documents && currentPatient.documents.length > 0 ? (
                    currentPatient.documents.map((doc, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: '#0369a1' }}>{doc.title} ({doc.type})</span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Date: {doc.date}</span>
                        </div>
                        <pre style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #cbd5e1' }}>
                          {JSON.stringify(doc.extractedData, null, 2)}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No attached documents.</div>
                  )}
                </div>
              )}

              {/* AYUSH TAB */}
              {activeTab === 'AYUSH Mode' && (
                <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#059669' }}>
                    <Leaf size={24} />
                    <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800 }}>
                      AYUSH Case Intake & Dashavidha Pariksha Summary
                    </h4>
                  </div>
                  <pre style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #a7f3d0', fontSize: '0.9rem', lineHeight: 1.6, color: '#064e3b' }}>
                    {JSON.stringify(currentPatient.ayushPariksha || "AYUSH mode was not selected during intake for this patient.", null, 2)}
                  </pre>
                </div>
              )}

            </div>
          ) : (
            <div style={{ background: '#ffffff', padding: '4rem', textAlign: 'center', color: '#94a3b8', borderRadius: '1rem' }}>
              Select a patient from the left queue to view clinical case summary.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
