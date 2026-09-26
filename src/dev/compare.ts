// Development only: the side-by-side of design.md §12.1. The photograph on the left, the render
// on the right, a 50% blend below, saved to compare/<frame>.png through the dev server. Also a
// plain capture of the canvas. Never part of the build: main.ts imports this behind
// import.meta.env.DEV.

async function save(name: string, canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>((ok) => canvas.toBlob((b) => ok(b!), 'image/png'));
  await fetch(`/__compare?name=${encodeURIComponent(name)}`, { method: 'POST', body: blob });
  return `compare/${name}`;
}

/** Renders one frame with `render` and copies it out in the same task, before the page composites. */
function grab(view: HTMLCanvasElement, render: () => void): HTMLCanvasElement {
  render();
  const c = document.createElement('canvas');
  c.width = view.width;
  c.height = view.height;
  c.getContext('2d')!.drawImage(view, 0, 0);
  return c;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = src;
  });
}

export async function capture(view: HTMLCanvasElement, render: () => void, name: string) {
  return save(name, grab(view, render));
}

/** `width` of each image in the sheet; the default is the render's own size. */
export async function sheet(view: HTMLCanvasElement, render: () => void, id: string, width = 0, suffix = '') {
  const shot = grab(view, render);
  // Prefer the full-resolution original; fall back to the committed 800 px copy.
  const photo = (await loadImage(`/Photos/DSCF${id}.JPG`)) ?? (await loadImage(`/mockup/set/${id}.jpg`));
  if (!photo) throw new Error(`no photograph for ${id}`);
  const W = width || shot.width, H = Math.round((W * shot.height) / shot.width);
  const out = document.createElement('canvas');
  out.width = W * 2;
  out.height = H * 2;
  const g = out.getContext('2d')!;
  g.fillStyle = '#111';
  g.fillRect(0, 0, out.width, out.height);
  g.imageSmoothingQuality = 'high';
  g.drawImage(photo, 0, 0, W, H);
  g.drawImage(shot, W, 0, W, H);
  g.drawImage(photo, W / 2, H, W, H);
  g.globalAlpha = 0.5;
  g.drawImage(shot, W / 2, H, W, H);
  g.globalAlpha = 1;
  g.fillStyle = 'rgba(255,255,255,0.8)';
  g.font = `${Math.round(H / 40)}px Helvetica, sans-serif`;
  g.fillText(`${id} photograph`, 12, H / 30 + 6);
  g.fillText('render', W + 12, H / 30 + 6);
  g.fillText('50% blend', W / 2 + 12, H + H / 30 + 6);
  return save(`${id}${suffix}.png`, out);
}

/**
 * For tools/lut-fit.ts: the render, the image as it enters the LUT, the sky's mask and the
 * photograph at the render's size, saved to compare/fit/, with what the grade does after the LUT.
 */
export async function fitCapture(view: HTMLCanvasElement, render: () => void, setFit: (mode: number) => void, id: string, meta: Record<string, unknown>) {
  const photo = (await loadImage(`/Photos/DSCF${id}.JPG`)) ?? (await loadImage(`/mockup/set/${id}.jpg`));
  if (!photo) throw new Error(`no photograph for ${id}`);
  const shots: [string, HTMLCanvasElement][] = [['render', grab(view, render)]];
  for (const [mode, name] of [[1, 'pre'], [2, 'sky']] as const) {
    setFit(mode);
    shots.push([name, grab(view, render)]);
  }
  setFit(0);
  const p = document.createElement('canvas');
  p.width = view.width;
  p.height = view.height;
  const g = p.getContext('2d')!;
  g.imageSmoothingQuality = 'high';
  g.drawImage(photo, 0, 0, p.width, p.height);
  shots.push(['photo', p]);
  for (const [name, c] of shots) await save(`fit/${id}-${name}.png`, c);
  await fetch(`/__compare?name=${encodeURIComponent(`fit/${id}.json`)}`, { method: 'POST', body: JSON.stringify(meta) });
  return `compare/fit/${id}-*.png`;
}
