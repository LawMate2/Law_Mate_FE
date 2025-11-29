import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AgentPage, ChatbotPage, LoginPage } from './pages'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function AppContent() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="logo-dot" />
          <strong>LawMate</strong>
        </div>
        <nav>
          {!isAuthenticated ? (
            <NavLink to="/login">로그인</NavLink>
          ) : (
            <>
              <NavLink to="/chatbot">챗봇</NavLink>
              <NavLink to="/agent">에이전트</NavLink>
              <button onClick={logout} className="logout-btn">로그아웃</button>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <ProtectedRoute>
                <AgentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
