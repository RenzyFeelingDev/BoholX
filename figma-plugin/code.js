// BoholX Homepage Generator — Figma Plugin
// Recreates the full BoholX homepage design (1440px desktop)

figma.showUI(__html__, { width: 300, height: 110 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'run') return;
  try {
    await buildHomepage();
  } catch (e) {
    figma.closePlugin('Error: ' + e.message);
  }
};

// ─────────────────────────────────────────
// Color palette (all Tailwind equivalents)
// ─────────────────────────────────────────
const C = {
  white:      { r: 1,     g: 1,     b: 1     },
  slate900:   { r: 0.059, g: 0.090, b: 0.165 },
  slate700:   { r: 0.200, g: 0.255, b: 0.333 },
  slate600:   { r: 0.278, g: 0.333, b: 0.412 },
  slate500:   { r: 0.392, g: 0.455, b: 0.545 },
  slate400:   { r: 0.580, g: 0.639, b: 0.722 },
  slate300:   { r: 0.796, g: 0.835, b: 0.882 },
  slate200:   { r: 0.886, g: 0.910, b: 0.941 },
  slate100:   { r: 0.945, g: 0.961, b: 0.976 },
  slate50:    { r: 0.973, g: 0.980, b: 0.988 },
  indigo700:  { r: 0.263, g: 0.220, b: 0.792 },
  indigo600:  { r: 0.310, g: 0.275, b: 0.898 },
  indigo500:  { r: 0.388, g: 0.400, b: 0.945 },
  indigo400:  { r: 0.506, g: 0.549, b: 0.973 },
  indigo200:  { r: 0.780, g: 0.824, b: 0.996 },
  indigo100:  { r: 0.878, g: 0.906, b: 1.000 },
  indigo50:   { r: 0.933, g: 0.949, b: 1.000 },
  sky50:      { r: 0.941, g: 0.969, b: 1.000 },
  sky200:     { r: 0.741, g: 0.898, b: 0.988 },
  blue100:    { r: 0.816, g: 0.902, b: 0.988 },
  emerald50:  { r: 0.925, g: 0.992, b: 0.961 },
  emerald200: { r: 0.663, g: 0.957, b: 0.796 },
  green100:   { r: 0.820, g: 0.980, b: 0.875 },
  violet100:  { r: 0.929, g: 0.855, b: 0.996 },
  amber50:    { r: 1.000, g: 0.980, b: 0.929 },
  amber200:   { r: 0.992, g: 0.902, b: 0.655 },
  orange100:  { r: 1.000, g: 0.929, b: 0.839 },
};

// ─────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────
function sp(color, opacity) {
  const p = { type: 'SOLID', color };
  if (opacity !== undefined) p.opacity = opacity;
  return p;
}

function gradientV(topColor, topOpacity, botColor, botOpacity) {
  return {
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { ...topColor, a: topOpacity ?? 1 } },
      { position: 1, color: { ...botColor, a: botOpacity ?? 1 } },
    ],
  };
}

function mkRect(parent, x, y, w, h, opts = {}) {
  const r = figma.createRectangle();
  r.x = x; r.y = y;
  r.resize(w, h);
  if (opts.fills) r.fills = opts.fills;
  else if (opts.fill) r.fills = [sp(opts.fill, opts.fillOpacity)];
  else r.fills = [];
  if (opts.stroke) {
    r.strokes = [sp(opts.stroke)];
    r.strokeWeight = opts.sw || 1;
    r.strokeAlign = 'INSIDE';
  }
  if (opts.r !== undefined) r.cornerRadius = opts.r;
  if (opts.name) r.name = opts.name;
  parent.appendChild(r);
  return r;
}

function mkEllipse(parent, x, y, w, h, opts = {}) {
  const e = figma.createEllipse();
  e.x = x; e.y = y;
  e.resize(w, h);
  e.fills = opts.fill ? [sp(opts.fill, opts.fillOpacity)] : [];
  if (opts.name) e.name = opts.name;
  parent.appendChild(e);
  return e;
}

