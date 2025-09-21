export type Meme = {
  id: string;
  src: string;
  author?: string;
  caption?: string;
  createdAt: number;
};

export function generateMemeId(prefix = "meme"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Very simple caption renderer — replace with canvas/GL drawing in the editor */
export function applyCaption(canvas: HTMLCanvasElement | null, text: string) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;

  // Clear + background placeholder
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  // Caption
  ctx.fillStyle = "#000";
  ctx.font = `${Math.max(16, Math.floor(width * 0.06))}px Impact, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(text ?? "", width / 2, height - 24, width - 32);
}
