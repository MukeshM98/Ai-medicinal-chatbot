export enum RiskLevel {
  Low = "Low Risk",
  Medium = "Medium Risk",
  High = "High Risk",
}

export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
}

export interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  status: RiskLevel;
  referenceRange: string;
}

export interface TimelineDataPoint {
  date: string;
  [key: string]: number | string; // Allows for dynamic metric keys
}

export interface TimelineData {
  metric1_name: string;
  metric2_name: string;
  points: {
    date: string;
    metric1_value: number;
    metric2_value: number;
  }[];
}

export interface AnalysisResult {
  patientInfo: PatientInfo;
  overallRisk: RiskLevel;
  summary: string;
  metrics: HealthMetric[];
  recommendations: string[];
  criticalFindings: string[];
  timelineData: TimelineData;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}