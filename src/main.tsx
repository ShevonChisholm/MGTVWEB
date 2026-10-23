import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { SavedProvider } from "./context/SavedContext"
import { InteractionProvider } from "./context/InteractionContext"
import { PlaylistProvider } from "./context/PlaylistContext"
import { ToastProvider } from "./context/ToastContext"
import { ToastStack } from "./components/shared/Toast"
import { MediaPlaybackProvider } from "./context/MediaPlaybackContext"
import "./index.css"
import { AppStateProvider } from "./context/AppStateContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <AppStateProvider>
        <InteractionProvider>
          <PlaylistProvider>
            <SavedProvider>
              <MediaPlaybackProvider>
                <App />
              </MediaPlaybackProvider>
              <ToastStack />
            </SavedProvider>
          </PlaylistProvider>
        </InteractionProvider>
      </AppStateProvider>
    </ToastProvider>
  </React.StrictMode>,
)
