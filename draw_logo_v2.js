const { createCanvas } = require('canvas');
const fs = require('fs');

const W = 900, H = 400;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, W, H);

// ---- SACHi ----
ctx.font = '900 200px "Arial Black", Arial';

// S
ctx.fillStyle = '#7C3AED';
ctx.fillText('S', 20, 230);

// A
ctx.fillStyle = '#7C3AED';
ctx.fillText('A', 140, 230);

// S-wave crossbar on the A in SACHi
ctx.beginPath();
ctx.moveTo(158, 146);
ctx.bezierCurveTo(184, 122, 210, 170, 236, 146);
ctx.strokeStyle = '#FBBF24';
ctx.lineWidth = 13;
ctx.lineCap = 'round';
ctx.stroke();

// C
ctx.fillStyle = '#7C3AED';
ctx.fillText('C', 265, 230);

// H
ctx.fillStyle = '#7C3AED';
ctx.fillText('H', 420, 230);

// lowercase i (no dot — we draw the dot as a globe)
// Draw just the stem of i
ctx.fillStyle = '#FBBF24';
ctx.fillRect(578, 120, 22, 115); // stem of i

// Globe as the dot
const globeX = 589, globeY = 68, globeR = 32;

// Outer circle
ctx.beginPath();
ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
ctx.fillStyle = '#FBBF24';
ctx.fill();

// Latitude lines (dark purple on gold)
ctx.strokeStyle = '#7C3AED';
ctx.lineWidth = 2.5;

// Equator
ctx.beginPath();
ctx.ellipse(globeX, globeY, globeR, globeR * 0.18, 0, 0, Math.PI * 2);
ctx.stroke();

// Upper lat
ctx.beginPath();
ctx.ellipse(globeX, globeY - globeR * 0.5, globeR * 0.87, globeR * 0.15, 0, 0, Math.PI * 2);
ctx.stroke();

// Lower lat
ctx.beginPath();
ctx.ellipse(globeX, globeY + globeR * 0.5, globeR * 0.87, globeR * 0.15, 0, 0, Math.PI * 2);
ctx.stroke();

// Longitude line (vertical curve through middle)
ctx.beginPath();
ctx.ellipse(globeX, globeY, globeR * 0.45, globeR, 0, 0, Math.PI * 2);
ctx.stroke();

// Outer border
ctx.beginPath();
ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
ctx.strokeStyle = '#7C3AED';
ctx.lineWidth = 3;
ctx.stroke();

// ---- STREAM ----
ctx.font = '900 82px "Arial Black", Arial';

const letters = ['S','T','R','E','A','M'];
const xPos =    [ 50, 120, 193, 270, 350, 435];
const streamY = 330;

letters.forEach((l, i) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(l, xPos[i], streamY);
});

// S-wave crossbar on the A in STREAM
ctx.beginPath();
ctx.moveTo(362, 294);
ctx.bezierCurveTo(376, 278, 392, 310, 418, 294);
ctx.strokeStyle = '#FBBF24';
ctx.lineWidth = 8;
ctx.lineCap = 'round';
ctx.stroke();

// EST. 2026
ctx.font = '22px Arial';
ctx.fillStyle = '#666666';
ctx.fillText('EST. 2026', 340, 372);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/app/sachi_logo_globe.png', buffer);
console.log('Done');
