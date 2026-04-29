// Importação do StrictMode e createRoot para renderização do React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Importação dos estilos globais CSS
import './index.css'
// Importação do componente principal App
import App from './App.jsx'

// Renderização do componente App envolto em StrictMode no elemento raiz do DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
