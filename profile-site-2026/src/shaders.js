// GLSL for the portrait effects. Every effect is a `vec3 effect()` spliced between COMMON and MAIN.
// Coordinates are canvas device pixels (gl_FragCoord); lengths from settings are CSS px, scaled by uDpr.

export const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

const COMMON = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;      // canvas size, device px
uniform vec4 uImg;      // illustration rect inside the square, top-left origin, in fractions of the square
uniform vec2 uLuma;     // (lo, hi): stretches the all-blue illustration to a full 0..1 luminance range
uniform vec3 uPlain;    // page colour behind the untreated illustration
uniform float uDpr, uTime, uReveal, uGrain;

float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

vec2 imgAt(vec2 fc){
  vec2 box = vec2(fc.x / uRes.x, 1.0 - fc.y / uRes.y);
  return (box - uImg.xy) / uImg.zw;
}
bool inside(vec2 t){ return t.x >= 0.0 && t.x <= 1.0 && t.y >= 0.0 && t.y <= 1.0; }
float sampleLuma(vec2 fc){
  vec2 t = imgAt(fc);
  if (!inside(t)) return 1.0;                     // outside the illustration reads as background
  vec4 c = texture2D(uTex, t);
  float l = clamp((luma(c.rgb) - uLuma.x) / (uLuma.y - uLuma.x), 0.0, 1.0);
  return mix(1.0, l, c.a);
}
float coverageAt(vec2 fc){                        // 1 on the subject, 0 in the empty field
  vec2 t = imgAt(fc);
  return inside(t) ? texture2D(uTex, t).a : 0.0;
}
float contrast(float l, float k){ return clamp((l - 0.5) * k + 0.5, 0.0, 1.0); }
vec3 duotone(float l, vec3 sh, vec3 hi){ return mix(sh, hi, l); }
`

const MAIN = `
void main(){
  vec3 col = effect();
  col += (hash(floor(gl_FragCoord.xy / (2.0 * uDpr)) + 19.19) - 0.5) * uGrain;   // print grain

  vec2 t = imgAt(gl_FragCoord.xy);
  vec4 src = inside(t) ? texture2D(uTex, t) : vec4(0.0);
  vec3 plain = mix(uPlain, src.rgb, src.a);

  // Reveal dissolves in coarse dithered blocks rather than a soft fade.
  float m = step(hash(floor(gl_FragCoord.xy / (6.0 * uDpr)) + 3.7), uReveal);
  gl_FragColor = vec4(mix(clamp(col, 0.0, 1.0), plain, m), 1.0);
}
`

const EFFECTS = {
  duotone: `
  uniform float uContrast;
  uniform vec3 uShadow, uHigh, uBg;
  vec3 effect(){
    float l = contrast(sampleLuma(gl_FragCoord.xy), uContrast);
    return mix(uBg, duotone(l, uShadow, uHigh), coverageAt(gl_FragCoord.xy));
  }`,

  mosaic: `
  uniform float uBlock, uContrast, uGrid, uGridW, uChecker;
  uniform vec3 uShadow, uHigh, uBg;
  vec3 effect(){
    float b = uBlock * uDpr;
    vec2 cell = floor(gl_FragCoord.xy / b);
    vec2 c = (cell + 0.5) * b;
    float cov = coverageAt(c);
    float l = contrast(sampleLuma(c), uContrast);
    float checker = mod(cell.x + cell.y, 2.0);
    vec3 col = mix(uBg * (1.0 - uChecker * checker), duotone(l, uShadow, uHigh), cov);
    vec2 f = fract(gl_FragCoord.xy / b);
    float line = clamp(step(f.x, uGridW) + step(f.y, uGridW), 0.0, 1.0);
    line *= 1.0 - step(0.5, cov);                 // grid only on the background
    return mix(col, col * 0.35, line * uGrid);
  }`,

  halftone: `
  uniform float uDot, uAngle, uContrast;
  uniform vec3 uBg, uInk;
  vec3 effect(){
    float l = contrast(sampleLuma(gl_FragCoord.xy), uContrast);
    vec2 p = rot(radians(uAngle)) * gl_FragCoord.xy;
    float d = length(fract(p / (uDot * uDpr)) - 0.5);
    float r = sqrt(1.0 - l) * 0.55;
    return mix(uBg, uInk, smoothstep(r, r - 0.06, d));
  }`,

  dither: `
  uniform float uPixel, uContrast;
  uniform vec3 uBg, uInk;
  float Bayer2(vec2 a){ a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
  float Bayer4(vec2 a){ return Bayer2(0.5 * a) * 0.25 + Bayer2(a); }
  float Bayer8(vec2 a){ return Bayer4(0.5 * a) * 0.25 + Bayer4(a); }
  vec3 effect(){
    float px = uPixel * uDpr;
    vec2 cell = floor(gl_FragCoord.xy / px);
    float l = contrast(sampleLuma((cell + 0.5) * px), uContrast);
    return mix(uBg, uInk, step(l, Bayer8(cell)));
  }`,

  chromatic: `
  uniform float uOffset, uContrast;
  uniform vec3 uShadow, uHigh, uBg;
  vec3 effect(){
    float a = uTime * 0.25;                       // the split slowly orbits
    vec2 dir = vec2(cos(a), sin(a)) * uOffset * uDpr;
    vec2 fc = gl_FragCoord.xy;
    vec3 cR = duotone(contrast(sampleLuma(fc + dir), uContrast), uShadow, uHigh);
    vec3 cG = duotone(contrast(sampleLuma(fc), uContrast), uShadow, uHigh);
    vec3 cB = duotone(contrast(sampleLuma(fc - dir), uContrast), uShadow, uHigh);
    float cov = max(coverageAt(fc + dir), max(coverageAt(fc), coverageAt(fc - dir)));
    return mix(uBg, vec3(cR.r, cG.g, cB.b), cov);
  }`,

  ascii: `
  uniform sampler2D uAtlas;
  uniform float uCell, uContrast, uLevels, uLighten, uCount;
  uniform vec3 uFill, uChar, uBg;
  vec3 effect(){
    float cs = uCell * uDpr;
    vec2 cell = floor(gl_FragCoord.xy / cs);
    vec2 c = (cell + 0.5) * cs;
    float l = clamp(contrast(sampleLuma(c), uContrast) + uLighten, 0.0, 1.0);
    float steps = max(uLevels, 2.0);
    l = clamp(floor(l * steps) / (steps - 1.0), 0.0, 1.0);
    float idx = floor((1.0 - l) * (uCount - 0.001));   // darker -> denser glyph
    vec2 sub = fract(gl_FragCoord.xy / cs);
    float glyph = texture2D(uAtlas, vec2((idx + sub.x) / uCount, sub.y)).r;
    return mix(uBg, mix(uFill, uChar, glyph), smoothstep(0.45, 0.8, coverageAt(c)));
  }`,

  edge: `
  uniform float uStrength, uThresh, uThickness;
  uniform vec3 uBg, uFill, uEdge;
  vec3 effect(){
    float e = uThickness * uDpr;
    vec2 fc = gl_FragCoord.xy;
    float tl = sampleLuma(fc + vec2(-e,  e)), t = sampleLuma(fc + vec2(0.0,  e)), tr = sampleLuma(fc + vec2( e,  e));
    float lf = sampleLuma(fc + vec2(-e, 0.0)),                                   rt = sampleLuma(fc + vec2( e, 0.0));
    float bl = sampleLuma(fc + vec2(-e, -e)), bt = sampleLuma(fc + vec2(0.0, -e)), br = sampleLuma(fc + vec2( e, -e));
    float gx = -tl - 2.0 * lf - bl + tr + 2.0 * rt + br;
    float gy =  tl + 2.0 * t  + tr - bl - 2.0 * bt - br;
    float g = smoothstep(uThresh, uThresh + 0.15, length(vec2(gx, gy)) * uStrength);
    return mix(uBg, mix(uFill, uEdge, g), coverageAt(fc));
  }`,

  invert: `
  uniform float uContrast, uLevels;
  uniform vec3 uDeep, uShadow, uMid, uHigh, uBg;
  vec3 effect(){
    float l = contrast(sampleLuma(gl_FragCoord.xy), uContrast);
    float steps = max(uLevels, 2.0);
    l = clamp(floor(l * steps) / (steps - 1.0), 0.0, 1.0);
    float t = l * 3.0;
    vec3 fx = t < 1.0 ? mix(uDeep, uShadow, t)
            : t < 2.0 ? mix(uShadow, uMid, t - 1.0)
                      : mix(uMid, uHigh, t - 2.0);
    return mix(uBg, fx, coverageAt(gl_FragCoord.xy));
  }`,
}

export const EFFECT_NAMES = Object.keys(EFFECTS)

export const ASCII_GLYPHS = ' .:;+/?*sS%$#@'

export function fragmentFor(name) {
  return COMMON + EFFECTS[name] + MAIN
}