function mkFrame(parent, name, x, y, w, h, opts = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.x = x; f.y = y;
  f.resize(w, h);
  if (opts.fills) f.fills = opts.fills;
  else if (opts.fill !== undefined) f.fills = [sp(opts.fill, opts.fillOpacity)];
  else f.fills = [];
  if (opts.stroke) {
    f.strokes = [sp(opts.stroke)];
    f.strokeWeight = opts.sw || 1;
    f.strokeAlign = 'INSIDE';
  }
  if (opts.r !== undefined) f.cornerRadius = opts.r;
  f.clipsContent = opts.clip !== false;
  if (parent) parent.appendChild(f);
  return f;
}

// Font name map (Figma uses spaced style names)
const FSTYLE = {
  light:     'Light',
  regular:   'Regular',
  medium:    'Medium',
  semibold:  'Semi Bold',
  bold:      'Bold',
  extrabold: 'Extra Bold',
  black:     'Black',
};

const loadedFonts = new Set();
async function loadFont(style) {
  const key = `Inter::${style}`;
  if (!loadedFonts.has(key)) {
    await figma.loadFontAsync({ family: 'Inter', style });
    loadedFonts.add(key);
  }
}

async function mkText(parent, chars, x, y, opts = {}) {
  const styleName = FSTYLE[opts.weight || 'regular'];
  await loadFont(styleName);

  const t = figma.createText();
  t.fontName = { family: 'Inter', style: styleName };
  t.fontSize = opts.size || 14;
  t.fills = [sp(opts.color || C.slate900)];

  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.lh) t.lineHeight = { value: opts.lh, unit: 'PIXELS' };
  if (opts.ls) t.letterSpacing = { value: opts.ls, unit: 'PERCENT' };

  if (opts.w) {
    t.textAutoResize = 'HEIGHT';
    t.resize(opts.w, 50);
  } else {
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
  }

  t.characters = chars;
  t.x = x; t.y = y;
  if (opts.name) t.name = opts.name;
  parent.appendChild(t);
  return t;
}

// Center a text node horizontally within parentWidth
async function mkTextCentered(parent, chars, parentWidth, y, opts = {}) {
  const textWidth = opts.w || Math.min(chars.length * (opts.size || 14) * 0.55, parentWidth - 48);
  const t = await mkText(parent, chars, Math.round((parentWidth - textWidth) / 2), y, { ...opts, w: textWidth });
  return t;
}

