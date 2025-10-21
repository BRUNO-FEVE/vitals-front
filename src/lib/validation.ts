import {
  NewPatientRequest,
  QuestionType,
  SubmitTriageRequest,
} from "@/types/patient";

// Validation functions for API requests

export function validateHospitalPassword(password: string): boolean {
  // Basic validation - in production, this should validate against a secure database
  return typeof password === "string" && password.length >= 3;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateQuestion(question: QuestionType): boolean {
  if (!question.id || !question.type || !question.question) {
    return false;
  }

  const validTypes = [
    "single_selection",
    "multi_selection",
    "yes_no",
    "slider",
  ];
  if (!validTypes.includes(question.type)) {
    return false;
  }

  // For questions with options, validate the options structure
  if (question.options) {
    return question.options.every(
      (option) =>
        option.value &&
        option.label &&
        typeof option.value === "string" &&
        typeof option.label === "string"
    );
  }

  return true;
}

export function validateQuestions(questions: QuestionType[]): boolean {
  if (!Array.isArray(questions) || questions.length === 0) {
    return false;
  }

  return questions.every(validateQuestion);
}

export function validateNewPatientRequest(
  body: unknown
): body is NewPatientRequest {
  if (!body || typeof body !== "object") return false;

  const obj = body as Record<string, unknown>;

  return (
    typeof obj.hospitalPassword === "string" &&
    obj.user !== null &&
    obj.user !== undefined &&
    typeof obj.user === "object" &&
    typeof (obj.user as Record<string, unknown>).name === "string" &&
    typeof (obj.user as Record<string, unknown>).dateOfBirth === "number" &&
    typeof (obj.user as Record<string, unknown>).cpf === "string" &&
    Array.isArray(obj.vitals) &&
    typeof obj.returnUrl === "string" &&
    Array.isArray(obj.questions) &&
    validateQuestions(obj.questions as QuestionType[]) &&
    validateHospitalPassword(obj.hospitalPassword) &&
    validateUrl(obj.returnUrl)
  );
}

export function validateSubmitTriageRequest(
  body: unknown
): body is SubmitTriageRequest {
  if (!body || typeof body !== "object") return false;

  const obj = body as Record<string, unknown>;

  return (
    typeof obj.hospitalPassword === "string" &&
    Array.isArray(obj.answers) &&
    validateHospitalPassword(obj.hospitalPassword) &&
    obj.answers.every(
      (answer: unknown) =>
        typeof answer === "object" &&
        answer !== null &&
        "questionId" in answer &&
        "answer" in answer
    )
  );
}
