# Cliente M5Stack — XtraChrono

Este módulo representa el cliente distribuido del sistema XtraChrono.
Cada M5Stack actúa como terminal de control que permite iniciar, pausar
o detener cronómetros centralizados en el servidor.

## Funciones principales
- Envío de eventos al servidor mediante HTTP POST.
- Recepción del tiempo oficial mediante WebSocket.
- Visualización del estado del cronómetro en pantalla.
- Feedback inmediato al usuario mediante botones y sonido.

## Consideraciones de diseño
- El M5Stack NO gestiona el tiempo oficial.
- El cronómetro reside únicamente en el servidor.
- El cliente funciona como interfaz distribuida de control.

Este módulo se presenta a nivel estructural y conceptual,
dejando la implementación completa como línea futura.