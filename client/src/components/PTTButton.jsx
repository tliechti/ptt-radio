// PTTButton — the large circular push-to-talk trigger, optimized for high sunlight readability
import { THEME } from "../theme.js";

function formatKeyLabel(key) {
  if (!key) return "SPACE";
  const k = String(key).trim();
  if (k.toLowerCase() === "space" || k === " ") return "SPACE";
  if (k.startsWith("Key") && k.length === 4) return k.slice(3).toUpperCase();
  if (k.startsWith("Digit") && k.length === 6) return k.slice(5);
  if (k.toLowerCase().includes("control") || k.toLowerCase().includes("ctrl")) return "CTRL";
  if (k.toLowerCase().includes("shift")) return "SHIFT";
  if (k.toLowerCase().includes("alt")) return "ALT";
  return k.toUpperCase();
}

export function PTTButton({ transmitting, enabled, pttKey, onDown, onUp }) {
  const micColor = transmitting
    ? "#ffffff"
    : enabled
    ? THEME.text.secondary
    : THEME.text.faint;

  const buttonBg = transmitting
    ? "radial-gradient(circle, #16a34a 0%, #15803d 70%, #14532d 100%)"
    : enabled
    ? "radial-gradient(circle, #ffffff 0%, #f0fdf4 65%, #dcfce7 100%)"
    : `radial-gradient(circle, ${THEME.bg.surfaceSubtle} 0%, ${THEME.bg.sunken} 100%)`;

  const borderColor = transmitting
    ? THEME.border.active
    : enabled
    ? THEME.border.bright
    : THEME.border.disabled;

  const labelColor = transmitting
    ? "#ffffff"
    : enabled
    ? THEME.text.secondary
    : THEME.text.faint;

  const helperColor = transmitting
    ? THEME.text.secondary
    : enabled
    ? THEME.text.secondary
    : THEME.text.faint;

  const keyLabel = formatKeyLabel(pttKey);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <button
        onMouseDown={onDown}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={(e) => { e.preventDefault(); onDown(); }}
        onTouchEnd={onUp}
        disabled={!enabled}
        aria-pressed={transmitting}
        aria-label={transmitting ? "Transmitting — release to stop" : "Push to talk — hold to transmit"}
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: buttonBg,
          border: `3px solid ${borderColor}`,
          cursor: enabled ? "pointer" : "not-allowed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: enabled ? 1 : 0.75,
          transition: "border-color 0.15s, background 0.15s, opacity 0.2s, transform 0.08s",
          transform: transmitting ? "scale(0.98)" : "scale(1)",
          animation: transmitting ? "pulse-ring 1s ease-out infinite" : "none",
          boxShadow: transmitting
            ? "0 0 24px rgba(22,163,74,0.45), inset 0 0 14px rgba(255,255,255,0.3)"
            : enabled
            ? "0 4px 16px rgba(22,163,74,0.18), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(0,0,0,0.06)"
            : "inset 0 1px 4px rgba(0,0,0,0.05)",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Microphone icon with high-contrast stroke for bright glare */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="10" y="4" width="8" height="14" rx="4" fill={micColor} />
          <path
            d="M6 16c0 4.418 3.582 8 8 8s8-3.582 8-8"
            stroke={micColor}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <line x1="14" y1="24" x2="14" y2="27" stroke={micColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="27" x2="18" y2="27" stroke={micColor} strokeWidth="2" strokeLinecap="round" />
        </svg>

        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            color: labelColor,
            animation: transmitting ? "tx-flash 0.5s ease infinite" : "none",
          }}
        >
          {transmitting ? "TRANSMIT" : "PUSH"}
        </span>
      </button>

      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          color: helperColor,
          letterSpacing: 1.5,
          textAlign: "center",
          transition: "color 0.2s",
        }}
      >
        HOLD {keyLabel} TO TALK
      </div>
    </div>
  );
}
