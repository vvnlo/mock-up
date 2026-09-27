import { useState } from 'react'
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
            <span className="chips detail">
              {t.projects.map((p) => <span className="chip" key={p}>{p}</span>)}
            </span>
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
      <header className="company-head">
        <span className="co" id={`${c.id}-name`}>
          <span className="logo" aria-hidden="true">{c.logo}</span>
          {c.name}
        </span>
        <span className="years">{c.years}</span>
      </header>
      <h2 className="claim">{c.claim}</h2>
      <p className="summary detail">{c.summary}</p>
      {c.roles && (
        <ul className="roles detail">
          {c.roles.map((r) => <li key={r}>{r}</li>)}
        </ul>
      )}

      {c.teams && (
        <>
          <Teams
            teams={c.teams}
            active={activeTeam}
            onHover={setActiveTeam}
            onPick={(team) => setJump({ team, at: Date.now() })}
          />
          <p className="hint detail">Hover a team to see its work. Click to jump to it.</p>
        </>
      )}

      <Gallery
        frames={c.gallery}
        label={`${c.name} work`}
        activeTeam={activeTeam}
        onHoverTeam={c.teams ? setActiveTeam : undefined}
        jump={jump}
      />

      <div className="cases detail">
        <span className="cases-label">Case studies</span>
        {c.caseStudies.map((cs) => (
          <a className="case" href={cs.href} key={cs.title}>
            {cs.locked && <LockIcon />}
            {cs.title}
          </a>
        ))}
      </div>
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
              <a href={`#${c.id}`}>
                <span className="co"><span className="logo" aria-hidden="true">{c.logo}</span>{c.name}</span>
                <span className="what">{c.oneLiner}</span>
                <span className="years">{c.years}</span>
              </a>
            </li>
          ))}
          <li className="muted">
            <a href={`#${earlier.id}`}>
              <span className="co"><span className="logo" aria-hidden="true">{earlier.logo}</span>{earlier.name}</span>
              <span className="what">{earlier.oneLiner}</span>
              <span className="years">{earlier.years}</span>
            </a>
          </li>
        </ol>

        {companies.map((c) => <Company c={c} key={c.id} />)}

        <section className="earlier detail" id={earlier.id}>
          <header className="company-head">
            <span className="co"><span className="logo" aria-hidden="true">{earlier.logo}</span>Earlier: {earlier.name}</span>
            <span className="years">{earlier.years}</span>
          </header>
          <p>{earlier.text}</p>
        </section>

        <footer className="footer detail">
          <span>{intro.email}</span>
          <a href={intro.bioUrl}>Back to vvnlo.com</a>
        </footer>
      </div>
    </div>
  )
}
