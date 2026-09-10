import { useEffect, useRef, useCallback } from "react";

/**
 * matchesKey — checks if a KeyboardEvent or custom key matches the configured target.
 *
 * @param {KeyboardEvent} e
 * @param {string} target - configured code, e.g. "Space", "KeyT", "T", "32"
 * @returns {boolean}
 */
export function matchesKey(e, target) {
  if (!target || !e) return false;
  const t = String(target).trim().toLowerCase();

  // 1. Direct match on e.code (e.g. "Space", "KeyT", "Digit1")
  const eCode = (e.code || "").toLowerCase();
  if (eCode && eCode === t) return true;

  // 2. Direct match on e.key (e.g. " ", "t", "T", "Enter", "Control")
  const eKey = (e.key || "").toLowerCase();
  if (eKey && eKey === t) return true;

  // 3. Match stripped or added prefixes (e.g. target "T" matching e.code "KeyT", or target "KeyT" matching e.key "t")
  if (eCode && (eCode === `key${t}` || `key${eCode}` === t)) return true;
  if (eCode && (eCode === `digit${t}` || `digit${eCode}` === t)) return true;
  if (eCode && (eCode === `numpad${t}` || `numpad${eCode}` === t)) return true;

  // 4. Space aliases
  const isSpaceTarget = t === "space" || t === " " || t === "spacebar" || t === "32" || t === "62";
  if (isSpaceTarget) {
    if (eCode === "space" || eKey === " " || eKey === "space" || eKey === "spacebar" || e.keyCode === 32 || e.which === 32) {
      return true;
    }
  }

  // 5. Modifier aliases
  if ((t === "control" || t === "ctrl") && (eCode.startsWith("control") || eKey === "control")) return true;
  if (t === "alt" && (eCode.startsWith("alt") || eKey === "alt")) return true;
  if (t === "shift" && (eCode.startsWith("shift") || eKey === "shift")) return true;

  // 6. Match numeric keyCode / which
  const numTarget = parseInt(t, 10);
  if (!isNaN(numTarget) && (e.keyCode === numTarget || e.which === numTarget)) {
    return true;
  }

  return false;
}

/**
 * useKeyBind — attach keydown/keyup and Android native key handlers to a configured key.
 *
 * @param {string}   code     - KeyboardEvent.code or key name, e.g. "Space", "KeyV", "T"
 * @param {Function} onDown   - called on first keydown (not repeat)
 * @param {Function} onUp     - called on keyup
 * @param {boolean}  enabled  - when false the listeners are a no-op
 */
export function useKeyBind(code, onDown, onUp, enabled = true) {
  const downRef = useRef(onDown);
  const upRef   = useRef(onUp);
  downRef.current = onDown;
  upRef.current   = onUp;

  useEffect(() => {
    if (!code || !enabled) return;

    let isDown = false;

    const handleDown = (e) => {
      // Ignore repeat events and ignore when user is actively typing in inputs
      if (e.repeat) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName)) return;

      if (matchesKey(e, code)) {
        e.preventDefault?.();
        if (!isDown) {
          isDown = true;
          downRef.current(e);
        }
      }
    };

    const handleUp = (e) => {
      if (matchesKey(e, code)) {
        e.preventDefault?.();
        if (isDown) {
          isDown = false;
          upRef.current(e);
        }
      }
    };

    // Android native custom event bridge (action 0 = DOWN, action 1 = UP)
    const handleAndroidKey = (e) => {
      const detail = e.detail;
      if (!detail) return;

      const isSpace = String(code).trim().toLowerCase() === "space" || String(code).trim() === "32";
      const match =
        (isSpace && (detail.keyCode === 62 || detail.keyCode === 32 || detail.scanCode === 57 || detail.scanCode === 115)) ||
        detail.keyCode === parseInt(code, 10) ||
        detail.scanCode === parseInt(code, 10);

      if (match) {
        if (detail.action === 0 && !isDown) {
          isDown = true;
          downRef.current(e);
        } else if (detail.action === 1 && isDown) {
          isDown = false;
          upRef.current(e);
        }
      }
    };

    // Safety: release PTT if window loses focus
    const handleBlur = () => {
      if (isDown) {
        isDown = false;
        upRef.current();
      }
    };

    window.addEventListener("keydown", handleDown, true);
    window.addEventListener("keyup", handleUp, true);
    window.addEventListener("androidKeyEvent", handleAndroidKey);
    window.addEventListener("blur", handleBlur);

    return () => {
      if (isDown) {
        upRef.current();
      }
      window.removeEventListener("keydown", handleDown, true);
      window.removeEventListener("keyup", handleUp, true);
      window.removeEventListener("androidKeyEvent", handleAndroidKey);
      window.removeEventListener("blur", handleBlur);
    };
  }, [code, enabled]);
}

/**
 * useKeyCapture — one-shot key capture for rebinding hotkeys in settings.
 *
 * @param {Function} onCapture - called with the normalized key identifier
 */
export function useKeyCapture(onCapture) {
  const capturing = useRef(false);

  const start = useCallback(() => {
    if (capturing.current) return;
    capturing.current = true;

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      capturing.current = false;
      window.removeEventListener("keydown", handler, { capture: true });

      // Prefer e.code if present (e.g. "Space", "KeyT"), else normalize e.key / keyCode
      let keyVal = e.code;
      if (!keyVal || keyVal === "Unidentified") {
        if (e.keyCode === 32 || e.key === " ") keyVal = "Space";
        else if (e.key && e.key.length === 1) keyVal = `Key${e.key.toUpperCase()}`;
        else keyVal = e.key || String(e.keyCode);
      }

      onCapture(keyVal);
    };

    window.addEventListener("keydown", handler, { capture: true });
  }, [onCapture]);

  return { start, isCapturing: () => capturing.current };
}
