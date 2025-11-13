import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { id, email, name } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: "ID and email are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Upsert user in our database
    const { error } = await supabase
      .from("users")
      .upsert(
        {
          id,
          email,
          name: name || null,
        },
        {
          onConflict: "id",
        }
      );

    if (error) {
      console.error("Sync user error:", error);
      return NextResponse.json(
        { error: "Failed to sync user", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sync user error:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}


