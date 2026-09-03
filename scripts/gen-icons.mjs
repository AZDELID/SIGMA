import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public", "logo.png");
const outDir = path.join(root, "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

async function iconOnCanvas({ size, logoRatio, background, outFile }) {
  const logoSize = Math.round(size * logoRatio);
  const logo = await sharp(src)
    .resize(logoSize, logoSize, { fit: "contain", background })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(path.join(outDir, outFile));

  console.log("wrote", outFile);
}

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const white = { r: 255, g: 255, b: 255, alpha: 1 };

await iconOnCanvas({ size: 192, logoRatio: 0.92, background: transparent, outFile: "icon-192.png" });
await iconOnCanvas({ size: 512, logoRatio: 0.92, background: transparent, outFile: "icon-512.png" });
// Maskable: OS crops to a circle within the safe zone (inner ~80%). Keep the
// gear well inside that so teeth don't get clipped.
await iconOnCanvas({ size: 512, logoRatio: 0.7, background: white, outFile: "icon-maskable-512.png" });
// Apple ignores alpha and renders it as black, so this needs an opaque bg.
await iconOnCanvas({ size: 180, logoRatio: 0.82, background: white, outFile: "apple-touch-icon.png" });

console.log("done");
