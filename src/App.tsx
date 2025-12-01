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
              <span style={{ marginRight: '1rem', color: '#666' }}>
                {user.name}님 환영합니다!
              </span>
              <NavLink to="/chatbot">AI 상담</NavLink>
              <button
                onClick={logout}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
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
