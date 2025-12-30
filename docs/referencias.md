# Referencias

Este documento recoge las principales fuentes técnicas y conceptuales
utilizadas durante el diseño y desarrollo del sistema XtraChrono.

---

## 1. Tecnologías y librerías

- **Node.js**  
  https://nodejs.org/  
  Entorno de ejecución JavaScript utilizado para implementar el servidor.

- **Express.js**  
  https://expressjs.com/  
  Framework web empleado para la gestión de rutas HTTP y middleware.

- **ws (WebSocket para Node.js)**  
  https://github.com/websockets/ws  
  Librería utilizada para la comunicación WebSocket en tiempo real.

- **Arduino Framework (ESP32)**  
  https://docs.arduino.cc/  
  Framework base para el desarrollo del cliente M5Stack.

- **PlatformIO**  
  https://platformio.org/  
  Entorno de desarrollo para sistemas embebidos basado en VS Code.

---

## 2. Dispositivos y hardware

- **M5Stack Core ESP32**  
  https://docs.m5stack.com/  
  Dispositivo utilizado como terminal distribuido de control.

- **Raspberry Pi**  
  https://www.raspberrypi.com/documentation/  
  Plataforma empleada como servidor central del sistema.

---

## 3. Conceptos y arquitectura

- **Arquitectura cliente-servidor**  
  Modelo de diseño utilizado para centralizar la lógica del sistema.

- **Comunicación en tiempo real con WebSocket**  
  https://developer.mozilla.org/es/docs/Web/API/WebSockets_API  
  Protocolo empleado para la transmisión continua de datos.

- **Sincronización temporal y estimación de desfase**  
  Concepto utilizado para ajustar la representación visual del tiempo en sistemas distribuidos.

---

## 4. Buenas prácticas

- **Separación de responsabilidades (SoC)**  
  Principio de diseño aplicado para estructurar el sistema en módulos.

- **Diseño modular y escalable**  
  Enfoque adoptado para facilitar la evolución futura del proyecto.