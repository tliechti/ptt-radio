<div align="center">

<img src="docs/banner.svg" alt="PTT-Radio — open-source push-to-talk over WebRTC" width="100%"/>

<br/>
<br/>

<!-- ── License ───────────────────────────────────────────────────────────── -->
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square&labelColor=070e07&color=22c55e)](LICENSE)

<!-- ── Stack ─────────────────────────────────────────────────────────────── -->
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-22c55e?style=flat-square&logo=node.js&logoColor=22c55e&labelColor=070e07)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-22c55e?style=flat-square&logo=react&logoColor=22c55e&labelColor=070e07)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-22c55e?style=flat-square&logo=vite&logoColor=22c55e&labelColor=070e07)](https://vitejs.dev)

<!-- ── Protocol ──────────────────────────────────────────────────────────── -->
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P-22c55e?style=flat-square&logo=webrtc&logoColor=22c55e&labelColor=070e07)](https://webrtc.org)
[![Codec](https://img.shields.io/badge/Codec-Opus_48kHz-22c55e?style=flat-square&labelColor=070e07&color=22c55e)](https://opus-codec.org)
[![Encrypted](https://img.shields.io/badge/Encrypted-SRTP-22c55e?style=flat-square&labelColor=070e07&color=22c55e)](https://datatracker.ietf.org/doc/html/rfc3711)

<!-- ── Transport ─────────────────────────────────────────────────────────── -->
[![Transport](https://img.shields.io/badge/Transport-WebSocket_%2B_UDP-22c55e?style=flat-square&labelColor=070e07&color=22c55e)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Docker](https://img.shields.io/badge/Docker-ready-22c55e?style=flat-square&logo=docker&logoColor=22c55e&labelColor=070e07)](docker-compose.yml)

<!-- ── Quality ───────────────────────────────────────────────────────────── -->
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e?style=flat-square&labelColor=070e07&color=22c55e)](CONTRIBUTING.md)
[![Open Source](https://img.shields.io/badge/Open_Source-%E2%9C%93-22c55e?style=flat-square&labelColor=070e07&color=22c55e)](https://opensource.org)

</div>
# PTT-Radio

**Open-source push-to-talk voice communication over WebRTC.**

Hold a button (or keyboard hotkey) to speak. Release to send. Anyone in the same room hears you in real time — no telephony, no audio servers, no third-party services required. Audio travels directly peer-to-peer over encrypted WebRTC (SRTP/Opus), with a tiny WebSocket signaling relay for peer discovery only.

```
  ┌───────── Machine A ──────────┐      ┌───────── Machine B ──────────┐
  │  Browser  →  PTT-Radio UI    │      │    PTT-Radio UI  ←  Browser  │
  │  [HOLD PTT]  Opus 48kHz      │      │     Opus 48kHz  [PLAYS AUDIO]│
  └──────────┬───────────────────┘      └──────────────────────────┬───┘
             │   WebRTC P2P (SRTP/UDP)                  │
             └──────────────────────────────────────────┘
                           ↕ signaling only ↕
                   ┌───────────────────────────┐
                   │   PTT-Radio Signal Server │
                   │   WebSocket — port 3001   │
                   └───────────────────────────┘
```

---

## Features

- **True half-duplex PTT** — hold to transmit, release to end packet
- **WebRTC mesh** — encrypted peer-to-peer audio (SRTP), no audio touches the server
- **Opus codec** — 48 kHz, 20 ms frames, native to all modern browsers, zero WASM
- **High-contrast Sunlight Mode** — optimized layout & colors for outdoor visibility
- **Live VU meter** — 24-segment LED-style input level display
- **Oscilloscope waveform ring** — real-time canvas visualization during TX
- **Multi-peer rooms** — up to 8 peers per channel, unlimited channels
- **ICE restart** — automatic reconnection on network changes
- **Demo mode** — works fully offline, no signaling server needed for local testing
- **Rebindable hotkey** — any key, captured live via one-shot listener
- **Persisted settings** — localStorage: server URL, room, hotkey, gain, channel
- **Android Support** — Capacitor-wrapped native Android APK
- **Docker-ready** — multi-stage builds for both client (Nginx) and server (Node)
- **PWA manifest** — installable as a desktop/mobile web app

---

## Directory Structure

```
ptt-radio/
├── package.json               ← root scripts (dev, build, docker)
├── docker-compose.yml         ← full-stack Docker deployment
├── .gitignore
│
├── client/                    ← React + Vite frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── capacitor.config.json  ← Capacitor native app config
│   ├── index.html             ← HTML entry point
│   ├── Dockerfile             ← multi-stage: build → Nginx
│   ├── nginx.conf             ← SPA routing, security headers, gzip
│   ├── android/               ← Native Android project (Gradle wrapper)
│   ├── public/
│   │   └── manifest.json      ← PWA manifest
│   └── src/
│       ├── main.jsx           ← React root mount
│       ├── App.jsx            ← root component
│       ├── theme.js           ← centralized sunlight color palette & theme tokens
│       │
│       ├── engine/
│       │   └── PTTEngine.js   ← WebAudio + WebRTC + signaling core class
│       │
│       ├── hooks/
│       │   ├── usePTTEngine.js  ← React bindings, persisted settings, state
│       │   └── useKeyBind.js    ← keyboard PTT binding + live key capture
│       │
│       ├── components/
│       │   ├── PTTRadioApp.jsx      ← main assembled UI
│       │   ├── PTTButton.jsx        ← circular push-to-talk button
│       │   ├── VUMeter.jsx          ← 24-segment LED level display
│       │   ├── WaveformRing.jsx     ← canvas oscilloscope ring
│       │   ├── DisplayComponents.jsx← LCD, SignalBars, PeerBadge, Squelch
│       │   ├── SettingsPanel.jsx    ← config overlay with key capture
│       │   └── EventLog.jsx         ← terminal-style event log
│       │
│       └── styles/            ← (reserved for future CSS modules)
│
└── server/                    ← Node.js WebSocket signaling server
    ├── package.json
    ├── Dockerfile
    ├── .env.example
    └── src/
        └── index.js           ← WebSocket relay, rooms, heartbeat, /health
```

---

## QuickStart — Local Development

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- A modern browser with WebRTC support (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)
- Microphone access

### 1 — Clone and install

```bash
git clone https://github.com/david-spies/ptt-radio.git
cd ptt-radio
npm install          # installs root dev deps (concurrently)
npm run install:all  # installs client + server deps
```

### 2 — Start both services

```bash
npm run dev
```

This starts:
- **Client** on `http://localhost:5173` (Vite HMR)
- **Signal server** on `ws://localhost:3001` (Node --watch)

### 3 — Use the app

1. Open `http://localhost:5173` in your browser (two tabs to simulate two peers)
2. Click **INIT MIC** — grant microphone permission
3. Click **CFG** → set Signal Server to `ws://localhost:3001`, set a Room name (e.g. `test`)
4. Click **CONNECT** in both tabs
5. **Hold SPACE** (or your custom key) in one tab → the other tab plays audio

> **Demo mode:** If no signaling server is reachable, the app falls back to demo mode automatically. Mic and PTT still work for local level/waveform testing.

---

## Building the Android App

PTT-Radio includes an Android project powered by [Capacitor](https://capacitorjs.com/).

### Prerequisites

- **Java Development Kit (JDK 17 or 21)**
- **Android SDK / Android Studio** (command-line tools or full IDE)
- `ANDROID_HOME` or `ANDROID_SDK_ROOT` configured in your environment

### 1 — Build Frontend & Sync Assets

Always build the latest web frontend and synchronize it to the native Android directory:

```bash
cd client
npm run build
npx cap sync android
```

### 2 — Compile the Android APK (CLI)

Navigate to the Android folder and compile with the Gradle wrapper:

```bash
cd client/android

# Build Debug APK
./gradlew assembleDebug

# Build Release APK
./gradlew assembleRelease

# Build Android App Bundle (.aab) for Google Play
./gradlew bundleRelease
```

> **Windows Users:** Use `gradlew.bat assembleDebug` instead of `./gradlew`.

#### Output Artifacts:
- **Debug APK:** `client/android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK:** `client/android/app/build/outputs/apk/release/app-release-unsigned.apk`

### 3 — Run & Install on Device

#### Via Command Line (ADB):
With an Android phone connected via USB (USB Debugging enabled) or an active emulator:

```bash
cd client/android
./gradlew installDebug
```
or:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

#### Via Android Studio:
Open the native project directly in Android Studio:

```bash
cd client
npx cap open android
```
- Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**, or
- Press the green **Run (▶)** button to launch on your device/emulator.

---

## Troubleshooting & Common Issues

### `ERR_CONNECTION_REFUSED`

If you encounter `ERR_CONNECTION_REFUSED`, check the following based on how you are running the app:

#### 1. Signaling server or dev server is not running
Start the servers from the project root:
```bash
npm run dev
```
Or start only the signaling server:
```bash
npm run start:server
```

#### 2. Running on an Android Phone (USB / Wi-Fi)
On an Android device, `localhost` refers to the **phone itself**, not your development computer.

- **Option A (USB Connected):** Forward port 3001 from your device to your host machine:
  ```bash
  adb reverse tcp:3001 tcp:3001
  ```
- **Option B (Wi-Fi):** In the app, tap **CFG** and set **Signaling Server** to your machine's LAN IP:
  ```text
  ws://192.168.1.xxx:3001
  ```

#### 3. Running on the Android Emulator
Set the **Signaling Server** in the **CFG** panel to the Android emulator host loopback address:
```text
ws://10.0.2.2:3001
```

#### 4. Offline / Demo Mode
If you don't want to run a signaling server, tap **CFG** and leave the **Signaling Server** input blank. The app will operate in local Demo Mode.

---

## QuickStart — Docker (Production)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2

### 1 — Configure environment

```bash
cp server/.env.example server/.env
# Edit server/.env — set ALLOWED_ORIGINS to your domain in production
```

### 2 — Build and start

```bash
npm run docker:up
# or directly:
docker compose up --build -d
```

Services:
- **Client** → `http://localhost:80`
- **Signal server** → `ws://localhost:3001`
- **Health check** → `http://localhost:3001/health`

### 3 — View logs

```bash
npm run docker:logs
```

### 4 — Stop

```bash
npm run docker:down
```

---

## Manual Production Deployment

### Signal Server (Node.js)

```bash
cd server
cp .env.example .env
# edit .env
npm install --omit=dev
node src/index.js
```

With PM2 for process management:

```bash
npm install -g pm2
pm2 start src/index.js --name ptt-radio-server
pm2 save
pm2 startup
```

### Client (Static Files)

```bash
cd client
npm install
npm run build
# dist/ contains the production static files
# Serve with any static file host: Nginx, Caddy, S3+CloudFront, Vercel, etc.
```

**Important:** The signaling server must use **WSS** (WebSocket Secure) in production because browsers block mixed content (HTTPS page → WS connection). Place it behind a TLS-terminating reverse proxy (Nginx, Caddy, Traefik) and expose it at `wss://your-domain.com/signal`.

Sample Caddy reverse proxy snippet:

```
your-domain.com {
    reverse_proxy /signal localhost:3001
    root * /var/www/ptt-radio/dist
    file_server
    try_files {path} /index.html
}
```

---

## Configuration Reference

### Settings Panel (CFG button in UI)

| Setting | Default | Description |
|---|---|---|
| Signal Server | *(blank — demo mode)* | WebSocket URL of the signaling server, e.g. `wss://signal.your-domain.com` |
| Room / Channel | `alpha-1` | Room name. Anyone with the same name joins the same channel. |
| PTT Hotkey | `Space` | Any keyboard key, captured live via the REBIND button |
| Input Device | Default Mic | Microphone device selection |
| Input Gain | 100% | Pre-transmit microphone amplification (0–300%) |
| Output Gain | 100% | Incoming peer audio volume (0–200%) |
| Channel | 1 | Display channel number (1–99), cosmetic only |

Settings are persisted to `localStorage` and restored on next load.

### Signal Server Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | TCP port to listen on |
| `MAX_ROOMS` | `500` | Maximum concurrent rooms |
| `MAX_PEERS` | `8` | Maximum peers per room |
| `HEARTBEAT_MS` | `20000` | WebSocket ping interval (ms) |
| `MSG_MAX_BYTES` | `65536` | Maximum message payload size (bytes) |
| `ALLOWED_ORIGINS` | *(open)* | Comma-separated allowed WebSocket origins |

---

## Architecture

### Audio Pipeline

```
Microphone
  └─ getUserMedia (48kHz, mono, echoCancellation, noiseSuppression)
       └─ MediaStreamSource
            └─ GainNode  (inputGain)
                 └─ AnalyserNode  (VU meter + waveform)

PTT DOWN → track.enabled = true  → audio flows into WebRTC sender
PTT UP   → track.enabled = false → silence (no data sent)

Incoming remote stream
  └─ MediaStreamSource
       └─ GainNode  (outputGain)
            └─ AudioDestination  (speakers)
```

Opus encoding happens natively inside the WebRTC stack — no manual encoding, no WASM, no worker threads.

### Signaling Protocol

The signaling server is a pure relay — it never inspects or buffers audio. It only:

1. Accepts `join` — adds peer to room, returns peer list, notifies existing peers
2. Routes `offer`, `answer`, `ice` — forwarded verbatim to the named `to` peer
3. Broadcasts `peer-left` when a connection closes
4. Runs a WebSocket heartbeat to detect zombie connections

After signaling is complete, all audio travels directly peer-to-peer via SRTP/UDP. The signaling server can go offline with no impact on in-progress calls.

### WebRTC Configuration

- **ICE policy:** `all` (direct, STUN, TURN fallback)
- **STUN servers:** Google public STUN (`stun.l.google.com:19302`, stun1–3)
- **ICE restart:** automatic on `failed` or `disconnected` state
- **Bundle policy:** `max-bundle` — single ICE transport for all streams
- **RTCP mux:** `require` — RTCP and RTP share a single UDP port

For networks with symmetric NAT (corporate firewalls), add your own TURN server to `ICE_SERVERS` in `client/src/engine/PTTEngine.js`.

---

## Browser Support

| Browser | Minimum Version | Notes |
|---|---|---|
| Chrome / Edge | 90 | Full support |
| Firefox | 88 | Full support |
| Safari | 15.4 | Requires user gesture before `getUserMedia` |
| Mobile Chrome | 90 | Hold button supported via touch events |
| Mobile Safari | 15.4 | Works; no keyboard hotkey on mobile |

WebRTC is blocked in HTTP contexts on mobile Safari — serve over HTTPS in production.

---

## Security Notes

- **No audio on server.** The signaling server only routes text messages. All audio is E2E-encrypted via SRTP between peers.
- **Set `ALLOWED_ORIGINS`** in production to prevent unauthorized clients from connecting to your signaling server.
- **Use TLS.** Deploy behind HTTPS/WSS. `getUserMedia` and WebRTC are blocked in insecure contexts by all modern browsers.
- **Room names are not passwords.** Anyone who knows a room name can join. Add an authentication layer (JWT in the join message, verified server-side) for private channels.
- **Peer IDs** are 8-character random alphanumeric strings generated client-side. They are not authenticated.

---

## Contributing

Pull requests welcome. Key areas for contribution:

- **TURN server integration** — configurable relay for symmetric NAT
- **Room authentication** — JWT or pre-shared key validation on join
- **Text chat** — WebRTC data channel alongside audio
- **Recording** — MediaRecorder API to save TX sessions locally
- **Electron wrapper** — system tray, global hotkeys, no browser needed
- **Tests** — unit tests for PTTEngine state machine

---

## License

MIT © PTT-Radio Contributors

---

## Acknowledgements

Built on open standards: [WebRTC](https://webrtc.org/), [Opus](https://opus-codec.org/), [WebAudio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

Inspired by [VoxShare](https://github.com/voxshare), [Mumble](https://www.mumble.info/), and [PTT4E](https://github.com/Zulko/ptt4e).
