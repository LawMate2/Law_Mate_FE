import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AgentPage, ChatbotPage, LoginPage, GoogleCallbackPage } from './pages'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="logo-dot" />
          <strong>LawMate</strong>
        </div>
        <nav>
          {isAuthenticated && user ? (
            <>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                color: '#475569',
                fontWeight: '600'
              }}>
                {user.name}님 환영합니다!
              </span>
              <NavLink to="/chatbot">AI 상담</NavLink>
              <button
                onClick={logout}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '1000px',
                  color: '#475569',
                  fontWeight: '600',
                  border: '1px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eff6ff'
                  e.currentTarget.style.borderColor = '#1d4ed8'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 78, 216, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <NavLink to="/login">로그인</NavLink>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />
          <Route path="/agent" element={<AgentPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
