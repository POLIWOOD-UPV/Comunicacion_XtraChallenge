#include <Arduino.h>
#include "network.h"
#include "ui.h"

void setup() {
    Serial.begin(115200);

    initUI();
    initNetwork();
}

void loop() {
    handleUI();
    handleNetwork();
}