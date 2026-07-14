// network.cpp
#include "network.h"
#include "config.h"

#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>
#include <cstring>

// =====================
// WebSocket
// =====================
WebSocketsClient ws;

// Estado sincronizado con el servidor
static bool wsConnected = false;
static String chronoState = "stopped";
static unsigned long baseElapsedMs = 0;
static unsigned long baseSyncLocalMs = 0;
static unsigned long lastSyncServerTime = 0;
static String networkStatusMessage = "Conectando...";
static String lastActionMessage = "";
static unsigned long lastActionMessageAt = 0;

static void syncClock(unsigned long elapsedMs, const String& state, unsigned long serverTime = 0) {
    if (serverTime != 0 && serverTime < lastSyncServerTime) {
        return;
    }

    baseElapsedMs = elapsedMs;
    baseSyncLocalMs = millis();
    chronoState = state;

    if (serverTime != 0) {
        lastSyncServerTime = serverTime;
    }
}

static unsigned long toElapsedMs(JsonVariant tiempo) {
    if (tiempo.isNull()) {
        return 0;
    }

    unsigned long min = tiempo["min"] | 0;
    unsigned long sec = tiempo["sec"] | 0;
    unsigned long ms = tiempo["ms"] | 0;
    return (min * 60000UL) + (sec * 1000UL) + ms;
}

static const char* chronoStateLabel(const String& state) {
    if (state == "running") return "En marcha";
    if (state == "paused") return "Pausado";
    if (state == "stopped") return "Detenido";
    return "Desconocido";
}

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
            wsConnected = true;
            networkStatusMessage = "WebSocket conectado";
            Serial.println("[WS] Conectado");
            break;

        case WStype_DISCONNECTED:
            wsConnected = false;
            networkStatusMessage = "WebSocket desconectado";
            Serial.println("[WS] Desconectado");
            break;

        case WStype_TEXT: {
            // Serial.print("[WS] RX: ");
            // Serial.println((char*)payload);

            StaticJsonDocument<384> doc;
            DeserializationError error = deserializeJson(doc, payload, length);
            if (error) {
                break;
            }

            const char* typeName = doc["type"] | "";

            if (strcmp(typeName, "status") == 0) {
                const char* message = doc["message"] | "WebSocket conectado";
                networkStatusMessage = String(message);
            }

            if (strcmp(typeName, "time") == 0) {
                JsonVariant payloadData = doc["payload"];
                if (!payloadData.isNull()) {
                    unsigned long elapsedMs = payloadData["elapsedMs"] | toElapsedMs(payloadData["tiempo"]);
                    const char* state = payloadData["state"] | "stopped";
                    unsigned long serverTime = payloadData["serverTime"] | 0;
                    syncClock(elapsedMs, String(state), serverTime);
                }
            }
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

    String responseBody = http.getString();
    if (responseBody.length() > 0) {
        StaticJsonDocument<384> responseDoc;
        DeserializationError responseError = deserializeJson(responseDoc, responseBody);
        if (!responseError) {
            const char* message = responseDoc["message"] | "";
            if (strlen(message) > 0) {
                lastActionMessage = message;
                lastActionMessageAt = millis();
            }

            const char* state = responseDoc["state"] | nullptr;
            unsigned long elapsedMs = responseDoc["elapsedMs"] | 0;
            unsigned long serverTime = responseDoc["serverTime"] | 0;
            if (state != nullptr) {
                syncClock(elapsedMs, String(state), serverTime);
            }
        }
    }

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

// =====================
// Estado compartido con la UI
// =====================
bool isWsConnected() {
    return wsConnected;
}

const char* getChronoState() {
    return chronoState.c_str();
}

unsigned long getDisplayedElapsedMs() {
    if (chronoState == "running") {
        return baseElapsedMs + (millis() - baseSyncLocalMs);
    }

    return baseElapsedMs;
}

const char* getNetworkStatusMessage() {
    if (lastActionMessage.length() > 0 && (millis() - lastActionMessageAt) < 3000UL) {
        return lastActionMessage.c_str();
    }

    return networkStatusMessage.c_str();
}
