import { VERT, EFFECT_NAMES, ASCII_GLYPHS, fragmentFor } from './shaders.js'
import { EFFECT_SETTINGS } from './palette.js'

const PAGE_COBALT = '#1338b5'
const GRAIN = 0.16
const SPLITS = [0.5, 0.62, 0.42, 0.56, 0.47, 0.6]
const REVEAL_MS = 260          // one cell's dissolve
const REVEAL_SPREAD_MS = 240   // extra delay for the cell farthest from the pointer
const INTRO_DELAY_MS = 450
const INTRO_STEP_MS = 80

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const shuffle = (list) => {
  const a = list.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pick = (list) => list[Math.floor(Math.random() * list.length)]

// Recursive split of the square, as in the reference: always cut the largest piece across its
// long side. `time` makes each cut drift gently around its base ratio.
function splitSquare(count, w, h, time) {
  const root = { w, h }
  const leaves = [root]
  let k = 0
  while (leaves.length < count) {
    let best = 0
    for (let i = 1; i < leaves.length; i++) {
      if (leaves[i].w * leaves[i].h > leaves[best].w * leaves[best].h) best = i
    }
    const n = leaves[best]
    n.axis = n.w >= n.h ? 'v' : 'h'
    n.base = SPLITS[k % SPLITS.length]
    n.k = k++
    n.a = n.axis === 'v' ? { w: Math.round(n.w * n.base), h: n.h } : { w: n.w, h: Math.round(n.h * n.base) }
    n.b = n.axis === 'v' ? { w: n.w - n.a.w, h: n.h } : { w: n.w, h: n.h - n.a.h }
    leaves.splice(best, 1, n.a, n.b)
  }

  const out = []
  let index = 0
  const walk = (n, x, y, cw, ch) => {
    if (!n.axis) {
      out.push({ x, y, w: cw, h: ch, index: index++ })
      return
    }
    const r = drift(n.k, n.base, time)
    if (n.axis === 'v') {
      const a = Math.round(cw * r)
      walk(n.a, x, y, a, ch)
      walk(n.b, x + a, y, cw - a, ch)
    } else {
      const a = Math.round(ch * r)
      walk(n.a, x, y, cw, a)
      walk(n.b, x, y + a, cw, ch - a)
    }
  }
  walk(root, 0, 0, w, h)
  return out
}

function drift(k, base, time) {
  const rnd = (m) => {
    const v = Math.sin((k + 1) * m) * 43758.5453
    return v - Math.floor(v)
  }
  const amp = 0.02 + rnd(127.1) * 0.03
  const speed = 0.2 + rnd(311.7) * 0.45
  const phase = rnd(74.7) * Math.PI * 2
  return Math.min(0.85, Math.max(0.15, base + amp * Math.sin(time * speed + phase)))
}

// Stretch range for the illustration's luminance (it is entirely blue, so raw luma is compressed).
function lumaRange(img) {
  const w = 160
  const h = Math.round((w * img.naturalHeight) / img.naturalWidth)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const d = ctx.getImageData(0, 0, w, h).data
  const values = []
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 128) values.push((0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255)
  }
  values.sort((a, b) => a - b)
  const lo = values[Math.floor(values.length * 0.02)] ?? 0
  const hi = values[Math.floor(values.length * 0.98)] ?? 1
  return [lo, Math.max(hi, lo + 0.05)]
}

function glyphAtlas(gl, glyphs) {
  const size = 64
  const c = document.createElement('canvas')
  c.width = size * glyphs.length
  c.height = size
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${Math.round(size * 1.2)}px "SF Mono", ui-monospace, Menlo, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < glyphs.length; i++) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(i * size, 0, size, size)
    ctx.clip()
    ctx.fillText(glyphs[i], i * size + size / 2, size * 0.55)
    ctx.restore()
  }
  return texture(gl, c, { flipY: true })
}

function texture(gl, source, { flipY = false, mipmap = false } = {}) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  if (mipmap) gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
  return s
}

/**
 * Mounts the effect grid on `figure`, which holds the illustration <img> and an overlay <canvas>.
 * Returns false (leaving the plain <img> visible) when WebGL is unavailable.
 */
