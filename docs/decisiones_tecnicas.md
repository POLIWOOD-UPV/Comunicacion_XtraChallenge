# Decisiones técnicas del sistema XtraChrono

## 1. Elección de una arquitectura cliente-servidor

Se ha optado por una arquitectura cliente-servidor con un único cronómetro centralizado en el servidor. Esta decisión garantiza:

- Coherencia temporal entre todos los dispositivos.
- Eliminación de discrepancias causadas por cronómetros independientes.
- Un punto único de verdad para los tiempos oficiales.

Los clientes actúan únicamente como interfaces de control y visualización.

---

## 2. Centralización del cronómetro

El cronómetro oficial reside exclusivamente en el servidor y no en los clientes. Esta decisión evita:

- Desincronización entre dispositivos.
- Dependencia de la precisión del hardware cliente.
- Errores humanos derivados del control manual.

El servidor mantiene el estado completo del cronómetro y difunde su valor en tiempo real.

---

## 3. Uso combinado de HTTP y WebSocket

Se ha decidido utilizar dos mecanismos de comunicación diferenciados:

### 3.1 HTTP para eventos discretos

HTTP se emplea para el envío de eventos puntuales (inicio, pausa y parada), ya que:

- Son acciones discretas.
- Requieren confirmación.
- Encajan con el modelo petición-respuesta.

### 3.2 WebSocket para datos en tiempo real

WebSocket se utiliza para la transmisión continua del tiempo del cronómetro, permitiendo:

- Actualización fluida y en tiempo real.
- Reducción del tráfico innecesario frente a polling.
- Mejor experiencia visual durante la retransmisión.

---

## 4. Evolución desde polling HTTP a WebSocket

En una fase inicial del diseño se contempló el uso de polling HTTP para consultar el estado del cronómetro. Sin embargo, este enfoque fue sustituido por WebSocket al presentar ventajas claras en eficiencia y escalabilidad.

Esta evolución refleja un proceso de diseño iterativo y consciente.

---

## 5. Identificación de dispositivos

Cada evento enviado al servidor incluye un identificador de dispositivo (deviceId). 
Esta decisión permite:

- Trazabilidad de eventos.
- Identificación de terminales en sistemas distribuidos.
- Posible análisis posterior de uso y rendimiento.

---

## 6. Sincronización temporal estimada

Aunque el cronómetro oficial reside en el servidor, se ha diseñado un mecanismo de sincronización temporal estimada para los clientes.

Este mecanismo permite compensar visualmente pequeñas diferencias de reloj sin comprometer la integridad del tiempo oficial.

---

## 7. Diseño modular del sistema

El sistema se ha estructurado en módulos independientes:

- Lógica de cronometraje
- Rutas HTTP
- Comunicación WebSocket
- Utilidades comunes

Este diseño facilita:
- Mantenimiento
- Escalabilidad
- Extensión futura del sistema

---

## 8. Alcance del proyecto

Algunas funcionalidades avanzadas (persistencia, sincronización precisa, clientes completos en hardware) se han dejado fuera de la implementación final por limitaciones de tiempo y alcance, pero han sido consideradas en el diseño del sistema.

Este enfoque prioriza la solidez arquitectónica frente a la complejidad de implementación.