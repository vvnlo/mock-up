const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Placeholder({ art }) {
  switch (art) {
    case 'phone':
      return <div className="ph-phone"><i /></div>
    case 'toast':
      return <div className="ph-toast" />
    case 'stack':
      return <div className="ph-stack"><i /><i /><i /></div>
    case 'pills':
      return <div className="ph-pills">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
    case 'rows':
      return <div className="ph-rows" />
    default:
      return <div className="ph-ui"><b /><i /></div>
  }
}

// One image, video or placeholder, filling its box.
export default function Media({ item }) {
  const isVideo = item.src && /\.(mp4|webm)$/i.test(item.src)
  return (
    <div className={`media tone-${item.tone || 'stone'}${item.motion && !item.src ? ' anim' : ''}`}>
      {isVideo ? (
        <video src={item.src} muted loop playsInline autoPlay={!reducedMotion} aria-label={item.title} />
      ) : item.src ? (
        <img src={item.src} alt={item.title} loading="lazy" draggable="false" />
      ) : (
        <Placeholder art={item.art} />
      )}
      {item.motion && <span className="badge">GIF</span>}
    </div>
  )
}
