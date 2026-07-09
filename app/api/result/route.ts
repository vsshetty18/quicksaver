import { NextResponse } from "next/server";
import { API_ROUTES } from "@/lib/api";

// ------------------------------------------------------------
// GET /api/result
// Proxies the "get result" request to the Flask ML backend.
// Returns the final JSON containing:
// - Average Speed
// - Maximum Speed
// - Vehicle Count
// - Risk Percentage
// - Prediction
// ------------------------------------------------------------

export async function GET() {
  try {
    const flaskResponse = await fetch(API_ROUTES.result, {
      method: "GET",
      cache: "no-store", // always fetch fresh results, never cached
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
    console.error("Result API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch results. Please try again." },
      { status: 500 }
    );
  }
}