export async function mountPortraitFx(figure) {
  const img = figure.querySelector('img')
  const canvas = figure.querySelector('canvas')
  const gl2 = canvas.getContext('webgl2', { antialias: false, alpha: false })
  const gl = gl2 || canvas.getContext('webgl', { antialias: false, alpha: false })
  if (!gl) return false

  await img.decode()
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')

  const programs = {}
  const program = (name) => {
    if (programs[name]) return programs[name]
    const p = gl.createProgram()
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fragmentFor(name)))
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
    const loc = new Proxy({}, { get: (cache, key) => (key in cache ? cache[key] : (cache[key] = gl.getUniformLocation(p, key))) })
    programs[name] = { p, loc, aPos: gl.getAttribLocation(p, 'aPos') }
    return programs[name]
  }

  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  // WebGL1 cannot mipmap a non-power-of-two image; WebGL2 can, which keeps the plain state crisp.
  const imgTex = texture(gl, img, { mipmap: !!gl2 })
  const atlas = glyphAtlas(gl, ASCII_GLYPHS)
  const luma = lumaRange(img)
  const plain = hexToRgb(PAGE_COBALT)

  // Keep in sync with .portrait__img in style.css.
  const imgRect = () => {
    const w = 0.9651
    return [0.088, 0.0931, w, (w * img.naturalHeight) / img.naturalWidth]
  }

  // ---- cell state -------------------------------------------------------------------------
  let cells = []
  const newCells = (reveal) => {
    const count = 6 + Math.floor(Math.random() * 4)
    let bag = []
    let last = null
    cells = Array.from({ length: count }, () => {
      if (!bag.length) bag = shuffle(EFFECT_NAMES)
      if (bag[bag.length - 1] === last && bag.length > 1) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]]
      const effect = bag.pop()
      last = effect
      return { effect, settings: pick(EFFECT_SETTINGS[effect]), reveal, target: reveal, startAt: 0 }
    })
  }

  let layout = []
  let elapsed = 0
  let lastFrame = performance.now()
  let running = false
  let visible = true

  const settle = (target, delayFor) => {
    const now = performance.now()
    cells.forEach((c, i) => {
      c.target = target
      c.startAt = reduceMotion.matches ? now : now + delayFor(i)
    })
    kick()
  }

  const settleFrom = (target, px, py) => {
    const rect = figure.getBoundingClientRect()
    const x = (px - rect.left) * (canvas.width / rect.width)
    const y = (py - rect.top) * (canvas.height / rect.height)
    const diag = Math.hypot(canvas.width, canvas.height)
    settle(target, (i) => {
      const r = layout.find((l) => l.index === i)
      if (!r) return 0
      return (Math.hypot(r.x + r.w / 2 - x, r.y + r.h / 2 - y) / diag) * REVEAL_SPREAD_MS
    })
  }

  // ---- rendering --------------------------------------------------------------------------
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(figure.clientWidth * dpr)
    const h = Math.round(figure.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    return dpr
  }

  const draw = (cell, rect, dpr) => {
    const { p, loc, aPos } = program(cell.effect)
    gl.useProgram(p)
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, imgTex)
    gl.uniform1i(loc.uTex, 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, atlas)
    gl.uniform1i(loc.uAtlas, 1)
    gl.uniform1f(loc.uCount, ASCII_GLYPHS.length)
    gl.uniform2f(loc.uRes, canvas.width, canvas.height)
    gl.uniform4fv(loc.uImg, imgRect())
    gl.uniform2fv(loc.uLuma, luma)
    gl.uniform3fv(loc.uPlain, plain)
    gl.uniform1f(loc.uDpr, dpr)
    gl.uniform1f(loc.uTime, elapsed)
    gl.uniform1f(loc.uGrain, GRAIN)
    gl.uniform1f(loc.uReveal, cell.reveal)
    for (const [name, value] of Object.entries(cell.settings)) {
      if (typeof value === 'string') gl.uniform3fv(loc[name], hexToRgb(value))
      else gl.uniform1f(loc[name], value)
    }
    gl.scissor(rect.x, canvas.height - rect.y - rect.h, rect.w, rect.h)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  const frame = (now) => {
    running = false
    if (!visible || gl.isContextLost()) return
    const dt = Math.min(now - lastFrame, 100)
    lastFrame = now
    if (!reduceMotion.matches) elapsed += dt / 1000

    let moving = false
    for (const c of cells) {
      if (c.reveal === c.target || now < c.startAt) {
        moving ||= c.reveal !== c.target
        continue
      }
      const step = reduceMotion.matches ? 1 : dt / REVEAL_MS
      c.reveal = c.target > c.reveal ? Math.min(c.target, c.reveal + step) : Math.max(c.target, c.reveal - step)
      moving ||= c.reveal !== c.target
    }

    const dpr = resize()
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.enable(gl.SCISSOR_TEST)
    layout = splitSquare(cells.length, canvas.width, canvas.height, elapsed)
    for (const rect of layout) draw(cells[rect.index], rect, dpr)
    gl.disable(gl.SCISSOR_TEST)

    if (moving || !reduceMotion.matches) kick()
  }

  function kick() {
    if (running || !visible) return
    running = true
    lastFrame = performance.now()
    requestAnimationFrame(frame)
  }

  // ---- interaction ------------------------------------------------------------------------
  let hovered = false
  const allRevealed = () => cells.every((c) => c.reveal === 1)

  const enter = (e) => {
    hovered = true
    settleFrom(1, e.clientX, e.clientY)
  }
  const leave = (e) => {
    hovered = false
    // While everything shows the plain illustration a new arrangement is invisible, so reshuffle.
    if (allRevealed()) newCells(1)
    settleFrom(0, e.clientX, e.clientY)
  }

  figure.addEventListener('pointerenter', (e) => e.pointerType !== 'touch' && enter(e))
  figure.addEventListener('pointerleave', (e) => e.pointerType !== 'touch' && leave(e))
  figure.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'touch') (hovered ? leave : enter)(e)
  })

  new ResizeObserver(() => kick()).observe(figure)
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden
    kick()
  }).observe(figure)
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden
    kick()
  })
  reduceMotion.addEventListener('change', kick)
  canvas.addEventListener('webglcontextlost', () => figure.classList.remove('is-live'))

  // ---- intro: the plain illustration first, then cells switch on one at a time -------------
  newCells(1)
  figure.classList.add('is-live')
  const order = shuffle(cells.map((_, i) => i))
  settle(0, (i) => INTRO_DELAY_MS + order.indexOf(i) * INTRO_STEP_MS)
  return true
}
