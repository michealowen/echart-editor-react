import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainApp from './MainApp'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
    </Routes>
  )
}

export default App