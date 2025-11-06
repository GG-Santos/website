import { NextRequest, NextResponse } from "next/server";
import { uploadToBlob } from "@/lib/vercel-blob";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const rawFolder = (formData.get("folder") as string | null) ?? "blog";
    const folder = rawFolder
      .replace(/\\/g, "/")
      .replace(/\.\.+/g, "")
      .replace(/^\/+/, "")
      .trim() || "blog";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const nameParts = file.name.split(".");
    const extension = nameParts.length > 1 ? nameParts.pop() : file.type.split("/").pop();
    const unique = Math.random().toString(36).substring(2, 10);
    const filename = `${folder}/${timestamp}-${unique}${extension ? `.${extension}` : ""}`;

    // Upload to Vercel Blob
    const url = await uploadToBlob(file, filename);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
