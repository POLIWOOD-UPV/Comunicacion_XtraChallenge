# 🕒 XtraChrono  
## Sistema centralizado de cronometraje para XtraChallenge

XtraChrono es un sistema de cronometraje distribuido diseñado para registrar
eventos temporales con precisión durante el XtraChallenge. El proyecto surge
como alternativa a la gestión manual mediante cronómetros independientes,
mejorando la sincronización, fiabilidad y explotación de los datos generados
durante la competición.

---

## 📌 Contexto del proyecto

Durante el XtraChallenge se generan múltiples eventos de tiempo (inicio,
pausa y duración de diferentes fases como vuelo, carga o preparación).
La gestión manual de estos eventos dificulta su sincronización y posterior
uso en retransmisiones o análisis.

XtraChrono propone una solución basada en un **servidor centralizado** y
**clientes distribuidos**, permitiendo un registro unificado y visualización
en tiempo real de los tiempos oficiales.

---

## 🧠 Arquitectura general

El sistema sigue una arquitectura **cliente-servidor**:

- 🖥️ **Servidor central (Node.js en Raspberry Pi)**  
  Mantiene el cronómetro oficial y gestiona los eventos.

- 📟 **Clientes M5Stack**  
  Actúan como terminales de control distribuidos.

- 🌐 **Cliente web**  
  Permite monitorización y control visual en tiempo real.

---

## 🔌 Comunicación

La comunicación se realiza mediante:

- **HTTP** para eventos discretos (start / pause / stop)
- **WebSocket** para transmisión continua del tiempo

---

## 📂 Estructura del proyecto

```text
INTERA-XtraChrono/
│
├── README.md
├── .gitignore
│
├── docs/
│   ├── memoria.pdf
│   ├── arquitectura.md
│   ├── decisiones_tecnicas.md
│   └── referencias.md
│
├── diagrams/
│   ├── arquitectura_general.png
│   ├── flujo_servidor.png
│   ├── flujo_m5stack.png
│   └── secuencia_eventos.png
│
├── server/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   │
│   ├── server.js
│   ├── ws_server.js
│   │
│   ├── src/
│   │   ├── core/
│   │   │   ├── cronometro.js
│   │   │   └── timeSync.js
│   │   │
│   │   ├── http/
│   │   │   ├── eventRoutes.js
│   │   │   └── statusRoutes.js
│   │   │
│   │   ├── ws/
│   │   │   └── wsHandlers.js
│   │   │
│   │   └── utils/
│   │       ├── logger.js
│   │       └── constants.js
│   │
│   └── public/
│       ├── index.html
│       ├── viewer.js
│       └── styles.css
│
├── client-m5stack/
│   ├── platformio.ini
│   ├── README.md
│   │
│   └── src/
│       ├── main.cpp
│       ├── network.cpp
│       ├── network.h
│       ├── ui.cpp
│       ├── ui.h
│       ├── sound.cpp
│       ├── sound.h
│       └── config.h
│
└── tests/
    ├── server.test.js
    └── cronometro.test.js
```

## ⚙️ Funcionamiento del sistema

1. El usuario interactúa con un cliente (web o M5Stack).
2. El cliente envía un evento HTTP al servidor.
3. El servidor actualiza el cronómetro oficial.
4. El tiempo se envía en tiempo real mediante WebSocket.
5. Los clientes actualizan su visualización.

El cronómetro oficial reside únicamente en el servidor, garantizando
coherencia entre todos los dispositivos.

---

## 🚀 Ejecución del servidor

### Requisitos
- Node.js ≥ 18
- npm

### Instalación y ejecución

```bash
npm install
node server.js
```

El servidor quedará accesible en:

http://localhost:3000

## 🧪 Tests

Se incluyen pruebas básicas para validar la lógica principal del sistema:

```text
node tests/cronometro.test.js
node tests/server.test.js
```

Estas pruebas verifican el comportamiento del cronómetro y la respuesta
del servidor.

## 🎨 Interfaz gráfica

El cliente web presenta una interfaz minimalista y profesional, alineada con
la identidad visual de Poliwood, pensada para su uso durante retransmisiones
en directo.

Incluye:

**Visualización del tiempo en tiempo real**

**Botones de control**

**Indicador de estado de conexión**

---

## 🔮 Líneas futuras

Persistencia de datos de cronometraje

Clientes M5Stack completamente funcionales

Mejora de la sincronización temporal

Generación de visualizaciones dinámicas para retransmisión

Control de múltiples cronómetros simultáneos

## 🧾 Notas finales

Este proyecto prioriza la solidez arquitectónica y la claridad conceptual,
dejando algunas funcionalidades avanzadas fuera del alcance de la
implementación final por motivos de tiempo.

La estructura modular del sistema permite su evolución futura sin
replantear el diseño base.

*Proyecto desarrollado en el contexto académico de INTERA*

**Poliwood · Universitat Politècnica de València**

![logo poliwood](/logo-poliwood-negro.png)
