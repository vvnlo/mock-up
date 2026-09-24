import './style.css'
import { mountPortraitFx } from './portrait-fx.js'

mountPortraitFx(document.getElementById('portrait')).catch((err) => {
  // The plain illustration stays visible underneath, so a failure only costs the effect.
  console.error('Portrait effect unavailable:', err)
})
