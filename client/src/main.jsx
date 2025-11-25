import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import {ThemeProvider} from './contexts/ThemeContext'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {setupStore, /*store*/} from '../src/store/store.ts'
import { Provider } from 'react-redux'
const store = setupStore()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ThemeProvider>
       <BrowserRouter><App /></BrowserRouter>
    </ThemeProvider>
   </Provider>
  </StrictMode>,
)
