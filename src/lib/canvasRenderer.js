const FONT_FAMILY = "'PST Mail Sans', system-ui, sans-serif";

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Measure total height of wrapped text without drawing
function measureWrappedHeight(ctx, text, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = 0;

  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines++;
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines++;
  return lines * lineHeight;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, align) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      const drawX = align === 'center' ? x - ctx.measureText(line).width / 2 : x;
      ctx.fillText(line, drawX, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    const drawX = align === 'center' ? x - ctx.measureText(line).width / 2 : x;
    ctx.fillText(line, drawX, currentY);
    currentY += lineHeight;
  }
  return currentY; // return the Y position after the last line
}

// Contain: fit within box preserving aspect ratio (letterboxed)
function fitContain(imgW, imgH, boxW, boxH, alignX = 'center', alignY = 'center') {
  const imgRatio = imgW / imgH;
  const boxRatio = boxW / boxH;
  let w, h;
  if (imgRatio > boxRatio) {
    w = boxW;
    h = boxW / imgRatio;
  } else {
    h = boxH;
    w = boxH * imgRatio;
  }

  let x, y;
  if (alignX === 'left') x = 0;
  else if (alignX === 'right') x = boxW - w;
  else x = (boxW - w) / 2;

  if (alignY === 'top') y = 0;
  else if (alignY === 'bottom') y = boxH - h;
  else y = (boxH - h) / 2;

  return { x, y, w, h };
}

// Cover: fill box preserving aspect ratio (cropped)
function fitCover(imgW, imgH, boxW, boxH, alignX = 'center', alignY = 'center') {
  const imgRatio = imgW / imgH;
  const boxRatio = boxW / boxH;
  let w, h;
  if (imgRatio > boxRatio) {
    h = boxH;
    w = boxH * imgRatio;
  } else {
    w = boxW;
    h = boxW / imgRatio;
  }

  let x, y;
  if (alignX === 'left') x = 0;
  else if (alignX === 'right') x = boxW - w;
  else x = (boxW - w) / 2;

  if (alignY === 'top') y = 0;
  else if (alignY === 'bottom') y = boxH - h;
  else y = (boxH - h) / 2;

  return { x, y, w, h };
}

export function drawComposition(ctx, { backgroundImg, screenshotImg, layout, scale, mode, title, date }) {
  const cw = layout.canvasWidth;
  const ch = layout.canvasHeight;
  const w = cw * scale;
  const h = ch * scale;

  ctx.clearRect(0, 0, w, h);

  // 1. Draw background stretched to fill
  if (backgroundImg) {
    ctx.drawImage(backgroundImg, 0, 0, w, h);
  } else {
    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(0, 0, w, h);
  }

  // 2. Draw screenshot if present
  if (screenshotImg && layout.screenshot) {
    const boxX = layout.screenshot.x * w;
    const boxY = layout.screenshot.y * h;
    const boxW = layout.screenshot.w * w;
    const boxH = layout.screenshot.h * h;
    const radius = layout.borderRadius * scale;

    // Fit screenshot within bounding box preserving aspect ratio
    const alignX = layout.screenshot.alignX || 'center';
    const alignY = layout.screenshot.alignY || 'center';
    const fillMode = layout.screenshot.fill || 'contain';
    const fitFn = fillMode === 'cover' ? fitCover : fitContain;
    const fit = fitFn(screenshotImg.naturalWidth, screenshotImg.naturalHeight, boxW, boxH, alignX, alignY);
    const sx = boxX + fit.x;
    const sy = boxY + fit.y;
    const sw = fit.w;
    const sh = fit.h;

    // Draw shadow
    ctx.save();
    ctx.shadowColor = layout.shadow.color;
    ctx.shadowBlur = layout.shadow.blur * scale;
    ctx.shadowOffsetX = layout.shadow.offsetX * scale;
    ctx.shadowOffsetY = layout.shadow.offsetY * scale;
    ctx.fillStyle = '#000';
    drawRoundedRect(ctx, sx, sy, sw, sh, radius);
    ctx.fill();
    ctx.restore();

    // Clip and draw screenshot
    ctx.save();
    drawRoundedRect(ctx, sx, sy, sw, sh, radius);
    ctx.clip();
    ctx.drawImage(screenshotImg, sx, sy, sw, sh);
    ctx.restore();
  }

  // 3. Draw title and date for cover mode
  if (mode === 'cover') {
    const t = layout.title;
    const d = layout.date;
    const titleFontSize = t ? t.fontSize * scale : 0;
    const dateFontSize = d ? d.fontSize * scale : 0;
    const titleLineHeight = titleFontSize * 1.15;
    const dateGap = layout.dateGap != null ? layout.dateGap * scale : titleFontSize * 0.4;
    const tx = t ? t.x * w : 0;
    const maxW = t ? t.maxWidth * w : 0;

    // Measure total text block height for vertical centering
    ctx.font = `${t.fontWeight} ${titleFontSize}px ${FONT_FAMILY}`;
    const titleH = title ? measureWrappedHeight(ctx, title, maxW, titleLineHeight) : 0;
    const dateH = date ? dateFontSize : 0;
    const totalBlockH = titleH + (titleH && dateH ? dateGap : 0) + dateH;

    // Compute starting Y
    let startY;
    if (layout.textVCenter) {
      // Vertically center only the title within a region (date follows below)
      const regionBottom = layout.textVCenterEnd != null ? layout.textVCenterEnd * h : h;
      startY = (regionBottom - titleH) / 2;
    } else {
      startY = t.y * h;
    }

    // Draw title
    if (title && t) {
      ctx.font = `${t.fontWeight} ${titleFontSize}px ${FONT_FAMILY}`;
      ctx.fillStyle = t.color;
      ctx.textBaseline = 'top';
      const titleEndY = wrapText(ctx, title, tx, startY, maxW, titleLineHeight, t.align);

      // Draw date right after title
      if (date && d) {
        const dy = titleEndY + dateGap;
        ctx.font = `${d.fontWeight} ${dateFontSize}px ${FONT_FAMILY}`;
        ctx.fillStyle = d.color;
        ctx.textBaseline = 'top';
        const formattedDate = formatDate(date);
        const dx = d.x != null ? d.x * w : tx;
        if (d.align === 'center') {
          const textW = ctx.measureText(formattedDate).width;
          ctx.fillText(formattedDate, dx - textW / 2, dy);
        } else {
          ctx.fillText(formattedDate, dx, dy);
        }
      }
    } else if (date && d) {
      // Date only, no title
      ctx.font = `${d.fontWeight} ${dateFontSize}px ${FONT_FAMILY}`;
      ctx.fillStyle = d.color;
      ctx.textBaseline = 'top';
      const formattedDate = formatDate(date);
      const dx = d.x * w;
      ctx.fillText(formattedDate, dx, startY);
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function exportComposition({ backgroundImg, screenshotImg, layout, scale, mode, title, date }) {
  const w = layout.canvasWidth * scale;
  const h = layout.canvasHeight * scale;

  const offscreen = document.createElement('canvas');
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext('2d');

  drawComposition(ctx, { backgroundImg, screenshotImg, layout, scale, mode, title, date });

  return new Promise((resolve) => {
    offscreen.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mockup-${scale}x.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, 'image/png');
  });
}
