// EventLog — scrollable terminal-style event log
import { THEME } from "../theme.js";

export function EventLog({ entries }) {
  return (
    <div
      role="log"
      aria-label="System event log"
      style={{
        background: THEME.bg.surface,
        border: `1px solid ${THEME.border.subtle}`,
        borderRadius: 8,
        padding: "9px 12px",
        maxHeight: 95,
        overflowY: "auto",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        fontWeight: 600,
        lineHeight: 1.65,
      }}
    >
      {entries.length === 0 ? (
        <span style={{ color: THEME.text.dim }}>▶ PTT-RADIO READY</span>
      ) : (
        entries.slice(0, 10).map((entry, i) => (
          <div key={i} style={{ color: i === 0 ? THEME.text.secondary : THEME.text.muted }}>
            <span style={{ color: THEME.text.dim, fontWeight: 500 }}>{entry.time} </span>
            <span style={{ fontWeight: 700 }}>{entry.type.toUpperCase()}</span>
            {entry.payload && Object.keys(entry.payload).length > 0 && (
              <span style={{ color: THEME.text.primary, fontWeight: 500 }}>
                {" "}
                {Object.entries(entry.payload)
                  .map(([k, v]) => `${k}:${typeof v === "object" ? JSON.stringify(v) : v}`)
                  .join(" ")}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
