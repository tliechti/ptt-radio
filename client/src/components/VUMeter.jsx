import { THEME } from "../theme.js";

// VUMeter — 24-segment LED-style level display, optimized for sunlight legibility
export function VUMeter({ db, transmitting }) {
  const clamped = Math.max(-60, Math.min(0, db));
  const pct     = (clamped + 60) / 60;
  const N       = 24;
  const lit     = Math.round(pct * N);

  return (
    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 28 }}>
      {Array.from({ length: N }).map((_, i) => {
        const active = i < lit;
        const zone   = i >= 21 ? "red" : i >= 17 ? "amber" : "green";
        const palette = {
          green: { on: THEME.accent.green, off: "#e2e8f0" },
          amber: { on: THEME.accent.amber, off: "#fef3c7" },
          red:   { on: THEME.accent.red,   off: "#fee2e2" },
        };
        const color = palette[zone][active ? "on" : "off"];
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: active && transmitting ? `${8 + (i / N) * 12}px` : "7px",
              background: color,
              borderRadius: 1,
              transition: "height 0.04s, background 0.04s",
              boxShadow: active && transmitting ? `0 0 3px ${color}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
