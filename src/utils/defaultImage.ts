/**
 * Generates an ultra-crisp, high-resolution rendering matching the user's uploaded image:
 * Middle-aged man with glasses, motion light trails, "IT ENDS AT 30",
 * and Age 22 (Green), Age 30 (Amber), Age 40+! (Red) plasma nodes.
 */
export function generateDefaultImage(): string {
  // We generate a high-DPI SVG that converts into a canvas/dataURL
  const width = 1920;
  const height = 1080;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#061219" />
      <stop offset="35%" stop-color="#0a1e27" />
      <stop offset="70%" stop-color="#071720" />
      <stop offset="100%" stop-color="#02090e" />
    </linearGradient>

    <!-- Teal Light Trails -->
    <linearGradient id="trail1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f2ff" stop-opacity="0" />
      <stop offset="40%" stop-color="#00e1d9" stop-opacity="0.9" />
      <stop offset="80%" stop-color="#00a3ff" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#00f2ff" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="trail2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00c8ff" stop-opacity="0" />
      <stop offset="50%" stop-color="#ffb703" stop-opacity="0.85" />
      <stop offset="90%" stop-color="#fb8500" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#ffb703" stop-opacity="0" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowYellow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowRed" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="32" result="blur2" />
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="blur1" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="displaced" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="textShadow">
      <feDropShadow dx="3" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Cyan/Blue Highway Motion Streaks -->
  <g opacity="0.85">
    <!-- Light streaks across horizon -->
    <path d="M -100,520 Q 500,490 2000,540" stroke="url(#trail1)" stroke-width="28" fill="none" opacity="0.4" />
    <path d="M -50,560 Q 600,550 2000,570" stroke="url(#trail1)" stroke-width="16" fill="none" opacity="0.8" />
    <path d="M 100,580 Q 750,580 2000,590" stroke="url(#trail2)" stroke-width="12" fill="none" opacity="0.7" />
    <path d="M 300,610 Q 900,600 2000,615" stroke="url(#trail2)" stroke-width="18" fill="none" opacity="0.9" />
    <path d="M -100,650 Q 800,640 2000,660" stroke="url(#trail1)" stroke-width="32" fill="none" opacity="0.3" />
    <path d="M -100,720 Q 900,710 2000,730" stroke="url(#trail1)" stroke-width="45" fill="none" opacity="0.2" />

    <!-- Ambient Bokeh Spots -->
    <circle cx="950" cy="540" r="12" fill="#00ffff" opacity="0.4" filter="blur(6px)" />
    <circle cx="1200" cy="570" r="18" fill="#ffb703" opacity="0.35" filter="blur(8px)" />
    <circle cx="1500" cy="520" r="8" fill="#00e5ff" opacity="0.5" filter="blur(4px)" />
    <circle cx="350" cy="460" r="14" fill="#00e1d9" opacity="0.3" filter="blur(6px)" />
  </g>

  <!-- Geometric Network Constellation (Cybernetic Web) -->
  <g stroke="#00e5ff" stroke-width="1.5" opacity="0.65" fill="none">
    <circle cx="110" cy="540" r="3" fill="#00f2ff" />
    <circle cx="160" cy="580" r="3" fill="#00f2ff" />
    <circle cx="80" cy="620" r="3" fill="#00f2ff" />
    <circle cx="140" cy="650" r="3" fill="#00f2ff" />
    <line x1="110" y1="540" x2="160" y2="580" />
    <line x1="160" y1="580" x2="80" y2="620" />
    <line x1="80" y1="620" x2="140" y2="650" />
    <line x1="110" y1="540" x2="80" y2="620" />

    <circle cx="840" cy="270" r="3" fill="#00f2ff" />
    <circle cx="910" cy="300" r="3" fill="#00f2ff" />
    <circle cx="870" cy="350" r="3" fill="#00f2ff" />
    <line x1="840" y1="270" x2="910" y2="300" />
    <line x1="910" y1="300" x2="870" y2="350" />
    <line x1="840" y1="270" x2="870" y2="350" />
  </g>

  <!-- High-Detail Portrait of Mature Man with Eyeglasses (Left Composition) -->
  <g transform="translate(0, 0)">
    <!-- Body / Shoulders (Dark Jacket & Shirt) -->
    <path d="M -50,1100 L -50,820 Q 240,780 480,820 L 760,860 L 820,1100 Z" fill="#11161d" />
    <path d="M 120,830 Q 380,800 620,840 L 580,1100 L 160,1100 Z" fill="#182029" stroke="#253242" stroke-width="1.5" />
    <!-- Shirt Collar -->
    <path d="M 330,860 L 380,950 L 430,860 Z" fill="#0b0f14" />
    <path d="M 310,830 L 380,930 L 350,970 L 290,850 Z" fill="#141a22" />
    <path d="M 450,830 L 380,930 L 410,970 L 470,850 Z" fill="#141a22" />

    <!-- Neck & Throat -->
    <path d="M 300,700 Q 380,720 460,700 L 450,850 Q 380,880 310,850 Z" fill="#b9886e" />
    <!-- Neck shadow and tendons -->
    <path d="M 340,730 Q 380,830 375,860" stroke="#8d5f49" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6" />
    <path d="M 420,730 Q 395,830 395,860" stroke="#8d5f49" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6" />

    <!-- Head & Face Structure -->
    <!-- Jawline & Ears -->
    <path d="M 230,420 Q 180,480 220,560 Q 260,700 380,720 Q 500,700 540,560 Q 580,480 530,420 Q 510,250 380,240 Q 250,250 230,420 Z" fill="#cfa286" />
    <!-- Face Contour Shadowing -->
    <path d="M 220,440 Q 200,530 250,650 Q 310,710 380,715 L 380,720 Q 260,700 220,560 Z" fill="#a46d53" opacity="0.45" />
    <path d="M 540,440 Q 560,530 510,650 Q 450,710 380,715 L 380,720 Q 500,700 540,560 Z" fill="#a46d53" opacity="0.35" />

    <!-- Ears -->
    <path d="M 215,440 Q 190,480 205,530 Q 220,560 235,530 Z" fill="#bd896e" />
    <path d="M 545,440 Q 570,480 555,530 Q 540,560 525,530 Z" fill="#bd896e" />

    <!-- Silver / Grey Hair (Full Realistic Volume) -->
    <path d="M 220,380 Q 200,280 270,180 Q 380,120 490,180 Q 560,280 540,380 Q 500,270 380,260 Q 260,270 220,380 Z" fill="#69737d" />
    <path d="M 235,350 Q 230,220 320,160 Q 440,140 520,200 Q 540,300 530,360 Q 490,240 380,240 Q 270,240 235,350 Z" fill="#a5afb8" />
    <path d="M 260,260 Q 350,170 450,190 Q 500,240 510,310 Q 470,220 380,220 Q 290,220 260,260 Z" fill="#dce3e8" opacity="0.75" />
    <!-- Fine hair highlights -->
    <path d="M 280,200 Q 380,150 480,210" stroke="#f0f4f8" stroke-width="3" fill="none" opacity="0.6" />
    <path d="M 300,180 Q 390,140 450,190" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.5" />

    <!-- Forehead Wrinkles / Texture (Adds realism) -->
    <path d="M 290,320 Q 380,310 470,320" stroke="#9a674e" stroke-width="2" fill="none" opacity="0.5" />
    <path d="M 305,340 Q 380,332 455,340" stroke="#9a674e" stroke-width="2" fill="none" opacity="0.5" />
    <path d="M 320,360 Q 380,355 440,360" stroke="#9a674e" stroke-width="1.5" fill="none" opacity="0.4" />

    <!-- Eyebrows (Grey/Dark mix) -->
    <path d="M 270,395 Q 320,380 355,400" stroke="#4a535c" stroke-width="9" stroke-linecap="round" fill="none" />
    <path d="M 275,394 Q 320,382 355,399" stroke="#88929c" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />
    <path d="M 490,395 Q 440,380 405,400" stroke="#4a535c" stroke-width="9" stroke-linecap="round" fill="none" />
    <path d="M 485,394 Q 440,382 405,399" stroke="#88929c" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />

    <!-- Eyes (Direct, Piercing Gaze with Highlights) -->
    <!-- Left Eye -->
    <ellipse cx="315" cy="435" rx="28" ry="16" fill="#ffffff" />
    <ellipse cx="315" cy="435" rx="14" ry="14" fill="#32506d" />
    <circle cx="315" cy="435" r="7" fill="#0b1117" />
    <circle cx="312" cy="431" r="3.5" fill="#ffffff" />
    <path d="M 285,432 Q 315,418 345,432" stroke="#40281b" stroke-width="4" fill="none" />
    <path d="M 288,438 Q 315,450 342,438" stroke="#794f38" stroke-width="2.5" fill="none" />

    <!-- Right Eye -->
    <ellipse cx="445" cy="435" rx="28" ry="16" fill="#ffffff" />
    <ellipse cx="445" cy="435" rx="14" ry="14" fill="#32506d" />
    <circle cx="445" cy="435" r="7" fill="#0b1117" />
    <circle cx="442" cy="431" r="3.5" fill="#ffffff" />
    <path d="M 415,432 Q 445,418 475,432" stroke="#40281b" stroke-width="4" fill="none" />
    <path d="M 418,438 Q 445,450 472,438" stroke="#794f38" stroke-width="2.5" fill="none" />

    <!-- Nose (Proportioned, Realistic Shading) -->
    <path d="M 370,410 L 365,510 Q 350,540 380,542 Q 410,540 395,510 L 390,410" fill="#ba866b" opacity="0.5" />
    <!-- Nose base & nostrils -->
    <path d="M 355,530 Q 380,545 405,530" stroke="#7a4b33" stroke-width="3.5" fill="none" />
    <ellipse cx="363" cy="532" rx="4" ry="2.5" fill="#382115" />
    <ellipse cx="397" cy="532" rx="4" ry="2.5" fill="#382115" />

    <!-- Mouth & Firm Serious Expression -->
    <path d="M 330,605 Q 380,600 430,605" stroke="#4a2a1a" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <path d="M 345,595 Q 380,590 415,595" fill="#af6c55" opacity="0.7" />
    <path d="M 345,612 Q 380,622 415,612" fill="#9e5d47" opacity="0.8" />
    <!-- Nasolabial folds / smile lines -->
    <path d="M 340,515 Q 320,570 330,625" stroke="#945e45" stroke-width="2.5" fill="none" opacity="0.6" />
    <path d="M 420,515 Q 440,570 430,625" stroke="#945e45" stroke-width="2.5" fill="none" opacity="0.6" />

    <!-- Realistic Wireframe Eyeglasses (Rectangular, Gunmetal Dark) -->
    <!-- Left Lens Frame -->
    <rect x="270" y="405" width="95" height="60" rx="14" fill="#00e5ff" fill-opacity="0.08" stroke="#1c242c" stroke-width="4.5" />
    <rect x="272" y="407" width="91" height="56" rx="12" fill="none" stroke="#6b7c8e" stroke-width="1.5" opacity="0.7" />
    <!-- Right Lens Frame -->
    <rect x="395" y="405" width="95" height="60" rx="14" fill="#00e5ff" fill-opacity="0.08" stroke="#1c242c" stroke-width="4.5" />
    <rect x="397" y="407" width="91" height="56" rx="12" fill="none" stroke="#6b7c8e" stroke-width="1.5" opacity="0.7" />
    <!-- Nose Bridge -->
    <path d="M 365,425 Q 380,418 395,425" stroke="#1c242c" stroke-width="4.5" fill="none" />
    <!-- Temple Arms -->
    <path d="M 270,425 L 215,445" stroke="#1c242c" stroke-width="4" fill="none" />
    <path d="M 490,425 L 545,445" stroke="#1c242c" stroke-width="4" fill="none" />
    <!-- Lens Sheen / Reflection -->
    <line x1="285" y1="412" x2="310" y2="460" stroke="#ffffff" stroke-width="2" opacity="0.3" stroke-linecap="round" />
    <line x1="410" y1="412" x2="435" y2="460" stroke="#ffffff" stroke-width="2" opacity="0.3" stroke-linecap="round" />
  </g>

  <!-- RIGHT COMPOSITION: Bold Typography and Glowing Traffic-Light Progression -->
  <g transform="translate(1020, 0)">
    <!-- Main Headline: IT ENDS AT 30 -->
    <!-- Drop Glow for Title -->
    <text x="350" y="225" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', 'Arial Black', sans-serif" font-weight="900" font-size="142" fill="#000000" opacity="0.6" filter="url(#textShadow)" letter-spacing="2">
      IT ENDS
    </text>
    <text x="350" y="225" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', 'Arial Black', sans-serif" font-weight="900" font-size="142" fill="#ffffff" letter-spacing="2">
      IT ENDS
    </text>

    <text x="350" y="375" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', 'Arial Black', sans-serif" font-weight="900" font-size="160" fill="#000000" opacity="0.6" filter="url(#textShadow)" letter-spacing="3">
      AT 30
    </text>
    <text x="350" y="375" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', 'Arial Black', sans-serif" font-weight="900" font-size="160" fill="#ffffff" letter-spacing="3">
      AT 30
    </text>

    <!-- Vertical Luminescent Connector Line -->
    <line x1="40" y1="520" x2="40" y2="880" stroke="#ffffff" stroke-width="3" opacity="0.9" />
    <line x1="40" y1="520" x2="40" y2="880" stroke="#00ff88" stroke-width="10" opacity="0.25" />
    <line x1="40" y1="670" x2="40" y2="880" stroke="#ff3b30" stroke-width="12" opacity="0.2" />

    <!-- 1. AGE 22 (Green Node) -->
    <g transform="translate(40, 555)">
      <!-- Outer Green Glow Aura -->
      <circle cx="0" cy="0" r="38" fill="#10b981" opacity="0.2" filter="url(#glowGreen)" />
      <circle cx="0" cy="0" r="26" fill="#059669" opacity="0.6" />
      <circle cx="0" cy="0" r="18" fill="#34d399" />
      <circle cx="0" cy="0" r="10" fill="#ffffff" />
      <!-- Concentric light ring -->
      <circle cx="0" cy="0" r="30" stroke="#6ee7b7" stroke-width="2.5" fill="none" opacity="0.8" />

      <!-- Text Label: Age 22 -->
      <text x="55" y="16" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-weight="800" font-size="62" fill="#34d399" filter="url(#textShadow)">
        Age 22
      </text>
    </g>

    <!-- 2. AGE 30 (Amber / Golden Node) -->
    <g transform="translate(40, 705)">
      <!-- Amber Glow Aura -->
      <circle cx="0" cy="0" r="42" fill="#f59e0b" opacity="0.25" filter="url(#glowYellow)" />
      <circle cx="0" cy="0" r="28" fill="#d97706" opacity="0.7" />
      <circle cx="0" cy="0" r="19" fill="#fbbf24" />
      <circle cx="0" cy="0" r="11" fill="#ffffff" />
      <!-- Radiant ring -->
      <circle cx="0" cy="0" r="34" stroke="#fde68a" stroke-width="2.5" stroke-dasharray="8 4" fill="none" opacity="0.9" />

      <!-- Text Label: Age 30 -->
      <text x="55" y="16" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-weight="800" font-size="62" fill="#f59e0b" filter="url(#textShadow)">
        Age 30
      </text>
    </g>

    <!-- 3. AGE 40+! (Crimson Plasma Crackle Node) -->
    <g transform="translate(40, 865)">
      <!-- Intense Red Shockwave Aura -->
      <circle cx="0" cy="0" r="54" fill="#ef4444" opacity="0.3" filter="url(#glowRed)" />
      <!-- Plasma crackle paths -->
      <path d="M -30,-15 L -10,-5 L -25,15 L -5,25 L -15,40" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.9" />
      <path d="M 25,-25 L 10,-8 L 30,10 L 8,28 L 22,38" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.9" />
      <path d="M -15,-30 L -5,-12 L 15,-25 L 8,-5 L 28,-10" stroke="#ffffff" stroke-width="1.5" fill="none" />

      <!-- Core Red Orb -->
      <circle cx="0" cy="0" r="32" fill="#b91c1c" />
      <circle cx="0" cy="0" r="22" fill="#ef4444" />
      <circle cx="0" cy="0" r="12" fill="#fee2e2" />

      <!-- Text Label: Age 40+! -->
      <text x="55" y="18" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-weight="900" font-size="68" fill="#ef4444" filter="url(#textShadow)">
        Age 40+!
      </text>
    </g>
  </g>
</svg>
`;

  try {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      const base64 = window.btoa(unescape(encodeURIComponent(svg)));
      return `data:image/svg+xml;base64,${base64}`;
    }
  } catch (e) {
    // fallback
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
