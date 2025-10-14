import { NextRequest, NextResponse } from "next/server";
import { patientStorage } from "@/lib/patient-storage";
import { TriageResult } from "@/types/patient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(body);

    const { hospitalPassword, answers } = body;

    // Validate request body
    if (!hospitalPassword || !Array.isArray(answers)) {
      return NextResponse.json(
        {
          error:
            "Invalid request body. hospitalPassword and answers are required.",
        },
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
      return NextResponse.json(
        { error: "Failed to send triage results to hospital" },
        { status: 500 }
      );
    }

    // Remove patient data from storage after successful submission
    patientStorage.removePatient(hospitalPassword);

    return NextResponse.json({
      message: "Triage results submitted successfully",
      patientId: patientData.user.cpf,
      answersCount: answers.length,
      sentTo: patientData.returnUrl,
    });
  } catch (error) {
    console.error("Error submitting triage results:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to submit triage results." },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to submit triage results." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to submit triage results." },
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
