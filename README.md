# ⚡ Smart Energy ML IoT

A comprehensive IoT platform that leverages Machine Learning to optimize energy consumption and detect wastage in real-time. The system collects sensor data (via ESP32 or Software Simulation), processes it through a Node.js backend, and uses a Flask-based ML API to predict room occupancy and automate device controls.

![Smart Energy Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-14354C?style=flat&logo=python&logoColor=white)

## ✨ Key Features

- **Real-Time Monitoring**: View live sensor data (Temperature, Motion, Voltage, Current) on a high-performance dashboard.
- **Machine Learning Automation**:
  - **Occupancy Detection**: Uses a Decision Tree model to predict room occupancy.
  - **Energy Wastage Detection**: Employs a Random Forest model to auto-shutdown devices when wastage is detected.
- **AI Gesture Control**: Control your lights and fans using webcam hand gestures (MediaPipe + OpenCV).
- **Realistic Hardware Simulation**: Test the entire ecosystem without physical hardware using a smooth-drift data generator.
- **Interactive Dashboard**: A responsive, dark-mode-ready React interface with real-time sync.

## 🏗️ System Architecture

The project is split into decoupled microservices:

1. **`dashboard/` (Frontend)**: React + Vite web dashboard.
2. **`backend/` (Backend)**: Node.js + Express API storing history in MongoDB.
3. **`ml-api/` (ML Prediction Service)**: Flask API serving `.pkl` ML models.
4. **`ml-model/` (Algorithms)**: Python scripts for model training (`scikit-learn`).
5. **`gesture-control/` (Vision AI)**: Computer Vision script for webcam-based control.
6. **`esp32_iot_node/` (Hardware)**: C++ application for ESP32 microcontroller telemetry.

## 🚀 Quick Start Guide

### 1. Run the Backend & Databases
```bash
# Start MongoDB locally or via Docker
cd backend
npm install
npm run dev
```

### 2. Run the ML Prediction API
```bash
cd ml-api
pip install -r requirements.txt
python app.py
```

### 3. Start the Frontend Dashboard
```bash
cd dashboard
npm install
npm run dev
```

## 🔬 Testing Without Hardware

If you don't have an ESP32 connected, you can simulate the entire platform:

### A. Start Realistic Data Simulation
Generates smooth-drifting sensor data every 5 seconds.
```bash
node simulate_hardware.js
```

### B. Start AI Gesture Control
Control devices using your webcam.
```bash
cd gesture-control
py -3.12 -m pip install -r requirements.txt
py -3.12 gesture_control.py
```
**Gestures:**
- 🖐️ **5 Fingers**: Devices ON
- ✌️ **2 Fingers**: Sleep Mode (Fan ON, Light OFF)
- ✊ **0 Fingers (Fist)**: Devices OFF

## 📚 Extended Documentation

- **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)**: Deep dive into API endpoints and prediction logic.
- **[ML_SETUP_GUIDE.md](./ML_SETUP_GUIDE.md)**: Instructions on retraining models.
- **[COMPLETE_DELIVERABLES.md](./COMPLETE_DELIVERABLES.md)**: Exhaustive feature checklist.

## 👥 Contributing

Contributions are welcome! Please create an issue to discuss changes or open a pull request.
