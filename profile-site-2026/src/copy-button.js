// Copy buttons: copy `data-copy` to the clipboard and show a check mark for a moment.
const COPIED_MS = 1400

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Clipboard API blocked (e.g. inside an iframe): fall back to a hidden textarea.
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    if (!ok) throw new Error('Copy failed')
  }
}

export function mountCopyButtons(root = document) {
  for (const button of root.querySelectorAll('.copy-button[data-copy]')) {
    const label = button.getAttribute('aria-label')
    let timer
    button.addEventListener('click', async () => {
      try {
        await copyText(button.dataset.copy)
      } catch {
        return
      }
      button.classList.add('is-copied')
      button.setAttribute('aria-label', 'Email copied')
      button.title = 'Copied'
      clearTimeout(timer)
      timer = setTimeout(() => {
        button.classList.remove('is-copied')
        button.setAttribute('aria-label', label)
        button.title = 'Copy email'
      }, COPIED_MS)
    })
  }
}
