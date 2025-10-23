// app/api/patients/cleanup/route.ts (or pages/api/patients/cleanup.ts)
import { NextRequest } from "next/server";
import { collection } from "@/lib/mongodb";
import {
  createJsonResponse,
  createErrorResponse,
  handleCorsOptions,
} from "@/lib/cors";

export async function DELETE(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization
    const authHeader = request.headers.get("authorization");
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Delete all documents from the collection
    const result = await collection.deleteMany({});

    return createJsonResponse(
      {
        success: true,
        deletedCount: result.deletedCount,
        message: `Successfully deleted ${result.deletedCount} patient records`,
      },
      200
    );
  } catch (error) {
    console.error("Error cleaning up patient data:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// Handle unsupported methods
export async function GET() {
  return createErrorResponse(
    "Method not allowed. Use DELETE to cleanup data.",
    405
  );
}

export async function POST() {
  return createErrorResponse(
    "Method not allowed. Use DELETE to cleanup data.",
    405
  );
}

export async function PUT() {
  return createErrorResponse(
    "Method not allowed. Use DELETE to cleanup data.",
    405
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return handleCorsOptions();
}
