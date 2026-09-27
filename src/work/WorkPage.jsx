import { useEffect, useRef, useState } from 'react'
import { intro, companies, earlier } from './content.js'
import Gallery from './Gallery.jsx'

function LockIcon() {
  return (
    <svg className="lock" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2" y="5.5" width="8" height="5.5" rx="1" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
    </svg>
  )
}

function SkimToggle({ on, onChange }) {
  return (
    <button type="button" className="skim" aria-pressed={on} onClick={() => onChange(!on)}>
      <span className="switch" aria-hidden="true" />
      30-second read
    </button>
  )
}

// The same row is used in the list at the top and as each section's sticky header.
function RowContent({ c, headingId }) {
  return (
    <>
      <span className="co" id={headingId}>
        <span className="logo" aria-hidden="true">{c.logo}</span>
        {c.name}
      </span>
      <span className="row-text">
        <span className="headline">{c.headline}</span>
        <span className="position">{c.position}</span>
      </span>
      <span className="years">{c.years}</span>
    </>
  )
}

function StickyRow({ c }) {
  const ref = useRef(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setStuck(e.intersectionRatio < 1), {
      threshold: [1],
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <header className={stuck ? 'row sticky stuck' : 'row sticky'} ref={ref}>
      <RowContent c={c} headingId={`${c.id}-name`} />
    </header>
  )
}

function CaseStudies({ items }) {
  return (
    <p className="cases">
      Case studies:{' '}
      {items.map((cs, i) => (
        <span key={cs.title}>
          <a href={cs.href}>
            {cs.title}
            {cs.locked && <LockIcon />}
          </a>
          {i < items.length - 1 && ', '}
        </span>
      ))}
    </p>
  )
}

function Teams({ teams, active, onHover, onPick }) {
  return (
    <div className="teams">
      {teams.map((t) => (
        <button
          type="button"
          className={active === t.id ? 'team on' : 'team'}
          key={t.id}
          onMouseEnter={() => onHover(t.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(t.id)}
          onBlur={() => onHover(null)}
          onClick={() => onPick(t.id)}
        >
          <span className="team-name">
            <strong>{t.name}</strong>
            <span className="detail">{t.role}</span>
          </span>
          <span className="team-body">
            <span className="team-scope">{t.scope}</span>
            <span className="projects detail">{t.projects.join(' · ')}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

function Company({ c }) {
  const [activeTeam, setActiveTeam] = useState(null)
  const [jump, setJump] = useState(null)

  return (
    <section className="company" id={c.id} aria-labelledby={`${c.id}-name`}>
      <StickyRow c={c} />
      <div className="company-body">
        <div className="about detail">
          <p className="summary">{c.summary}</p>
          <CaseStudies items={c.caseStudies} />
        </div>

        {c.teams && (
          <Teams
            teams={c.teams}
            active={activeTeam}
            onHover={setActiveTeam}
            onPick={(team) => setJump({ team, at: Date.now() })}
          />
        )}
      </div>

      <Gallery
        frames={c.gallery}
        label={`${c.name} work`}
        activeTeam={activeTeam}
        onHoverTeam={c.teams ? setActiveTeam : undefined}
        jump={jump}
      />
    </section>
  )
}

export default function WorkPage() {
  const [skim, setSkim] = useState(false)

  return (
    <div className={skim ? 'site skimming' : 'site'}>
      <div className="page">
        <nav className="topbar">
          <a className="back" href={intro.bioUrl}>← {intro.name}</a>
          <div className="topbar-right">
            <span className="email detail">{intro.email}</span>
            <SkimToggle on={skim} onChange={setSkim} />
          </div>
        </nav>

        <header className="intro">
          <h1>{intro.title}</h1>
          <p className="detail">{intro.summary}</p>
          <p className="nda detail"><LockIcon />{intro.nda}</p>
        </header>

        <ol className="toc">
          {companies.map((c) => (
            <li key={c.id}>
              <a className="row" href={`#${c.id}`}>
                <RowContent c={c} />
              </a>
            </li>
          ))}
          <li className="muted">
            <a className="row" href={`#${earlier.id}`}>
              <RowContent c={earlier} />
            </a>
          </li>
        </ol>

        {companies.map((c) => <Company c={c} key={c.id} />)}

        <section className="company earlier" id={earlier.id} aria-labelledby={`${earlier.id}-name`}>
          <header className="row muted">
            <RowContent c={earlier} headingId={`${earlier.id}-name`} />
          </header>
          <div className="company-body">
            <p className="summary detail">{earlier.text}</p>
          </div>
        </section>

        <footer className="footer detail">
          <span>{intro.email}</span>
          <a href={intro.bioUrl}>Back to vvnlo.com</a>
        </footer>
      </div>
    </div>
  )
}
