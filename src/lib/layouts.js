// Image mode layouts — all render at 1920×1080 base (16:9)
// Screenshot placement uses fractional coordinates (0–1) relative to canvas
export const IMAGE_LAYOUTS = [
  {
    id: 'img-1',
    label: '1',
    canvasWidth: 1920,
    canvasHeight: 1080,
    // Centered with even padding
    screenshot: { x: 0.10, y: 0.08, w: 0.80, h: 0.84, alignX: 'center', alignY: 'center' },
    borderRadius: 12,
    shadow: { offsetX: 0, offsetY: 8, blur: 40, color: 'rgba(0,0,0,0.35)' },
  },
  {
    id: 'img-2',
    label: '2',
    canvasWidth: 1920,
    canvasHeight: 1080,
    // Aligned to right and bottom edges, bleeding off canvas
    screenshot: { x: 0.12, y: 0.12, w: 0.92, h: 0.92, alignX: 'right', alignY: 'bottom' },
    borderRadius: 12,
    shadow: { offsetX: 0, offsetY: 8, blur: 40, color: 'rgba(0,0,0,0.35)' },
  },
  {
    id: 'img-3',
    label: '3',
    canvasWidth: 1920,
    canvasHeight: 1080,
    // Aligned to top and right edge, bleeding off canvas
    screenshot: { x: 0.18, y: -0.04, w: 0.86, h: 0.86, alignX: 'right', alignY: 'top' },
    borderRadius: 12,
    shadow: { offsetX: 0, offsetY: 8, blur: 40, color: 'rgba(0,0,0,0.35)' },
  },
];

// Cover mode layouts — different aspect ratios
export const COVER_LAYOUTS = [
  {
    id: 'cover-16-9',
    label: '1',
    canvasWidth: 1920,
    canvasHeight: 1080,
    screenshot: { x: 0.46, y: 0.08, w: 0.58, h: 0.96, alignX: 'left', alignY: 'top', fill: 'cover' },
    borderRadius: 12,
    shadow: { offsetX: 0, offsetY: 8, blur: 40, color: 'rgba(0,0,0,0.25)' },
    textVCenter: true, // vertically center the title+date block
    title: { x: 0.07, maxWidth: 0.33, fontSize: 135, fontWeight: 300, color: '#FFFFFF', align: 'left' },
    date: { x: 0.07, fontSize: 32, fontWeight: 300, color: 'rgba(255,255,255,0.8)', align: 'left' },
  },
  {
    id: 'cover-3-2',
    label: '2',
    canvasWidth: 1200,
    canvasHeight: 800,
    screenshot: { x: 0.09, y: 0.253, w: 0.94, h: 0.787, alignX: 'left', alignY: 'top', fill: 'cover' },
    borderRadius: 12,
    shadow: { offsetX: 0, offsetY: 8, blur: 40, color: 'rgba(0,0,0,0.25)' },
    textVCenter: true,
    textVCenterEnd: 0.253, // center text between top edge and screenshot top
    dateGap: 8, // small gap between title and date
    title: { x: 0.09, maxWidth: 0.86, fontSize: 61, fontWeight: 300, color: '#FFFFFF', align: 'left' },
    date: { x: 0.09, fontSize: 21, fontWeight: 300, color: 'rgba(255,255,255,0.8)', align: 'left' },
  },
];
