import React, { useState } from 'react';
import { Smartphone, Globe, ShieldCheck, Mic, CheckCircle, Upload, AlertTriangle, RefreshCw, Leaf, UserCheck, Lock } from 'lucide-react';
import AudioGuide from '../components/AudioGuide';
import VoiceInputModal from '../components/VoiceInputModal';
import PainSelector from '../components/PainSelector';
import DocumentScannerModal from '../components/DocumentScannerModal';
import AYUSHParikshaForm from '../components/AYUSHParikshaForm';
import { LANGUAGES, KIOSK_TEXTS } from '../mockData/clinicalOntology';
import { ABDMService } from '../services/abdm/abdmService';
import { AuthService } from '../services/auth/authService';
import { ClinicalEngine } from '../services/clinicalEngine/clinicalEngine';
import { storageService } from '../services/storage/storageService';

export default function PatientKioskView({ onCaseSubmitted }) {
  // Step State: 1: Language -> 2: ABHA Choice -> 3: Ident Verification -> 4: Consent -> 5: Mode -> 6: Case Intake -> 7: Docs -> 8: Complete
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState('en');
  const t = KIOSK_TEXTS[lang] || KIOSK_TEXTS['en'];

  // Identity State
  const [identityType, setIdentityType] = useState('NO_ABHA');
  const [abhaInput, setAbhaInput] = useState('91-2834-1928-3019');
  const [mobileInput, setMobileInput] = useState('9876543210');
  const [otpInput, setOtpInput] = useState('123456');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [patientDetails, setPatientDetails] = useState({ name: 'Ramesh Kumar', age: 45, gender: 'Male' });
  const [tempSession, setTempSession] = useState(null);

  // Consent & Specialty Mode
  const [specialtyMode, setSpecialtyMode] = useState('General'); // 'General' or 'AYUSH'

  // Case Intake State
  const [chiefComplaintText, setChiefComplaintText] = useState('');
  const [painSeverity, setPainSeverity] = useState(5);
  const [painLocation, setPainLocation] = useState('Chest / Epigastrium');
  const [ayushParams, setAyushParams] = useState({});
  const [attachedDocs, setAttachedDocs] = useState([]);
  const [redFlagStatus, setRedFlagStatus] = useState(null);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voicePromptText, setVoicePromptText] = useState('');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Handle ABHA Verification
  const handleVerifyAbha = async () => {
    const res = await ABDMService.verifyAbha(abhaInput);
    if (res.success) {
      setPatientDetails({ name: res.name, age: res.age, gender: res.gender });
      setStep(4); // Move to consent
    } else {
      alert(res.message);
    }
  };

  // Handle Mobile OTP
  const handleSendOtp = () => {
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    const res = AuthService.verifyOtp(mobileInput, otpInput);
    if (res.success) {
      setIsOtpVerified(true);
      const tempId = ABDMService.createTemporaryIdentity(mobileInput, patientDetails);
      setTempSession(tempId);
      setStep(4); // Move to consent
    } else {
      alert(res.message);
    }
  };

  // Handle Voice Recording Callback
  const handleVoiceConfirm = (transcript) => {
    setChiefComplaintText(transcript);
    // Evaluate Red Flags dynamically
    const redFlagEval = ClinicalEngine.evaluateRedFlags(transcript, [], painSeverity);
    if (redFlagEval.hasRedFlag) {
      setRedFlagStatus(redFlagEval);
    }
  };

  // Submit Final Case
  const handleSubmitCase = () => {
    const redFlagEval = ClinicalEngine.evaluateRedFlags(chiefComplaintText, [], painSeverity);

    const tokenNumber = `OPD-${Math.floor(100 + Math.random() * 900)}`;
    const newPatient = {
      id: `PAT-2026-${Math.floor(100 + Math.random() * 900)}`,
      tokenNo: tokenNumber,
      name: patientDetails.name,
      age: patientDetails.age,
      gender: patientDetails.gender,
      mobile: mobileInput,
      hasAbha: identityType === 'ABHA',
      abhaId: identityType === 'ABHA' ? abhaInput : null,
      tempId: tempSession ? tempSession.tempId : null,
      mode: specialtyMode,
      language: LANGUAGES.find(l => l.code === lang)?.name || 'English',
      priority: redFlagEval.suggestedPriority,
      status: redFlagEval.hasRedFlag ? 'URGENT TRIAGE ALERT' : 'Case Completed',
      assignedDoctor: specialtyMode === 'AYUSH' ? 'Dr. Vaidya Suresh Sharma (AYUSH)' : 'Dr. Ananya Sharma (General Medicine)',
      timeInQueue: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint: {
        complaint: chiefComplaintText || "General indisposition & discomfort",
        duration: "1 to 2 weeks",
        severity: `${painSeverity}/10 (${painLocation})`
      },
      hpi: {
        onset: "Gradual onset over recent days",
        location: painLocation,
        character: "Pressing sensation",
        aggravating: "Exertion / spicy food",
        relieving: "Rest / antacids",
        associatedSymptoms: ["Acid regurgitation", "Discomfort"]
      },
      pastHistory: { diseases: ["Hypertension"], hospitalizations: [], surgeries: [] },
      drugHistory: [{ name: "Amlodipine 5mg", dosage: "1-0-0", duration: "1 Year" }],
      allergies: ["No known allergies"],
      documents: attachedDocs,
      timeline: [
        { year: "Today", event: `Case-Taking Intake Completed (${specialtyMode} Mode)`, category: "Case Intake" }
      ],
      redFlags: redFlagEval.flags.map(f => f.reason),
      aiSummary: ClinicalEngine.generateSummary({
        chiefComplaint: { complaint: chiefComplaintText, duration: "1-2 weeks", severity: `${painSeverity}/10` },
        hpi: { location: painLocation },
        redFlags: redFlagEval.flags.map(f => f.reason),
        documents: attachedDocs
      }),
      ayushPariksha: specialtyMode === 'AYUSH' ? ayushParams : null,
      isVerifiedByDoctor: false,
      consentGiven: true,
      consentTimestamp: new Date().toLocaleString()
    };

    storageService.addPatient(newPatient);
    setStep(8); // Move to final completed screen
    if (onCaseSubmitted) onCaseSubmitted(newPatient);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 100px)', padding: '2rem 1rem' }}>
      <div className="kiosk-container">

        {/* Top Kiosk Header / Progress Indicator */}
        <div style={{ background: '#ffffff', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.5rem', borderRadius: '10px' }}>
              <Smartphone size={24} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                OPD KIOSK CLINICAL INTAKE
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Step {step} of 8 — Touch & Voice Guided
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AudioGuide text={t.welcome} lang={lang} />
            <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <Globe size={14} /> {LANGUAGES.find(l => l.code === lang)?.native}
            </button>
          </div>
        </div>

        {/* STEP 1: LANGUAGE SELECTION */}
        {step === 1 && (
          <div className="kiosk-card animate-fade-in">
            <h2 className="kiosk-title">{t.selectLang}</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
              Select your spoken language for audio guidance & voice history taking.
            </p>

            <div className="kiosk-btn-grid" style={{ marginTop: '2rem' }}>
              {LANGUAGES.map((l) => (
                <div
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setStep(2);
                  }}
                  className={`kiosk-option-card ${lang === l.code ? 'selected' : ''}`}
                >
                  <span style={{ fontSize: '2rem' }}>{l.icon}</span>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>{l.native}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{l.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: ABHA VS NO-ABHA SELECTION */}
        {step === 2 && (
          <div className="kiosk-card animate-fade-in">
            <h2 className="kiosk-title">{t.abhaTitle}</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              {t.abhaHelp}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* I Have ABHA */}
              <div
                onClick={() => {
                  setIdentityType('ABHA');
                  setStep(3);
                }}
                className="kiosk-option-card"
                style={{ padding: '2rem', border: '2px solid #0284c7', background: '#f0f9ff' }}
              >
                <ShieldCheck size={48} color="#0284c7" />
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 800, color: '#0369a1' }}>
                  {t.hasAbha}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#0284c7' }}>
                  Enter 14-digit ABHA ID or @abdm address for instant verification.
                </p>
              </div>

              {/* I Don't Have ABHA */}
              <div
                onClick={() => {
                  setIdentityType('NO_ABHA');
                  setStep(3);
                }}
                className="kiosk-option-card"
                style={{ padding: '2rem', border: '2px solid #0d9488', background: '#f0fdf4' }}
              >
                <Smartphone size={48} color="#0d9488" />
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 800, color: '#0f766e' }}>
                  {t.noAbha}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#0d9488' }}>
                  Continue securely using Mobile Number & OTP Verification.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">
                {t.back}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: IDENTIFICATION FORM (ABHA OR NO-ABHA) */}
        {step === 3 && (
          <div className="kiosk-card animate-fade-in">
            {identityType === 'ABHA' ? (
              <div>
                <h2 className="kiosk-title">Enter ABHA Health ID</h2>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Enter your Ayushman Bharat Health Account number for authorization.
                </p>

                <div style={{ maxWidth: '450px', margin: '0 auto 1.5rem' }}>
                  <input
                    type="text"
                    value={abhaInput}
                    onChange={(e) => setAbhaInput(e.target.value)}
                    placeholder={t.abhaNumberPlaceholder}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', borderRadius: '0.75rem', border: '2px solid #cbd5e1', fontWeight: 700 }}
                  />
                  <button onClick={handleVerifyAbha} className="btn btn-primary btn-kiosk-large" style={{ width: '100%', marginTop: '1rem' }}>
                    <ShieldCheck size={22} /> Verify ABHA ID & Fetch Profile
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="kiosk-title">Mobile Number OTP Verification</h2>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  {t.tempIdNotice}
                </p>

                {/* Security Rule Notice */}
                <div style={{ background: '#fffbe8', border: '1px solid #fde68a', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#92400e' }}>
                  <Lock size={16} style={{ display: 'inline', marginRight: '0.35rem' }} />
                  {t.noMergeRuleNotice}
                </div>

                <div style={{ maxWidth: '450px', margin: '0 auto 1.5rem', display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                      Mobile Number:
                    </label>
                    <input
                      type="text"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder={t.mobilePlaceholder}
                      style={{ width: '100%', padding: '0.85rem', fontSize: '1.1rem', borderRadius: '0.75rem', border: '2px solid #cbd5e1', fontWeight: 700 }}
                    />
                  </div>

                  {!isOtpSent ? (
                    <button onClick={handleSendOtp} className="btn btn-teal btn-kiosk-large">
                      Send OTP Code
                    </button>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                        Enter 6-Digit OTP Code (Demo Code: 123456):
                      </label>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="123456"
                        style={{ width: '100%', padding: '0.85rem', fontSize: '1.2rem', borderRadius: '0.75rem', border: '2px solid #0d9488', fontWeight: 800, textAlign: 'center', letterSpacing: '0.2em' }}
                      />
                      <button onClick={handleVerifyOtp} className="btn btn-teal btn-kiosk-large" style={{ width: '100%', marginTop: '1rem' }}>
                        Verify OTP & Create Session
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary">
                {t.back}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONSENT MODULE */}
        {step === 4 && (
          <div className="kiosk-card animate-fade-in">
            <h2 className="kiosk-title">{t.consentTitle}</h2>
            <div style={{ marginBottom: '1rem' }}>
              <AudioGuide text={t.consentText} lang={lang} />
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.6, color: '#334155' }}>
              {t.consentText}
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                🔒 <strong>Patient Rights:</strong> Consent version 2.4. You can revoke consent at any time during your consultation. Data is processed locally in accordance with ABDM security architecture.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setConsentGiven(true);
                  setStep(5);
                }}
                className="btn btn-teal btn-kiosk-large"
                style={{ flex: 1 }}
              >
                <CheckCircle size={22} /> {t.agreeConsent}
              </button>
              <button onClick={() => setStep(1)} className="btn btn-secondary btn-kiosk-large">
                {t.cancelConsent}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SPECIALTY DISCIPLINE MODE */}
        {step === 5 && (
          <div className="kiosk-card animate-fade-in">
            <h2 className="kiosk-title">{t.ayushToggle}</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Select whether you are consulting General Allopathic Medicine or AYUSH OPD.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div
                onClick={() => {
                  setSpecialtyMode('General');
                  setStep(6);
                }}
                className={`kiosk-option-card ${specialtyMode === 'General' ? 'selected' : ''}`}
                style={{ padding: '2rem' }}
              >
                <Smartphone size={40} color="#0284c7" />
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  {t.ayushGeneral}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Standard clinical case-taking with SOCRATES pain framework & system review.
                </p>
              </div>

              <div
                onClick={() => {
                  setSpecialtyMode('AYUSH');
                  setStep(6);
                }}
                className={`kiosk-option-card ${specialtyMode === 'AYUSH' ? 'selected' : ''}`}
                style={{ padding: '2rem', border: '2px solid #059669', background: '#f0fdf4' }}
              >
                <Leaf size={40} color="#059669" />
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 800, color: '#064e3b' }}>
                  {t.ayushAyush}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#047857' }}>
                  Includes Dashavidha Pariksha, Deha Prakriti, Agni & Koshtha evaluation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: CASE-TAKING CONVERSATIONAL INTAKE */}
        {step === 6 && (
          <div className="kiosk-card animate-fade-in">
            {/* Red Flag Warning Banner */}
            {redFlagStatus && redFlagStatus.hasRedFlag && (
              <div style={{ background: '#fef2f2', border: '2px solid #ef4444', padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={24} /> {t.redFlagAlert}
                </div>
              </div>
            )}

            <h2 className="kiosk-title">{t.chiefQuestion}</h2>
            <div style={{ marginBottom: '1rem' }}>
              <AudioGuide text={t.chiefQuestion} lang={lang} />
            </div>

            {/* Response Input Controls: Voice vs Touch */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => {
                  setVoicePromptText(t.chiefQuestion);
                  setIsVoiceModalOpen(true);
                }}
                className="btn btn-primary btn-kiosk-large"
              >
                <Mic size={22} /> {t.voiceBtn}
              </button>

              <button
                onClick={() => setChiefComplaintText("Severe epigastric burning pain after eating spicy food for 2 weeks.")}
                className="btn btn-secondary btn-kiosk-large"
              >
                👆 Quick Touch Demo Answer
              </button>
            </div>

            {/* Textarea Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                Your Reported Problem:
              </label>
              <textarea
                rows={3}
                value={chiefComplaintText}
                onChange={(e) => {
                  setChiefComplaintText(e.target.value);
                  const redFlagEval = ClinicalEngine.evaluateRedFlags(e.target.value, [], painSeverity);
                  if (redFlagEval.hasRedFlag) setRedFlagStatus(redFlagEval);
                }}
                placeholder="Describe your health problem here..."
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '0.75rem', border: '2px solid #cbd5e1', fontWeight: 500 }}
              />
            </div>

            {/* Touch Pain & Body Selector */}
            <PainSelector
              value={painSeverity}
              onChange={(val) => {
                setPainSeverity(val);
                const redFlagEval = ClinicalEngine.evaluateRedFlags(chiefComplaintText, [], val);
                if (redFlagEval.hasRedFlag) setRedFlagStatus(redFlagEval);
              }}
              onSelectLocation={(loc) => setPainLocation(loc)}
            />

            {/* AYUSH Form if selected */}
            {specialtyMode === 'AYUSH' && (
              <div style={{ marginTop: '1.5rem' }}>
                <AYUSHParikshaForm onChange={(params) => setAyushParams(params)} />
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(5)} className="btn btn-secondary">
                {t.back}
              </button>
              <button onClick={() => setStep(7)} className="btn btn-teal btn-kiosk-large">
                Next: Medical Documents ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: MEDICAL DOCUMENT OCR SCANNING */}
        {step === 7 && (
          <div className="kiosk-card animate-fade-in">
            <h2 className="kiosk-title">{t.uploadDoc}</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Scan previous doctor prescriptions, blood test reports, or discharge summaries using Medical OCR.
            </p>

            <button
              onClick={() => setIsDocModalOpen(true)}
              className="btn btn-teal btn-kiosk-large"
              style={{ width: '100%', marginBottom: '1.5rem' }}
            >
              <Upload size={24} /> Upload / Scan Document with Medical OCR Engine
            </button>

            {/* Attached Documents List */}
            {attachedDocs.length > 0 && (
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                  Attached Digitized Documents ({attachedDocs.length}):
                </div>
                {attachedDocs.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>{doc.title}</span>
                    <span className="badge badge-green">OCR Verified</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={() => setStep(6)} className="btn btn-secondary">
                {t.back}
              </button>
              <button onClick={handleSubmitCase} className="btn btn-primary btn-kiosk-large">
                <CheckCircle size={22} /> {t.finish}
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: COMPLETED CASE SCREEN */}
        {step === 8 && (
          <div className="kiosk-card animate-fade-in" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <UserCheck size={48} />
            </div>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Thank You! Case Intaken Successfully
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              Your case history and digitized documents have been securely sent to the doctor's queue. Please proceed to the OPD waiting lounge.
            </p>

            <div className="badge badge-green" style={{ fontSize: '1rem', padding: '0.6rem 1.25rem', marginBottom: '2rem' }}>
              OPD Queue Token Assigned: {patientDetails.name}
            </div>

            <div>
              <button onClick={() => setStep(1)} className="btn btn-secondary btn-kiosk-large">
                <RefreshCw size={20} /> Clear Session & Return to Kiosk Welcome
              </button>
            </div>
          </div>
        )}

        {/* Voice Input Modal */}
        <VoiceInputModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onConfirm={handleVoiceConfirm}
          questionPrompt={voicePromptText}
          lang={lang}
        />

        {/* Document Scanner Modal */}
        <DocumentScannerModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          onDocumentProcessed={(doc) => setAttachedDocs([...attachedDocs, doc])}
        />

      </div>
    </div>
  );
}
