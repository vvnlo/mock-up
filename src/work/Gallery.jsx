import { useRef } from 'react'
import Media from './Media.jsx'

const smooth = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

// A horizontal strip of images. Scrolls with trackpad or touch, and drags with a mouse.
export default function Gallery({ frames, label }) {
  const ref = useRef(null)
  const drag = useRef(null)

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
    const lefts = [...el.children].map((c) => c.offsetLeft)
    const nearest = lefts.reduce((a, b) => (Math.abs(b - el.scrollLeft) < Math.abs(a - el.scrollLeft) ? b : a), 0)
    el.scrollTo({ left: nearest, behavior: smooth() })
  }

  return (
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
      {frames.map((frame, i) => (
        <div className={`frame frame-${frame.size}${i > 0 ? ' detail' : ''}`} key={frame.title + i}>
          <Media item={frame} />
        </div>
      ))}
    </div>
  )
}
