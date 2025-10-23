/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { collection } from "@/lib/mongodb";
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

    // Retrieve patient data from MongoDB
    const patientData = await collection.findOne({ hospitalPassword });

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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ hospitalPassword: string }> }
) {
  try {
    const { hospitalPassword } = await context.params;
    const body = await request.json();

    // Validate hospital password
    if (!hospitalPassword || !validateHospitalPassword(hospitalPassword)) {
      return createErrorResponse("Invalid hospital password", 400);
    }

    // Check if patient exists
    const existingPatient = await collection.findOne({ hospitalPassword });

    if (!existingPatient) {
      return createErrorResponse("Patient data not found", 404);
    }

    // Prepare update data - only allow certain fields to be updated
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Update only provided fields
    if (body.user) updateData.user = body.user;
    if (body.vitals) updateData.vitals = body.vitals;
    if (body.questions) updateData.questions = body.questions;
    if (body.returnUrl) updateData.returnUrl = body.returnUrl;

    // Update the patient data
    const result = await collection.updateOne(
      { hospitalPassword },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return createErrorResponse("Patient data not found", 404);
    }

    // Fetch updated patient data
    const updatedPatient = await collection.findOne({ hospitalPassword });

    return createJsonResponse(
      {
        success: true,
        patientId: updatedPatient?.user.cpf,
        hospitalPassword,
        questionsCount: updatedPatient?.questions.length,
        vitalsCount: updatedPatient?.vitals.length,
        returnUrl: updatedPatient?.returnUrl,
        updatedAt: updateData.updatedAt,
      },
      200,
      "Patient data updated successfully"
    );
  } catch (error) {
    console.error("Error updating patient data:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return createErrorResponse("Invalid JSON in request body", 400);
    }

    return createErrorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ hospitalPassword: string }> }
) {
  try {
    const { hospitalPassword } = await context.params;
    const body = await request.json();

    // Validate hospital password
    if (!hospitalPassword || !validateHospitalPassword(hospitalPassword)) {
      return createErrorResponse("Invalid hospital password", 400);
    }

    // Check if patient exists
    const existingPatient = await collection.findOne({ hospitalPassword });

    if (!existingPatient) {
      return createErrorResponse("Patient data not found", 404);
    }

    // Build dynamic update object for partial updates
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Handle nested field updates
    if (body.user) {
      Object.keys(body.user).forEach((key) => {
        updateData[`user.${key}`] = body.user[key];
      });
    }

    // Handle array operations for vitals
    if (body.vitals) {
      if (body.vitalsOperation === "push") {
        // Add new vital(s) to array
        await collection.updateOne(
          { hospitalPassword },
          {
            $push: {
              vitals: {
                $each: Array.isArray(body.vitals) ? body.vitals : [body.vitals],
              },
            } as any, // Type assertion to fix TypeScript error
            $set: { updatedAt: new Date() },
          }
        );
      } else if (body.vitalsOperation === "replace") {
        // Replace entire vitals array
        updateData.vitals = body.vitals;
      }
    }

    // Handle array operations for questions
    if (body.questions) {
      if (body.questionsOperation === "push") {
        // Add new question(s) to array
        await collection.updateOne(
          { hospitalPassword },
          {
            $push: {
              questions: {
                $each: Array.isArray(body.questions)
                  ? body.questions
                  : [body.questions],
              },
            } as any, // Type assertion to fix TypeScript error
            $set: { updatedAt: new Date() },
          }
        );
      } else if (body.questionsOperation === "replace") {
        // Replace entire questions array
        updateData.questions = body.questions;
      }
    }

    if (body.returnUrl) updateData.returnUrl = body.returnUrl;

    // Apply updates if not already done with $push operations
    if (Object.keys(updateData).length > 1) {
      await collection.updateOne({ hospitalPassword }, { $set: updateData });
    }

    // Fetch updated patient data
    const updatedPatient = await collection.findOne({ hospitalPassword });

    return createJsonResponse(
      {
        success: true,
        patientId: updatedPatient?.user.cpf,
        hospitalPassword,
        questionsCount: updatedPatient?.questions.length,
        vitalsCount: updatedPatient?.vitals.length,
        updatedAt: updateData.updatedAt,
      },
      200,
      "Patient data partially updated successfully"
    );
  } catch (error) {
    console.error("Error partially updating patient data:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return createErrorResponse("Invalid JSON in request body", 400);
    }

    return createErrorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ hospitalPassword: string }> }
) {
  try {
    const { hospitalPassword } = await context.params;

    // Validate hospital password
    if (!hospitalPassword || !validateHospitalPassword(hospitalPassword)) {
      return createErrorResponse("Invalid hospital password", 400);
    }

    // Delete the patient data
    const result = await collection.deleteOne({ hospitalPassword });

    if (result.deletedCount === 0) {
      return createErrorResponse("Patient data not found", 404);
    }

    return createJsonResponse(
      {
        success: true,
        hospitalPassword,
        message: "Patient data deleted successfully",
      },
      200
    );
  } catch (error) {
    console.error("Error deleting patient data:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function POST() {
  return createErrorResponse(
    "Method not allowed. Use PUT to update or PATCH for partial updates.",
    405
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return handleCorsOptions();
}
