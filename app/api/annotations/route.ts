import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blueprintId = searchParams.get("blueprintId");

    if (!blueprintId) {
      return NextResponse.json(
        { error: "Blueprint ID is required" },
        { status: 400 }
      );
    }

    const { data: annotations, error } = await supabase
      .from("annotations")
      .select("*")
      .eq("blueprintId", blueprintId)
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch annotations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ annotations });
  } catch (error) {
    console.error("Annotations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch annotations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blueprintId, type, x, y, content, color } = await request.json();

    if (!blueprintId || !type || x === undefined || y === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const annotationId = crypto.randomUUID();

    const { data: annotation, error } = await supabase
      .from("annotations")
      .insert({
        id: annotationId,
        blueprintId,
        userId: user.id,
        type,
        x,
        y,
        content: content || null,
        color: color || "#3b82f6",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create annotation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ annotation });
  } catch (error) {
    console.error("Create annotation error:", error);
    return NextResponse.json(
      { error: "Failed to create annotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const annotationId = searchParams.get("id");

    if (!annotationId) {
      return NextResponse.json(
        { error: "Annotation ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("annotations")
      .delete()
      .eq("id", annotationId)
      .eq("userId", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete annotation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete annotation error:", error);
    return NextResponse.json(
      { error: "Failed to delete annotation" },
      { status: 500 }
    );
  }
}

