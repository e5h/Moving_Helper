import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import {NavigationProvider} from "./components/NavigationContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <NavigationProvider>
          <App />
      </NavigationProvider>
  </StrictMode>,
)
