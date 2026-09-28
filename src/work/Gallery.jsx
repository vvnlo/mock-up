import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Media from './Media.jsx'
import './lightbox.css'

const smooth = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

// Full-screen view of one image. Click anywhere or press Esc to close; arrow keys step through.
function Lightbox({ frames, index, onClose, onStep }) {
  const closeRef = useRef(null)
  const frame = frames[index]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={frame.title} onClick={onClose}>
      <Media item={frame} key={frame.src} />
      <button type="button" className="lightbox-close" ref={closeRef} aria-label="Close" onClick={onClose}>
        Close
      </button>
    </div>,
    document.body,
  )
}

// A horizontal strip of images. Scrolls with trackpad or touch, drags with a mouse,
// and opens an image full screen on click.
export default function Gallery({ frames, label }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const badge = useRef(null)
  const [open, setOpen] = useState(-1)
  const viewable = frames.map((f, i) => (f.src ? i : -1)).filter((i) => i >= 0)

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      ref.current.classList.add('dragging')
      ref.current.setPointerCapture(e.pointerId)
    }
    if (d.moved) ref.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    const d = drag.current
    drag.current = null
    if (!d?.moved) return
    const el = ref.current
    el.classList.remove('dragging')
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
    const lefts = [...el.children].map((c) => c.offsetLeft - pad)
    const nearest = lefts.reduce((a, b) => (Math.abs(b - el.scrollLeft) < Math.abs(a - el.scrollLeft) ? b : a), 0)
    el.scrollTo({ left: nearest, behavior: smooth() })
  }

  // "View" badge that follows the cursor over images that can open.
  const moveBadge = (e) => {
    const b = badge.current
    if (!b) return
    b.style.left = `${e.clientX}px`
    b.style.top = `${e.clientY}px`
  }
  const showBadge = (on) => badge.current?.classList.toggle('on', on)

  const step = (dir) =>
    setOpen((cur) => {
      const pos = viewable.indexOf(cur)
      return viewable[(pos + dir + viewable.length) % viewable.length]
    })

  return (
    <>
      <div
        className="strip"
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {frames.map((frame, i) => {
          const className = `frame frame-${frame.size}${i > 0 ? ' detail' : ''}`
          const style = frame.ratio ? { aspectRatio: frame.ratio } : undefined
          if (!frame.src) {
            return (
              <div className={className} style={style} key={frame.title + i}>
                <Media item={frame} />
              </div>
            )
          }
          return (
            <button
              type="button"
              className={`${className} frame-button`}
              style={style}
              key={frame.title + i}
              aria-label={`View ${frame.title}`}
              onClick={() => setOpen(i)}
              onMouseEnter={(e) => { moveBadge(e); showBadge(true) }}
              onMouseMove={moveBadge}
              onMouseLeave={() => showBadge(false)}
            >
              <Media item={frame} />
            </button>
          )
        })}
      </div>
      {viewable.length > 0 && <span className="view-badge" ref={badge} aria-hidden="true">View</span>}
      {open >= 0 && <Lightbox frames={frames} index={open} onClose={() => setOpen(-1)} onStep={step} />}
    </>
  )
}
