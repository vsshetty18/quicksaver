import { NextRequest, NextResponse } from "next/server";
import { API_ROUTES } from "@/lib/api";

// ------------------------------------------------------------
// POST /api/upload
// Acts as a proxy between the frontend and the Flask ML backend.
// Forwards the uploaded video file to the Flask /upload endpoint.
//
// Why proxy instead of calling Flask directly from the browser?
// - Keeps the Flask backend URL server-side only (not exposed
//   directly in client network requests if you don't want it to be)
// - Makes it easy to add validation/logging later in one place
// ------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Read the incoming form data (the video file) from the request
    const formData = await request.formData();
    const file = formData.get("video");

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided." },
        { status: 400 }
      );
    }

    // Forward the form data to the Flask backend's /upload endpoint
    const flaskResponse = await fetch(API_ROUTES.upload, {
      method: "POST",
      body: formData,
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
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to upload video. Please try again." },
      { status: 500 }
    );
  }
}

