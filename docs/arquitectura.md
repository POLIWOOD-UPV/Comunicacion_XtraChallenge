# Arquitectura del sistema XtraChrono

## 1. Visión general

XtraChrono es un sistema de cronometraje centralizado y distribuido diseñado para el registro preciso de eventos temporales durante el XtraChallenge.
El sistema sustituye el uso de cronómetros manuales independientes por una arquitectura cliente-servidor que garantiza coherencia, sincronización y explotación de datos en tiempo real.

La arquitectura se basa en un servidor central ejecutado en una Raspberry Pi y múltiples clientes distribuidos (M5Stack y cliente web) que interactúan con dicho servidor.

---

## 2. Componentes del sistema

### 2.1 Servidor central (Raspberry Pi)

El servidor central es el núcleo del sistema y se encarga de:

- Mantener el cronómetro oficial de la competición.
- Procesar eventos de inicio, pausa y parada.
- Difundir el tiempo actual en tiempo real.
- Exponer el estado del sistema mediante una API HTTP.

Está implementado en Node.js utilizando el framework Express y comunicación WebSocket para la transmisión continua de datos.

---

### 2.2 Clientes M5Stack

Los dispositivos M5Stack actúan como terminales de control distribuidos.
Sus principales funciones son:

- Capturar la interacción del usuario mediante botones físicos.
- Enviar eventos al servidor mediante peticiones HTTP POST.
- Recibir el tiempo oficial mediante WebSocket.
- Mostrar el estado del cronómetro en pantalla.

Los M5Stack no gestionan el tiempo oficial, evitando inconsistencias y errores de sincronización entre dispositivos.

---

### 2.3 Cliente web

El cliente web proporciona una interfaz gráfica de monitorización y control del cronómetro. Permite:

- Visualizar el tiempo oficial en tiempo real.
- Enviar comandos de control al servidor.
- Mostrar el estado de conexión del sistema.

Esta interfaz es especialmente útil durante la retransmisión del evento.

---

## 3. Comunicación entre componentes

### 3.1 Comunicación HTTP

La comunicación HTTP se utiliza para el envío de eventos discretos:

- Inicio del cronómetro
- Pausa del cronómetro
- Detención del cronómetro

Cada evento incluye información de identificación del dispositivo emisor, permitiendo trazabilidad en un entorno distribuido.

---

### 3.2 Comunicación WebSocket

El protocolo WebSocket se utiliza para la transmisión continua del tiempo del cronómetro desde el servidor hacia los clientes.

Este enfoque permite:
- Actualización en tiempo real.
- Reducción del tráfico innecesario.
- Visualización fluida durante la retransmisión.

---

## 4. Sincronización temporal

Aunque el cronómetro oficial reside en el servidor, el sistema incorpora un mecanismo de sincronización temporal estimada.

Mediante el intercambio de marcas de tiempo entre cliente y servidor, los dispositivos pueden calcular un desfase aproximado que se utiliza
exclusivamente para ajustar la representación visual del tiempo mostrado.

Este mecanismo no afecta al cronómetro oficial y se plantea como base para futuras mejoras del sistema.

---

## 5. Flujo general de funcionamiento

1. El usuario interactúa con un cliente (M5Stack o web).
2. El cliente envía un evento HTTP al servidor.
3. El servidor procesa el evento y actualiza el cronómetro.
4. El servidor difunde el tiempo actualizado mediante WebSocket.
5. Los clientes actualizan su visualización en tiempo real.

---

## 6. Extensibilidad del sistema

La arquitectura modular del sistema permite:

- Añadir nuevos tipos de clientes.
- Incorporar persistencia de datos.
- Mejorar la sincronización temporal.
- Generar visualizaciones dinámicas para contenido audiovisual.

Esta flexibilidad garantiza la evolución futura del sistema sin replantear su diseño base.