import { useRef, useEffect } from 'react';
import { drawComposition } from '../lib/canvasRenderer';
import { useImageLoader } from '../hooks/useImageLoader';

export default function PreviewCanvas({ mode, screenshot, backgroundPath, layout, title, date }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const backgroundImg = useImageLoader(backgroundPath);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !backgroundImg) return;

    const ctx = canvas.getContext('2d');
    const cw = layout.canvasWidth;
    const ch = layout.canvasHeight;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const scaleToFit = Math.min(containerWidth / cw, containerHeight / ch);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = cw * scaleToFit * dpr;
    canvas.height = ch * scaleToFit * dpr;
    canvas.style.width = `${cw * scaleToFit}px`;
    canvas.style.height = `${ch * scaleToFit}px`;

    ctx.scale(scaleToFit * dpr, scaleToFit * dpr);

    // Wait for fonts before drawing
    document.fonts.ready.then(() => {
      drawComposition(ctx, {
        backgroundImg,
        screenshotImg: screenshot,
        layout,
        scale: 1,
        mode,
        title,
        date,
      });
    });
  }, [backgroundImg, screenshot, layout, mode, title, date]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="rounded-lg shadow-lg" />
    </div>
  );
}
