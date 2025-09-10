import { GoogleGenAI, Chat, Part, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { RiskLevel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    const data = await base64EncodedDataPromise;
    return {
      inlineData: {
        data,
        mimeType: file.type,
      },
    };
};

export const analyzeHealthReport = async (imageParts: Part[]): Promise<AnalysisResult> => {
    const prompt = `
        You are an expert AI medical report analyzer. Your task is to perform a highly accurate analysis of the provided health report image(s). Follow a chain-of-thought process for maximum precision.

        **Chain-of-Thought Process:**
        1.  **Internal Text Transcription (Silent Step)**: First, silently and internally transcribe all text, numbers, and labels from the health report image(s). This transcription will be your source of truth. Do not output this transcription.
        2.  **Structured Data Extraction**: Using your internal transcription, meticulously extract the required information and populate the JSON object according to the schema.
        3.  **Analysis and Generation**: Based on the extracted and structured data, perform the analysis (risk assessment, summary, etc.) as requested.

        **Medical Reference Data (Use for Validation):**
        - **Hemoglobin (Hgb)**: M: 13.2-16.6 g/dL, W: 11.6-15.0 g/dL.
        - **White Blood Cells (WBC)**: 4,500 - 11,000 /mcL.
        - **Platelets**: 150,000 - 450,000 /mcL.
        - **Serum Creatinine**: M: 0.7-1.3 mg/dL, W: 0.6-1.1 mg/dL.
        - **eGFR**: > 90 mL/min/1.73m².
        - **ALT & AST**: ALT: ~7-40 U/L, AST: ~8-40 U/L.
        - **Bilirubin**: 0.1 - 1.2 mg/dL.
        - **Uric Acid**: M: 3.4-7.0 mg/dL, W: 2.4-6.0 mg/dL.
        - **Visual Acuity**: 6/6 or 20/20.
        - **Color Vision**: Normal (Ishihara test).
        - **Heart Rate (Resting)**: 60 - 100 bpm.
        - **Blood Pressure**: < 120/80 mmHg.

        **JSON Output Instructions:**
        1.  **patientInfo**: Extract patient's name, age, and gender. Use placeholders if missing.
        2.  **metrics**: Extract all relevant metrics from the reference list. For each, provide the name, value, unit, reference range, and a status ('Low Risk', 'Medium Risk', 'High Risk') determined by comparing the value against the reference range.
        3.  **overallRisk**: Determine the single overall risk level based on the severity and number of out-of-range metrics.
        4.  **summary**: Write a concise, easy-to-understand summary of the key findings.
        5.  **criticalFindings**: THIS IS VERY IMPORTANT. Create a list of the most significant 'High Risk' or 'Medium Risk' findings. Each string in the list should be a short, clear statement (e.g., "Hemoglobin is significantly low at 9.5 g/dL.", "Blood Pressure is elevated."). If there are no such findings, return an empty array [].
        6.  **recommendations**: Provide 3-4 actionable wellness recommendations. These recommendations MUST be directly linked to the 'criticalFindings'. For example, if a finding is low hemoglobin, a recommendation could be about iron-rich foods. Always include a recommendation to consult a doctor.
        7.  **timelineData**: Generate plausible historical data for the two most critical metrics identified. Create a 'points' array with exactly four data points spanning the last 18 months (e.g., 'Jan 23', 'Jul 23', 'Jan 24', 'Jul 24').

        Your entire response MUST be a single, valid JSON object that strictly conforms to the provided schema. Do not include any text, markdown formatting (like \`\`\`json), or explanations outside of the JSON object.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            patientInfo: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    age: { type: Type.INTEGER },
                    gender: { type: Type.STRING },
                },
                required: ["name", "age", "gender"],
            },
            overallRisk: {
                type: Type.STRING,
                enum: [RiskLevel.Low, RiskLevel.Medium, RiskLevel.High],
            },
            summary: {
                type: Type.STRING,
            },
            metrics: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        value: { type: Type.STRING },
                        unit: { type: Type.STRING },
                        status: { type: Type.STRING, enum: [RiskLevel.Low, RiskLevel.Medium, RiskLevel.High] },
                        referenceRange: { type: Type.STRING },
                    },
                    required: ["name", "value", "unit", "status", "referenceRange"],
                },
            },
            criticalFindings: {
              type: Type.ARRAY,
              description: "A list of short, clear statements about the most urgent or high-risk findings. Empty array if none.",
              items: { type: Type.STRING },
            },
            recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
            timelineData: {
                type: Type.OBJECT,
                properties: {
                    metric1_name: { type: Type.STRING },
                    metric2_name: { type: Type.STRING },
                    points: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                date: { type: Type.STRING },
                                metric1_value: { type: Type.NUMBER },
                                metric2_value: { type: Type.NUMBER },
                            },
                            required: ["date", "metric1_value", "metric2_value"],
                        }
                    }
                },
                required: ["metric1_name", "metric2_name", "points"],
            },
        },
        required: ["patientInfo", "overallRisk", "summary", "metrics", "criticalFindings", "recommendations", "timelineData"],
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [...imageParts, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResult;
};

export const startChatSession = (analysisResult: AnalysisResult): Chat => {
  const model = ai.chats;

  const context = `
    You are a friendly and helpful AI medical assistant.
    Your role is to explain health report results to a user in simple, clear, and reassuring language.
    Do not provide medical advice, diagnoses, or treatment plans. Always recommend consulting a healthcare professional for any medical concerns.
    Use the following health report data as context for your answers. Do not make up information beyond this context.

    CONTEXT:
    - Patient: ${analysisResult.patientInfo.name}, ${analysisResult.patientInfo.age}, ${analysisResult.patientInfo.gender}
    - Overall Risk: ${analysisResult.overallRisk}
    - AI Summary: ${analysisResult.summary}
    - Critical Findings to Note:
      ${analysisResult.criticalFindings.length > 0 ? analysisResult.criticalFindings.map(f => `  - ${f}`).join('\n') : '  - None'}
    - Key Metrics:
      ${analysisResult.metrics.map(m => `  - ${m.name}: ${m.value} ${m.unit} (Status: ${m.status}, Normal Range: ${m.referenceRange})`).join('\n')}
    - Recommendations from Report:
      ${analysisResult.recommendations.map(r => `  - ${r}`).join('\n')}
  `;

  return model.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: context,
    }
  });
};