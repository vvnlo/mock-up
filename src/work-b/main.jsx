import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './work-b.css'
import WorkPageB from './WorkPageB.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkPageB />
  </StrictMode>,
)
