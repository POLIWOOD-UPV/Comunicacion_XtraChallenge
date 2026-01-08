// network.cpp
#include "network.h"
#include "config.h"

#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>

// =====================
// WebSocket
// =====================
WebSocketsClient ws;

// =====================
// WiFi
// =====================
void initWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Conectando a WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nWiFi conectado");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
}

// =====================
// WebSocket callback
// =====================
void onWsEvent(WStype_t type, uint8_t * payload, size_t length) {

    switch (type) {

        case WStype_CONNECTED:
            Serial.println("[WS] Conectado");
            break;

        case WStype_DISCONNECTED:
            Serial.println("[WS] Desconectado");
            break;

        case WStype_TEXT: {
            Serial.print("[WS] RX: ");
            Serial.println((char*)payload);
            break;
        }

        default:
            break;
    }
}

// =====================
// Init Network
// =====================
void initNetwork() {
    initWiFi();

    ws.begin(SERVER_HOST, SERVER_PORT, "/");
    ws.onEvent(onWsEvent);
    ws.setReconnectInterval(2000);

    Serial.println("WebSocket iniciado");
}

// =====================
// Loop Network
// =====================
void handleNetwork() {
    ws.loop();
}

// =====================
// HTTP POST helper
// =====================
void sendPost(const char* endpoint) {

    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;
    String url = String("http://") + SERVER_HOST + ":" + SERVER_PORT + endpoint;

    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<128> doc;
    doc["deviceId"] = DEVICE_ID;
    doc["timestamp"] = millis();

    String body;
    serializeJson(doc, body);

    int code = http.POST(body);

    Serial.print("POST ");
    Serial.print(endpoint);
    Serial.print(" -> ");
    Serial.println(code);

    http.end();
}

// =====================
// Public API
// =====================
void sendStartEvent() {
    sendPost("/start");
}

void sendPauseEvent() {
    sendPost("/pause");
}

void sendStopEvent() {
    sendPost("/stop");
}
