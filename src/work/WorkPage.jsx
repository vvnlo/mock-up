import { useState } from 'react'
import { intro, companies } from './content.js'
import Gallery from './Gallery.jsx'
import ResumeButton from './ResumeButton.jsx'
import Badges from './Badges.jsx'

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
      <p className="company-name">{c.name}<Badges modes={c.modes} /></p>
      <h2 className="headline" id={`${c.id}-headline`}>{c.headline}</h2>
      <p className="meta">{c.position} · <span className="nowrap">{c.years}</span></p>

      <div className="about detail">
        {c.summary.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
        {c.caseStudies.length > 0 && (
          <p>
            Case studies:{' '}
            {c.caseStudies.map((cs, i) => (
              <span key={cs.title}>
                <a href={cs.href}>{cs.title}</a>
                {i < c.caseStudies.length - 1 && ', '}
              </span>
            ))}
          </p>
        )}
      </div>

      {c.gallery.length > 0 && <Gallery frames={c.gallery} label={`${c.name} work`} />}
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
        <p className="blurb">{intro.blurb}</p>

        <ol className="toc">
          {companies.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>
                <span className="toc-name">{c.name}</span>
                <span className="toc-title">{c.title}<Badges modes={c.modes} /></span>
                <span className="toc-years">{c.years}</span>
              </a>
            </li>
          ))}
        </ol>
        <ResumeButton href={intro.resumeUrl} />

        {companies.map((c) => <Company c={c} key={c.id} />)}
      </div>
    </div>
  )
}
