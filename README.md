# 🚗 AI Vehicle Speed Detection & Accident Probability Prediction

A **BE AI & ML Major Project** that analyzes traffic video footage to detect
vehicles, estimate their speed, and predict accident risk using classical
Computer Vision (OpenCV) and a Machine Learning model (Random Forest).

---

## 📋 Project Overview

This system allows a user to upload traffic video footage. The backend then:

1. Detects vehicles using OpenCV (background subtraction + contour detection)
2. Tracks vehicles across frames using a centroid-based tracker
3. Estimates each vehicle's speed using two virtual reference lines
4. Predicts accident risk (Safe / Medium Risk / High Risk) using a trained
   Random Forest Classifier
5. Displays results on an interactive dashboard with charts

No deep learning, no authentication, no database — kept simple and
beginner-friendly, ideal for a final-year major project demonstration.

---

## ✨ Features

- 🎥 Upload MP4 / AVI / MOV traffic videos
- 🚙 Vehicle detection & tracking (OpenCV only — no YOLO/DeepSORT)
- ⚡ Speed estimation via virtual line-crossing (Distance / Time)
- ⚠️ Accident risk prediction with Risk % and Safe/Medium/High labels
- 📊 Dashboard with statistic cards, bar chart (speeds), and pie chart (risk)
- 📱 Fully responsive, modern UI with Tailwind CSS
- 🔌 Clean REST API separation between frontend and ML backend

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Chart.js (via react-chartjs-2)

**Backend**
- Next.js API Routes (proxy layer)
- Flask (Python) — ML backend

**Machine Learning / Computer Vision**
- OpenCV (vehicle detection & tracking)
- Scikit-learn (Random Forest Classifier)
- NumPy, Pandas, Joblib

---

## 📁 Folder Structure
