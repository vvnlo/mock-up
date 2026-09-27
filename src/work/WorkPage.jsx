import { useState } from 'react'
import { intro, companies } from './content.js'
import Gallery from './Gallery.jsx'

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
    <section className="company" id={c.id} aria-labelledby={`${c.id}-headline`}>
      <p className="company-name">{c.name}</p>
      <h2 className="headline" id={`${c.id}-headline`}>{c.headline}</h2>
      <p className="meta">
        <span>{c.position}</span>
        <span>{c.years}</span>
      </p>

      <div className="about detail">
        {c.summary.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
        <p>
          Case studies:{' '}
          {c.caseStudies.map((cs, i) => (
            <span key={cs.title}>
              <a href={cs.href}>{cs.title}</a>
              {i < c.caseStudies.length - 1 && ', '}
            </span>
          ))}
        </p>
      </div>

      <Gallery frames={c.gallery} label={`${c.name} work`} />
    </section>
  )
}

export default function WorkPage() {
  const [skim, setSkim] = useState(false)

  return (
    <div className={skim ? 'site skimming' : 'site'}>
      <div className="page">
        <nav className="topbar">
          <a href={intro.bioUrl}>← {intro.name}</a>
          <SkimToggle on={skim} onChange={setSkim} />
        </nav>

        <h1>{intro.title}</h1>

        <ol className="toc">
          {companies.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>
                <span className="toc-name">{c.name}</span>
                <span className="toc-title">{c.title}</span>
                <span className="toc-years">{c.years}</span>
              </a>
            </li>
          ))}
        </ol>

        {companies.map((c) => <Company c={c} key={c.id} />)}
      </div>
    </div>
  )
}
