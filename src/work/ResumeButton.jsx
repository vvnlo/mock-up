// "View resume" link styled as a button. Used by both versions; each styles `.cta` itself.
export default function ResumeButton({ href }) {
  return (
    <a className="cta" href={href} target="_blank" rel="noopener noreferrer">
      View resume
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3.5 12.5l9-9M5 3.5h7.5V11" />
      </svg>
    </a>
  )
}
