// Toggles between the cobalt (dark, default) and parchment (light) themes and remembers the choice.
export function mountThemeToggle(button, onChange) {
  const root = document.documentElement

  const sync = () => {
    const light = root.dataset.theme === 'light'
    button.setAttribute('aria-pressed', String(light))
    button.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`)
  }

  button.addEventListener('click', () => {
    const light = root.dataset.theme !== 'light'
    if (light) root.dataset.theme = 'light'
    else delete root.dataset.theme
    try {
      localStorage.setItem('theme', light ? 'light' : 'dark')
    } catch {
      // Storage unavailable (private mode, sandboxed frame): the toggle still works for this visit.
    }
    sync()
    onChange?.()
  })

  sync()
}
