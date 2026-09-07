// Document Intelligence & Medical OCR Pipeline Abstraction Service
// Extracts Diagnoses, Medicines, Investigations, Procedures, and highlights abnormal values

export class OCRService {
  /**
   * Simulates/Processes medical document image or PDF, running image enhancement,
   * OCR text parsing, and medical entity extraction.
   */
  static async processDocument(file, docType = 'Prescription') {
    return new Promise((resolve) => {
      // Simulate realistic network & OCR processing time
      setTimeout(() => {
        const fileBasename = file ? file.name : "scanned_prescription.jpg";
        
        let extractedData = {
          diagnoses: ["Essential Hypertension", "Mild Dyspepsia"],
          medicines: [
            { name: "Telmisartan 40mg", dosage: "1-0-0", duration: "30 Days", instruction: "Morning after food" },
            { name: "Pantoprazole 40mg", dosage: "1-0-0", duration: "14 Days", instruction: "Before breakfast" },
            { name: "Multivitamin Cap", dosage: "0-0-1", duration: "30 Days", instruction: "At bedtime" }
          ],
          investigations: [
            { test: "Serum Creatinine", value: "1.1 mg/dL", range: "0.7 - 1.3 mg/dL", isAbnormal: false },
            { test: "Fasting Blood Sugar", value: "138 mg/dL", range: "70 - 99 mg/dL", isAbnormal: true },
            { test: "HbA1c", value: "7.2 %", range: "4.0 - 5.6 %", isAbnormal: true }
          ],
          procedures: [],
          abnormalValues: [
            "Fasting Blood Sugar: 138 mg/dL (Elevated)",
            "HbA1c: 7.2 % (Indicates Uncontrolled Diabetes)"
          ]
        };

        if (docType === 'Lab Report') {
          extractedData = {
            diagnoses: ["Type 2 Diabetes Mellitus", "Dyslipidemia"],
            medicines: [],
            investigations: [
              { test: "HbA1c", value: "8.1 %", range: "4.0 - 5.6 %", isAbnormal: true },
              { test: "Total Cholesterol", value: "245 mg/dL", range: "< 200 mg/dL", isAbnormal: true },
              { test: "LDL Cholesterol", value: "158 mg/dL", range: "< 100 mg/dL", isAbnormal: true },
              { test: "Hemoglobin", value: "13.8 g/dL", range: "13.0 - 17.0 g/dL", isAbnormal: false }
            ],
            procedures: [],
            abnormalValues: [
              "HbA1c: 8.1 % (High risk)",
              "Total Cholesterol: 245 mg/dL (High)",
              "LDL Cholesterol: 158 mg/dL (High)"
            ]
          };
        } else if (docType === 'Discharge Summary') {
          extractedData = {
            diagnoses: ["Acute Gastritis", "Dehydration"],
            medicines: [
              { name: "Sucralfate Syrup 10ml", dosage: "1-1-1", duration: "10 Days", instruction: "1 hr before meals" },
              { name: "Osetron 4mg", dosage: "1-0-1", duration: "5 Days", instruction: "S.O.S for nausea" }
            ],
            investigations: [
              { test: "Ultrasound Abdomen", value: "Mild Antral Gastritis, normal gallbladder", range: "Normal", isAbnormal: false }
            ],
            procedures: [
              { name: "IV Fluid Resuscitation", date: "2025-10-14" },
              { name: "Diagnostic Endoscopy", date: "2025-10-15" }
            ],
            abnormalValues: []
          };
        }

        resolve({
          id: `DOC-${Date.now()}`,
          title: `${docType} - ${fileBasename}`,
          date: new Date().toISOString().split('T')[0],
          type: docType,
          url: file ? URL.createObjectURL(file) : "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
          extractedData,
          confidenceScore: 0.94,
          verifiedByHuman: false
        });
      }, 1500);
    });
  }
}
