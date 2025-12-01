import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AgentPage, ChatbotPage, LoginPage, GoogleCallbackPage } from './pages'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="logo-dot" />
          <strong>LawMate</strong>
        </div>
        <nav>
          <NavLink to="/login">로그인</NavLink>
          <NavLink to="/chatbot">AI 상담</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/agent" element={<AgentPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
