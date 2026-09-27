import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './work.css'
import WorkPage from './WorkPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkPage />
  </StrictMode>,
)
