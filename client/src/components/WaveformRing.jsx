import { useEffect, useRef } from "react";
import { THEME } from "../theme.js";

// WaveformRing — oscilloscope-style radial waveform canvas
export function WaveformRing({ analyserRef, transmitting, size = 88 }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const R   = size / 2;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, size, size);

      const analyser = analyserRef.current;

      if (!analyser || !transmitting) {
        // Idle ring
        ctx.beginPath();
        ctx.arc(R, R, R - 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(22, 163, 74, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return;
      }

      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);

      const points = 180;
      const step   = Math.floor(buf.length / points);

      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const v     = buf[i * step] || 0;
        const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
        const r     = R - 8 + v * 24;
        const x     = R + r * Math.cos(angle);
        const y     = R + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.strokeStyle = THEME.accent.green;
      ctx.lineWidth   = 2;
      ctx.shadowColor = THEME.accent.green;
      ctx.shadowBlur  = 4;
      ctx.stroke();

      ctx.shadowBlur = 0;
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserRef, transmitting, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
