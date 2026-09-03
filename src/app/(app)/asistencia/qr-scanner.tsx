"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export function QrScanner({
  onDetected,
  onClose,
}: {
  onDetected: (codigo: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let frameId: number | null = null;
    let activo = true;

    async function iniciar() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      } catch {
        setError(
          "No se pudo acceder a la cámara. Revisa los permisos del navegador."
        );
        return;
      }
      if (!activo || !videoRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      escanear();
    }

    function escanear() {
      if (!activo || !videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const resultado = jsQR(imageData.data, imageData.width, imageData.height);
          if (resultado?.data) {
            activo = false;
            onDetected(resultado.data);
            return;
          }
        }
      }
      frameId = requestAnimationFrame(escanear);
    }

    iniciar();

    return () => {
      activo = false;
      if (frameId !== null) cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onDetected]);

  return (
    <div className="space-y-2 rounded-lg border border-brand-200 bg-white shadow-sm shadow-brand-900/5 p-4">
      {error ? (
        <p className="rounded-md bg-brand-red-50 px-3 py-2 text-sm text-brand-red-dark">
          {error}
        </p>
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full max-w-sm rounded-md border border-brand-300 bg-black"
        />
      )}
      <canvas ref={canvasRef} className="hidden" />
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-brand-600 hover:text-brand-900"
      >
        Cancelar
      </button>
    </div>
  );
}
