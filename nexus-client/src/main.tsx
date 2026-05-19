import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'


const saved = localStorage.getItem('nexus-theme')
if (saved) {
  const { state } = JSON.parse(saved)
  if (state?.isDark) {
    document.documentElement.classList.add('dark')
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <App />

    </TooltipProvider>
  </StrictMode>,
)