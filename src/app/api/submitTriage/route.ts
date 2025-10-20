import { NextRequest } from "next/server";
import { patientStorage } from "@/lib/patient-storage";
import { TriageResult } from "@/types/patient";
import { validateSubmitTriageRequest } from "@/lib/validation";
import {
  createJsonResponse,
  createErrorResponse,
  handleCorsOptions,
} from "@/lib/cors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!validateSubmitTriageRequest(body)) {
      return createErrorResponse(
        "Invalid request body. hospitalPassword and answers are required.",
        400,
        "Required fields: hospitalPassword (string), answers (array of {questionId, answer})"
      );
    }

    const { hospitalPassword, answers } = body;

    // Retrieve patient data
    const patientData = patientStorage.getPatient(hospitalPassword);

    if (!patientData) {
      return createErrorResponse("Patient data not found or expired", 404);
    }

    // Create triage result
    const triageResult: TriageResult = {
      patientId: patientData.user.cpf,
      answers: answers,
      completedAt: Date.now(),
    };

    // Send results to hospital's callback URL
    const success = await patientStorage.sendTriageResults(
      patientData.returnUrl,
      triageResult
    );

    if (!success) {
      return createErrorResponse(
        "Failed to send triage results to hospital",
        500
      );
    }

    // Remove patient data from storage after successful submission
    patientStorage.removePatient(hospitalPassword);

    return createJsonResponse(
      {
        patientId: patientData.user.cpf,
        answersCount: answers.length,
        sentTo: patientData.returnUrl,
        completedAt: triageResult.completedAt,
      },
      200,
      "Triage results submitted successfully"
    );
  } catch (error) {
    console.error("Error submitting triage results:", error);

    if (error instanceof SyntaxError) {
      return createErrorResponse("Invalid JSON in request body", 400);
    }

    return createErrorResponse("Internal server error", 500);
  }
}

// Handle unsupported methods
export async function GET() {
  return createErrorResponse(
    "Method not allowed. Use POST to submit triage results.",
    405
  );
}

export async function PUT() {
  return createErrorResponse(
    "Method not allowed. Use POST to submit triage results.",
    405
  );
}

export async function DELETE() {
  return createErrorResponse(
    "Method not allowed. Use POST to submit triage results.",
    405
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return handleCorsOptions();
}
