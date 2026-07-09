"""
vehicle_detector.py
------------------------------------------------------------
Detects vehicles in video frames using classical Computer
Vision techniques only (no deep learning):

- Background Subtraction (MOG2)
- Contour Detection
- Bounding Box extraction

This module is intentionally kept simple and beginner-friendly,
as required for this BE AI & ML major project.
------------------------------------------------------------
"""

import cv2
import numpy as np


class VehicleDetector:
    """
    Wraps OpenCV's background subtractor and contour detection
    logic to find moving vehicles in each video frame.
    """

    def __init__(self, min_contour_area=800):
        # MOG2 background subtractor - separates moving objects (vehicles)
        # from the static background (road).
        self.background_subtractor = cv2.createBackgroundSubtractorMOG2(
            history=500,
            varThreshold=40,
            detectShadows=True
        )

        # Minimum contour area to filter out noise (small false detections)
        self.min_contour_area = min_contour_area

        # Kernel used for morphological operations (cleaning up the mask)
        self.kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

    def detect(self, frame):
        """
        Detects vehicles in a single video frame.

        Args:
            frame: A single BGR video frame (numpy array).

        Returns:
            bounding_boxes: List of (x, y, w, h) tuples for each detected vehicle.
            mask: The processed foreground mask (useful for debugging).
        """
        # Step 1: Apply background subtraction to get the foreground mask
        fg_mask = self.background_subtractor.apply(frame)

        # Step 2: Remove shadows (MOG2 marks shadows as gray value 127)
        _, thresh_mask = cv2.threshold(fg_mask, 200, 255, cv2.THRESH_BINARY)

        # Step 3: Clean up the mask using morphological operations
        # - Opening removes small noise
        # - Dilation fills in small gaps in detected vehicle shapes
        clean_mask = cv2.morphologyEx(thresh_mask, cv2.MORPH_OPEN, self.kernel)
        clean_mask = cv2.dilate(clean_mask, self.kernel, iterations=2)

        # Step 4: Find contours in the cleaned mask
        contours, _ = cv2.findContours(
            clean_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        # Step 5: Filter contours by area and extract bounding boxes
        bounding_boxes = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area >= self.min_contour_area:
                x, y, w, h = cv2.boundingRect(contour)
                bounding_boxes.append((x, y, w, h))

        return bounding_boxes, clean_mask

    @staticmethod
    def draw_boxes(frame, bounding_boxes, vehicle_ids=None):
        """
        Draws bounding boxes (and optional vehicle IDs) on the frame.

        Args:
            frame: The video frame to draw on.
            bounding_boxes: List of (x, y, w, h) tuples.
            vehicle_ids: Optional list of IDs matching bounding_boxes,
                         used to label each box (e.g. "ID 1").

        Returns:
            The frame with bounding boxes drawn on it.
        """
        for i, (x, y, w, h) in enumerate(bounding_boxes):
            # Draw green bounding box around each detected vehicle
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Label with vehicle ID if provided
            if vehicle_ids is not None and i < len(vehicle_ids):
                label = f"ID {vehicle_ids[i]}"
                cv2.putText(
                    frame, label, (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2
                )

        return frame
