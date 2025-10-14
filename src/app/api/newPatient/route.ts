/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { NewPatientRequest } from "@/types/patient";
import { patientStorage } from "@/lib/patient-storage";

// Hospital password validation function
// In a production environment, this would validate against a database
function validateHospitalPassword(password: string): boolean {
  // For now, we'll accept any non-empty password
  // In production, this should validate against a secure database
  return password.length >= 3;
}

// Validate the structure of questions
// function validateQuestions(questions: PatientQuestion[]): boolean {
//   if (!Array.isArray(questions) || questions.length === 0) {
//     return false;
//   }

//   return questions.every((question) => {
//     // Check required fields
//     if (
//       !question.id ||
//       !question.type ||
//       !question.question ||
//       !Array.isArray(question.options)
//     ) {
//       return false;
//     }

//     // Check question type
//     const validTypes = [
//       "yes_no",
//       "single_selection",
//       "multi_selection",
//       "slider",
//     ];
//     if (!validTypes.includes(question.type)) {
//       return false;
//     }

//     // Check options structure
//     if (question.options.length === 0) {
//       return false;
//     }

//     return question.options.every(
//       (option) =>
//         option.id &&
//         option.label &&
//         typeof option.id === "string" &&
//         typeof option.label === "string"
//     );
//   });
// }

// Validate the request body structure
// function validateRequestBody(body: any): body is NewPatientRequest {
//   return (
//     body &&
//     typeof body.hospitalPassword === "string" &&
//     body.user &&
//     typeof body.user.name === "string" &&
//     typeof body.user.dateOfBirth === "number" &&
//     typeof body.user.cpf === "string" &&
//     Array.isArray(body.questions) &&
//     typeof body.returnUrl === "string" &&
//     validateQuestions(body.questions)
//   );
// }

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // // Validate request structure
    // if (!validateRequestBody(body)) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Invalid request body. Please check the structure and required fields.",
    //       details:
    //         "Required fields: hospitalPassword (string), user (object with name, dateOfBirth, cpf), questions (array), returnUrl (string)",
    //     },
    //     { status: 400 }
    //   );
    // }

    const { hospitalPassword, user, questions, returnUrl } =
      body as NewPatientRequest;

    // Validate hospital password
    if (!validateHospitalPassword(hospitalPassword)) {
      return NextResponse.json(
        { error: "Invalid hospital password" },
        { status: 401 }
      );
    }

    // Validate return URL format
    try {
      new URL(returnUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid return URL format" },
        { status: 400 }
      );
    }

    // Check if patient data already exists for this hospital password
    const existingPatient = patientStorage.getPatient(hospitalPassword);
    if (existingPatient) {
      return NextResponse.json(
        { error: "Patient data already exists for this hospital password" },
        { status: 409 }
      );
    }

    // Store the patient data
    patientStorage.storePatient(hospitalPassword, {
      user,
      questions,
      returnUrl,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Patient data stored successfully",
        patientId: user.cpf,
        hospitalPassword: hospitalPassword,
        questionsCount: questions.length,
        returnUrl: returnUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing new patient request:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to create a new patient." },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to create a new patient." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to create a new patient." },
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
