import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeBlueprintWithGPT4 } from "@/lib/ai/openai";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await request.json();

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Get all user's blueprints with analysis data
    const { data: blueprints, error } = await supabase
      .from("blueprints")
      .select("id, filename, analysisData, supabaseUrl")
      .eq("userId", user.id)
      .eq("autoAnalyzed", true);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch blueprints" },
        { status: 500 }
      );
    }

    if (!blueprints || blueprints.length === 0) {
      return NextResponse.json({ results: [] });
    }

        // Use GPT-4 Vision to semantically search through blueprints
    const searchPrompt = `You are a blueprint search assistant. Given a search query and a list of blueprints with their analysis data, return a JSON array of relevant blueprint IDs ranked by relevance.

Search Query: "${query}"

Blueprints:
${blueprints.map((bp: any) => 
  `ID: ${bp.id}, Filename: ${bp.filename}, Analysis: ${JSON.stringify(bp.analysisData || {})}`
).join('\n\n')}

Return JSON in this format:
{
  "results": [
    {"blueprintId": "id1", "relevance": 0.95, "reason": "Why it's relevant"},
    {"blueprintId": "id2", "relevance": 0.80, "reason": "Why it's relevant"}
  ]
}`;

    const systemPrompt = "You are a search assistant specialized in architectural blueprints. Analyze search queries and match them to relevant blueprints based on their analysis data. Return only valid JSON.";

        const searchText = await analyzeBlueprintWithGPT4(
          blueprints[0]?.supabaseUrl || "", // Use first blueprint image as context (or empty if none)
          searchPrompt,
          systemPrompt
        );

    // Parse JSON from Claude's response
    let searchResults;
    try {
      const jsonMatch = searchText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       searchText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch?.[1] || jsonMatch?.[0] || searchText;
      searchResults = JSON.parse(jsonString);
    } catch (e) {
      // Fallback: try parsing the whole response
      try {
        searchResults = JSON.parse(searchText);
      } catch (e2) {
        searchResults = { results: [] };
      }
    }

    // Map results back to full blueprint data
    const results = (searchResults?.results || [])
      .map((result: any) => {
        const blueprint = blueprints?.find((bp: any) => bp.id === result.blueprintId);
        if (!blueprint) return null;
        return {
          ...blueprint,
          relevance: result.relevance,
          reason: result.reason,
        };
      })
      .filter((r: any) => r !== null);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}

