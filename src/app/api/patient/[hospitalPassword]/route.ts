import { NextRequest, NextResponse } from "next/server";
import { patientStorage } from "@/lib/patient-storage";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ hospitalPassword: string }> }
) {
  try {
    const { hospitalPassword } = await context.params;

    if (!hospitalPassword) {
      return NextResponse.json(
        { error: "Hospital password is required" },
        { status: 400 }
      );
    }

    // Retrieve patient data
    const patientData = patientStorage.getPatient(hospitalPassword);

    if (!patientData) {
      return NextResponse.json(
        { error: "Patient data not found or expired" },
        { status: 404 }
      );
    }

    // Return patient data (excluding sensitive information)
    return NextResponse.json({
      queueNumber: hospitalPassword,
      user: patientData.user,
      questions: patientData.questions,
      returnUrl: patientData.returnUrl,
      createdAt: patientData.createdAt,
    });
  } catch (error) {
    console.error("Error retrieving patient data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed. Use GET to retrieve patient data." },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed. Use GET to retrieve patient data." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed. Use GET to retrieve patient data." },
    { status: 405 }
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
