import { NextResponse } from "next/server";

// CORS configuration for Vercel deployment with localhost support
export const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGIN || "https://your-vercel-domain.vercel.app" // Use environment variable or default
      : "*", // Allow all origins in development (including localhost)
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours
};

export function createCorsResponse(
  status: number = 200,
  body: BodyInit | null = null
) {
  return new NextResponse(body, {
    status,
    headers: corsHeaders,
  });
}

export function createJsonResponse<T>(
  data: T,
  status: number = 200,
  message?: string
) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      data,
      message,
    },
    {
      status,
      headers: corsHeaders,
    }
  );
}

export function createErrorResponse(
  error: string,
  status: number = 500,
  details?: string
) {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
    },
    {
      status,
      headers: corsHeaders,
    }
  );
}

export async function handleCorsOptions() {
  return createCorsResponse();
}
