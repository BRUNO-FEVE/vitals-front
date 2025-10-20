import { NextRequest } from "next/server";
import { patientStorage } from "@/lib/patient-storage";
import { validateNewPatientRequest } from "@/lib/validation";
import {
  createJsonResponse,
  createErrorResponse,
  handleCorsOptions,
} from "@/lib/cors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request structure
    if (!validateNewPatientRequest(body)) {
      return createErrorResponse(
        "Invalid request body. Please check the structure and required fields.",
        400,
        "Required fields: hospitalPassword (string), user (object with name, dateOfBirth, cpf), vitals (array), questions (array), returnUrl (string)"
      );
    }

    const { hospitalPassword, user, vitals, questions, returnUrl } = body;

    // Check if patient data already exists for this hospital password
    const existingPatient = patientStorage.getPatient(hospitalPassword);
    if (existingPatient) {
      return createErrorResponse(
        "Patient data already exists for this hospital password",
        409
      );
    }

    // Store the patient data
    patientStorage.storePatient(hospitalPassword, {
      user,
      vitals,
      questions,
      returnUrl,
    });

    // Return success response
    return createJsonResponse(
      {
        patientId: user.cpf,
        hospitalPassword,
        questionsCount: questions.length,
        vitalsCount: vitals.length,
        returnUrl,
      },
      201,
      "Patient data stored successfully"
    );
  } catch (error) {
    console.error("Error processing new patient request:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return createErrorResponse("Invalid JSON in request body", 400);
    }

    // Handle other errors
    return createErrorResponse("Internal server error", 500);
  }
}

// Handle unsupported methods
export async function GET() {
  return createErrorResponse(
    "Method not allowed. Use POST to create a new patient.",
    405
  );
}

export async function PUT() {
  return createErrorResponse(
    "Method not allowed. Use POST to create a new patient.",
    405
  );
}

export async function DELETE() {
  return createErrorResponse(
    "Method not allowed. Use POST to create a new patient.",
    405
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return handleCorsOptions();
}
