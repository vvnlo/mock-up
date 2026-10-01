// Small "IC" / "Mgmt" badges for the kind of role. Each version styles `.badge-mode`.
export default function Badges({ modes = [], className = '' }) {
  if (!modes.length) return null
  return (
    <span className={`badges ${className}`.trim()}>
      {modes.map((m) => (
        <span className="badge-mode" key={m} title={m === 'IC' ? 'Individual contributor' : 'Management'}>
          {m}
        </span>
      ))}
    </span>
  )
}
