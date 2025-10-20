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
  body: any
): body is NewPatientRequest {
  return (
    body &&
    typeof body.hospitalPassword === "string" &&
    body.user &&
    typeof body.user.name === "string" &&
    typeof body.user.dateOfBirth === "number" &&
    typeof body.user.cpf === "string" &&
    Array.isArray(body.vitals) &&
    typeof body.returnUrl === "string" &&
    validateQuestions(body.questions) &&
    validateHospitalPassword(body.hospitalPassword) &&
    validateUrl(body.returnUrl)
  );
}

export function validateSubmitTriageRequest(
  body: any
): body is SubmitTriageRequest {
  return (
    body &&
    typeof body.hospitalPassword === "string" &&
    Array.isArray(body.answers) &&
    validateHospitalPassword(body.hospitalPassword) &&
    body.answers.every(
      (answer: any) => answer.questionId && answer.answer !== undefined
    )
  );
}


