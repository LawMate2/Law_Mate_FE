import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { authApi } from '../services/api'
import './pages.css'

function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState('Google 로그인 처리 중...')

  useEffect(() => {
    const handleCallback = async () => {
      console.log('[GoogleCallback] 콜백 처리 시작')
      console.log('[GoogleCallback] 현재 URL:', window.location.href)

      const code = searchParams.get('code')
      const error = searchParams.get('error')

      console.log('[GoogleCallback] code:', code)
      console.log('[GoogleCallback] error:', error)

      if (error) {
        console.error('[GoogleCallback] OAuth 에러:', error)
        setMessage(`로그인 실패: ${error}`)

        // 부모 창에 에러 전달
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: error
          }, window.location.origin)
        }

        setTimeout(() => window.close(), 2000)
        return
      }

      if (!code) {
        console.error('[GoogleCallback] 인증 코드가 없습니다')
        setMessage('인증 코드가 없습니다.')

        // 부모 창에 에러 전달
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: '인증 코드가 없습니다.'
          }, window.location.origin)
        }

        setTimeout(() => window.close(), 2000)
        return
      }

      try {
        console.log('[GoogleCallback] 서버로 code 전송 시작')
        setMessage('서버와 통신 중...')

        // authApi를 사용하여 Google 로그인 처리
        const result = await authApi.googleLogin(code)
        console.log('[GoogleCallback] 서버 응답 성공:', result)

        // 부모 창에 성공 결과 전달
        if (result.access_token) {
          setMessage('로그인 성공! 창을 닫는 중...')
          console.log('[GoogleCallback] 로그인 성공, 부모 창으로 토큰 전달')

          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              accessToken: result.access_token,
              refreshToken: result.refresh_token,
              user: result.user
            }, window.location.origin)
          }

          setTimeout(() => window.close(), 1000)
        } else {
          throw new Error('토큰을 받지 못했습니다.')
        }
      } catch (error) {
        console.error('[GoogleCallback] 예외 발생:', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        setMessage(`로그인 실패: ${errorMessage}`)

        // 부모 창에 에러 전달
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: errorMessage
          }, window.location.origin)
        }

        // 에러 시 자동으로 닫지 않고 사용자가 확인할 수 있게 함
        // setTimeout(() => window.close(), 5000)
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="page login-page">
      <section className="panel">
        <h1>Google 로그인</h1>
        <p className="muted">{message}</p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div className="spinner"></div>
        </div>
      </section>
    </div>
  )
}

export default GoogleCallbackPage
