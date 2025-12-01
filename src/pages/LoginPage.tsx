import './pages.css'
import { useState } from 'react'
import type { FormEvent } from 'react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setMessage(`${email}로 로그인 시도`)
  }

  const handleGoogleLogin = async () => {
    const access_token = "토큰토큰토큰토큰토큰토큰토큰토큰토큰토큰토큰토큰토큰토큰"

    try {
      const response = await fetch("http://localhost:8000/auth/google", {
        method: "POST",
        headers: {
          "accept": "application/json"
          ,"Content-Type": "application/json"
        },
        body: JSON.stringify({
          access_token: access_token
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} 오류`)
      }

      const result = await response.json()
      setMessage(`${JSON.stringify(result)}: 로그인되었습니다.`)
    } catch (error) {
      console.error(error)
      setMessage(`${error}`)
    }
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
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit">로그인</button>
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
