import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { DataStoreProvider } from './data/DataStoreProvider.tsx'
import { PrivacyProvider } from './privacy/PrivacyProvider.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataStoreProvider>
          <PrivacyProvider>
            <App />
          </PrivacyProvider>
        </DataStoreProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
