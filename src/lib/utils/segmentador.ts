// Quita el fondo de una foto usando MediaPipe Tasks Vision (Apache-2.0),
// modelo "selfie segmenter" oficial de Google. Corre en el navegador; el
// WASM y el modelo se descargan de un CDN la primera vez que se usa (no
// van en el bundle de la app).
import type { ImageSegmenter } from "@mediapipe/tasks-vision";

// Debe coincidir con la versión instalada de "@mediapipe/tasks-vision"
// en package.json — el WASM y los bindings JS deben ser la misma versión.
const WASM_BASE_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODELO_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";

let segmentadorPromise: Promise<ImageSegmenter> | null = null;

export function obtenerSegmentador(): Promise<ImageSegmenter> {
  if (!segmentadorPromise) {
    segmentadorPromise = (async () => {
      const { FilesetResolver, ImageSegmenter } = await import(
        "@mediapipe/tasks-vision"
      );
      const wasmFileset = await FilesetResolver.forVisionTasks(WASM_BASE_PATH);
      return ImageSegmenter.createFromOptions(wasmFileset, {
        baseOptions: { modelAssetPath: MODELO_URL, delegate: "GPU" },
        runningMode: "IMAGE",
        outputConfidenceMasks: true,
        outputCategoryMask: false,
      });
    })();
  }
  return segmentadorPromise;
}