// ─────────────────────────────────────────
// Main builder
// ─────────────────────────────────────────
async function buildHomepage() {
  const page = figma.currentPage;
  const W = 1440;
  let totalY = 0;

  // Pre-load all needed fonts
  for (const s of ['Light', 'Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold']) {
    await loadFont(s);
  }

  // ──────────────────────────────────────
  // Root frame
  // ──────────────────────────────────────
  const root = mkFrame(null, 'BoholX — Homepage (1440px)', 0, 0, W, 100, {
    fill: C.white,
    clip: true,
  });

  // ══════════════════════════════════════
  // NAV  (h = 64)
  // ══════════════════════════════════════
  const NAV_H = 64;
  const nav = mkFrame(root, 'Navigation', 0, totalY, W, NAV_H, {
    fill: C.white,
    stroke: C.slate100,
    sw: 1,
  });

  // Logo mark
  mkRect(nav, 24, 18, 28, 28, { fill: C.indigo600, r: 8, name: 'Logo Mark' });
  await mkText(nav, '✦', 31, 22, { size: 12, color: C.white, weight: 'bold' });
  await mkText(nav, 'BoholX', 60, 20, { size: 18, color: C.slate900, weight: 'bold' });

  // Nav links
  await mkText(nav, 'Submit Profile', W - 240, 22, { size: 14, color: C.slate600, weight: 'medium' });
  mkRect(nav, W - 140, 14, 116, 38, { fill: C.indigo600, r: 12, name: 'Find Talent Btn' });
  await mkText(nav, 'Find Talent', W - 115, 24, { size: 14, color: C.white, weight: 'medium' });

  totalY += NAV_H;

  // ══════════════════════════════════════
  // HERO  (h = 596)
  // ══════════════════════════════════════
  const HERO_H = 596;
  const hero = mkFrame(root, 'Hero', 0, totalY, W, HERO_H, {
    fills: [gradientV(C.indigo50, 0.6, C.white, 1)],
    clip: true,
  });

  // Decorative blobs
  mkEllipse(hero, W - 320, -220, 600, 600, { fill: C.indigo100, fillOpacity: 0.35, name: 'Blob Top Right' });
  mkEllipse(hero, -100, HERO_H - 220, 400, 400, { fill: C.violet100, fillOpacity: 0.2, name: 'Blob Bottom Left' });

  // Location badge
  const badgeW = 330;
  const badgeX = (W - badgeW) / 2;
  mkRect(hero, badgeX, 80, badgeW, 32, { fill: C.indigo50, stroke: C.indigo200, r: 16, name: 'Location Badge BG' });
  await mkText(hero, '📍  Serving all 48 municipalities of Bohol', badgeX + 16, 88,
    { size: 12, color: C.indigo600, weight: 'semibold' });

  // Headline line 1
  await mkTextCentered(hero, 'Find Boholano talent', W, 136,
    { size: 60, color: C.slate900, weight: 'extrabold', lh: 66, w: 800, name: 'H1 Line 1' });

  // Headline line 2 (indigo)
  await mkTextCentered(hero, 'for your project.', W, 208,
    { size: 60, color: C.indigo600, weight: 'extrabold', lh: 66, w: 600, name: 'H1 Line 2' });

  // Subheading
  await mkTextCentered(hero, 'Describe what you need in plain language. BoholX understands context, skills, and location — and surfaces the right match.', W, 294,
    { size: 18, color: C.slate500, w: 560, lh: 28, name: 'Hero Subtitle' });

  // ── Search widget ──
  const SY = 368;
  const SW = 640;
  const SX = (W - SW) / 2;

  // Tabs
  mkRect(hero, SX, SY, 118, 36, { fill: C.indigo600, r: 8, name: 'Tab Active' });
  await mkText(hero, 'Project Need', SX + 14, SY + 10, { size: 14, color: C.white, weight: 'medium' });
  await mkText(hero, 'Search People', SX + 138, SY + 10, { size: 14, color: C.slate600, weight: 'medium' });

  // Input box
  mkRect(hero, SX, SY + 48, SW, 56, {
    fill: C.white, stroke: C.slate200, sw: 2, r: 16, name: 'Search Input Box'
  });
  await mkText(hero, '🔍', SX + 16, SY + 64, { size: 16, color: C.slate400 });
  await mkText(hero, "What's on your mind? (e.g. I need a web developer for my tourism startup…)", SX + 44, SY + 65,
    { size: 14, color: C.slate400, w: SW - 100 });
  // Send arrow button
  mkRect(hero, SX + SW - 44, SY + 60, 32, 32, { fill: C.indigo600, r: 10, name: 'Search Arrow Btn' });
  await mkText(hero, '→', SX + SW - 35, SY + 68, { size: 14, color: C.white, weight: 'bold' });

  // "Try:" quick tags
  await mkText(hero, 'TRY:', SX, SY + 122, { size: 11, color: C.slate400, weight: 'semibold', ls: 5 });
  const TAGS = ['Web dev in Panglao', 'Designer Tagbilaran', 'Caterer for events', 'Photographer Bohol'];
  let tagX = SX + 42;
  for (const tag of TAGS) {
    const tw = tag.length * 6.8 + 24;
    mkRect(hero, tagX, SY + 118, tw, 26, { fill: C.slate100, r: 13, name: `Tag: ${tag}` });
    await mkText(hero, tag, tagX + 12, SY + 123, { size: 12, color: C.slate600, weight: 'medium' });
    tagX += tw + 8;
  }

  // Stats row
  const STATS_Y = SY + 164;
  const STATS = [
    { num: '340+',   label: 'Active talent' },
    { num: '1,200+', label: 'Completed projects' },
    { num: '48',     label: 'Municipalities' },
  ];
  const statGap = 148;
  const statsStartX = (W - (2 * statGap + 120)) / 2;
  for (let i = 0; i < 3; i++) {
    const sx = statsStartX + i * (statGap + 1);
    await mkTextCentered(hero, STATS[i].num, 120, STATS_Y, { size: 30, color: C.slate900, weight: 'extrabold', w: 120, name: `Stat ${i}` });
    // Re-position manually since we can't rely on centering inside parent
    const numNode = hero.findAll(n => n.name === `Stat ${i}`)[0];
    if (numNode) numNode.x = sx;
    await mkText(hero, STATS[i].label, sx, STATS_Y + 38, { size: 13, color: C.slate500, w: 120, align: 'CENTER' });
    if (i < 2) mkRect(hero, sx + 130, STATS_Y + 4, 1, 40, { fill: C.slate200 });
  }

  totalY += HERO_H;

  // ══════════════════════════════════════
  // HOW IT WORKS  (h = 420)
  // ══════════════════════════════════════
  const HOW_H = 420;
  const how = mkFrame(root, 'How It Works', 0, totalY, W, HOW_H, {
    fill: C.white,
    stroke: C.slate100,
    sw: 1,
  });

  await mkTextCentered(how, 'How BoholX works', W, 64, { size: 24, color: C.slate900, weight: 'bold', w: 400 });
  await mkTextCentered(how, 'Conversational search is the only way to discover talent — no directories, no filters.', W, 104,
    { size: 16, color: C.slate500, w: 520, lh: 24 });

  const HOW_CARDS = [
    { step: '01', icon: '💬', title: 'Describe your need',
      desc: 'Type naturally — your project, the skills, the location. BoholX extracts what matters.' },
    { step: '02', icon: '✦',  title: 'AI matches talent',
      desc: 'Each profile is scored on skill fit, industry experience, and availability.' },
    { step: '03', icon: '🤝', title: 'Connect directly',
      desc: 'Reveal contact info and start the conversation. No middlemen.' },
  ];
  const CARD_W = 400;
  const CARD_H = 220;
  const CARD_GAP = 20;
  const CARD_TOTAL = 3 * CARD_W + 2 * CARD_GAP;
  const CARD_START_X = (W - CARD_TOTAL) / 2;
  const CARD_Y = 156;

  for (let i = 0; i < 3; i++) {
    const cx = CARD_START_X + i * (CARD_W + CARD_GAP);
    mkRect(how, cx, CARD_Y, CARD_W, CARD_H, {
      fill: C.white, stroke: C.slate100, sw: 1, r: 16, name: `How Card ${i + 1}`
    });
    await mkText(how, HOW_CARDS[i].step, cx + 24, CARD_Y + 24, { size: 12, color: C.indigo400, weight: 'bold', ls: 8 });
    await mkText(how, HOW_CARDS[i].icon, cx + 24, CARD_Y + 50, { size: 26 });
    await mkText(how, HOW_CARDS[i].title, cx + 24, CARD_Y + 92, { size: 16, color: C.slate900, weight: 'semibold' });
    await mkText(how, HOW_CARDS[i].desc, cx + 24, CARD_Y + 120, { size: 14, color: C.slate500, w: CARD_W - 48, lh: 22 });
  }

  totalY += HOW_H;

  // ══════════════════════════════════════
  // FEATURED MUNICIPALITIES  (h = 340)
  // ══════════════════════════════════════
  const MUN_H = 340;
  const mun = mkFrame(root, 'Featured Municipalities', 0, totalY, W, MUN_H, {
    fill: C.slate50,
    stroke: C.slate100,
    sw: 1,
  });

  await mkText(mun, 'Featured municipalities', 24, 60, { size: 24, color: C.slate900, weight: 'bold' });
  await mkText(mun, "Talent from across Bohol's most active communities", 24, 96, { size: 14, color: C.slate500 });

  const MUNIS = [
    { name: 'Panglao',    icon: '🏝️', desc: 'Beach & island specialists',     count: 62,
      bg: C.sky50,    border: C.sky200    },
    { name: 'Carmen',     icon: '🌿', desc: 'Chocolate Hills & eco-tourism',   count: 45,
      bg: C.emerald50, border: C.emerald200 },
    { name: 'Tagbilaran', icon: '🏙️', desc: 'City professionals & creatives',  count: 118,
      bg: C.indigo50,  border: C.indigo200  },
    { name: 'Loboc',      icon: '🛶', desc: 'River & cultural experts',         count: 34,
      bg: C.amber50,   border: C.amber200   },
  ];

  const MUN_PAD = 24;
  const MUN_CARD_W = Math.floor((W - MUN_PAD * 2 - 3 * 16) / 4);
  const MUN_CARD_H = 174;
  const MUN_Y = 138;

  for (let i = 0; i < 4; i++) {
    const mx = MUN_PAD + i * (MUN_CARD_W + 16);
    mkRect(mun, mx, MUN_Y, MUN_CARD_W, MUN_CARD_H, {
      fill: MUNIS[i].bg, stroke: MUNIS[i].border, r: 16, name: `Muni Card: ${MUNIS[i].name}`
    });
    await mkText(mun, MUNIS[i].icon, mx + 20, MUN_Y + 18, { size: 24 });
    await mkText(mun, MUNIS[i].name, mx + 20, MUN_Y + 58, { size: 18, color: C.slate900, weight: 'semibold' });
    await mkText(mun, MUNIS[i].desc, mx + 20, MUN_Y + 86, { size: 12, color: C.slate500, w: MUN_CARD_W - 40, lh: 18 });
    await mkText(mun, `👤  ${MUNIS[i].count} profiles`, mx + 20, MUN_Y + 134, { size: 12, color: C.slate700, weight: 'semibold' });
  }

  totalY += MUN_H;

  // ══════════════════════════════════════
  // CTA SECTION  (h = 380)
  // ══════════════════════════════════════
  const CTA_H = 380;
  const ctaSection = mkFrame(root, 'CTA Section', 0, totalY, W, CTA_H, { fill: C.white });

  // Indigo card
  const CTA_CARD_H = 300;
  mkRect(ctaSection, 24, 40, W - 48, CTA_CARD_H, {
    fills: [gradientV(C.indigo500, 1, C.indigo700, 1)],
    r: 24, name: 'CTA Card'
  });
  // Decorative circle on card
  mkEllipse(ctaSection, W - 220, -40, 288, 288, { fill: C.white, fillOpacity: 0.05, name: 'CTA Blob' });

  // Badge
  const ctaBadgeW = 248;
  const ctaBadgeX = (W - ctaBadgeW) / 2;
  mkRect(ctaSection, ctaBadgeX, 84, ctaBadgeW, 32, { fill: C.white, fillOpacity: 0.2, r: 16 });
  await mkTextCentered(ctaSection, '✦  AI-powered talent onboarding', W, 92,
    { size: 12, color: C.white, weight: 'semibold', w: ctaBadgeW });

  // Heading
  await mkTextCentered(ctaSection, 'Are you a Boholano professional?', W, 140,
    { size: 32, color: C.white, weight: 'bold', w: 620 });

  // Subtext
  await mkTextCentered(ctaSection, 'Submit your profile and let BoholX match you with the right projects — automatically.', W, 198,
    { size: 18, color: C.indigo100, w: 500, lh: 28 });

  // Button
  const CTA_BTN_W = 216;
  const ctaBtnX = (W - CTA_BTN_W) / 2;
  mkRect(ctaSection, ctaBtnX, 270, CTA_BTN_W, 50, { fill: C.white, r: 14, name: 'CTA Button' });
  await mkTextCentered(ctaSection, 'Submit Your Profile  →', W, 284,
    { size: 15, color: C.indigo700, weight: 'semibold', w: CTA_BTN_W });

  totalY += CTA_H;

  // ══════════════════════════════════════
  // FOOTER  (h = 80)
  // ══════════════════════════════════════
  const FOOTER_H = 80;
  const footer = mkFrame(root, 'Footer', 0, totalY, W, FOOTER_H, {
    fill: C.white,
    stroke: C.slate100,
    sw: 1,
  });

  // Logo
  mkRect(footer, 24, 26, 24, 24, { fill: C.indigo600, r: 6 });
  await mkText(footer, '✦', 29, 29, { size: 11, color: C.white });
  await mkText(footer, 'BoholX', 54, 29, { size: 14, color: C.slate900, weight: 'bold' });

  // Tagline
  await mkTextCentered(footer, 'The Bohol talent marketplace. Conversational search only.', W, 30,
    { size: 12, color: C.slate400, w: 400 });

  // Footer links
  await mkText(footer, 'Find Talent', W - 200, 30, { size: 12, color: C.slate500 });
  await mkText(footer, 'Submit Profile', W - 110, 30, { size: 12, color: C.slate500 });

  totalY += FOOTER_H;

  // ─────────────────────────────────────
  // Finalize: resize root and add to page
  // ─────────────────────────────────────
  root.resize(W, totalY);
  page.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin(`✅ BoholX homepage created! (${W} × ${totalY}px)`);
}
