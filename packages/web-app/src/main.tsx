import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { YouVersionProvider } from '@youversion/platform-react-ui'
import './index.css'
import App from './App.tsx'

const appKey = import.meta.env.VITE_YOUVERSION_APP_KEY as string

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <YouVersionProvider appKey={appKey}>
      <App />
    </YouVersionProvider>
  </StrictMode>
)
