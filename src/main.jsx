import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { SessionProvider } from './data/session'
import { StoreProvider } from './data/store'
import { ToastProvider } from './data/toast'
import './styles/global.css'
import './styles/timer.css'
import './styles/pages.css'

if (!document.startViewTransition) document.documentElement.classList.add('no-view-transitions')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <StoreProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </StoreProvider>
    </ToastProvider>
  </StrictMode>,
)
