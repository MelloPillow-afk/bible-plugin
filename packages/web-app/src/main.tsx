import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { YouVersionProvider } from '@youversion/platform-react-ui'
import { router } from './router'
import './styles/globals.css'

const appKey = import.meta.env.VITE_YOUVERSION_APP_KEY as string

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <YouVersionProvider appKey={appKey}>
      <RouterProvider router={router} />
    </YouVersionProvider>
  </StrictMode>
)
