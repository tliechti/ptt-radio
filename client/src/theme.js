// Centralized high-contrast sunlight theme tokens and color palette for PTT-Radio

export const THEME = {
  bg: {
    app: "linear-gradient(160deg, #f1f5f9 0%, #e2e8f0 100%)",
    radio: "#ffffff",
    header: "#f8fafc",
    surface: "#f8fafc",
    surfaceSubtle: "#f1f5f9",
    lcd: "#eef8f1",
    sunken: "#e2e8f0",
    overlay: "rgba(255, 255, 255, 0.96)",
    buttonReady: "#dcfce7",
    buttonConnected: "#dcfce7",
    buttonIdle: "#f1f5f9",
    input: "#ffffff",
  },
  border: {
    default: "#cbd5e1",
    subtle: "#e2e8f0",
    bright: "#16a34a",
    divider: "#e2e8f0",
    active: "#15803d",
    disabled: "#cbd5e1",
    input: "#94a3b8",
  },
  text: {
    primary: "#0f172a",
    secondary: "#166534",
    muted: "#475569",
    dim: "#64748b",
    faint: "#94a3b8",
    warning: "#b45309",
    danger: "#dc2626",
    info: "#1d4ed8",
  },
  accent: {
    green: "#16a34a",
    greenLight: "#22c55e",
    greenBright: "#15803d",
    amber: "#d97706",
    red: "#dc2626",
    blue: "#2563eb",
  },
  shadow: {
    radio: "0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0, 0, 0, 0.08)",
    lcd: "inset 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  },
};
