# ⚡ Smart Energy ML IoT

A comprehensive IoT platform that leverages Machine Learning to optimize energy consumption and detect wastage in real-time. The system collects sensor data via an ESP32 node, processes it through a Node.js backend, and uses a Flask-based ML API to predict room occupancy and automate device controls.

![Smart Energy Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-14354C?style=flat&logo=python&logoColor=white)

## ✨ Key Features

- **Real-Time Monitoring**: View live sensor data (Temperature, Motion, Voltage, Current) from ESP32 devices.
- **Machine Learning Automation**:
  - **Occupancy Detection**: Uses a Decision Tree model to accurately predict whether a room is occupied based on historical and real-time sensor logic.
  - **Energy Wastage Detection**: Employs a Random Forest model to identify scenarios where devices (like fans/lights) are running unnecessarily.
- **Interactive Dashboard**: A responsive, dark-mode-ready React interface built with Tailwind CSS.
- **Secure Authentication**: JWT-protected API routes and encrypted user details.
- **Hardware Integration**: Fully functioning ESP32 C++ implementation for edge-node data transmission.

## 🏗️ System Architecture

The project is split into decoupled microservices:

1. **`dashboard/` (Frontend)**: React + Vite web dashboard running on port `3000`.
2. **`backend/` (Backend)**: Node.js + Express API storing history in MongoDB, running on port `5000`.
3. **`ml-api/` (ML Prediction Service)**: Flask API serving `.pkl` ML models on port `6000` or `8000`.
4. **`ml-model/` (Algorithms)**: Python scripts for tabular data generation and model training (`scikit-learn`).
5. **`esp32_iot_node/` (Hardware)**: C++ application for ESP32 microcontroller to gather and transmit telemetry.

*(For detailed system interactions, data flow, and database models, please refer to [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).)*

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (Running locally on default port `27017` or MongoDB Atlas)

### 1. Run the Backend Server

```bash
cd backend
npm install
# Ensure your .env has MONGO_URI and ML_API_URL
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

### 4. ESP32 Node Setup
- Open the `esp32_iot_node/esp32_iot_node.ino` file via Arduino IDE.
- Update your local Wi-Fi credentials (`ssid`, `password`) and the `serverUrl` point to your Backend.
- Compile and flash to your ESP32 board.

## 📚 Extended Documentation

For a deeper dive into specific components, refer to these comprehensive guides included in the repository:
- **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)**: Deep dive into API endpoints, authentication flows, and prediction logic.
- **[ML_SETUP_GUIDE.md](./ML_SETUP_GUIDE.md)**: Instructions on retraining and deploying the Machine Learning models.
- **[ML_API_SUMMARY.md](./ML_API_SUMMARY.md)**: Quick reference specifications for the Flask ML service.
- **[COMPLETE_DELIVERABLES.md](./COMPLETE_DELIVERABLES.md)**: Exhaustive checklist of ML features and API validations.

## 🛠️ Testing & Validation

A suite of verification scripts are provided:
- To test the ML service directly: `python ml-api/test_api.py`
- To test the Backend-to-ML integration: `node backend/test-ml-integration.js`

## 👥 Contributing

Contributions are welcome! Please create an issue to discuss the change you want to make, or simply open a pull request.
