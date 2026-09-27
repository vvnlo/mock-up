const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One image, video or grey placeholder, filling its box.
export default function Media({ item }) {
  if (!item.src) return <div className="media placeholder" role="img" aria-label={item.title} />
  if (/\.(mp4|webm)$/i.test(item.src)) {
    return (
      <video className="media" src={item.src} muted loop playsInline autoPlay={!reducedMotion} aria-label={item.title} />
    )
  }
  return <img className="media" src={item.src} alt={item.title} loading="lazy" draggable="false" />
}
