// Version B: styled after vvnlo.com (one type size, hairline rules, underline links),
// in black and white. Each company is a text band above a full-width gallery band.
// Shares content and the gallery with version A.
import { useEffect, useState } from 'react'
import { intro, companies } from '../work/content.js'
import Gallery from '../work/Gallery.jsx'
import ResumeButton from '../work/ResumeButton.jsx'
import Badges from '../work/Badges.jsx'

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
    <section className="section" id={c.id} aria-labelledby={`${c.id}-headline`}>
      <div className="band band--text">
        <p className="greeting band-label">
          {c.name}
          <Logo src={c.logo} />
        </p>
        <div className="band-left">
          <h2 className="headline" id={`${c.id}-headline`}>{c.headline}</h2>
          <p className="muted meta">{c.position} · <Badges modes={c.modes} className="meta-badges" /> · <span className="nowrap">{c.years}</span></p>
        </div>
        <div className="band-right about detail">
          {c.summary.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
          {c.caseStudies.length > 0 && (
            <p>
              {c.caseStudies.length > 1 ? 'Case studies' : 'Case study'}:{' '}
              {c.caseStudies.map((cs, i) => (
                <span key={cs.title}>
                  <a className="case-link" href={cs.href} aria-label={`${cs.title} (password protected)`}>
                    <Label>{cs.title}</Label>
                    {/* lock-2-fill from Remix Icon (Apache-2.0) */}
                    <svg className="lock" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                      <path d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM11 15.7324V18H13V15.7324C13.5978 15.3866 14 14.7403 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 14.7403 10.4022 15.3866 11 15.7324ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16Z" />
                    </svg>
                  </a>
                  {i < c.caseStudies.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
      {c.gallery.length > 0 && (
        <div className="band band--gallery">
          <Gallery frames={c.gallery} label={`${c.name} work`} />
        </div>
      )}
    </section>
  )
}

export default function WorkPageB() {
  const [skim, setSkim] = useState(false)

  return (
    <div className={skim ? 'site skimming' : 'site'}>
      <header className="topbar">
        <a className="brand" href={intro.bioUrl}><Label>{intro.name}</Label></a>
        <div className="topbar-right">
          <button type="button" className="skim" aria-pressed={skim} onClick={() => setSkim(!skim)}>
            <span className="switch" aria-hidden="true" />
            30s read
          </button>
          <span className="topbar-divider" aria-hidden="true" />
          <ThemeToggle />
        </div>
      </header>

      <main className="frame-box">
        <span className="rule rule--left" aria-hidden="true" />
        <span className="rule rule--right" aria-hidden="true" />

        <section className="section" aria-labelledby="page-title">
          <div className="band band--intro">
            <h1 className="headline" id="page-title">{intro.title}</h1>
            <p className="blurb">{intro.blurb}</p>
            <ol className="toc">
              {companies.map((c) => (
                <li key={c.id}>
                  {c.listOnly ? (
                    <span className="toc-name">
                      {c.name}
                      <Logo src={c.logo} />
                    </span>
                  ) : (
                    <a href={`#${c.id}`}>
                      <Label>{c.name}</Label>
                      <Logo src={c.logo} />
                    </a>
                  )}
                  <span className="muted toc-title">{c.title}</span>
                  <Badges modes={c.modes} className="toc-badges" />
                  <span className="muted years">{c.years}</span>
                </li>
              ))}
            </ol>
            <ResumeButton href={intro.resumeUrl} />
          </div>
        </section>

        {companies.filter((c) => !c.listOnly).map((c) => <Company c={c} key={c.id} />)}

        <footer className="section footer detail">
            <p>
              You can reach me at{' '}
              <span className="nowrap">
                <a href={`mailto:${intro.email}`}><Label>{intro.email}</Label></a>
                <CopyButton text={intro.email} />,
              </span>{' '}
              or on <a href={intro.linkedin}><Label>LinkedIn</Label></a> and{' '}
              <a href={intro.x}><Label>X</Label></a>.
            </p>
            <span className="footer-year">© 2026</span>
        </footer>
      </main>
    </div>
  )
}
