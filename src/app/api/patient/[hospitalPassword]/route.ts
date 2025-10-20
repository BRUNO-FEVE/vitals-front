import { NextRequest } from "next/server";
import { patientStorage } from "@/lib/patient-storage";
import { validateHospitalPassword } from "@/lib/validation";
import {
  createJsonResponse,
  createErrorResponse,
  handleCorsOptions,
} from "@/lib/cors";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ hospitalPassword: string }> }
) {
  try {
    const { hospitalPassword } = await context.params;

    // Validate hospital password
    if (!hospitalPassword || !validateHospitalPassword(hospitalPassword)) {
      return createErrorResponse("Invalid hospital password", 400);
    }

    // Retrieve patient data
    const patientData = patientStorage.getPatient(hospitalPassword);

    if (!patientData) {
      return createErrorResponse("Patient data not found or expired", 404);
    }

    // Return patient data (excluding sensitive information)
    return createJsonResponse({
      queueNumber: hospitalPassword,
      user: patientData.user,
      vitals: patientData.vitals,
      questions: patientData.questions,
      returnUrl: patientData.returnUrl,
      createdAt: patientData.createdAt,
    });
  } catch (error) {
    console.error("Error retrieving patient data:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// Handle unsupported methods
export async function POST() {
  return createErrorResponse(
    "Method not allowed. Use GET to retrieve patient data.",
    405
  );
}

export async function PUT() {
  return createErrorResponse(
    "Method not allowed. Use GET to retrieve patient data.",
    405
  );
}

export async function DELETE() {
  return createErrorResponse(
    "Method not allowed. Use GET to retrieve patient data.",
    405
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return handleCorsOptions();
}
