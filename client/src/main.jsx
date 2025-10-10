import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import {ThemeProvider} from './contexts/ThemeContext'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
       <BrowserRouter><App /></BrowserRouter>
    </ThemeProvider>
   
  </StrictMode>,
)
