// Clinical History Engine with Adaptive Questioning, Red-Flag Rules & AI Summary Generation
import { RED_FLAG_RULES } from '../../mockData/clinicalOntology';

export class ClinicalEngine {
  /**
   * Evaluates patient responses against clinical rules to detect urgent red-flag symptoms.
   */
  static evaluateRedFlags(chiefComplaintText, associatedSymptoms = [], severity = 0) {
    const textLower = (chiefComplaintText + " " + associatedSymptoms.join(" ")).toLowerCase();
    const detectedFlags = [];

    for (const rule of RED_FLAG_RULES) {
      const matchKeyword = rule.keywords.some(kw => textLower.includes(kw.toLowerCase()));
      const hasHighSeverity = severity >= rule.severityThreshold;

      if (matchKeyword && (hasHighSeverity || associatedSymptoms.length > 0)) {
        detectedFlags.push({
          ruleId: rule.id,
          reason: rule.reason,
          action: rule.action,
          severity: severity
        });
      }
    }

    return {
      hasRedFlag: detectedFlags.length > 0,
      flags: detectedFlags,
      suggestedPriority: detectedFlags.length > 0 ? "RED" : (severity >= 6 ? "YELLOW" : "GREEN")
    };
  }

  /**
   * Generates a structured AI Clinical Summary for doctor review
   */
  static generateSummary(patientData) {
    const cc = patientData.chiefComplaint || {};
    const hpi = patientData.hpi || {};
    const past = patientData.pastHistory || {};
    const drugs = patientData.drugHistory || [];
    const redFlags = patientData.redFlags || [];
    const docs = patientData.documents || [];

    const docExtracts = docs.map(d => {
      const diag = d.extractedData?.diagnoses?.join(", ") || "None";
      const abn = d.extractedData?.abnormalValues?.join("; ") || "None";
      return `• [${d.type} ${d.date}]: Diagnoses: ${diag} | Abnormal Findings: ${abn}`;
    }).join("\n");

    const drugList = drugs.map(m => `• ${m.name} ${m.dosage || ''} (${m.frequency || ''}) - ${m.duration || ''}`).join("\n") || "No current chronic medications reported.";

    const alertSection = redFlags.length > 0
      ? `🚨 RED-FLAG URGENT ALERTS:\n${redFlags.map(rf => `- ${rf}`).join("\n")}\n`
      : `STATUS: Standard Non-Urgent OPD Case (Green Triage)`;

    return `AI-GENERATED CLINICAL CASE SUMMARY
=========================================================
NOTICE: AI ASSISTED SUMMARY - DOCTOR VERIFICATION & SIGN-OFF REQUIRED

${alertSection}

1. CHIEF COMPLAINT:
- ${cc.complaint || "Not specified"} (Duration: ${cc.duration || "N/A"}, Severity: ${cc.severity || "N/A"})

2. HISTORY OF PRESENT ILLNESS (HPI):
- Onset & Course: ${hpi.onset || "N/A"}
- Location & Radiation: ${hpi.location || "N/A"} | ${hpi.character || ""}
- Aggravating Factors: ${hpi.aggravating || "None reported"}
- Relieving Factors: ${hpi.relieving || "None reported"}
- Associated Symptoms: ${hpi.associatedSymptoms?.join(", ") || "None"}

3. PAST MEDICAL & SURGICAL HISTORY:
- Chronic Illnesses: ${past.diseases?.join(", ") || "Nil"}
- Past Surgeries: ${past.surgeries?.join(", ") || "Nil"}

4. DRUG HISTORY & CURRENT MEDICATIONS:
${drugList}

5. ALLERGIES:
- ${patientData.allergies?.join(", ") || patientData.allergies || "No known allergies"}

6. PERSONAL & SOCIAL HISTORY:
- Diet: ${patientData.personalHistory?.diet || "Standard"} | Smoking: ${patientData.personalHistory?.smoking || "No"} | Alcohol: ${patientData.personalHistory?.alcohol || "No"}

7. DOCUMENT INTELLIGENCE EXTRACTS:
${docExtracts || "No previous documents uploaded."}
=========================================================`;
  }
}
