#include <HTTPClient.h>
#include <WiFi.h>

const char *ssid = "YOUR_WIFI";
const char *password = "YOUR_PASS";

const char *server = "http://192.168.1.10:5000/api/sensors/data";
const char *jwtToken = "YOUR_JWT_TOKEN"; // Replace with actual token from login

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(server);
    http.addHeader("Content-Type", "application/json");
    
    // Add Authorization header for protected backend routes
    String authHeader = "Bearer " + String(jwtToken);
    http.addHeader("Authorization", authHeader);

    // Generate simulated sensor data
    float temperature = random(240, 320) / 10.0;
    int motion = random(0, 2);
    float current = random(10, 50) / 10.0;
    float voltage = random(220, 235);

    // Construct JSON payload
    String json = "{";
    json += "\"temperature\":" + String(temperature) + ",";
    json += "\"motion\":" + String(motion) + ",";
    json += "\"current\":" + String(current) + ",";
    json += "\"voltage\":" + String(voltage) + ",";
    json += "\"lightStatus\":true,";
    json += "\"fanStatus\":false";
    json += "}";

    Serial.print("Sending data: ");
    Serial.println(json);

    int httpCode = http.POST(json);

    if (httpCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Code: ");
      Serial.println(httpCode);
      Serial.print("Server Response: ");
      Serial.println(response);
    } else {
      Serial.print("Error on HTTP request: ");
      Serial.println(http.errorToString(httpCode));
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected. Reconnecting...");
    WiFi.begin(ssid, password);
  }

  delay(10000); // 10 second interval
}