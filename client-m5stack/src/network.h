#pragma once

void initNetwork();
void handleNetwork();

// Envío de eventos
void sendStartEvent();
void sendPauseEvent();
void sendStopEvent();

// Estado sincronizado con el servidor
bool isWsConnected();
const char* getChronoState();
unsigned long getDisplayedElapsedMs();
const char* getNetworkStatusMessage();