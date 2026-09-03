import "server-only";
import QRCode from "qrcode";

/** Genera un QR (data URL PNG) que codifica el texto dado. Solo servidor. */
export async function generarQrDataUrl(texto: string): Promise<string> {
  return QRCode.toDataURL(texto, {
    margin: 1,
    width: 320,
    errorCorrectionLevel: "M",
  });
}
