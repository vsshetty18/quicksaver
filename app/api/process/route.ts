import { NextRequest, NextResponse } from "next/server";
import { API_ROUTES } from "@/lib/api";

// ------------------------------------------------------------
// POST /api/process
// Proxies the "process video" request to the Flask ML backend.
// Triggers vehicle detection, tracking, speed estimation,
// and accident risk prediction on the previously uploaded video.
//
// Expected JSON body: { "filename": "example.mp4" }
// ------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json(
        { error: "No filename provided. Upload a video first." },
        { status: 400 }
      );
    }

    // Forward the request to the Flask backend's /process endpoint
    const flaskResponse = await fetch(API_ROUTES.process, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      return NextResponse.json(
        { error: `Flask backend error: ${errorText}` },
        { status: flaskResponse.status }
      );
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Process API error:", error);
    return NextResponse.json(
      { error: "Failed to process video. Please try again." },
      { status: 500 }
    );
  }
}
