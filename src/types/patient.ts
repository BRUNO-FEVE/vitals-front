// Types for the new patient endpoint and hospital integration

export interface PatientUser {
  name: string;
  dateOfBirth: number; // Unix timestamp
  cpf: string;
}

export interface QuestionOption {
  id: string;
  label: string;
}

export interface PatientQuestion {
  id: string;
  type: "yes_no" | "single_selection" | "multi_selection" | "slider";
  question: string;
  options: QuestionOption[];
}

export interface NewPatientRequest {
  hospitalPassword: string;
  user: PatientUser;
  questions: PatientQuestion[];
  returnUrl: string;
}

export interface StoredPatientData {
  hospitalPassword: string;
  user: PatientUser;
  questions: PatientQuestion[];
  returnUrl: string;
  createdAt: number; // Unix timestamp
}

export interface TriageResult {
  patientId: string; // CPF or hospital password
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>;
  completedAt: number; // Unix timestamp
}

// In-memory storage type
export type PatientStorage = Map<string, StoredPatientData>;
