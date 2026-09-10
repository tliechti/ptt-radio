import { THEME } from "../theme.js";

// ─── LCDDisplay ─────────────────────────────────────────────────────────────
const STATE_LABELS = {
  idle:         "STANDBY",
  connecting:   "CONNECTING...",
  connected:    "ONLINE",
  demo:         "LOCAL DEMO",
  disconnected: "OFFLINE",
  transmitting: "TX ACTIVE",
};

const STATE_COLORS = {
  idle:         THEME.text.secondary,
  connecting:   THEME.accent.amber,
  connected:    THEME.accent.green,
  demo:         THEME.accent.blue,
  disconnected: THEME.text.muted,
  transmitting: THEME.accent.red,
};

export function LCDDisplay({ channel, room, state, peerCount, txDuration }) {
  const stateColor = STATE_COLORS[state] || THEME.text.secondary;

  return (
    <div
      style={{
        background: THEME.bg.lcd,
        border: `1px solid #bbf7d0`,
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "'IBM Plex Mono', monospace",
        color: THEME.text.secondary,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 4,
        boxShadow: THEME.shadow.lcd,
      }}
    >
      {/* Centered Channel Number */}
      <div
        style={{
          color: "#14532d",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 3,
          lineHeight: 1.2,
        }}
      >
        CH {String(channel).padStart(3, "0")}
      </div>

      {/* Centered State Badge */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: stateColor,
          padding: "2px 8px",
          background: "#ffffff",
          borderRadius: 4,
          border: `1px solid ${stateColor}`,
        }}
      >
        {STATE_LABELS[state] ?? state.toUpperCase()}
      </div>

      {/* Centered Room & Peer Information */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          color: "#166534",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.5,
          marginTop: 2,
        }}
      >
        <span>{room ? room.toUpperCase().slice(0, 14) : "NO ROOM"}</span>
        <span>•</span>
        <span>
          {peerCount} PEER{peerCount !== 1 ? "S" : ""}
        </span>
      </div>

      {/* Centered TX Duration */}
      {txDuration > 0 && (
        <div
          style={{
            marginTop: 2,
            color: THEME.text.warning,
            fontSize: 10,
            letterSpacing: 1,
            fontWeight: 600,
          }}
        >
          LAST TX: {(txDuration / 1000).toFixed(1)}s
        </div>
      )}
    </div>
  );
}

// ─── SignalBars ─────────────────────────────────────────────────────────────
export function SignalBars({ strength = 0 }) {
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 14 }}
      aria-label={`Signal strength: ${strength} of 5`}
    >
      {[1, 2, 3, 4, 5].map((b) => (
        <div
          key={b}
          style={{
            width: 3,
            height: 4 + b * 2,
            background: b <= strength ? THEME.accent.green : "#cbd5e1",
            borderRadius: 1,
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ─── PeerBadge ──────────────────────────────────────────────────────────────
export function PeerBadge({ peer, isTransmitting }) {
  const connected = peer.state === "connected";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        background: isTransmitting ? "#dcfce7" : "#ffffff",
        border: `1px solid ${isTransmitting ? "#86efac" : "#e2e8f0"}`,
        borderRadius: 6,
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          flexShrink: 0,
          background: connected ? THEME.accent.green : peer.state === "connecting" ? THEME.accent.amber : THEME.accent.red,
          transition: "background 0.3s",
        }}
      />
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          color: THEME.text.primary,
          flex: 1,
        }}
      >
        {peer.id}
      </span>
      {isTransmitting && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: THEME.accent.green,
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: 1,
            animation: "tx-flash 0.5s ease infinite",
          }}
        >
          TX
        </span>
      )}
      <span
        style={{
          fontSize: 10,
          fontFamily: "'IBM Plex Mono', monospace",
          color: THEME.text.muted,
          fontWeight: 500,
          letterSpacing: 1,
        }}
      >
        {peer.state.toUpperCase()}
      </span>
    </div>
  );
}

// ─── SquelchIndicator ───────────────────────────────────────────────────────
export function SquelchIndicator({ active }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        opacity: active ? 1 : 0.35,
        transition: "opacity 0.25s",
      }}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: active ? `${5 + Math.sin(i * 1.1) * 4 + 4}px` : "4px",
            background: THEME.accent.green,
            borderRadius: 1,
            transition: "height 0.08s",
            transitionDelay: active ? `${i * 0.025}s` : "0s",
          }}
        />
      ))}
    </div>
  );
}
