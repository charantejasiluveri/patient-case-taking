// Clinical History Ontology, Multilingual Translations, Red-Flag Rules & SOCRATES Framework

export const LANGUAGES = [
  { code: "en", name: "English", native: "English", icon: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", icon: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", icon: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", icon: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", icon: "🇮🇳" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", icon: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", icon: "🇮🇳" },
  { code: "bn", name: "Bengali", native: "বাংলা", icon: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", icon: "🇮🇳" }
];

export const RED_FLAG_RULES = [
  {
    id: "RF-CHEST-PAIN",
    keywords: ["chest pain", "pressure in chest", "छाती में दर्द", "గుండె నొప్పి", "நெஞ்சு வலி", "heart pain", "crushing pain"],
    associated: ["shortness of breath", "sweating", "jaw pain", "arm pain", "left shoulder pain", "nausea"],
    severityThreshold: 7,
    reason: "CRITICAL: Potential Acute Coronary Syndrome / Myocardial Infarction",
    action: "Trigger Triage Alert RED, assign priority queue, direct to Resuscitation Room"
  },
  {
    id: "RF-DYSPNEA",
    keywords: ["cannot breathe", "difficulty breathing", "गंभीर सांस फूलना", "శ్వాస ఆడకపోవడం", "shortness of breath"],
    associated: ["cyanosis", "chest tightness", "wheezing"],
    severityThreshold: 8,
    reason: "CRITICAL: Severe Respiratory Distress / Acute Asthma / Pulmonary Embolism",
    action: "Trigger Triage Alert RED, Stat Oxygen & Physician Review"
  },
  {
    id: "RF-STROKE",
    keywords: ["face weakness", "arm numbness", "slurred speech", "sudden weakness", "लकवा", "పక్షవాతం", "sudden loss of vision"],
    associated: ["confusion", "loss of balance"],
    severityThreshold: 5,
    reason: "CRITICAL: FAST Protocol - Suspected Acute Cerebrovascular Accident (Stroke)",
    action: "Trigger Triage Alert RED, Immediate Stroke Team Notification & CT Scan"
  },
  {
    id: "RF-BLEEDING",
    keywords: ["coughing blood", "vomiting blood", "severe bleeding", "खून की उल्टी", "రక్తం వాంతి"],
    associated: ["dizziness", "fainting"],
    severityThreshold: 6,
    reason: "CRITICAL: Massive Hemorrhage / Active Upper GI Bleed",
    action: "Trigger Triage Alert RED, Stat Hemostatic Assessment"
  }
];

export const SOCRATES_PAIN_QUESTIONS = [
  { key: "site", question: "Site: Where is the pain located precisely?", type: "body_selector" },
  { key: "onset", question: "Onset: Did the pain start suddenly or build up gradually?", options: ["Sudden (within seconds/minutes)", "Gradual (over hours/days)", "Chronic (weeks/months)"] },
  { key: "character", question: "Character: What does the pain feel like?", options: ["Sharp / Stabbing", "Burning / Heartburn", "Dull Ache", "Crushing / Vice-like Pressure", "Throbbing", "Colicky / Cramping"] },
  { key: "radiation", question: "Radiation: Does the pain travel or move to any other body part?", options: ["Stays in one spot", "Radiates to Left Shoulder / Arm", "Radiates to Jaw / Neck", "Radiates to Back", "Radiates to Abdomen / Groin"] },
  { key: "associations", question: "Associated Symptoms: Do you have any of the following alongside?", multiSelect: true, options: ["Shortness of breath", "Cold sweating (Diaphoresis)", "Nausea / Vomiting", "Dizziness / Lightheadedness", "Fever / Chills", "Acid taste in mouth"] },
  { key: "timeCourse", question: "Timing / Course: How long does the pain last?", options: ["Constant continuous pain", "Comes in waves (Intermittent)", "Lasts 5-15 mins", "Only after meals", "Worse at night"] },
  { key: "exacerbating", question: "Exacerbating / Relieving Factors: What makes it worse or better?", options: ["Worse with exertion / stairs", "Worse after spicy/oily food", "Relieved by antacids", "Relieved by rest", "Worse with deep breathing"] },
  { key: "severity", question: "Severity: On a scale of 0 (no pain) to 10 (worst pain imaginable), how severe is it?", type: "slider_0_10" }
];

export const AYUSH_DASHAVIDHA_PARIKSHA = [
  { id: "prakriti", label: "Deha Prakriti (Constitutional Type)", options: ["Vata Dominant", "Pitta Dominant", "Kapha Dominant", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha", "Sama Dhatu"] },
  { id: "vikriti", label: "Vikriti (Pathological Imbalance)", options: ["Vata Vriddhi", "Pitta Vriddhi", "Kapha Vriddhi", "Ama Accumulation", "Dhatu Kshaya"] },
  { id: "sara", label: "Sara (Tissue Excellence)", options: ["Pravara (Superior)", "Madhyama (Moderate)", "Avara (Low)"] },
  { id: "samhanana", label: "Samhanana (Body Compactness)", options: ["Pravara", "Madhyama", "Avara"] },
  { id: "pramana", label: "Pramana (Anthropometric Proportion)", options: ["Sama (Proportional)", "Asama (Unproportional)"] },
  { id: "satmya", label: "Satmya (Adaptability)", options: ["Pravara", "Madhyama", "Avara"] },
  { id: "sattva", label: "Sattva (Mental Resilience)", options: ["Pravara Sattva", "Madhyama Sattva", "Avara Sattva"] },
  { id: "aharaShakti", label: "Ahara Shakti (Digestive Power)", options: ["Abhyavaharana Shakti High", "Jarana Shakti High", "Manda (Low)", "Sama (Normal)"] },
  { id: "vyayamaShakti", label: "Vyayama Shakti (Physical Stamina)", options: ["Pravara", "Madhyama", "Avara"] },
  { id: "vaya", label: "Vaya (Age Category)", options: ["Bala (Childhood)", "Madhyama (Adult)", "Vriddha (Elderly)"] },
  { id: "agni", label: "Agni (Digestive Fire)", options: ["Sama Agni (Balanced)", "Manda Agni (Sluggish)", "Tikshna Agni (Intense)", "Vishama Agni (Irregular)"] },
  { id: "koshtha", label: "Koshtha (Bowel Habit)", options: ["Mridu Koshtha (Soft/Frequent)", "Madhyama Koshtha (Normal)", "Krura Koshtha (Hard/Constipated)"] }
];

export const KIOSK_TEXTS = {
  en: {
    welcome: "Welcome. Let's prepare your clinical case for the doctor.",
    subtitle: "Quick, confidential, and accurate history-taking before your OPD consultation.",
    selectLang: "Select Your Preferred Language",
    abhaTitle: "Do you have an ABHA Health ID?",
    abhaHelp: "ABHA (Ayushman Bharat Health Account) lets us fetch your medical history securely with your consent.",
    hasAbha: "I Have ABHA ID",
    noAbha: "I Don't Have ABHA",
    abhaNumberPlaceholder: "Enter 14-digit ABHA ID (e.g., 91-2834-1928-3019)",
    mobilePlaceholder: "Enter 10-digit Mobile Number",
    verifyOtp: "Verify OTP Code",
    otpHelp: "We have sent a 6-digit verification code to your mobile.",
    tempIdNotice: "No ABHA? A secure Temporary Session ID will be issued for today's visit.",
    noMergeRuleNotice: "🔒 Security Notice: Your identity will be created as a new temporary profile. Past records will not be merged automatically without hospital staff verification.",
    consentTitle: "Patient Information Consent",
    consentText: "I give consent for Patient Case-Taking platform to collect my medical complaints, symptoms, uploaded documents, and history solely for assisting the hospital OPD doctor during my consultation today. I understand that my data is encrypted and protected under Indian ABDM guidelines.",
    agreeConsent: "I Understand & Give Consent",
    cancelConsent: "Cancel / Exit",
    listenAudio: "🔊 Play Audio Explanation",
    chiefQuestion: "What is your main health problem today?",
    voiceBtn: "🎙 Speak Answer",
    touchBtn: "👆 Touch / Select Answer",
    replayAudio: "🔊 Hear Question Again",
    next: "Continue ➔",
    back: "← Back",
    finish: "Submit Case to OPD Queue",
    uploadDoc: "Upload / Scan Previous Prescriptions or Lab Reports",
    ocrProcessing: "Scanning document with Medical OCR Engine...",
    ocrSuccess: "Document Digitized! Extracted diagnostic and medicine parameters ready for review.",
    ayushToggle: "Select Medicine Discipline",
    ayushGeneral: "General Allopathic Medicine",
    ayushAyush: "AYUSH (Ayurveda / Siddha / Homeopathy)",
    redFlagAlert: "🚨 Potentially urgent symptoms detected! Please stay seated while a triage nurse assists you immediately."
  },
  hi: {
    welcome: "स्वागत है। डॉक्टर के परामर्श से पहले आपकी बीमारी का विवरण तैयार करते हैं।",
    subtitle: "OPD डॉक्टर से मिलने से पहले त्वरित, गुप्त और सटीक जानकारी दर्ज करें।",
    selectLang: "अपनी पसंदीदा भाषा चुनें",
    abhaTitle: "क्या आपके पास आभा (ABHA) स्वास्थ्य आईडी है?",
    abhaHelp: "आभा आईडी से आपकी सहमति के साथ आपकी पिछली मेडिकल रिपोर्ट सुरक्षित रूप से जुड़ सकती है।",
    hasAbha: "मेरे पास ABHA ID है",
    noAbha: "मेरे पास ABHA ID नहीं है",
    abhaNumberPlaceholder: "14-अंकों का आभा आईडी दर्ज करें (उदा. 91-2834-1928-3019)",
    mobilePlaceholder: "10-अंकों का मोबाइल नंबर दर्ज करें",
    verifyOtp: "ओटीपी (OTP) सत्यापित करें",
    otpHelp: "हमने आपके मोबाइल पर 6-अंकों का सुरक्षा कोड भेजा है।",
    tempIdNotice: "आभा आईडी नहीं है? आज की यात्रा के लिए एक अस्थायी सुरक्षा आईडी बनाई जाएगी।",
    noMergeRuleNotice: "🔒 सुरक्षा सूचना: आपकी जानकारी को एक नया अस्थायी प्रोफ़ाइल माना जाएगा। स्टाफ सत्यापन के बिना पुराने रिकॉर्ड अपने आप नहीं जोड़े जाएंगे।",
    consentTitle: "रोगी सहमति पत्र",
    consentText: "मैं आज के परामर्श के लिए अपनी स्वास्थ्य समस्याओं, लक्षणों और मेडिकल दस्तावेजों को साझा करने की सहमति देता/देती हूँ। डेटा भारतीय ABDM दिशानिर्देशों के तहत सुरक्षित रखा जाएगा।",
    agreeConsent: "मैं समझ गया/गई हूँ और सहमति देता/देती हूँ",
    cancelConsent: "रद्द करें",
    listenAudio: "🔊 ऑडियो विवरण सुनें",
    chiefQuestion: "आज आपको क्या मुख्य स्वास्थ्य समस्या है?",
    voiceBtn: "🎙 बोलकर उत्तर दें",
    touchBtn: "👆 टच करके उत्तर दें",
    replayAudio: "🔊 प्रश्न दोबारा सुनें",
    next: "आगे बढ़ें ➔",
    back: "← पीछे जाएँ",
    finish: "मामला डॉक्टर को भेजें",
    uploadDoc: "पुराने पर्चे या लैब रिपोर्ट स्कैन / अपलोड करें",
    ocrProcessing: "मेडिकल ओसीआर से दस्तावेज़ को पढ़ा जा रहा है...",
    ocrSuccess: "दस्तावेज़ पढ़ा गया! दवाइयाँ और जाँच रिपोर्ट सफलतापूर्वक निकाली गईं।",
    ayushToggle: "चिकित्सा पद्धति का चयन करें",
    ayushGeneral: "एलोपैथिक (सामान्य) चिकित्सा",
    ayushAyush: "आयुष (आयुर्वेद / सिद्ध / होम्योपैथी)",
    redFlagAlert: "🚨 गंभीर लक्षण पाए गए हैं! कृपया प्रतीक्षा करें, नर्स/स्टाफ तुरंत आपकी सहायता करेंगे।"
  },
  te: {
    welcome: "స్వాగతం. డాక్టర్‌తో సంప్రదింపులకు ముందు మీ కేసు వివరాలు సిద్ధం చేద్దాం.",
    subtitle: "వేగవంతమైన మరియు ఖచ్చితమైన సమాచారం కోసం కేస్-టేకింగ్ సిస్టమ్.",
    selectLang: "మీ భాషను ఎంచుకోండి",
    abhaTitle: "మీ వద్ద అభా (ABHA) హెల్త్ ఐడీ ఉందా?",
    abhaHelp: "అభా ఐడీ ద్వారా మీ పూర్వ వైద్య నివేదికలు సురక్షితంగా అనుసంధానించబడతాయి.",
    hasAbha: "నా వద్ద ABHA ID ఉంది",
    noAbha: "నా వద్ద ABHA ID లేదు",
    abhaNumberPlaceholder: "14 అంకెల అభా ఐడీ నమోదు చేయండి",
    mobilePlaceholder: "10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి",
    verifyOtp: "OTP కోడ్ నమోదు చేయండి",
    otpHelp: "మీ మొబైల్‌కు 6 అంకెల కోడ్ పంపబడింది.",
    tempIdNotice: "అభా ఐడీ లేదా? తాత్కాలిక సెషన్ ఐడీ ద్వారా కొనసాగవచ్చు.",
    noMergeRuleNotice: "🔒 భద్రతా గమనిక: గత రికార్డులు డాక్టర్ ధృవీకరణ లేకుండా నేరుగా కలపబడవు.",
    consentTitle: "పేషెంట్ సమాచార అంగీకారం",
    consentText: "డాక్టర్ కేస్ రిపోర్ట్ తయారీ కోసం నా ఆరోగ్య వివరాలు ఇవ్వడానికి అంగీకరిస్తున్నాను.",
    agreeConsent: "నేను అంగీకరిస్తున్నాను",
    cancelConsent: "రద్దు చేయి",
    listenAudio: "🔊 ఆడియో వివరణ వినండి",
    chiefQuestion: "ఈరోజు మీ ముఖ్యమైన ఆరోగ్య సమస్య ఏమిటి?",
    voiceBtn: "🎙 మైక్‌తో చెప్పండి",
    touchBtn: "👆 స్క్రీన్‌పై ఎంచుకోండి",
    replayAudio: "🔊 ప్రశ్న మళ్లీ వినండి",
    next: "తరువాత ➔",
    back: "← వెనుకకు",
    finish: "కేసును డాక్టర్‌కు పంపండి",
    uploadDoc: "పాత ప్రిస్క్రిప్షన్లు లేదా ల్యాబ్ రిపోర్టులు అప్‌లోడ్ చేయండి",
    ocrProcessing: "పత్రాలను OCR స్కానర్ చదువుతోంది...",
    ocrSuccess: "రిపోర్టు విజయవంతంగా స్కాన్ చేయబడింది!",
    ayushToggle: "వైద్య విభాగాన్ని ఎంచుకోండి",
    ayushGeneral: "అల్లోపతిక్ (జనరల్) వైద్యం",
    ayushAyush: "ఆయుష్ (ఆయుర్వేద / సిద్ధ / హోమియోపతి)",
    redFlagAlert: "🚨 అత్యవసర లక్షణాలు గుర్తించబడ్డాయి! సిబ్బంది వెంటనే మిమ్మల్ని పరిశీలిస్తారు."
  }
};
