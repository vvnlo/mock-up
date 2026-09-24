// Blues, olives and parchment, tuned to sit against the cobalt page (#1338b5).
export const PALETTE = {
  navy: '#0b1846',
  blue: '#4c7bff',
  powder: '#a8c0f0',
  oliveDeep: '#3a3c14',
  olive: '#6f7130',
  oliveLight: '#a7a55a',
  parchment: '#f2ead3',
  parchmentDeep: '#dccca4',
}

const P = PALETTE

// One entry per effect; `variants` are alternate settings picked at random per cell.
export const EFFECT_SETTINGS = {
  duotone: [
    { uContrast: 1.35, uShadow: P.navy, uHigh: P.parchment, uBg: P.parchment },
  ],
  mosaic: [
    { uBlock: 13, uContrast: 1.7, uGrid: 0.85, uGridW: 0.22, uChecker: 0, uShadow: P.oliveDeep, uHigh: P.parchment, uBg: P.olive },
    { uBlock: 28, uContrast: 1.7, uGrid: 0.65, uGridW: 0.2, uChecker: 0.18, uShadow: P.navy, uHigh: P.powder, uBg: P.blue },
  ],
  halftone: [
    { uDot: 12, uAngle: 45, uContrast: 1.2, uBg: P.oliveLight, uInk: P.navy },
    { uDot: 22, uAngle: 0, uContrast: 1.2, uBg: P.powder, uInk: P.navy },
  ],
  dither: [
    { uPixel: 2, uContrast: 1.15, uBg: P.parchment, uInk: P.oliveDeep },
    { uPixel: 5, uContrast: 1.9, uBg: P.powder, uInk: P.navy },
  ],
  chromatic: [
    { uOffset: 8, uContrast: 1.45, uShadow: P.navy, uHigh: P.powder, uBg: P.blue },
    { uOffset: 10, uContrast: 1.2, uShadow: P.navy, uHigh: P.parchment, uBg: P.navy },
  ],
  ascii: [
    { uCell: 13, uContrast: 1.1, uLevels: 5, uLighten: 0.12, uFill: P.parchment, uChar: P.oliveDeep, uBg: P.oliveDeep },
    { uCell: 9, uContrast: 1.5, uLevels: 5, uLighten: 0.35, uFill: P.parchmentDeep, uChar: P.navy, uBg: P.olive },
  ],
  edge: [
    { uStrength: 1.2, uThresh: 0.08, uThickness: 1, uFill: P.navy, uEdge: P.parchment, uBg: P.olive },
    { uStrength: 1.5, uThresh: 0.25, uThickness: 0.8, uFill: P.oliveDeep, uEdge: P.oliveLight, uBg: P.navy },
  ],
  invert: [
    { uContrast: 1.35, uLevels: 4, uDeep: P.olive, uShadow: P.navy, uMid: P.powder, uHigh: P.parchment, uBg: P.oliveDeep },
    { uContrast: 1.8, uLevels: 3, uDeep: P.navy, uShadow: P.navy, uMid: P.oliveLight, uHigh: P.parchment, uBg: P.blue },
  ],
}
