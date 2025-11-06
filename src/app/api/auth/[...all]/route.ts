import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

// Wrap handlers with error logging
async function handleRequest(
  method: "GET" | "POST",
  request: NextRequest
): Promise<NextResponse> {
  try {
    if (method === "GET") {
      return await handler.GET(request);
    } else {
      return await handler.POST(request);
    }
  } catch (error) {
    // Log error details for debugging
    console.error(`❌ Better Auth ${method} error:`, {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      pathname: request.nextUrl.pathname,
    });

    // Check if it's a database connection error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("DATABASE_URL") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("Prisma") ||
      errorMessage.includes("P1001") || // Prisma connection error code
      errorMessage.includes("P1017") // Prisma server closed connection
    ) {
      console.error("Database connection error detected:", {
        DATABASE_URL_set: !!process.env.DATABASE_URL,
        DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
        error: errorMessage,
      });
    }

    // Return a proper error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? errorMessage
            : "An error occurred processing your request",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest("GET", request);
}

export async function POST(request: NextRequest) {
  return handleRequest("POST", request);
}

