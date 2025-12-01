import '../styles/common.css'
import '../styles/LoginPage.css'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../services'
import { useAuth } from '../contexts/AuthContext'
import googleLogo from '../images/google_logo.png'

function LoginPage() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chatbot')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (!code && !errorParam) {
      return
    }

    const cleanedParams = new URLSearchParams(searchParams)
    cleanedParams.delete('code')
    cleanedParams.delete('error')
    setSearchParams(cleanedParams, { replace: true })

    if (errorParam) {
      const readableError = decodeURIComponent(errorParam)
      setMessage(`Google 로그인 실패: ${readableError}`)
      return
    }

    if (!code) {
      return
    }

    const finishGoogleLogin = async () => {
      setIsLoading(true)
      setMessage('Google 계정 정보를 확인 중입니다...')
      try {
        const response = await api.exchangeGoogleCode(code)
        if (response.token) {
          localStorage.setItem('accessToken', response.token)
          login(response.token)
          setMessage(response.message ?? '로그인 완료! 곧 이동합니다.')
          setTimeout(() => {
            navigate('/chatbot')
          }, 1000)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Google 인증을 완료하는 중 문제가 발생했습니다.'
        setMessage(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void finishGoogleLogin()
  }, [searchParams, setSearchParams, login, navigate])

  const handleGoogleLogin = async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setMessage('Google 로그인 페이지로 이동 중입니다...')
    try {
      const { authorizationUrl } = await api.getGoogleAuthUrl()
      window.location.href = authorizationUrl
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google 로그인 진입에 실패했습니다.'
      setMessage(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="page login-page">
      <section className="panel">
        <h1>LawMate 로그인</h1>
        <p className="muted">Google 계정으로 OAuth 인증을 진행하세요.</p>
        <div className="auth-actions">
          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <img src={googleLogo} alt="Google logo" />
            Google 계정으로 로그인
          </button>
          <p className="muted fine-print">
            LawMate는 Google OAuth2를 통해 접근 권한만 요청하며 비밀번호를 저장하지 않습니다.
          </p>
        </div>
        {message && <p className="feedback">{message}</p>}
      </section>
      <section className="panel login-info">
        <h2>LawMate Assistant</h2>
        <p>로그인 후 챗봇과 에이전트 기능을 사용해 Gmail, Drive, Calendar를 한 곳에서 제어할 수 있습니다.</p>
      </section>
    </div>
  )
}

export default LoginPage
