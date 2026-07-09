"use client";

import { useEffect, useState } from "react";
import { getResult } from "@/lib/api";
import DashboardCards from "@/components/DashboardCards";
import Charts from "@/components/Charts";

// ------------------------------------------------------------
// Result Page
// Fetches processed video results from Flask backend and
// displays: processed video, stats, prediction, and charts.
// ------------------------------------------------------------

interface ResultData {
  processedVideoUrl: string;
  totalVehicles: number;
  averageSpeed: number;
  maxSpeed: number;
  riskPercentage: number;
  prediction: "Safe" | "Medium Risk" | "High Risk";
  vehicleSpeeds: { id: number; speed: number }[];
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResult() {
      try {
        const data = await getResult();
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to load results.");
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, []);

  // Maps prediction text to badge color classes
  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case "Safe":
        return "badge-safe";
      case "Medium Risk":
        return "badge-medium";
      case "High Risk":
        return "badge-risk";
      default:
        return "badge-safe";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-gray-500">
        Loading results...
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-red-500 mb-2">
          {error || "No result data available."}
        </p>
        <p className="text-sm text-gray-500">
          Please upload a video from the Home page first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <h1 className="text-2xl font-bold mb-6">Analysis Result</h1>

      {/* Processed Video + Prediction Badge */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-lg font-semibold">Processed Video</h2>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getPredictionBadge(
              result.prediction
            )}`}
          >
            {result.prediction} — Risk: {result.riskPercentage}%
          </span>
        </div>
        <video
          src={result.processedVideoUrl}
          controls
          className="w-full rounded-xl bg-black"
        />
      </div>

      {/* Statistic Cards */}
      <div className="mb-8">
        <DashboardCards
          vehicleCount={result.totalVehicles}
          averageSpeed={result.averageSpeed}
          maxSpeed={result.maxSpeed}
          riskPercentage={result.riskPercentage}
        />
      </div>

      {/* Charts */}
      <Charts
        vehicleSpeeds={result.vehicleSpeeds}
        riskPercentage={result.riskPercentage}
      />
    </div>
  );
}
