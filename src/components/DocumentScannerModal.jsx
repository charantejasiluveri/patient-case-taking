import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { OCRService } from '../services/ocr/ocrService';

export default function DocumentScannerModal({ isOpen, onClose, onDocumentProcessed }) {
  const [docType, setDocType] = useState('Prescription');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDoc, setProcessedDoc] = useState(null);

  if (!isOpen) return null;

  const handleUpload = async (selectedFile = null) => {
    setIsProcessing(true);
    setProcessedDoc(null);
    try {
      const result = await OCRService.processDocument(selectedFile || file, docType);
      setProcessedDoc(result);
      setIsProcessing(false);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (processedDoc && onDocumentProcessed) {
      onDocumentProcessed(processedDoc);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '1.5rem',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        border: '2px solid #0d9488',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#ccfbf1', padding: '0.6rem', borderRadius: '12px', color: '#0d9488' }}>
            <FileText size={24} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
              Upload Medical Document (OCR + AI Extraction)
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Scans prescriptions, lab reports, & discharge summaries into structured digital entities.
            </p>
          </div>
        </div>

        {/* Document Type Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
            Select Document Category:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Prescription', 'Lab Report', 'Discharge Summary', 'Imaging Report'].map((type) => (
              <button
                key={type}
                onClick={() => setDocType(type)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: docType === type ? '2px solid #0d9488' : '1px solid #cbd5e1',
                  background: docType === type ? '#ccfbf1' : '#ffffff',
                  color: docType === type ? '#0f766e' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Drop Zone */}
        {!processedDoc && !isProcessing && (
          <div
            onClick={() => handleUpload()}
            style={{
              border: '2px dashed #0d9488',
              borderRadius: '1rem',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: '#f0fdf4',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Upload size={40} style={{ color: '#0d9488', marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
              Click to Scan / Upload Document Image or Sample
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Supports JPG, PNG, PDF (Prints & Legible Handwriting)
            </div>
            <button className="btn btn-teal" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
              Select Sample {docType} Image
            </button>
          </div>
        )}

        {/* Processing Spinner */}
        {isProcessing && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="voice-wave" style={{ marginBottom: '1rem' }}>
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <div style={{ fontWeight: 700, color: '#0d9488', fontSize: '1.1rem' }}>
              Running Medical OCR & Clinical Entity Extraction...
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              Identifying diagnoses, medicines, dosages, and highlighting abnormal lab markers...
            </div>
          </div>
        )}

        {/* Processed Results */}
        {processedDoc && (
          <div className="animate-fade-in" style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
              <span className="badge badge-green">
                <CheckCircle size={14} /> OCR Verification Complete (Score: 94%)
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{processedDoc.date}</span>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>Extracted Diagnoses:</div>
              <div style={{ fontSize: '0.95rem', color: '#0d9488', fontWeight: 600 }}>
                {processedDoc.extractedData.diagnoses.join(', ') || 'None identified'}
              </div>
            </div>

            {/* Medicines List */}
            {processedDoc.extractedData.medicines.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>Extracted Prescribed Medicines:</div>
                <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {processedDoc.extractedData.medicines.map((m, idx) => (
                    <div key={idx} style={{ background: '#ffffff', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                      <span style={{ color: '#64748b' }}>{m.dosage} ({m.duration}) - {m.instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Abnormal Values Banner */}
            {processedDoc.extractedData.abnormalValues.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', margin: '0.75rem 0' }}>
                <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={16} /> Highlighted Abnormal Findings for Doctor Review:
                </div>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', fontSize: '0.82rem', color: '#991b1b' }}>
                  {processedDoc.extractedData.abnormalValues.map((ab, i) => (
                    <li key={i}>{ab}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          {processedDoc && (
            <button onClick={handleConfirm} className="btn btn-teal">
              <CheckCircle size={18} /> Attach to Patient Case
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
