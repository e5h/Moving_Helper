import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import {NavigationProvider} from "./components/NavigationContext.tsx";
import {CacheProvider} from "./components/CacheContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CacheProvider>
          <NavigationProvider>
              <App />
          </NavigationProvider>
      </CacheProvider>
  </StrictMode>,
)
