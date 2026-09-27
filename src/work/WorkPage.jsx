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

function Company({ c }) {
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
      <ul className="roles detail">
        {c.roles.map((r) => <li key={r}>{r}</li>)}
      </ul>

      <dl className="impact">
        {c.impact.map((m) => (
          <div key={m.label}>
            <dt>{m.value}</dt>
            <dd>{m.label}</dd>
          </div>
        ))}
      </dl>

      <Gallery frames={c.gallery} label={`${c.name} work`} />

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
