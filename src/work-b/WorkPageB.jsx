// Version B: styled after vvnlo.com (one type size, hairline rules, text beside image),
// in black and white. Shares content and the gallery with version A.
import { useEffect, useState } from 'react'
import { intro, companies } from '../work/content.js'
import Gallery from '../work/Gallery.jsx'
import Media from '../work/Media.jsx'

function readTheme() {
  try {
    return localStorage.getItem('work-theme')
  } catch {
    return null
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme ? theme === 'dark' : systemDark

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    try {
      if (theme) localStorage.setItem('work-theme', theme)
    } catch {
      // Storage can be unavailable; the toggle still works for this visit.
    }
  }, [theme])

  return (
    <button
      type="button"
      className="icon-button"
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <svg viewBox="0 0 48 48" width="12" height="12" fill="none" aria-hidden="true">
        <rect x="3.5" y="3.5" width="41" height="41" rx="20.5" stroke="currentColor" strokeWidth="5" />
        {isDark ? (
          <path d="M46.6365 24C46.6365 11.2975 36.339 1 23.6365 1V47C36.339 47 46.6365 36.7025 46.6365 24Z" fill="currentColor" />
        ) : (
          <path d="M1.36353 24C1.36353 11.2975 11.661 1 24.3635 1V47C11.661 47 1.36353 36.7025 1.36353 24Z" fill="currentColor" />
        )}
      </svg>
    </button>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard can be blocked; the address stays selectable.
    }
  }
  return (
    <button type="button" className="copy-button" onClick={copy} aria-label={`Copy ${text}`} title="Copy email">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {copied ? (
          <path d="M4 13 L9.5 18.5 L20 6" />
        ) : (
          <>
            <path d="M10 8h10s2 0 2 2v10s0 2 -2 2H10s-2 0 -2 -2V10s0 -2 2 -2" />
            <path d="M4 16c-1.1 0 -2 -0.9 -2 -2V4c0 -1.1 0.9 -2 2 -2h10c1.1 0 2 0.9 2 2" />
          </>
        )}
      </svg>
    </button>
  )
}

function Label({ children }) {
  return <span className="link-label">{children}</span>
}

function Logo({ src }) {
  return src ? <img className="link-logo" src={src} alt="" width="20" height="20" /> : null
}

function Company({ c }) {
  return (
    <section className="row" id={c.id} aria-labelledby={`${c.id}-headline`}>
      <span className="rule rule--top" aria-hidden="true" />
      <div className="cell cell-text">
        <p className="greeting">
          {c.name}
          <Logo src={c.logo} />
        </p>
        <h2 className="headline" id={`${c.id}-headline`}>{c.headline}</h2>
        <p className="muted">{c.position}, {c.years}</p>
        <div className="about detail">
          {c.summary.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
          <p>
            Case studies:{' '}
            {c.caseStudies.map((cs, i) => (
              <span key={cs.title}>
                <a href={cs.href}><Label>{cs.title}</Label></a>
                {i < c.caseStudies.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="cell cell-media">
        <Gallery frames={c.gallery} label={`${c.name} work`} />
      </div>
    </section>
  )
}

export default function WorkPageB() {
  const [skim, setSkim] = useState(false)
  const [preview, setPreview] = useState(companies[0].id)

  return (
    <div className={skim ? 'site skimming' : 'site'}>
      <nav className="corner corner--left">
        <a href={intro.bioUrl}><Label>← {intro.name}</Label></a>
      </nav>
      <div className="corner corner--right">
        <button type="button" className="skim" aria-pressed={skim} onClick={() => setSkim(!skim)}>
          30-second read
        </button>
        <ThemeToggle />
      </div>

      <main className="column">
        <span className="rule rule--left" aria-hidden="true" />
        <span className="rule rule--right" aria-hidden="true" />

        <section className="row row--intro" aria-labelledby="page-title">
          <span className="rule rule--top" aria-hidden="true" />
          <div className="cell cell-text">
            <h1 className="greeting" id="page-title">{intro.title}</h1>
            <ol className="toc">
              {companies.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onMouseEnter={() => setPreview(c.id)}
                    onFocus={() => setPreview(c.id)}
                  >
                    <Label>{c.name}</Label>
                    <Logo src={c.logo} />
                  </a>
                  <span className="muted">{c.title}, {c.years}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="cell cell-media cell-preview" aria-hidden="true">
            {companies.map((c) => (
              <div className={c.id === preview ? 'preview on' : 'preview'} key={c.id}>
                <div className={`frame frame-${c.gallery[0].size}`}>
                  <Media item={c.gallery[0]} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {companies.map((c) => <Company c={c} key={c.id} />)}

        <section className="row row--contact">
          <span className="rule rule--top" aria-hidden="true" />
          <span className="rule rule--bottom" aria-hidden="true" />
          <div className="cell cell-text detail">
            <p>
              You can reach me at{' '}
              <span className="nowrap">
                <a href={`mailto:${intro.email}`}><Label>{intro.email}</Label></a>
                <CopyButton text={intro.email} />,
              </span>{' '}
              or on <a href={intro.linkedin}><Label>LinkedIn</Label></a> and{' '}
              <a href={intro.x}><Label>X</Label></a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
