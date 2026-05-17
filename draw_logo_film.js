const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function main() {
  // Load the original image
  const img = await loadImage('https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/a55d0c5a1_image.png');
  
  const W = img.width, H = img.height;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  
  // Draw original image
  ctx.drawImage(img, 0, 0);
  
  // The yellow wave in the original sits roughly at:
  // y center ~345, from x~100 to x~580, gentle S-curve wave
  // We need to COVER the yellow wave with black first, then draw the film strip
  
  // Cover yellow wave with black rectangle
  ctx.fillStyle = '#000000';
  ctx.fillRect(80, 310, 520, 70);
  
  // Now draw a film strip that follows the same wave path
  // Wave path: starts low-left, rises in middle, dips slightly, ends mid-right
  // Matching the original wave: from (100,355) curving up to peak around (300,330) then down to (560,350)
  
  const GOLD = '#FBBF24';
  const FILM_H = 28; // height of the film strip
  const HOLE_W = 10;
  const HOLE_H = 8;
  const HOLE_GAP = 16;
  
  // The wave control points (matching original yellow wave roughly)
  // We'll sample points along the bezier and draw the film strip
  
  function bezierPoint(t, p0, p1, p2, p3) {
    const mt = 1 - t;
    return mt*mt*mt*p0 + 3*mt*mt*t*p1 + 3*mt*t*t*p2 + t*t*t*p3;
  }
  
  // Wave curve: x from 95 to 565, y wave
  const x0=95,  y0=352;
  const x1=200, y1=322;
  const x2=400, y2=338;
  const x3=565, y3=342;
  
  const steps = 200;
  const points = [];
  for(let i=0; i<=steps; i++) {
    const t = i/steps;
    const x = bezierPoint(t, x0, x1, x2, x3);
    const y = bezierPoint(t, y0, y1, y2, y3);
    points.push({x, y});
  }
  
  // Draw film strip body following the wave
  // Top edge
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y - FILM_H/2);
  for(let i=1; i<=steps; i++) {
    ctx.lineTo(points[i].x, points[i].y - FILM_H/2);
  }
  // Bottom edge (reverse)
  for(let i=steps; i>=0; i--) {
    ctx.lineTo(points[i].x, points[i].y + FILM_H/2);
  }
  ctx.closePath();
  ctx.fillStyle = GOLD;
  ctx.fill();
  
  // Draw dark film frames inside the strip
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  const numFrames = 8;
  for(let f=0; f<numFrames; f++) {
    const t1 = (f/numFrames) * 0.95 + 0.025;
    const t2 = ((f+1)/numFrames) * 0.95 + 0.025;
    const idx1 = Math.floor(t1 * steps);
    const idx2 = Math.floor(t2 * steps);
    const midIdx = Math.floor((idx1+idx2)/2);
    const cx = points[midIdx].x;
    const cy = points[midIdx].y;
    
    // Draw dark rectangle for each frame
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(-((x3-x0)/numFrames)*0.38, -FILM_H/2+5, ((x3-x0)/numFrames)*0.76, FILM_H-10);
    ctx.restore();
  }
  
  // Draw sprocket holes along top and bottom of film strip
  const numHoles = 14;
  for(let h=0; h<numHoles; h++) {
    const t = (h/(numHoles-1)) * 0.9 + 0.05;
    const idx = Math.floor(t * steps);
    const px = points[idx].x;
    const py = points[idx].y;
    
    // Top hole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(px - HOLE_W/2, py - FILM_H/2 + 2, HOLE_W, HOLE_H, 2);
    ctx.fill();
    
    // Bottom hole
    ctx.beginPath();
    ctx.roundRect(px - HOLE_W/2, py + FILM_H/2 - HOLE_H - 2, HOLE_W, HOLE_H, 2);
    ctx.fill();
  }
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('/app/sachi_film.png', buffer);
  console.log('Done', W, H);
}

main().catch(console.error);
