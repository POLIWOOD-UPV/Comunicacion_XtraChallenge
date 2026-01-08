// ui.cpp
#include "ui.h"
#include "network.h"
#include <M5Stack.h>

void initUI() {
    M5.begin(true, false, true);
    M5.Lcd.clear(BLACK);

    M5.Lcd.setTextSize(2);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("XtraChrono");

    M5.Lcd.setCursor(20, 80);
    M5.Lcd.println("A: START");

    M5.Lcd.setCursor(20, 110);
    M5.Lcd.println("B: PAUSE");

    M5.Lcd.setCursor(20, 140);
    M5.Lcd.println("C: STOP");
}

void handleUI() {
    M5.update();

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
}
