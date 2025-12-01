import './pages.css'
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { devLogin, setAuthData } = useAuth()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('로그인 처리 중...')

    try {
      // AuthContext의 devLogin 메서드 사용
      await devLogin({ email, name: name || undefined })

      setMessage('로그인 성공! 리다이렉트 중...')
      setTimeout(() => navigate('/chatbot'), 1000)
    } catch (error) {
      console.error('개발용 로그인 실패:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessage(`로그인 실패: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 팝업으로부터 메시지 수신
    const handleMessage = async (event: MessageEvent) => {
      // 보안: origin 확인
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { accessToken, refreshToken, user } = event.data

        // AuthContext의 setAuthData 메서드를 사용하여 인증 정보 저장
        setAuthData(accessToken, refreshToken, user)

        setMessage('로그인 성공! 리다이렉트 중...')
        setTimeout(() => navigate('/chatbot'), 1000)
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        setMessage(`로그인 실패: ${event.data.error}`)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [navigate, setAuthData])

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
    const scope = 'openid email profile'

    // Google OAuth URL 생성
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.append('client_id', clientId)
    googleAuthUrl.searchParams.append('redirect_uri', redirectUri)
    googleAuthUrl.searchParams.append('response_type', 'code')
    googleAuthUrl.searchParams.append('scope', scope)
    googleAuthUrl.searchParams.append('access_type', 'offline')
    googleAuthUrl.searchParams.append('prompt', 'consent')

    // 팝업으로 Google 로그인 열기
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      googleAuthUrl.toString(),
      'Google 로그인',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    setMessage('Google 로그인 팝업이 열렸습니다...')
  }

  return (
    <div className="page login-page">
      <section className="panel">
        <h1>LawMate 로그인</h1>
        <p className="muted">LawMate 법률 상담의 모든 기능을 누리세요!</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              placeholder="lawyer@lawmate.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
            />
          </label>
          <label>
            이름 (선택사항)
            <input
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
            />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '개발용 로그인'}
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              marginTop: "0.5rem"
              ,background: "#ffffff"
              ,color: "#444"
              ,border: "1px solid #ccc"
              ,width: "auto"
              ,alignSelf: "center"
              ,display: "flex"
              ,alignItems: "center"
              ,gap: "0.5rem"
              ,padding: "0.5rem 1rem"
            }}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" 
              alt="Google 로그인" 
              width="24" 
              height="24" 
            />
            <span>Google 로그인</span>
          </button>
        </form>
        {message && <p className="feedback">{message}</p>}
      </section>
      <section className="panel login-info">
        <h2>쉽고 빠르고 편리한 법률 상담 서비스</h2>
        <p>단 몇 초면 빠른 AI 상담이 가능합니다.</p>
      </section>
    </div>  //TODO: 자동으로 넘어가ㅡㄴ 슬라이드쇼로 변경 (예: 왜 LawMate인가요?)
  )
}

export default LoginPage
