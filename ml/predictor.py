"""
predictor.py
------------------------------------------------------------
Loads the trained Random Forest model (accident_model.pkl)
and provides a simple function to predict accident risk
based on traffic conditions extracted from the processed video.

Inputs:
    - Average Speed
    - Vehicle Count
    - Distance Between Vehicles
    - Weather (0 = Clear, 1 = Rain)

Outputs:
    - Risk Percentage (0-100)
    - Prediction Label (Safe / Medium Risk / High Risk)
------------------------------------------------------------
"""

import os
import joblib
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "accident_model.pkl")

# Load the trained model once when this module is imported.
# If the model file doesn't exist yet, raise a clear error
# telling the developer to run train_model.py first.
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    raise FileNotFoundError(
        "accident_model.pkl not found. Please run 'python train_model.py' "
        "inside the ml/ folder first to generate the trained model."
    )


def get_risk_label(risk_percentage):
    """
    Converts a numeric risk percentage into a human-readable label.

    Args:
        risk_percentage: float between 0 and 100.

    Returns:
        One of "Safe", "Medium Risk", "High Risk".
    """
    if risk_percentage < 40:
        return "Safe"
    elif risk_percentage < 70:
        return "Medium Risk"
    else:
        return "High Risk"


def predict_accident_risk(average_speed, vehicle_count, distance_between_vehicles, weather):
    """
    Predicts accident risk using the trained Random Forest model.

    Args:
        average_speed: Average speed of detected vehicles (km/h).
        vehicle_count: Number of vehicles detected in the video.
        distance_between_vehicles: Approximate average distance
                                    between vehicles (meters).
        weather: 0 for Clear, 1 for Rain.

    Returns:
        A dict containing:
            - risk_percentage: float (0-100)
            - prediction: str ("Safe" / "Medium Risk" / "High Risk")
    """
    # Prepare input as a 2D array (model expects a batch of samples)
    features = np.array([[
        average_speed,
        vehicle_count,
        distance_between_vehicles,
        weather
    ]])

    # predict_proba returns probability for [class_0 (safe), class_1 (accident)]
    probabilities = model.predict_proba(features)[0]
    risk_percentage = round(probabilities[1] * 100, 1)  # probability of "accident" class

    prediction_label = get_risk_label(risk_percentage)

    return {
        "risk_percentage": risk_percentage,
        "prediction": prediction_label
    }
