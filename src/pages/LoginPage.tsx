import './pages.css'
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

const slideshow = [
  {
    title: "쉽고 빠르고 편리한 법률 상담 서비스",
    desc: "단 몇 초면 빠른 AI 상담이 가능합니다.",
    image: "https://img.kr.gcp-karroter.net/origin/article/202511/1763204099193bdaa8376b55df1a963a635ecc76984b3c95e47b86d11ad9aff28eb03c55ad5d30.webp?f=webp&q=95&s=1440x1440&t=inside"
  },
  {
    title: "24시간 언제나 열려있는 상담소",
    desc: "시간과 장소에 구애받지 않고 손 안에서 물어보세요.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000"  //AI: Copilot - 이미지 출처 Unsplash
  },
  {
    title: "복잡한 법률 용어도 알기 쉽게",
    desc: "어려운 판례와 법령을 쉽게 이해하고 설명할 수 있어요.",
    image: "https://i.ytimg.com/vi/_Lsku5VO8Rw/hqdefault.jpg"
  }
]

const slideshow_time = 5000

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshow.length)
    }, slideshow_time)
    return () => clearInterval(timer) //TODO: 수동으로 넘길때 slide 타이머 초기화
  }, [])

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
      <section 
        className="panel login-info"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(29, 78, 216, 0.85), rgba(59, 130, 246, 0.85)), url(${slideshow[currentSlide].image})`,
          transition: "background-image 0.5s ease-in-out"
        }}
      >
        <div className="slide-content fade-in" key={currentSlide}>
          <h2>{slideshow[currentSlide].title}</h2>
          <p>{slideshow[currentSlide].desc}</p>
        </div>
        <div className="slide-indicators">
          {slideshow.map((_, idx) => (
            <span 
              key={idx} 
              className={`indicator ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </section>
    </div>  //TODO: 자동으로 넘어가ㅡㄴ 슬라이드쇼로 변경 (예: 왜 LawMate인가요?)
  )
}

export default LoginPage
