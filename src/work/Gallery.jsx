import { useCallback, useEffect, useRef, useState } from 'react'
import Media from './Media.jsx'

const smooth = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

function Frame({ frame, index, activeTeam, onHoverTeam }) {
  // Frames after the first fade out in the 30-second read.
  const detail = index > 0 ? ' detail' : ''
  const on = activeTeam && frame.team === activeTeam ? ' on' : ''
  const hover = onHoverTeam
    ? { onMouseEnter: () => onHoverTeam(frame.team), onMouseLeave: () => onHoverTeam(null) }
    : {}
  if (frame.size === 'grid') {
    return (
      <figure className={`frame frame-grid${detail}${on}`} data-team={frame.team} {...hover}>
        <div className="frame-box grid-box">
          {frame.items.map((item) => (
            <div className="cell" key={item.title}>
              <Media item={item} />
              <span className="cell-cap">{item.title}</span>
            </div>
          ))}
        </div>
        <figcaption>
          <strong>{frame.title}</strong>
          {frame.note && <span>{frame.note}</span>}
        </figcaption>
      </figure>
    )
  }
  return (
    <figure className={`frame frame-${frame.size}${detail}${on}`} data-team={frame.team} {...hover}>
      <div className="frame-box">
        <Media item={frame} />
      </div>
      <figcaption>
        <strong>{frame.title}</strong>
        {frame.note && <span>{frame.note}</span>}
      </figcaption>
    </figure>
  )
}

export default function Gallery({ frames, label, activeTeam, onHoverTeam, jump }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const [pos, setPos] = useState({ index: 0, atStart: true, atEnd: false })

  const frameLefts = useCallback(() => {
    const el = ref.current
    const pad = parseFloat(getComputedStyle(el).paddingLeft)
    return [...el.children].map((c) => c.offsetLeft - pad)
  }, [])

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const lefts = frameLefts()
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    let index = 0
    lefts.forEach((l, i) => { if (l <= el.scrollLeft + 8) index = i })
    setPos({ index: atEnd ? lefts.length - 1 : index, atStart: el.scrollLeft <= 4, atEnd })
  }, [frameLefts])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  // Jump to a team's first frame when its row is clicked.
  useEffect(() => {
    if (!jump) return
    const el = ref.current
    const i = frames.findIndex((f) => f.team === jump.team)
    if (i < 0) return
    el.scrollTo({ left: frameLefts()[i], behavior: smooth() })
  }, [jump, frames, frameLefts])

  const go = (dir) => {
    const el = ref.current
    const lefts = frameLefts()
    const target =
      dir > 0
        ? lefts.find((l) => l > el.scrollLeft + 8)
        : [...lefts].reverse().find((l) => l < el.scrollLeft - 8)
    el.scrollTo({ left: target ?? (dir > 0 ? el.scrollWidth : 0), behavior: smooth() })
  }

  // Drag to scroll with a mouse. Touch and trackpads scroll natively.
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
    const lefts = frameLefts()
    const nearest = lefts.reduce((a, b) => (Math.abs(b - el.scrollLeft) < Math.abs(a - el.scrollLeft) ? b : a), 0)
    el.scrollTo({ left: nearest, behavior: smooth() })
  }

  return (
    <div className="gallery">
      <div
        className={activeTeam ? 'strip focus' : 'strip'}
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {frames.map((frame, i) => (
          <Frame frame={frame} index={i} key={frame.title + i} activeTeam={activeTeam} onHoverTeam={onHoverTeam} />
        ))}
      </div>
      <div className="strip-bar detail">
        <span className="count">
          {pos.index + 1} / {frames.length}
        </span>
        <div className="arrows">
          <button type="button" onClick={() => go(-1)} disabled={pos.atStart} aria-label="Previous">
            ←
          </button>
          <button type="button" onClick={() => go(1)} disabled={pos.atEnd} aria-label="Next">
            →
          </button>
        </div>
      </div>
    </div>
  )
}
