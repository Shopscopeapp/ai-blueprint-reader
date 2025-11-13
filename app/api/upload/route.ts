import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToSupabase } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/acad",
      "application/x-dwg",
      "image/vnd.dwg",
    ];

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "png", "jpg", "jpeg", "dwg", "dxf"];

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension || "")
    ) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PDF, PNG, JPG, DWG, DXF" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const { url } = await uploadToSupabase(file, user.id);

    // Generate a unique ID for the blueprint
    const blueprintId = crypto.randomUUID();

    // Save to database
    const { data: blueprint, error } = await supabase
      .from("blueprints")
      .insert({
        id: blueprintId,
        userId: user.id,
        filename: file.name,
        supabaseUrl: url,
        fileType: file.type || fileExtension || "unknown",
        analysisStatus: "pending",
        autoAnalyzed: false,
        analysisData: {},
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to save blueprint to database", details: error.message },
        { status: 500 }
      );
    }

    // Trigger auto-analysis in background (fire and forget)
    // Note: In production, consider using a queue system like Bull or similar
    if (typeof process.env.NEXT_PUBLIC_APP_URL !== 'undefined') {
      // Only trigger if we have the URL configured
      // This will be handled client-side after redirect
    }

    return NextResponse.json(
      { blueprint, message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
