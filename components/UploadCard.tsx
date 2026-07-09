"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadVideo, processVideo } from "@/lib/api";

// ------------------------------------------------------------
// UploadCard Component
// Handles video file selection, upload to Flask backend,
// triggers processing, then redirects to the Result page.
// ------------------------------------------------------------

const ALLOWED_TYPES = ["video/mp4", "video/avi", "video/quicktime", "video/x-msvideo"];

export default function UploadCard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handles file selection + basic validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType =
      ALLOWED_TYPES.includes(file.type) ||
      /\.(mp4|avi|mov)$/i.test(file.name);

    if (!isValidType) {
      setErrorMessage("Please upload a valid MP4, AVI, or MOV video file.");
      setStatus("error");
      return;
    }

    setSelectedFile(file);
    setStatus("idle");
    setErrorMessage("");
  };

  // Handles the full upload -> process -> redirect flow
  const handleUploadAndProcess = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a video file first.");
      setStatus("error");
      return;
    }

    try {
      // Step 1: Upload video to Flask backend
      setStatus("uploading");
      const uploadResponse = await uploadVideo(selectedFile);

      // Step 2: Trigger processing (vehicle detection, speed estimation, prediction)
      setStatus("processing");
      await processVideo(uploadResponse.filename);

      // Step 3: Redirect to Result page
      router.push("/result");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const isBusy = status === "uploading" || status === "processing";

  return (
    <div className="card card-hover max-w-xl w-full mx-auto text-center">
      <h2 className="text-xl font-semibold mb-2">Upload Traffic Video</h2>
      <p className="text-sm text-gray-500 mb-6">
        Supported formats: MP4, AVI, MOV
      </p>

      {/* File Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-brand-300 rounded-xl py-10 px-4 cursor-pointer hover:bg-brand-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.avi,.mov"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-brand-600 font-medium">
          {selectedFile ? selectedFile.name : "Click to select a video file"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {selectedFile
            ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
            : "or drag and drop (click to browse)"}
        </p>
      </div>

      {/* Error Message */}
      {status === "error" && (
        <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
      )}

      {/* Action Button */}
      <button
        onClick={handleUploadAndProcess}
        disabled={isBusy}
        className="mt-6 w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {status === "uploading" && "Uploading..."}
        {status === "processing" && "Processing video (this may take a moment)..."}
        {(status === "idle" || status === "error") && "Upload & Analyze"}
      </button>
    </div>
  );
}
