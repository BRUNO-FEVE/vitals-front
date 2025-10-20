// Types for the Triage Web Application API

export interface PatientUser {
  name: string;
  dateOfBirth: number; // Unix timestamp
  cpf: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  nested_questions?: QuestionType[];
}

export interface QuestionType {
  id: string;
  type: "single_selection" | "multi_selection" | "yes_no" | "slider";
  question: string;
  options?: QuestionOption[];
}

export interface NewPatientRequest {
  hospitalPassword: string;
  user: PatientUser;
  vitals: string[]; // e.g. ["temperature", "heartbeat/oxygen", "pressure", "weight"]
  questions: QuestionType[];
  returnUrl: string;
}

export interface StoredPatientData {
  hospitalPassword: string;
  user: PatientUser;
  vitals: string[];
  questions: QuestionType[];
  returnUrl: string;
  createdAt: number; // Unix timestamp
}

export interface TriageAnswer {
  questionId: string;
  answer: string | string[];
}

export interface TriageResult {
  patientId: string; // CPF
  answers: TriageAnswer[];
  completedAt: number; // Unix timestamp
}

export interface SubmitTriageRequest {
  hospitalPassword: string;
  answers: TriageAnswer[];
}

// API Response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// In-memory storage type
export type PatientStorage = Map<string, StoredPatientData>;
