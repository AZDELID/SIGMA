"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { obtenerSegmentador } from "@/lib/utils/segmentador";

// Cuadrada: el carnet usa la foto recortada en círculo, así que ancho y
// alto deben ser iguales para que el círculo quede centrado y proporcionado.
const TAMANO_ESTANDAR = 320;
const PROPORCION = 1;

type Estado = "vacio" | "camara" | "procesando" | "listo" | "error";

function recortarCentrado(
  fuente: CanvasImageSource,
  anchoOrig: number,
  altoOrig: number
): HTMLCanvasElement {
  let sx = 0;
  let sy = 0;
  let sw = anchoOrig;
  let sh = altoOrig;

  if (anchoOrig / altoOrig > PROPORCION) {
    sw = altoOrig * PROPORCION;
    sx = (anchoOrig - sw) / 2;
  } else {
    sh = anchoOrig / PROPORCION;
    sy = (altoOrig - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = TAMANO_ESTANDAR;
  canvas.height = TAMANO_ESTANDAR;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(fuente, sx, sy, sw, sh, 0, 0, TAMANO_ESTANDAR, TAMANO_ESTANDAR);
  return canvas;
}

/** Deja transparente todo lo que quede fuera del círculo inscrito en el canvas. */
function recortarEnCirculo(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")!;
  const imagen = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const radio = canvas.width / 2;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > radio * radio) {
        const i = (y * canvas.width + x) * 4;
        imagen.data[i + 3] = 0;
      }
    }
  }

  ctx.putImageData(imagen, 0, 0);
}

async function quitarFondo(canvas: HTMLCanvasElement): Promise<void> {
  const segmentador = await obtenerSegmentador();
  const resultado = segmentador.segment(canvas);
  const mascara = resultado.confidenceMasks?.[0];

  if (!mascara) {
    // No se pudo generar la máscara: se deja la foto tal cual, solo recortada.
    return;
  }

  const valores = mascara.getAsFloat32Array();
  const ctx = canvas.getContext("2d")!;
  const imagen = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < valores.length; i++) {
    if (valores[i] < 0.5) {
      imagen.data[i * 4 + 3] = 0;
    }
  }

  ctx.putImageData(imagen, 0, 0);
  mascara.close();
}

export function FotoCaptura({
  fotoActualUrl,
  onFotoLista,
}: {
  fotoActualUrl?: string | null;
  onFotoLista: (url: string) => void;
}) {
  const [estado, setEstado] = useState<Estado>("vacio");
  const [previewUrl, setPreviewUrl] = useState<string | null>(fotoActualUrl ?? null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function procesarYSubir(fuente: CanvasImageSource, ancho: number, alto: number) {
    setEstado("procesando");
    setError(null);
    try {
      const canvas = recortarCentrado(fuente, ancho, alto);
      await quitarFondo(canvas);
      recortarEnCirculo(canvas);

      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("No se pudo generar la imagen"))),
          "image/png"
        )
      );

      const supabase = createClient();
      const nombreArchivo = `${crypto.randomUUID()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("fotos-alumnos")
        .upload(nombreArchivo, blob, { contentType: "image/png" });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("fotos-alumnos").getPublicUrl(nombreArchivo);
      setPreviewUrl(data.publicUrl);
      onFotoLista(data.publicUrl);
      setEstado("listo");
    } catch {
      setError("No se pudo procesar la foto. Intenta de nuevo.");
      setEstado("error");
    } finally {
      pararCamara();
    }
  }

  async function abrirCamara() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setEstado("camara");
      // El <video> se monta en este render; esperar al siguiente tick.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      });
    } catch {
      setError("No se pudo acceder a la cámara. Revisa los permisos del navegador.");
      setEstado("error");
    }
  }

  function pararCamara() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function tomarFoto() {
    const video = videoRef.current;
    if (!video) return;
    procesarYSubir(video, video.videoWidth, video.videoHeight);
  }

  function manejarArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const img = new Image();
    img.onload = () => {
      procesarYSubir(img, img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(archivo);
  }

  return (
    <div className="space-y-2">
      <label className="mb-1 block text-xs font-medium text-brand-600">Foto</label>

      <div className="flex items-start gap-4">
        <div
          className="flex items-center justify-center overflow-hidden rounded-full border border-brand-300 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,white_0%_50%)] bg-[length:16px_16px]"
          style={{ width: TAMANO_ESTANDAR / 2, height: TAMANO_ESTANDAR / 2 }}
        >
          {estado === "camara" ? (
            <video
              ref={videoRef}
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Foto del alumno"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center text-xs text-brand-400">
              Sin foto
            </span>
          )}
        </div>

        <div className="space-y-2">
          {estado === "camara" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={tomarFoto}
                className="rounded-md bg-brand-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98]"
              >
                Capturar
              </button>
              <button
                type="button"
                onClick={() => {
                  pararCamara();
                  setEstado(previewUrl ? "listo" : "vacio");
                }}
                className="rounded-md border border-brand-300 bg-white px-3 py-1.5 text-xs text-brand-700 hover:bg-brand-100"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={abrirCamara}
                disabled={estado === "procesando"}
                className="rounded-md border border-brand-300 bg-white px-3 py-1.5 text-xs text-brand-700 hover:bg-brand-100 disabled:opacity-50"
              >
                📷 Tomar foto
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={estado === "procesando"}
                className="rounded-md border border-brand-300 bg-white px-3 py-1.5 text-xs text-brand-700 hover:bg-brand-100 disabled:opacity-50"
              >
                {estado === "procesando" ? "Procesando..." : "Subir foto"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={manejarArchivo}
                className="hidden"
              />
            </div>
          )}
          <p className="text-xs text-brand-400">
            Se recorta en círculo y se le quita el fondo automáticamente,
            para el carnet.
          </p>
          {error && <p className="text-xs text-brand-red-dark">{error}</p>}
        </div>
      </div>
    </div>
  );
}
