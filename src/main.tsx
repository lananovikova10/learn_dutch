import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { AIHintProvider } from './contexts/AIHintContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AIHintProvider>
        <App />
      </AIHintProvider>
    </ThemeProvider>
  </StrictMode>,
)