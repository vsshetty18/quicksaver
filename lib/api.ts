/**
 * lib/api.ts
 * ------------------------------------------------------------
 * Centralized API configuration file.
 *
 * All backend (Flask ML server) URLs are defined here so that
 * they can be changed in ONE place — for example when you deploy
 * the Flask backend to Render/Railway and get a live URL.
 *
 * Usage:
 *   import { API_BASE_URL, API_ROUTES } from "@/lib/api";
 * ------------------------------------------------------------
 */

// Base URL of the Flask ML backend.
// - During local development, Flask usually runs on port 5000.
// - After deploying (Render/Railway/etc.), replace this value
//   with your live backend URL, e.g. "https://your-app.onrender.com"
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5000";

// All Flask endpoints in one place.
// If you rename or add a route in app.py, update it here too.
export const API_ROUTES = {
  upload: `${API_BASE_URL}/upload`,
  process: `${API_BASE_URL}/process`,
  result: `${API_BASE_URL}/result`,
};

/**
 * Generic helper to upload a video file to the Flask backend.
 * Returns the JSON response (e.g. { message, filename }).
 */
export async function uploadVideo(file: File) {
  const formData = new FormData();
  formData.append("video", file);

  const response = await fetch(API_ROUTES.upload, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Video upload failed. Please try again.");
  }

  return response.json();
}

/**
 * Triggers processing of the uploaded video on the Flask backend.
 * This runs vehicle detection, tracking, speed estimation,
 * and accident risk prediction.
 */
export async function processVideo(filename: string) {
  const response = await fetch(API_ROUTES.process, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });

  if (!response.ok) {
    throw new Error("Video processing failed. Please try again.");
  }

  return response.json();
}

/**
 * Fetches the final result JSON from the Flask backend
 * (average speed, max speed, vehicle count, risk %, prediction).
 */
export async function getResult() {
  const response = await fetch(API_ROUTES.result, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch results.");
  }

  return response.json();
}
