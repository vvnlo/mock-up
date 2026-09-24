import './style.css'
import { mountPortraitFx } from './portrait-fx.js'
import { mountCopyButtons } from './copy-button.js'
import { mountThemeToggle } from './theme-toggle.js'

mountThemeToggle(document.querySelector('.theme-toggle'))
mountCopyButtons()

mountPortraitFx(document.getElementById('portrait')).catch((err) => {
  // The plain illustration stays visible underneath, so a failure only costs the effect.
  console.error('Portrait effect unavailable:', err)
})
