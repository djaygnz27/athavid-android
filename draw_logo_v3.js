const { createCanvas } = require('canvas');
const fs = require('fs');

const SCALE = 3;
const W = 900 * SCALE, H = 360 * SCALE;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');
ctx.scale(SCALE, SCALE);

const PURPLE = '#7C3AED';
const GOLD   = '#FBBF24';
const WHITE  = '#FFFFFF';
const GRAY   = '#555555';
const DARK   = '#0D0618';

// Background
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 900, 360);

// ─── ICON MARK ───────────────────────────────────────────────
const IX = 90, IY = 165, IR = 70;

// Dark purple circle bg
ctx.beginPath();
ctx.arc(IX, IY, IR, 0, Math.PI * 2);
ctx.fillStyle = '#1A0A3C';
ctx.fill();

// The S-wave stroke — bold, fluid, single path
ctx.beginPath();
ctx.moveTo(IX - 28, IY - 52);
// Top curl of S
ctx.bezierCurveTo(IX - 28, IY - 70, IX + 32, IY - 70, IX + 32, IY - 38);
// Middle crossover
ctx.bezierCurveTo(IX + 32, IY - 10, IX - 28, IY + 10, IX - 28, IY + 38);
// Bottom curl of S
ctx.bezierCurveTo(IX - 28, IY + 70, IX + 32, IY + 70, IX + 32, IY + 52);
ctx.strokeStyle = GOLD;
ctx.lineWidth = 13;
ctx.lineCap = 'round';
ctx.stroke();

// Globe above the S icon (top right of circle)
const GX = IX + 42, GY = IY - 52, GR = 16;
ctx.beginPath();
ctx.arc(GX, GY, GR, 0, Math.PI * 2);
ctx.fillStyle = GOLD;
ctx.fill();
// Globe lines in purple
ctx.strokeStyle = PURPLE;
ctx.lineWidth = 1.8;
// Equator
ctx.beginPath();
ctx.ellipse(GX, GY, GR, GR * 0.28, 0, 0, Math.PI * 2);
ctx.stroke();
// Upper lat
ctx.beginPath();
ctx.ellipse(GX, GY - GR * 0.52, GR * 0.86, GR * 0.2, 0, 0, Math.PI * 2);
ctx.stroke();
// Lower lat
ctx.beginPath();
ctx.ellipse(GX, GY + GR * 0.52, GR * 0.86, GR * 0.2, 0, 0, Math.PI * 2);
ctx.stroke();
// Meridian
ctx.beginPath();
ctx.ellipse(GX, GY, GR * 0.38, GR, 0, 0, Math.PI * 2);
ctx.stroke();
// Outer ring
ctx.beginPath();
ctx.arc(GX, GY, GR, 0, Math.PI * 2);
ctx.strokeStyle = PURPLE;
ctx.lineWidth = 2.2;
ctx.stroke();

// Thin gold divider
ctx.beginPath();
ctx.moveTo(170, 78);
ctx.lineTo(170, 252);
ctx.strokeStyle = GOLD;
ctx.lineWidth = 1.2;
ctx.globalAlpha = 0.35;
ctx.stroke();
ctx.globalAlpha = 1;

// ─── SACHi WORDMARK ─────────────────────────────────────────
const BIG = 168;
ctx.font = `900 ${BIG}px "Arial Black", Arial`;

// S
ctx.fillStyle = PURPLE;
ctx.fillText('S', 188, 228);

// A
ctx.fillStyle = PURPLE;
ctx.fillText('A', 302, 228);

// S-wave crossbar on A — measured: A from x=302, width~118, crossbar ~42% up
// baseline 228, height 168 => top at 60 => crossbar at 60 + 168*0.42 = ~131
ctx.beginPath();
ctx.moveTo(320, 148);
ctx.bezierCurveTo(342, 122, 366, 174, 390, 148);
ctx.strokeStyle = GOLD;
ctx.lineWidth = 12;
ctx.lineCap = 'round';
ctx.stroke();

// C
ctx.fillStyle = PURPLE;
ctx.fillText('C', 420, 228);

// H
ctx.fillStyle = PURPLE;
ctx.fillText('H', 564, 228);

// i stem only (we'll draw the globe as dot)
ctx.fillStyle = GOLD;
// Just the stem — rect approximation
ctx.fillRect(700, 120, 20, 112);

// Globe dot on i
const DX = 710, DY = 72, DR = 26;
ctx.beginPath();
ctx.arc(DX, DY, DR, 0, Math.PI * 2);
ctx.fillStyle = GOLD;
ctx.fill();
ctx.strokeStyle = PURPLE;
ctx.lineWidth = 2.2;
// Equator
ctx.beginPath();
ctx.ellipse(DX, DY, DR, DR * 0.28, 0, 0, Math.PI * 2);
ctx.stroke();
// Upper lat
ctx.beginPath();
ctx.ellipse(DX, DY - DR * 0.52, DR * 0.86, DR * 0.2, 0, 0, Math.PI * 2);
ctx.stroke();
// Lower lat
ctx.beginPath();
ctx.ellipse(DX, DY + DR * 0.52, DR * 0.86, DR * 0.2, 0, 0, Math.PI * 2);
ctx.stroke();
// Meridian
ctx.beginPath();
ctx.ellipse(DX, DY, DR * 0.38, DR, 0, 0, Math.PI * 2);
ctx.stroke();
// Outer ring
ctx.beginPath();
ctx.arc(DX, DY, DR, 0, Math.PI * 2);
ctx.strokeStyle = PURPLE;
ctx.lineWidth = 2.5;
ctx.stroke();

// ─── STREAM ──────────────────────────────────────────────────
const SM = 74;
ctx.font = `900 ${SM}px "Arial Black", Arial`;
const sLetters = ['S','T','R','E','A','M'];
const sX =       [188, 252, 316, 386, 460, 542];
sLetters.forEach((l,i) => {
  ctx.fillStyle = WHITE;
  ctx.fillText(l, sX[i], 316);
});

// S-wave crossbar on A in STREAM
// A at x=460, width~72, crossbar ~42% => baseline 316, height 74 => crossbar at 316-(74*0.58)=273
ctx.beginPath();
ctx.moveTo(470, 275);
ctx.bezierCurveTo(484, 258, 500, 292, 516, 275);
ctx.strokeStyle = GOLD;
ctx.lineWidth = 7.5;
ctx.lineCap = 'round';
ctx.stroke();

// EST. 2026
ctx.font = '18px Arial';
ctx.fillStyle = GRAY;
ctx.fillText('EST. 2026', 430, 344);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/app/sachi_master.png', buffer);
console.log('Done');
