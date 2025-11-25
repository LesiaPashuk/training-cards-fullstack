import { useState } from 'react'
import { memo } from 'react'

import './App.css'
import { AppRoutes } from './components/AppRoutes'
function App() {
 
  return (
    <>
    <AppRoutes></AppRoutes>
    </>
  )
}

export default  memo(App)
