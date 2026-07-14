// ui.cpp
#include "ui.h"
#include "network.h"
#include <M5Unified.h>
#include <WiFi.h>
#include <cstring>
#include "logo.h"

namespace {
    const uint32_t UI_REFRESH_FPS = 20; // Sube o baja este valor para cambiar la fluidez visual en el M5Stack.
    const uint32_t UI_FRAME_MS = 1000 / UI_REFRESH_FPS;
    uint32_t lastFrameMs = 0;

    String lastRenderedState = "";
    unsigned long lastRenderedElapsed = 0;
    String lastRenderedMessage = "";

    uint32_t elapsedToMs(unsigned long elapsedMs) {
        return static_cast<uint32_t>(elapsedMs);
    }

    void drawHeader() {
        M5.Display.fillScreen(BLACK);
        M5.Display.setTextColor(WHITE, BLACK);

        // Bloque visual del logo. El PSD no se puede dibujar directamente en el M5Stack.
        // Aquí dejamos un espacio preparado para sustituirlo por una imagen BMP/JPG convertida.
        M5.Display.fillRoundRect(14, 12, 52, 52, 8, DARKGREY);
        M5.Display.pushImage(14, 12, logoWidth, logoHeight, logo);

        M5.Display.setTextSize(2);
        M5.Display.setCursor(78, 20);
        M5.Display.print("XtraChrono");

        M5.Display.setTextSize(1);
        M5.Display.setTextColor(LIGHTGREY, BLACK);
        M5.Display.setCursor(78, 42);
        M5.Display.print("Cronometro sincronizado");
    }

    const char* stateLabel(const char* state) {
        if (strcmp(state, "running") == 0) return "En marcha";
        if (strcmp(state, "paused") == 0) return "Pausado";
        if (strcmp(state, "stopped") == 0) return "Detenido";
        return "Desconocido";
    }

    uint16_t stateColor(const char* state) {
        if (strcmp(state, "running") == 0) return RED;
        if (strcmp(state, "paused") == 0) return YELLOW;
        if (strcmp(state, "stopped") == 0) return DARKGREY;
        return WHITE;
    }

    void drawStateChip(const char* state) {
        M5.Display.fillRoundRect(18, 70, 284, 28, 10, stateColor(state));
        M5.Display.setTextColor(BLACK, stateColor(state));
        M5.Display.setTextSize(1);
        M5.Display.setCursor(28, 80);
        M5.Display.print("Estado: ");
        M5.Display.print(stateLabel(state));
    }

    void drawTimer(unsigned long elapsedMs) {

        unsigned long totalSeconds = elapsedMs / 1000UL;
        unsigned long min = totalSeconds / 60UL;
        unsigned long sec = totalSeconds % 60UL;
        unsigned long ms = elapsedMs % 1000UL;

        char buffer[16];
        snprintf(buffer, sizeof(buffer), "%02lu:%02lu:%03lu", min, sec, ms);

        M5.Display.fillRect(40, 132, 250, 35, BLACK);

        M5.Display.setTextColor(WHITE, BLACK);
        M5.Display.setTextSize(4);
        M5.Display.setCursor(40, 132);
        M5.Display.print(buffer);
    }

    void drawFooter(const String& message) {
        M5.Display.fillRect(0, 196, 320, 44, BLACK);
        M5.Display.setTextSize(1);
        M5.Display.setTextColor(LIGHTGREY, BLACK);
        M5.Display.setCursor(16, 202);
        M5.Display.print("A: START   B: PAUSE   C: STOP");

        M5.Display.setTextColor(WHITE, BLACK);
        M5.Display.setCursor(16, 216);
        M5.Display.print("WiFi: ");
        M5.Display.print(WiFi.status() == WL_CONNECTED ? "OK" : "OFF");
        M5.Display.print("  WS: ");
        M5.Display.print(isWsConnected() ? "OK" : "WAIT");

        M5.Display.setTextColor(LIGHTGREY, BLACK);
        M5.Display.setCursor(16, 228);
        M5.Display.print(message.c_str());
    }

    void renderUI() {
        const char* state = getChronoState();
        unsigned long elapsedMs = getDisplayedElapsedMs();
        String message = getNetworkStatusMessage();

        drawTimer(elapsedMs);

        if (lastRenderedState != state) {
            lastRenderedState = state;
            drawStateChip(state);
        }

        if (lastRenderedMessage != message) {
            lastRenderedMessage = message;
            drawFooter(message);
        }

        lastRenderedElapsed = elapsedMs;
    }
}

void initUI() {

    auto cfg = M5.config();
    M5.begin(cfg);
    M5.Display.setSwapBytes(true);
    drawHeader();
    drawStateChip("stopped");
    M5.Display.drawRoundRect(18, 112, 284, 72, 14, DARKGREY);
    drawTimer(0);
    drawFooter("Esperando conexion...");

    lastRenderedState = "stopped";
    lastRenderedElapsed = 0;
    lastRenderedMessage = "Esperando conexion...";
}

void handleUI() {
    M5.update();

    // Botones primero: máxima prioridad
    if (M5.BtnA.wasPressed()) {
        Serial.println("[UI] START");
        sendStartEvent();
    }

    if (M5.BtnB.wasPressed()) {
        Serial.println("[UI] PAUSE");
        sendPauseEvent();
    }

    if (M5.BtnC.wasPressed()) {
        Serial.println("[UI] STOP");
        sendStopEvent();
    }

    // Pantalla después
    const uint32_t now = millis();

    if ((now - lastFrameMs) >= UI_FRAME_MS) {
        lastFrameMs = now;
        renderUI();
    }
}