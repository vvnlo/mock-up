import { useEffect, useRef } from 'react'

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Muted looping video. React sets `muted` only as a property, which browsers don't count
// for autoplay, so start it by hand.
function Video({ item }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || reducedMotion) return
    v.muted = true
    v.play().catch(() => {})
  }, [])
  return <video ref={ref} className="media" src={item.src} muted loop playsInline preload="auto" aria-label={item.title} />
}

// One image, video or grey placeholder, filling its box.
export default function Media({ item }) {
  if (!item.src) return <div className="media placeholder" role="img" aria-label={item.title} />
  if (/\.(mp4|webm)$|^data:video\//i.test(item.src)) return <Video item={item} />
  return <img className="media" src={item.src} alt={item.title} loading="lazy" draggable="false" />
}
