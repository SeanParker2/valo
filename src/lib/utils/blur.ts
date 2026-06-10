const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0ece4" offset="20%" />
      <stop stop-color="#e8e2d8" offset="50%" />
      <stop stop-color="#f0ece4" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0ece4" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

export function blurDataURL(w = 700, h = 475): string {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}

export const BLUR_PLACEHOLDER = blurDataURL(700, 475);
