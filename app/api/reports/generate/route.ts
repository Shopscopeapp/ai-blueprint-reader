import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blueprintId, format = "html" } = await request.json();

    if (!blueprintId) {
      return NextResponse.json(
        { error: "Blueprint ID is required" },
        { status: 400 }
      );
    }

    // Get blueprint
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", blueprintId)
      .eq("userId", user.id)
      .single();

    if (blueprintError || !blueprint) {
      return NextResponse.json(
        { error: "Blueprint not found" },
        { status: 404 }
      );
    }

    // Get conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("blueprintId", blueprintId)
      .eq("userId", user.id)
      .order("updatedAt", { ascending: false })
      .limit(1)
      .single();

    // Generate HTML report
    const analysisData = blueprint.analysisData || {};
    const messages = conversation
      ? JSON.parse(conversation.messages || "[]")
      : [];

    const htmlReport = generateHTMLReport(blueprint, analysisData, messages);

    if (format === "html") {
      return new NextResponse(htmlReport, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="blueprint-report-${blueprint.filename.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.html"`,
        },
      });
    }

    // For PDF, return HTML that can be printed to PDF
    return NextResponse.json({
      html: htmlReport,
      filename: `blueprint-report-${blueprint.filename.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.html`,
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

function generateHTMLReport(
  blueprint: any,
  analysisData: any,
  messages: any[]
): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blueprint Analysis Report - ${blueprint.filename}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', monospace;
            background: #0a0e27;
            color: #06b6d4;
            padding: 40px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #0a0e27;
            border: 2px solid #06b6d4;
            padding: 40px;
        }
        .header {
            border-bottom: 2px solid #06b6d4;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 32px;
            color: #06b6d4;
            margin-bottom: 10px;
        }
        .header .subtitle {
            color: #67e8f9;
            font-size: 14px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section-title {
            font-size: 24px;
            color: #06b6d4;
            border-bottom: 1px solid #06b6d4;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        .info-item {
            background: rgba(6, 182, 212, 0.1);
            border: 1px solid #06b6d4;
            padding: 15px;
        }
        .info-label {
            font-size: 12px;
            color: #67e8f9;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 16px;
            color: #06b6d4;
            font-weight: bold;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .data-table th,
        .data-table td {
            border: 1px solid #06b6d4;
            padding: 12px;
            text-align: left;
        }
        .data-table th {
            background: rgba(6, 182, 212, 0.2);
            color: #06b6d4;
            font-weight: bold;
        }
        .data-table td {
            color: #67e8f9;
        }
        .message {
            background: rgba(6, 182, 212, 0.1);
            border-left: 3px solid #06b6d4;
            padding: 15px;
            margin-bottom: 15px;
        }
        .message.user {
            border-left-color: #3b82f6;
        }
        .message.assistant {
            border-left-color: #06b6d4;
        }
        .message-role {
            font-size: 12px;
            color: #67e8f9;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .message-content {
            color: #06b6d4;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #06b6d4;
            text-align: center;
            color: #67e8f9;
            font-size: 12px;
        }
        @media print {
            body {
                background: white;
                color: black;
            }
            .container {
                border: none;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BLUEPRINT ANALYSIS REPORT</h1>
            <div class="subtitle">Generated on ${date}</div>
        </div>

        <div class="section">
            <h2 class="section-title">FILE INFORMATION</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">FILENAME</div>
                    <div class="info-value">${blueprint.filename}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">FILE TYPE</div>
                    <div class="info-value">${blueprint.fileType.toUpperCase()}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">UPLOADED</div>
                    <div class="info-value">${new Date(blueprint.uploadedAt).toLocaleDateString()}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">STATUS</div>
                    <div class="info-value">${blueprint.autoAnalyzed ? "ANALYZED" : "PENDING"}</div>
                </div>
            </div>
        </div>

        ${analysisData.summary ? `
        <div class="section">
            <h2 class="section-title">SUMMARY</h2>
            <p style="color: #67e8f9; font-size: 16px;">${analysisData.summary}</p>
        </div>
        ` : ""}

        ${analysisData.dimensions ? `
        <div class="section">
            <h2 class="section-title">DIMENSIONS</h2>
            <table class="data-table">
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
                ${analysisData.dimensions.totalArea ? `<tr><td>Total Area</td><td>${analysisData.dimensions.totalArea}</td></tr>` : ""}
                ${analysisData.dimensions.length ? `<tr><td>Length</td><td>${analysisData.dimensions.length}</td></tr>` : ""}
                ${analysisData.dimensions.width ? `<tr><td>Width</td><td>${analysisData.dimensions.width}</td></tr>` : ""}
                ${analysisData.dimensions.height ? `<tr><td>Height</td><td>${analysisData.dimensions.height}</td></tr>` : ""}
            </table>
        </div>
        ` : ""}

        ${analysisData.rooms && analysisData.rooms.length > 0 ? `
        <div class="section">
            <h2 class="section-title">ROOMS (${analysisData.rooms.length})</h2>
            <table class="data-table">
                <tr>
                    <th>Room Name</th>
                    <th>Area</th>
                    <th>Dimensions</th>
                </tr>
                ${analysisData.rooms.map((room: any) => `
                    <tr>
                        <td>${room.name || "N/A"}</td>
                        <td>${room.area || "N/A"}</td>
                        <td>${room.dimensions || "N/A"}</td>
                    </tr>
                `).join("")}
            </table>
        </div>
        ` : ""}

        ${analysisData.materials && analysisData.materials.length > 0 ? `
        <div class="section">
            <h2 class="section-title">MATERIALS (${analysisData.materials.length})</h2>
            <table class="data-table">
                <tr>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Specifications</th>
                </tr>
                ${analysisData.materials.map((material: any) => `
                    <tr>
                        <td>${material.type || "N/A"}</td>
                        <td>${material.quantity || "N/A"}</td>
                        <td>${material.specifications || "N/A"}</td>
                    </tr>
                `).join("")}
            </table>
        </div>
        ` : ""}

        ${analysisData.compliance ? `
        <div class="section">
            <h2 class="section-title">COMPLIANCE</h2>
            <div class="info-item">
                <div class="info-label">STATUS</div>
                <div class="info-value">${analysisData.compliance.status?.toUpperCase() || "UNKNOWN"}</div>
            </div>
            ${analysisData.compliance.issues && analysisData.compliance.issues.length > 0 ? `
                <h3 style="color: #06b6d4; margin-top: 15px; margin-bottom: 10px;">Issues:</h3>
                <ul style="color: #67e8f9; margin-left: 20px;">
                    ${analysisData.compliance.issues.map((issue: string) => `<li>${issue}</li>`).join("")}
                </ul>
            ` : ""}
        </div>
        ` : ""}

        ${analysisData.costEstimate ? `
        <div class="section">
            <h2 class="section-title">COST ESTIMATE</h2>
            <div class="info-grid">
                ${analysisData.costEstimate.range ? `
                <div class="info-item">
                    <div class="info-label">TOTAL RANGE</div>
                    <div class="info-value" style="font-size: 24px;">${analysisData.costEstimate.range}</div>
                </div>
                ` : ""}
                ${analysisData.costEstimate.breakdown ? `
                <div class="info-item">
                    <div class="info-label">BREAKDOWN</div>
                    <div style="color: #67e8f9;">
                        ${analysisData.costEstimate.breakdown.materials ? `<div>Materials: ${analysisData.costEstimate.breakdown.materials}</div>` : ""}
                        ${analysisData.costEstimate.breakdown.labor ? `<div>Labor: ${analysisData.costEstimate.breakdown.labor}</div>` : ""}
                        ${analysisData.costEstimate.breakdown.other ? `<div>Other: ${analysisData.costEstimate.breakdown.other}</div>` : ""}
                    </div>
                </div>
                ` : ""}
            </div>
        </div>
        ` : ""}

        ${messages.length > 0 ? `
        <div class="section">
            <h2 class="section-title">CONVERSATION HISTORY</h2>
            ${messages.map((msg: any) => {
                const content = typeof msg.content === "string" ? msg.content : msg.content[0]?.text || "";
                return `
                    <div class="message ${msg.role}">
                        <div class="message-role">${msg.role.toUpperCase()}</div>
                        <div class="message-content">${content.replace(/\n/g, "<br>")}</div>
                    </div>
                `;
            }).join("")}
        </div>
        ` : ""}

        <div class="footer">
            <p>Generated by BlueprintAI - Professional Blueprint Analysis Platform</p>
            <p>Report ID: ${blueprint.id}</p>
        </div>
    </div>
</body>
</html>`;
}

