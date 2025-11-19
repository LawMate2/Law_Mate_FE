import './pages.css'
import { useState } from 'react'
import type { FormEvent } from 'react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    // TODO: Replace with actual login request.
    setMessage(`로그인 시도: ${email}`)
  }

  return (
    <div className="page login-page">
      <section className="panel">
        <h1>LawMate 로그인</h1>
        <p className="muted">발급 받은 계정으로 로그인하세요.</p>
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
        </form>
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
