import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SavedProvider } from './context/SavedContext'
import { InteractionProvider } from './context/InteractionContext'
import { PlaylistProvider } from './context/PlaylistContext'
import { ToastProvider } from './context/ToastContext'
import { ToastStack } from './components/shared/Toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <InteractionProvider>
        <PlaylistProvider>
          <SavedProvider>
            <App />
            <ToastStack />
          </SavedProvider>
        </PlaylistProvider>
      </InteractionProvider>
    </ToastProvider>
  </React.StrictMode>,
)
