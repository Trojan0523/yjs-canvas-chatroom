import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import Home from './components/Home'
import Canvas from './components/Canvas'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  text-align: center;
`

function App() {
  return (
    <Router>
      <AppContainer>
        <h1>Collaborative Canvas Chatroom</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Canvas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppContainer>
    </Router>
  )
}

export default App
