#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API Configuration
const char* serverUrl = "http://YOUR_SERVER_IP:5000"; // e.g. http://192.168.1.100:5000
const char* loginEndpoint = "/api/auth/login";
const char* sensorEndpoint = "/api/sensors/data";

// User Credentials (to get JWT token)
const char* userEmail = "user@example.com";
const char* userPassword = "password123";

// Hardware Pins
const int lightRelayPin = 26;
const int fanRelayPin = 27;
const int motionSensorPin = 14; // Input for motion sensor

// Global Variables
String authToken = "";
unsigned long lastMsg = 0;

void setup() {
  Serial.begin(115200);
  
  pinMode(lightRelayPin, OUTPUT);
  pinMode(fanRelayPin, OUTPUT);
  pinMode(motionSensorPin, INPUT);
  
  // Initialize Relays (OFF)
  digitalWrite(lightRelayPin, LOW);
  digitalWrite(fanRelayPin, LOW);

  connectToWiFi();
  loginToBackend();
}

void loop() {
  // Check Wi-Fi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  // Send sensor data every 10 seconds
  unsigned long now = millis();
  if (now - lastMsg > 10000) {
    lastMsg = now;
    sendSensorData();
  }
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

bool loginToBackend() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverUrl) + loginEndpoint;
    
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    // Create login JSON
    StaticJsonDocument<200> doc;
    doc["email"] = userEmail;
    doc["password"] = userPassword;
    
    String jsonRequest;
    serializeJson(doc, jsonRequest);

    Serial.println("Logging in to backend...");
    int httpResponseCode = http.POST(jsonRequest);

    if (httpResponseCode == 200 || httpResponseCode == 201) {
      String response = http.getString();
      StaticJsonDocument<500> respDoc;
      deserializeJson(respDoc, response);
      
      authToken = respDoc["token"].as<String>();
      Serial.println("Login Success! Token received.");
      http.end();
      return true;
    } else {
      Serial.print("Login Failed. HTTP Error: ");
      Serial.println(httpResponseCode);
      http.end();
      return false;
    }
  }
  return false;
}

void sendSensorData() {
  if (authToken == "") {
    if (!loginToBackend()) return;
  }

  HTTPClient http;
  String url = String(serverUrl) + sensorEndpoint;
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + authToken);

  // Read Sensors (Simulated values for demonstration)
  int motionDetected = digitalRead(motionSensorPin);
  float temperature = 25.0 + random(-20, 20) / 10.0; // Simulated
  float current = random(10, 200) / 100.0;         // Simulated 0.1A - 1.99A
  float voltage = 5.0 + random(-2, 3) / 10.0;      // Simulated 4.8V - 5.2V

  // Create sensor data JSON
  StaticJsonDocument<300> doc;
  doc["motion"] = motionDetected;
  doc["temperature"] = temperature;
  doc["current"] = current;
  doc["voltage"] = voltage;
  
  String jsonRequest;
  serializeJson(doc, jsonRequest);

  Serial.println("Sending sensor data...");
  int httpResponseCode = http.POST(jsonRequest);

  if (httpResponseCode == 200 || httpResponseCode == 201) {
    String response = http.getString();
    Serial.println("Response received: " + response);

    // Parse response for device control
    StaticJsonDocument<1024> respDoc;
    DeserializationError error = deserializeJson(respDoc, response);

    if (!error) {
      // Access nested object 'data.commands' (Authoritative state)
      bool lightCommand = respDoc["data"]["commands"]["light"];
      bool fanCommand = respDoc["data"]["commands"]["fan"];

      // Control Relays
      digitalWrite(lightRelayPin, lightCommand ? HIGH : LOW);
      digitalWrite(fanRelayPin, fanCommand ? HIGH : LOW);

      Serial.print("Commands Executed - Light: ");
      Serial.print(lightCommand ? "ON" : "OFF");
      Serial.print(", Fan: ");
      Serial.println(fanCommand ? "ON" : "OFF");
    } else {
      Serial.println("JSON Parsing Error!");
    }
  } else if (httpResponseCode == 401) {
    Serial.println("Token expired. Relogging...");
    authToken = ""; // Trigger relogin next time
  } else {
    Serial.print("Error sending sensor data. HTTP Code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}
