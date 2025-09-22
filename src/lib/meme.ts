// src/lib/meme.ts
// Lightweight canvas helper used by the legacy MemeEditor component.

type CanvasLike = HTMLCanvasElement | null | undefined;

/**
 * Draws a caption near the bottom edge of the canvas.
 * The implementation is intentionally defensive so the helper can operate
 * against canvases that may or may not be initialised yet.
 */
export function applyCaption(canvas: CanvasLike, caption: string): void {
  if (!canvas || typeof caption !== "string") return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const { width, height } = canvas;
  const padding = Math.max(12, Math.round(width * 0.04));
  const boxHeight = Math.max(48, Math.round(height * 0.18));

  context.save();
  context.fillStyle = "rgba(0, 0, 0, 0.65)";
  context.fillRect(0, height - boxHeight, width, boxHeight);

  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fontSize = Math.max(16, Math.round(width / 18));
  context.font = `700 ${fontSize}px sans-serif`;

  const maxWidth = width - padding * 2;
  context.fillText(caption, width / 2, height - boxHeight / 2, maxWidth);
  context.restore();
}

export default applyCaption;
