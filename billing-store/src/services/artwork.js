// Built-in illustrations used when a picture file is missing or fails to load,
// so a slider / card is never left blank.
const palettes = {
  hoses: ["#11234f", "#223382", "#F98513"],
  pipes: ["#0b1a3d", "#2a3f9a", "#ffb15e"],
  brake: ["#102349", "#1d2f77", "#f26b21"],
  hero: ["#07142f", "#223382", "#F98513"],
};

export function fallbackArt(kind = "hero") {
  const key = String(kind).toLowerCase();
  const name = key.includes("brake") || key.includes("nylon") ? "brake"
    : key.includes("hose") || key.includes("hydraulic") || key.includes("steering") ? "hoses"
    : key.includes("pipe") || key.includes("teflon") || key.includes("nozzle") ? "pipes" : "hero";
  const [a, b, c] = palettes[name];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="800" height="600" fill="url(#g)"/>
<g fill="none" stroke="${c}" stroke-linecap="round">
<path d="M-20 420 C 180 420 220 220 420 220 S 640 380 820 340" stroke-width="30" opacity=".9"/>
<path d="M-20 470 C 200 470 250 280 430 280 S 650 430 820 400" stroke-width="12" opacity=".45"/>
<path d="M-20 360 C 160 360 200 160 410 160 S 630 320 820 280" stroke-width="6" opacity=".35"/>
</g>
<g fill="${c}" opacity=".95"><circle cx="420" cy="220" r="26"/><circle cx="420" cy="220" r="11" fill="${a}"/></g>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
