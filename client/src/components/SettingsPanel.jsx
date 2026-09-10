import { useState, useCallback } from "react";
import { useKeyCapture } from "../hooks/useKeyBind.js";
import { THEME } from "../theme.js";

const inputStyle = {
  background: "#f8fafc",
  border: `1px solid ${THEME.border.default}`,
  borderRadius: 6,
  color: THEME.text.primary,
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 12,
  fontWeight: 600,
  padding: "8px 10px",
  outline: "none",
  width: "100%",
};

const labelStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  fontWeight: 700,
  color: THEME.text.secondary,
  letterSpacing: 1,
  display: "block",
  marginBottom: 5,
};

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export function SettingsPanel({ settings, onChange, devices, onClose }) {
  const [capturingKey, setCapturingKey] = useState(false);

  const { start: startCapture } = useKeyCapture(useCallback((code) => {
    setCapturingKey(false);
    onChange({ ...settings, pttKey: code });
  }, [settings, onChange]));

  const handleCaptureKey = () => {
    setCapturingKey(true);
    startCapture();
  };

  const set = (key) => (e) => {
    const val = e.target.type === "range"
      ? parseFloat(e.target.value)
      : e.target.type === "number"
        ? parseInt(e.target.value, 10)
        : e.target.value;
    onChange({ ...settings, [key]: val });
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "rgba(255, 255, 255, 0.98)",
      backdropFilter: "blur(12px)",
      borderRadius: 14,
      padding: 22,
      zIndex: 20,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, color: THEME.text.primary, letterSpacing: 2 }}>
          CONFIGURATION
        </span>
        <button
          onClick={onClose}
          style={{
            background: THEME.bg.surfaceSubtle, border: `1px solid ${THEME.border.default}`,
            color: THEME.text.primary, cursor: "pointer", borderRadius: 4,
            padding: "4px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
          }}
        >
          ESC / CLOSE
        </button>
      </div>

      {/* Network */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, color: THEME.text.dim, letterSpacing: 2, marginBottom: 10 }}>
          ── NETWORK ──────────────────────────────
        </div>
        <Field label="SIGNALING SERVER">
          <input
            type="text"
            style={inputStyle}
            value={settings.signalingUrl || ""}
            onChange={set("signalingUrl")}
            placeholder="wss://signal.your-domain.com"
            spellCheck={false}
          />
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: THEME.text.dim, marginTop: 4 }}>
            Leave blank to use demo mode (local PTT only)
          </div>
        </Field>
        <Field label="ROOM / CHANNEL NAME">
          <input
            type="text"
            style={inputStyle}
            value={settings.room || ""}
            onChange={set("room")}
            placeholder="alpha-team"
            spellCheck={false}
          />
        </Field>
      </div>

      {/* Audio */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, color: THEME.text.dim, letterSpacing: 2, marginBottom: 10 }}>
          ── AUDIO ────────────────────────────────
        </div>
        <Field label="INPUT DEVICE">
          <select style={inputStyle} value={settings.inputDevice || ""} onChange={set("inputDevice")}>
            <option value="">Default Microphone</option>
            {(devices.inputs || []).map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Microphone (${d.deviceId.slice(0, 8)})`}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`INPUT GAIN: ${Math.round(settings.inputGain * 100)}%`}>
          <input type="range" min="0" max="3" step="0.05" value={settings.inputGain} onChange={set("inputGain")} style={{ accentColor: THEME.accent.green }} />
        </Field>
        <Field label={`OUTPUT GAIN: ${Math.round(settings.outputGain * 100)}%`}>
          <input type="range" min="0" max="2" step="0.05" value={settings.outputGain} onChange={set("outputGain")} style={{ accentColor: THEME.accent.green }} />
        </Field>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, color: THEME.text.dim, letterSpacing: 2, marginBottom: 10 }}>
          ── CONTROLS ─────────────────────────────
        </div>
        <Field label="PTT HOTKEY">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              style={{ ...inputStyle, flex: 1 }}
              value={capturingKey ? "PRESS ANY KEY..." : settings.pttKey || "Space"}
              readOnly
            />
            <button
              onClick={handleCaptureKey}
              style={{
                background: capturingKey ? THEME.bg.buttonReady : THEME.bg.surfaceSubtle,
                border: `1px solid ${capturingKey ? THEME.border.bright : THEME.border.default}`,
                color: capturingKey ? THEME.text.secondary : THEME.text.primary,
                cursor: "pointer", borderRadius: 4,
                padding: "7px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {capturingKey ? "LISTENING..." : "REBIND"}
            </button>
          </div>
        </Field>
        <Field label={`CHANNEL: ${settings.channel || 1}`}>
          <input type="range" min="1" max="99" step="1" value={settings.channel || 1} onChange={set("channel")} style={{ accentColor: THEME.accent.green }} />
        </Field>
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: "auto",
          background: THEME.bg.buttonReady,
          border: `1px solid ${THEME.border.bright}`,
          color: THEME.text.secondary,
          cursor: "pointer",
          borderRadius: 6,
          padding: "10px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        SAVE &amp; CLOSE
      </button>
    </div>
  );
}
