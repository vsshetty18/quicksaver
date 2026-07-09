"""
app.py
------------------------------------------------------------
Main Flask backend for the AI Vehicle Speed Detection &
Accident Probability Prediction project.

Endpoints:
    POST /upload   - Upload a traffic video file
    POST /process  - Process the uploaded video (detect, track,
                      estimate speed, predict accident risk)
    GET  /result   - Return the latest processed result as JSON

Run locally:
    cd ml
    python app.py
------------------------------------------------------------
"""

import os
import json
import cv2
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from vehicle_detector import VehicleDetector
from speed_estimator import CentroidTracker, SpeedEstimator
from predictor import predict_accident_risk

# ------------------------------------------------------------
# App Setup
# ------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # Allows requests from the Next.js frontend (different domain on Vercel)

BASE_DIR = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "output")
RESULT_JSON_PATH = os.path.join(OUTPUT_FOLDER, "result.json")

ALLOWED_EXTENSIONS = {"mp4", "avi", "mov"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Checks if the uploaded file has an allowed video extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ------------------------------------------------------------
# Route: POST /upload
# ------------------------------------------------------------
@app.route("/upload", methods=["POST"])
def upload_video():
    """Accepts a video file upload and saves it to the uploads/ folder."""
    if "video" not in request.files:
        return jsonify({"error": "No video file found in request."}), 400

    file = request.files["video"]

    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Allowed: mp4, avi, mov."}), 400

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    return jsonify({
        "message": "Video uploaded successfully.",
        "filename": file.filename
    }), 200


# ------------------------------------------------------------
# Route: POST /process
# ------------------------------------------------------------
@app.route("/process", methods=["POST"])
def process_video():
    """
    Processes the uploaded video:
    1. Runs vehicle detection (OpenCV) frame by frame.
    2. Tracks vehicles using CentroidTracker.
    3. Estimates speed using SpeedEstimator (two virtual lines).
    4. Predicts accident risk using the trained ML model.
    5. Saves an annotated output video + result.json.
    """
    data = request.get_json()
    filename = data.get("filename") if data else None

    if not filename:
        return jsonify({"error": "No filename provided."}), 400

    video_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(video_path):
        return jsonify({"error": "Uploaded video not found. Please upload again."}), 404

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Define two virtual horizontal lines at 40% and 70% of the frame height
    line1_y = int(frame_height * 0.4)
    line2_y = int(frame_height * 0.7)

    detector = VehicleDetector(min_contour_area=800)
    tracker = CentroidTracker(max_disappeared=15, max_distance=60)
    speed_estimator = SpeedEstimator(
        line1_y=line1_y, line2_y=line2_y,
        real_distance_meters=15, fps=fps
    )

    # Prepare output video writer (annotated with bounding boxes + lines)
    output_filename = f"processed_{filename}"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    frame_count = 0
    max_vehicle_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # Step 1: Detect vehicles in this frame
        bounding_boxes, _ = detector.detect(frame)
        max_vehicle_count = max(max_vehicle_count, len(bounding_boxes))

        # Step 2: Update tracker with current detections
        tracked_objects = tracker.update(bounding_boxes)

        # Step 3: Update speed estimator with tracked positions
        speed_estimator.update(tracked_objects, frame_count)

        # Step 4: Draw bounding boxes, IDs, and virtual lines on the frame
        vehicle_ids = list(tracked_objects.keys())
        frame = VehicleDetector.draw_boxes(frame, bounding_boxes, vehicle_ids)
        cv2.line(frame, (0, line1_y), (frame_width, line1_y), (255, 0, 0), 2)
        cv2.line(frame, (0, line2_y), (frame_width, line2_y), (0, 0, 255), 2)

        out.write(frame)

    cap.release()
    out.release()

    # Step 5: Gather results
    vehicle_speeds_dict = speed_estimator.get_speeds()

    # Fallback: if no vehicle completed a full line-crossing (short/test clips),
    # avoid an empty result — use max detected vehicle count as vehicle_count.
    vehicle_speed_list = [
        {"id": vid, "speed": speed} for vid, speed in vehicle_speeds_dict.items()
    ]

    total_vehicles = max(max_vehicle_count, len(vehicle_speed_list))
    speeds_only = [v["speed"] for v in vehicle_speed_list]

    average_speed = round(sum(speeds_only) / len(speeds_only), 1) if speeds_only else 0
    max_speed = round(max(speeds_only), 1) if speeds_only else 0

    # Approximate average distance between vehicles (simple heuristic,
    # placeholder weather = 0 (Clear) unless changed by the user later)
    approx_distance = round(30 / total_vehicles, 1) if total_vehicles > 0 else 30
    weather = 0  # Default: Clear. Could be made configurable via request body.

    # Step 6: Predict accident risk using the trained ML model
    prediction_result = predict_accident_risk(
        average_speed=average_speed if average_speed > 0 else 30,
        vehicle_count=total_vehicles if total_vehicles > 0 else 1,
        distance_between_vehicles=approx_distance,
        weather=weather
    )

    # Step 7: Build and save the final result JSON
    result_data = {
        "processedVideoUrl": f"/output/{output_filename}",
        "totalVehicles": total_vehicles,
        "averageSpeed": average_speed,
        "maxSpeed": max_speed,
        "riskPercentage": prediction_result["risk_percentage"],
        "prediction": prediction_result["prediction"],
        "vehicleSpeeds": vehicle_speed_list
    }

    with open(RESULT_JSON_PATH, "w") as f:
        json.dump(result_data, f, indent=2)

    return jsonify(result_data), 200


# ------------------------------------------------------------
# Route: GET /result
# ------------------------------------------------------------
@app.route("/result", methods=["GET"])
def get_result():
    """Returns the most recently saved processing result."""
    if not os.path.exists(RESULT_JSON_PATH):
        return jsonify({"error": "No result available yet. Please process a video first."}), 404

    with open(RESULT_JSON_PATH, "r") as f:
        result_data = json.load(f)

    return jsonify(result_data), 200


# ------------------------------------------------------------
# Route: Serve processed output videos statically
