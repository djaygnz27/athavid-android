const { createCanvas } = require('canvas');
const fs = require('fs');

const W = 900, H = 380;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, W, H);

// ---- SACHi ----
ctx.font = '900 200px "Arial Black", Arial';

// S
ctx.fillStyle = '#7C3AED';
ctx.fillText('S', 20, 220);

// A
ctx.fillStyle = '#7C3AED';
ctx.fillText('A', 140, 220);

// S-wave crossbar on the A in SACHi
// Crossbar sits at approx y=136, from x=158 to x=258
ctx.beginPath();
ctx.moveTo(158, 136);
ctx.bezierCurveTo(184, 112, 210, 160, 236, 136);
ctx.strokeStyle = '#FBBF24';
ctx.lineWidth = 13;
ctx.lineCap = 'round';
ctx.stroke();

// C
ctx.fillStyle = '#7C3AED';
ctx.fillText('C', 265, 220);

// H
ctx.fillStyle = '#7C3AED';
ctx.fillText('H', 420, 220);

// lowercase i
ctx.fillStyle = '#FBBF24';
ctx.fillText('i', 570, 220);

// ---- STREAM ----
ctx.font = '900 82px "Arial Black", Arial';

const letters = ['S','T','R','E','A','M'];
const xPos =    [ 50, 120, 193, 270, 350, 435];
const streamY = 318;

letters.forEach((l, i) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(l, xPos[i], streamY);
});

// S-wave crossbar on the A in STREAM
// A is at x=350, crossbar approx y=284, from x=362 to x=418
ctx.beginPath();
ctx.moveTo(362, 284);
ctx.bezierCurveTo(376, 268, 392, 300, 418, 284);
ctx.strokeStyle = '#FBBF24';
ctx.lineWidth = 8;
ctx.lineCap = 'round';
ctx.stroke();

// EST. 2026
ctx.font = '22px Arial';
ctx.fillStyle = '#666666';
ctx.fillText('EST. 2026', 340, 358);

// Save
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/app/sachi_logo_final.png', buffer);
console.log('Done');
