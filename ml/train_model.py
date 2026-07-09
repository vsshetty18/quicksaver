"""
train_model.py
------------------------------------------------------------
Trains a Random Forest Classifier to predict accident risk
based on: speed, vehicle_count, distance_between_vehicles, weather.

Run this script once to generate accident_model.pkl:
    python train_model.py

The trained model is saved using joblib and loaded later
by predictor.py during real-time predictions.
------------------------------------------------------------
"""

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# ------------------------------------------------------------
# Step 1: Load the dataset
# ------------------------------------------------------------
DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "accident_model.pkl")

print("Loading dataset...")
df = pd.read_csv(DATASET_PATH)
print(f"Dataset loaded with {len(df)} rows.")

# ------------------------------------------------------------
# Step 2: Split features (X) and target (y)
# ------------------------------------------------------------
FEATURE_COLUMNS = ["speed", "vehicle_count", "distance_between_vehicles", "weather"]
TARGET_COLUMN = "accident"

X = df[FEATURE_COLUMNS]
y = df[TARGET_COLUMN]

# ------------------------------------------------------------
# Step 3: Split into training and testing sets
# ------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ------------------------------------------------------------
# Step 4: Train the Random Forest Classifier
# ------------------------------------------------------------
print("Training Random Forest Classifier...")
model = RandomForestClassifier(
    n_estimators=100,     # number of decision trees
    max_depth=5,          # keeps the model simple and beginner-friendly
    random_state=42
)
model.fit(X_train, y_train)

# ------------------------------------------------------------
# Step 5: Evaluate the model
# ------------------------------------------------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model trained successfully. Test Accuracy: {accuracy * 100:.2f}%")

# ------------------------------------------------------------
# Step 6: Save the trained model to accident_model.pkl
# ------------------------------------------------------------
joblib.dump(model, MODEL_PATH)
print(f"Model saved to: {MODEL_PATH}")
