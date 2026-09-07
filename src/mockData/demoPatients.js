// Demo Patients with comprehensive realistic medical records for SIH 2026 presentation

export const INITIAL_PATIENTS = [
  {
    id: "PAT-2026-001",
    tokenNo: "OPD-101",
    name: "Ramesh Kumar",
    age: 45,
    gender: "Male",
    mobile: "+91 98765 43210",
    hasAbha: true,
    abhaId: "91-2834-1928-3019",
    abhaAddress: "ramesh.kumar@abdm",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    mode: "General",
    language: "English",
    priority: "GREEN",
    status: "Case Completed",
    assignedDoctor: "Dr. Ananya Sharma (Cardiology/Internal Med)",
    timeInQueue: "09:15 AM",
    chiefComplaint: {
      complaint: "Burning chest sensation & upper abdominal pain after meals",
      duration: "2 weeks",
      severity: "Moderate (5/10)"
    },
    hpi: {
      onset: "Gradual onset over 14 days, worse after spicy dinner",
      location: "Epigastric region radiating to lower retrosternal area",
      character: "Burning, non-radiating to arm/neck",
      aggravating: "Oily food, lying down flat after dinner",
      relieving: "Antacids, drinking cold milk",
      associatedSymptoms: ["Acid regurgitation", "Occasional nausea", "No dyspnea", "No diaphoresis"]
    },
    pastHistory: {
      diseases: ["Hypertension (Controlled)"],
      hospitalizations: ["None in last 5 years"],
      surgeries: ["Appendectomy (2018)"]
    },
    drugHistory: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily (Morning)", duration: "2 years" },
      { name: "Gelusil Antacid Syrup", dosage: "10ml", frequency: "As needed", duration: "1 week" }
    ],
    allergies: ["Penicillin (Mild skin rash)"],
    familyHistory: "Father had Hypertension; Mother had Type 2 Diabetes",
    personalHistory: {
      diet: "Non-vegetarian, frequent spicy meals",
      smoking: "Non-smoker",
      alcohol: "Occasional social consumer",
      sleep: "6 hours per night",
      habits: "High coffee consumption (4 cups/day)"
    },
    documents: [
      {
        id: "DOC-101",
        title: "Prescription - City Hospital",
        date: "2025-11-12",
        type: "Prescription",
        url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
        extractedData: {
          diagnoses: ["Gastroesophageal Reflux Disease (GERD)", "Mild Gastritis"],
          medicines: [
            { name: "Pantoprazole 40mg", dosage: "1-0-0", duration: "14 days", instruction: "Before breakfast" },
            { name: "Domperidone 10mg", dosage: "1-0-1", duration: "14 days", instruction: "Before meals" }
          ],
          investigations: ["Upper GI Endoscopy recommended if symptoms persist"],
          abnormalValues: []
        }
      },
      {
        id: "DOC-102",
        title: "Lipid Profile & Complete Blood Count",
        date: "2026-01-20",
        type: "Lab Report",
        url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600",
        extractedData: {
          diagnoses: ["Mild Hyperlipidemia"],
          medicines: [],
          investigations: [
            { test: "Total Cholesterol", value: "228 mg/dL", range: "120 - 200 mg/dL", isAbnormal: true },
            { test: "Triglycerides", value: "195 mg/dL", range: "50 - 150 mg/dL", isAbnormal: true },
            { test: "Hemoglobin", value: "14.2 g/dL", range: "13.5 - 17.5 g/dL", isAbnormal: false },
            { test: "Fasting Blood Sugar", value: "98 mg/dL", range: "70 - 99 mg/dL", isAbnormal: false }
          ],
          abnormalValues: ["Total Cholesterol: 228 mg/dL (High)", "Triglycerides: 195 mg/dL (High)"]
        }
      }
    ],
    timeline: [
      { year: "2018", event: "Appendectomy Surgery at St. Martha Hospital", category: "Surgery" },
      { year: "2024", event: "Diagnosed with Essential Hypertension", category: "Diagnosis" },
      { year: "Nov 2025", event: "Consultation for GERD - Pantoprazole prescribed", category: "Prescription" },
      { year: "Jan 2026", event: "Lab Test - Lipid Profile (Elevated Cholesterol)", category: "Lab Test" },
      { year: "Today", event: "AI Kiosk Case-Taking Completed (Epigastric Pain)", category: "Case Intake" }
    ],
    redFlags: [],
    aiSummary: `PATIENT CLINICAL HISTORY SUMMARY
===================================================
Chief Complaint: Burning epigastric pain & heartburn for 2 weeks (Severity: 5/10).
HPI: Gradual onset, aggravated by spicy meals & recumbency; relieved temporarily by antacids. Associated with regurgitation. No dyspnea or radiation to jaw/arm.
Past History: Essential Hypertension (2 yrs). Appendectomy (2018).
Current Drugs: Amlodipine 5mg OD.
Allergies: Penicillin (Rash).
Document Intelligence: Lab report (2026-01-20) indicates mild hyperlipidemia (Cholesterol 228 mg/dL).
Triage Flag: GREEN (Non-urgent standard OPD).`,
    doctorNotes: "",
    isVerifiedByDoctor: false,
    consentGiven: true,
    consentTimestamp: "2026-09-06 09:16:02"
  },

  {
    id: "PAT-2026-002",
    tokenNo: "OPD-102",
    name: "Sunita Devi",
    age: 58,
    gender: "Female",
    mobile: "+91 94123 78901",
    hasAbha: false,
    tempId: "TEMP-2026-8841",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    mode: "General",
    language: "Hindi",
    priority: "RED",
    status: "URGENT TRIAGE ALERT",
    assignedDoctor: "Dr. Vikram Seth (Emergency / Cardiology)",
    timeInQueue: "09:28 AM",
    chiefComplaint: {
      complaint: "Severe crushing chest pain radiating to left jaw & shortness of breath",
      duration: "45 minutes",
      severity: "Severe (9/10)"
    },
    hpi: {
      onset: "Sudden onset while walking upstairs 45 mins ago",
      location: "Substernal chest area, radiating to left shoulder and lower jaw",
      character: "Heavy pressure, squeezing like a vice",
      aggravating: "Any exertion or movement",
      relieving: "Nil",
      associatedSymptoms: ["Profuse sweating (Diaphoresis)", "Nausea", "Severe dyspnea", "Dizziness"]
    },
    pastHistory: {
      diseases: ["Type 2 Diabetes Mellitus (10 yrs)", "Hypertension (5 yrs)"],
      hospitalizations: ["Admitted 2 years ago for unstable angina"],
      surgeries: ["Coronary Angiography (2024)"]
    },
    drugHistory: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "10 years" },
      { name: "Telmisartan", dosage: "40mg", frequency: "Once daily", duration: "5 years" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Nightly", duration: "2 years" },
      { name: "Ecosprin (Aspirin)", dosage: "75mg", frequency: "Once daily", duration: "2 years" }
    ],
    allergies: ["No known drug allergies"],
    familyHistory: "Strong cardiac history: Brother had MI at age 50",
    personalHistory: {
      diet: "Vegetarian",
      smoking: "Non-smoker",
      alcohol: "Teetotaler",
      sleep: "5 hours per night",
      habits: "Sedentary lifestyle"
    },
    documents: [
      {
        id: "DOC-201",
        title: "Discharge Summary - Apex Heart Institute",
        date: "2024-05-18",
        type: "Discharge Summary",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
        extractedData: {
          diagnoses: ["Unstable Angina", "Single Vessel CAD (LAD 60% stenosis)"],
          medicines: [
            { name: "Ecosprin 75mg", dosage: "0-1-0", duration: "Long term", instruction: "After lunch" },
            { name: "Atorvastatin 20mg", dosage: "0-0-1", duration: "Long term", instruction: "At bed time" }
          ],
          investigations: ["ECG: ST depression in V3-V5", "Echo: EF 55%, LVDD Grade 1"],
          abnormalValues: ["LAD Stenosis: 60%"]
        }
      }
    ],
    timeline: [
      { year: "2016", event: "Diagnosed with Type 2 Diabetes Mellitus", category: "Diagnosis" },
      { year: "2021", event: "Diagnosed with Hypertension", category: "Diagnosis" },
      { year: "May 2024", event: "Hospitalization for Unstable Angina (CAG done)", category: "Hospitalization" },
      { year: "Today 09:28 AM", event: "CRITICAL RED FLAG DETECTED - Acute Chest Pain & Diaphoresis", category: "Emergency Alert" }
    ],
    redFlags: [
      "CRITICAL: Retrosternal crushing pain (9/10) radiating to left arm & jaw",
      "CRITICAL: Associated acute diaphoresis & severe shortness of breath",
      "HIGH RISK: Known CAD with 60% LAD stenosis (Discharge Summary 2024)",
      "IMMEDIATE ACTION REQUIRED: Stat ECG, Sublingual Nitroglycerin protocol, Immediate Cardiology Evaluation"
    ],
    aiSummary: `⚠️ EMERGENCY RED FLAG ALERT DETECTED
===================================================
Chief Complaint: Sudden onset retrosternal crushing pain (9/10) radiating to left arm & jaw (Duration: 45 mins).
Associated Symptoms: Severe dyspnea, profuse diaphoresis, nausea.
Risk Factors: 10-yr T2DM, Hypertension, Known CAD with 60% LAD stenosis (2024).
Recommendation: Immediate Triage Intercept. Transfer patient directly to Resuscitation/ECG Room. Doctor notified automatically.`,
    doctorNotes: "",
    isVerifiedByDoctor: false,
    consentGiven: true,
    consentTimestamp: "2026-09-06 09:28:15"
  },

  {
    id: "PAT-2026-003",
    tokenNo: "OPD-103",
    name: "Rajesh Patel",
    age: 52,
    gender: "Male",
    mobile: "+91 97234 56789",
    hasAbha: true,
    abhaId: "82-1049-5512-8823",
    abhaAddress: "rajesh.patel@abdm",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    mode: "AYUSH",
    language: "Gujarati",
    priority: "YELLOW",
    status: "Case Completed",
    assignedDoctor: "Dr. Vaidya Suresh Sharma (AYUSH / Kayachikitsa)",
    timeInQueue: "09:40 AM",
    chiefComplaint: {
      complaint: "Bilateral knee joint pain, morning stiffness & heavy feeling in body (Amavata)",
      duration: "3 months",
      severity: "Moderate (6/10)"
    },
    hpi: {
      onset: "Gradual onset over 3 months, worsening during cold monsoon weather",
      location: "Bilateral Janu Sandhi (Knee joints) and Manibandha (Wrist joints)",
      character: "Stiffening pain with swelling (Sandhishoola & Shotha)",
      aggravating: "Cold weather, heavy meals (Gurvahara), morning upon waking",
      relieving: "Warm fomentation (Svedana), hot water bath",
      associatedSymptoms: ["Anorexia (Aruchi)", "Lethargy (Alasya)", "Indigestion (Amapaka)", "Constipation (Baddhakostha)"]
    },
    ayushPariksha: {
      prakriti: "Vata-Kapha",
      vikriti: "Vata-Kapha Vriddhi with Ama accumulation",
      sara: "Madhyama Sara (Medium tissue quality)",
      samhanana: "Madhyama (Medium body compactness)",
      pramana: "Sama (Proportional body dimensions)",
      satmya: "Madhyama Satmya",
      sattva: "Pravara Sattva (Strong mental resilience)",
      aharaShakti: "Manda Agni (Sluggish digestion capability)",
      vyayamaShakti: "Avara (Low exercise capacity due to pain)",
      vaya: "Madhyama Vaya (52 yrs)",
      agni: "Manda Agni (Low digestive fire)",
      koshtha: "Krura Koshtha (Hard bowels / tendency to constipation)",
      ahara: "Prefers heavy, greasy foods, late dinners",
      vihara: "Daytime sleep (Diva Swapna), sedentary work",
      nidana: "Ama Formation due to Manda Agni & Viruddhahara",
      samprapti: "Vata & Kapha aggravation -> Ama entry into Sandhi -> Amavata Lakshana"
    },
    pastHistory: {
      diseases: ["Chronic Dyspepsia"],
      hospitalizations: ["None"],
      surgeries: ["None"]
    },
    drugHistory: [
      { name: "Yogaraj Guggulu", dosage: "2 tablets", frequency: "Twice daily", duration: "1 month" },
      { name: "Eranda Taila", dosage: "5ml", frequency: "At night with warm milk", duration: "2 weeks" }
    ],
    allergies: ["No known allergies"],
    familyHistory: "Mother had joint ailments (Sandhigata Vata)",
    personalHistory: {
      diet: "Vegetarian, high dairy intake, curd at night",
      smoking: "Non-smoker",
      alcohol: "Non-drinker",
      sleep: "Disturbed due to joint stiffness",
      habits: "Late night sleeping"
    },
    documents: [
      {
        id: "DOC-301",
        title: "X-Ray Both Knees (AP & Lateral)",
        date: "2026-02-05",
        type: "Imaging Report",
        url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
        extractedData: {
          diagnoses: ["Grade 2 Osteoarthritis Both Knees", "Mild Joint Space Narrowing"],
          medicines: [],
          investigations: [
            { test: "Rheumatoid Factor (RA Factor)", value: "14 IU/mL", range: "< 20 IU/mL (Negative)", isAbnormal: false },
            { test: "Uric Acid", value: "5.8 mg/dL", range: "3.5 - 7.2 mg/dL", isAbnormal: false },
            { test: "ESR", value: "38 mm/hr", range: "0 - 20 mm/hr", isAbnormal: true }
          ],
          abnormalValues: ["ESR: 38 mm/hr (Elevated inflammatory marker)"]
        }
      }
    ],
    timeline: [
      { year: "Nov 2025", event: "Onset of morning knee stiffness and body heaviness", category: "Symptom Onset" },
      { year: "Feb 2026", event: "X-Ray Knees & Inflammatory Marker Lab Test (ESR 38)", category: "Lab Test" },
      { year: "Today", event: "AYUSH Case-Taking Intake - Dashavidha Pariksha completed", category: "AYUSH Case" }
    ],
    redFlags: [],
    aiSummary: `AYUSH CLINICAL HISTORY SUMMARY (DASHAVIDHA PARIKSHA)
===================================================
Chief Complaint: Joint pain & stiffness in knee joints (Amavata symptoms) for 3 months.
Ayurvedic Assessment:
- Deha Prakriti: Vata-Kapha | Vikriti: Vata-Kapha with Ama
- Agni: Manda Agni (Indigestion) | Koshtha: Krura Koshtha
- Samprapti: Mandagni -> Ama -> Sandhi Sthanasamsraya
Investigations: Elevated ESR (38 mm/hr), X-Ray shows Grade 2 OA.
Recommendation: Chikitsa targeting Ama Pachana, Deepana, and Vata-Anulomana.
AYUSH MODE NOTICE: Doctor/Vaidya verification required before prescribing.`,
    doctorNotes: "",
    isVerifiedByDoctor: false,
    consentGiven: true,
    consentTimestamp: "2026-09-06 09:40:10"
  }
];
