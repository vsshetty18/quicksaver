"""
speed_estimator.py
------------------------------------------------------------
Contains two components:

1. CentroidTracker - A simple centroid-based object tracker
   that assigns consistent IDs to vehicles across frames.

2. SpeedEstimator - Estimates vehicle speed using two virtual
   horizontal reference lines and Speed = Distance / Time.

Both are kept simple and beginner-friendly (no deep learning
trackers like DeepSORT/ByteTrack, as required).
------------------------------------------------------------
"""

import math
import time


class CentroidTracker:
    """
    Tracks objects (vehicles) across frames by matching the
    centroid of each new detection to the closest existing
    tracked object.
    """

    def __init__(self, max_disappeared=15, max_distance=60):
        self.next_object_id = 1
        self.objects = {}          # object_id -> centroid (x, y)
        self.disappeared = {}      # object_id -> frames disappeared count
        self.max_disappeared = max_disappeared
        self.max_distance = max_distance

    def register(self, centroid):
        """Registers a new object with the next available ID."""
        object_id = self.next_object_id
        self.objects[object_id] = centroid
        self.disappeared[object_id] = 0
        self.next_object_id += 1
        return object_id

    def deregister(self, object_id):
        """Removes an object that has disappeared for too long."""
        del self.objects[object_id]
        del self.disappeared[object_id]

    def update(self, bounding_boxes):
        """
        Updates tracked objects given the current frame's bounding boxes.

        Args:
            bounding_boxes: List of (x, y, w, h) tuples from VehicleDetector.

        Returns:
            Dict mapping object_id -> centroid (x, y) for currently tracked objects.
        """
        # Compute centroids for current detections
        input_centroids = []
        for (x, y, w, h) in bounding_boxes:
            cx = int(x + w / 2)
            cy = int(y + h / 2)
            input_centroids.append((cx, cy))

        # If no existing objects, register all detections as new
        if len(self.objects) == 0:
            for centroid in input_centroids:
                self.register(centroid)
        else:
            object_ids = list(self.objects.keys())
            object_centroids = list(self.objects.values())

            # If no detections this frame, mark all existing objects as disappeared
            if len(input_centroids) == 0:
                for object_id in object_ids:
                    self.disappeared[object_id] += 1
                    if self.disappeared[object_id] > self.max_disappeared:
                        self.deregister(object_id)
            else:
                # Match each existing object to the closest new centroid
                used_input_indices = set()
                for object_id, object_centroid in zip(object_ids, object_centroids):
                    best_distance = float("inf")
                    best_index = -1

                    for i, input_centroid in enumerate(input_centroids):
                        if i in used_input_indices:
                            continue
                        distance = math.hypot(
                            object_centroid[0] - input_centroid[0],
                            object_centroid[1] - input_centroid[1]
                        )
                        if distance < best_distance:
                            best_distance = distance
                            best_index = i

                    # Only match if within max_distance threshold
                    if best_index != -1 and best_distance <= self.max_distance:
                        self.objects[object_id] = input_centroids[best_index]
                        self.disappeared[object_id] = 0
                        used_input_indices.add(best_index)
                    else:
                        self.disappeared[object_id] += 1
                        if self.disappeared[object_id] > self.max_disappeared:
                            self.deregister(object_id)

                # Register any unmatched detections as new objects
                for i, input_centroid in enumerate(input_centroids):
                    if i not in used_input_indices:
                        self.register(input_centroid)

        return self.objects


class SpeedEstimator:
    """
    Estimates vehicle speed using two virtual horizontal lines.

    Speed = Distance / Time

    When a vehicle's centroid crosses Line 1, we start a timer.
    When it crosses Line 2, we stop the timer and calculate speed
    based on the known real-world distance between the two lines.
    """

    def __init__(self, line1_y, line2_y, real_distance_meters=15, fps=30):
        """
        Args:
            line1_y: Y-coordinate (pixels) of the first virtual line.
            line2_y: Y-coordinate (pixels) of the second virtual line.
            real_distance_meters: Approximate real-world distance (in meters)
                                   between line1 and line2 on the actual road.
                                   Adjustable based on camera calibration.
            fps: Frames per second of the video (used for time calculation).
        """
        self.line1_y = line1_y
        self.line2_y = line2_y
        self.real_distance_meters = real_distance_meters
        self.fps = fps

        # object_id -> timestamp when it crossed line1
        self.crossing_times = {}

        # object_id -> calculated speed (km/h), once available
        self.vehicle_speeds = {}

    def update(self, tracked_objects, frame_count):
        """
        Checks tracked object positions against the two virtual lines
        and calculates speed when a vehicle crosses both.

        Args:
            tracked_objects: Dict of object_id -> centroid (x, y) from CentroidTracker.
            frame_count: Current frame number (used with fps for time calculation).
        """
        current_time = frame_count / self.fps

        for object_id, (cx, cy) in tracked_objects.items():
            # Vehicle crosses Line 1 (start timer)
            if abs(cy - self.line1_y) <= 5 and object_id not in self.crossing_times:
                self.crossing_times[object_id] = current_time

            # Vehicle crosses Line 2 (stop timer, calculate speed)
            elif abs(cy - self.line2_y) <= 5 and object_id in self.crossing_times:
                start_time = self.crossing_times[object_id]
                elapsed_time = current_time - start_time

                if elapsed_time > 0 and object_id not in self.vehicle_speeds:
                    # Speed = Distance / Time -> convert m/s to km/h
                    speed_mps = self.real_distance_meters / elapsed_time
                    speed_kmph = round(speed_mps * 3.6, 1)
                    self.vehicle_speeds[object_id] = speed_kmph

    def get_speeds(self):
        """Returns a dict of object_id -> speed (km/h) for vehicles with calculated speed."""
        return self.vehicle_speeds
