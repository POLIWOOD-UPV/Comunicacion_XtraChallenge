# Cliente M5Stack — XtraChrono

Este módulo representa el cliente distribuido del sistema XtraChrono.
Cada M5Stack actúa como terminal de control que permite iniciar, pausar
o detener cronómetros centralizados en el servidor.

## Funciones principales
- Envío de eventos al servidor mediante HTTP POST.
- Recepción del tiempo oficial mediante WebSocket.
- Visualización del estado del cronómetro en pantalla.
- Feedback inmediato al usuario mediante botones y sonido.

## Pantalla y logo
- La pantalla del M5Stack se dibuja desde `src/ui.cpp`.
- El refresco visual se controla con `UI_REFRESH_FPS` dentro de ese mismo archivo.
- El fichero `img/centrado.psd` no se puede mostrar directamente en el M5Stack.
- Para usar ese logo hay que exportarlo primero a una imagen rasterizada, normalmente JPG o BMP.
- Lo más práctico es convertirlo a JPG, copiarlo al SD del M5Stack o a SPIFFS, y dibujarlo desde código.
- Si prefieres hacerlo más simple, puedes dejar un logo vectorial simulado con texto/rectángulos hasta tener la imagen convertida.

## Consideraciones de diseño
- El M5Stack NO gestiona el tiempo oficial.
- El cronómetro reside únicamente en el servidor.
- El cliente funciona como interfaz distribuida de control.

## Sincronización visual
- El tiempo que ves en pantalla se sincroniza con el servidor a través del WebSocket.
- El M5Stack no recalcula el cronómetro desde cero; solo interpola suavemente el tiempo recibido.
- Si quieres cambiar la fluidez, ajusta `UI_REFRESH_FPS`.

Este módulo se presenta a nivel estructural y conceptual,
dejando la implementación completa como línea futura.