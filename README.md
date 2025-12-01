<div align="center">

```
 ╔═══════════════════════════════════════════════════════════╗
 ║                                                           ║
 ║      ██╗      █████╗ ██╗    ██╗███╗   ███╗ █████╗       ║
 ║      ██║     ██╔══██╗██║    ██║████╗ ████║██╔══██╗      ║
 ║      ██║     ███████║██║ █╗ ██║██╔████╔██║███████║      ║
 ║      ██║     ██╔══██║██║███╗██║██║╚██╔╝██║██╔══██║      ║
 ║      ███████╗██║  ██║╚███╔███╔╝██║ ╚═╝ ██║██║  ██║      ║
 ║      ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝     ╚═╝╚═╝  ╚═╝      ║
 ║                                                           ║
 ║              🤖 AI 기반 법률 상담 플랫폼 ⚖️               ║
 ╚═══════════════════════════════════════════════════════════╝
```

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](./LICENSE)

</div>

---

## 📋 목차

- [✨ 프로젝트 소개](#-프로젝트-소개)
- [🎯 주요 기능](#-주요-기능)
- [🏗️ 시스템 아키텍처](#️-시스템-아키텍처)
- [🛠️ 기술 스택](#️-기술-스택)
- [🚀 시작하기](#-시작하기)
- [📂 프로젝트 구조](#-프로젝트-구조)
- [💡 주요 컴포넌트](#-주요-컴포넌트)
- [🔐 인증 시스템](#-인증-시스템)
- [📸 스크린샷](#-스크린샷)
- [🤝 기여하기](#-기여하기)

---

## ✨ 프로젝트 소개

**LawMate**는 인공지능 기술을 활용한 법률 상담 플랫폼입니다.
사용자는 법률 문서를 업로드하고, AI와 실시간으로 대화하며, Google 서비스와 연동하여
계약서를 관리하고 일정을 자동으로 등록할 수 있습니다.

### 🎪 핵심 가치

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  💬 실시간 AI 상담    📄 OCR 문서 분석    🔗 Google 연동    │
│                                                             │
│  "복잡한 법률 문제를 쉽고 빠르게 해결하세요"                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 주요 기능

### 1️⃣ 💬 AI 법률 챗봇

실시간 WebSocket 연결을 통한 스트리밍 응답으로 자연스러운 대화 경험을 제공합니다.

```typescript
✓ 실시간 토큰 스트리밍
✓ 대화 이력 관리
✓ 다중 채팅 세션 지원
✓ 로컬 스토리지 캐싱
```

### 2️⃣ 📄 문서 OCR 및 분석

이미지와 PDF 파일에서 텍스트를 추출하고 AI가 자동으로 계약서를 분석합니다.

| 지원 형식 | 기능 | 상태 |
|----------|------|------|
| 📷 이미지 | JPG, PNG | ✅ |
| 📑 PDF | 다중 페이지 | ✅ |
| 📊 분석 | 계약서 검토 | ✅ |
| 💾 저장 | 자동 보관 | ✅ |

### 3️⃣ 🔗 Google 서비스 연동

MCP(Model Context Protocol)를 통한 Google 서비스 자동화

<table>
  <tr>
    <td align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png" width="48" height="48" />
      <br />
      <b>Gmail</b>
      <br />
      <sub>이메일 자동 전송</sub>
    </td>
    <td align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/512px-Google_Drive_icon_%282020%29.svg.png" width="48" height="48" />
      <br />
      <b>Drive</b>
      <br />
      <sub>문서 자동 업로드</sub>
    </td>
    <td align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png" width="48" height="48" />
      <br />
      <b>Calendar</b>
      <br />
      <sub>일정 자동 등록</sub>
    </td>
  </tr>
</table>

### 4️⃣ 🤖 AI 자동 데이터 추출

대화 내용에서 AI가 자동으로 정보를 추출하여 폼을 채워줍니다.

```
대화 분석 → 정보 추출 → 자동 입력 → 사용자 확인 → 전송
   🔍         🧠         ✍️         👀         ✅
```

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19 + TypeScript + Vite                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ ChatbotPage │  │  AgentPage  │  │  LoginPage  │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │   │
│  │         │                │                │          │   │
│  │         └────────────────┴────────────────┘          │   │
│  │                          │                           │   │
│  │            ┌─────────────▼──────────────┐            │   │
│  │            │   API Service Layer        │            │   │
│  │            │  (aiApi, mcpApi, authApi)  │            │   │
│  │            └─────────────┬──────────────┘            │   │
│  └──────────────────────────┼──────────────────────────┘   │
└─────────────────────────────┼──────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
  ┌─────────────┐      ┌─────────────┐     ┌─────────────┐
  │   Backend   │      │  WebSocket  │     │ MCP Server  │
  │   REST API  │◄────►│   Server    │     │   (Google)  │
  │             │      │             │     │             │
  │  FastAPI    │      │  Streaming  │     │ Gmail/Drive │
  │  Python     │      │   Response  │     │  /Calendar  │
  └─────────────┘      └─────────────┘     └─────────────┘
         │
         ▼
  ┌─────────────┐
  │  Database   │
  │  (MongoDB?) │
  └─────────────┘
```

---

## 🛠️ 기술 스택

### Frontend Core

<div align="center">

| 기술 | 버전 | 용도 |
|------|------|------|
| ⚛️ React | 19.1.1 | UI 프레임워크 |
| 🔷 TypeScript | 5.8.3 | 타입 안전성 |
| ⚡ Vite | 7.2.2 | 빌드 도구 |
| 🛣️ React Router | 7.9.6 | 라우팅 |

</div>

### 개발 도구

```yaml
코드 품질:
  - ESLint: 9.36.0
  - TypeScript ESLint: 8.44.0

빌드 & 번들링:
  - Vite React Plugin: 5.0.3
  - TypeScript Compiler: 5.8.3
```

### 주요 기술 특징

```diff
+ WebSocket을 활용한 실시간 스트리밍
+ Context API를 통한 전역 상태 관리
+ localStorage 기반 채팅 이력 캐싱
+ Protected Route로 인증 처리
+ FormData를 활용한 파일 업로드
+ Base64 인코딩 파일 전송
```

---

## 🚀 시작하기

### 📦 설치

```bash
# 의존성 설치
npm install
```

### ⚙️ 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```bash
# API 서버 주소
VITE_BASE_API_URL=http://localhost:8000

# MCP 서버 주소 (선택사항)
VITE_MCP_API_URL=http://localhost:8000

# Google OAuth (선택사항)
VITE_GOOGLE_CLIENT_ID=your-client-id
```

### 🏃 실행

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

개발 서버는 `http://localhost:5173`에서 실행됩니다 🎉

---

## 📂 프로젝트 구조

```
java_2nd_project_client/
│
├── 📁 public/              # 정적 파일
│
├── 📁 src/
│   ├── 📁 assets/          # 이미지, 아이콘 등
│   │   └── contract.png
│   │
│   ├── 📁 components/      # 재사용 컴포넌트
│   │   └── ProtectedRoute.tsx
│   │
│   ├── 📁 contexts/        # Context API
│   │   └── AuthContext.tsx
│   │
│   ├── 📁 pages/           # 페이지 컴포넌트
│   │   ├── AgentPage.tsx       # 📄 파일 업로드 & MCP
│   │   ├── ChatbotPage.tsx     # 💬 AI 챗봇
│   │   ├── LoginPage.tsx       # 🔐 로그인
│   │   ├── GoogleCallbackPage.tsx
│   │   ├── MCPTestPage.tsx     # 🧪 MCP 테스트
│   │   ├── pages.css
│   │   └── index.ts
│   │
│   ├── 📁 services/        # API 서비스
│   │   └── api.ts              # REST & WebSocket
│   │
│   ├── App.tsx             # 앱 루트
│   ├── App.css
│   ├── main.tsx            # 진입점
│   └── index.css
│
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 vite.config.ts
└── 📄 README.md
```

---

## 💡 주요 컴포넌트

### 🤖 ChatbotPage

실시간 AI 상담 채팅 인터페이스

**주요 기능:**
- ✅ WebSocket 기반 스트리밍 응답
- ✅ 다중 채팅 세션 관리
- ✅ 대화 이력 저장 및 복원
- ✅ 로딩 인디케이터
- ✅ AgentPage 팝업 통합

**핵심 로직:**
```typescript
// 실시간 메시지 스트리밍
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.event === 'token') {
    buffered += data.token
    // 실시간 UI 업데이트
  }
}
```

### 📄 AgentPage

파일 업로드 및 Google 서비스 연동

**주요 기능:**
- 📤 드래그 앤 드롭 파일 업로드
- 🔍 OCR 텍스트 추출
- 🤖 AI 자동 정보 추출
- 📧 Gmail 전송
- 💾 Drive 업로드
- 📅 Calendar 일정 등록

**처리 흐름:**
```
파일 선택 → OCR 추출 → AI 분석 → 결과 표시 → Google 서비스 연동
```

### 🔐 LoginPage & Auth

Google OAuth 2.0 기반 인증

**인증 흐름:**
```
User → LoginPage → Google OAuth → CallbackPage → Backend
                                       ↓
                                  Access Token
                                       ↓
                                   로그인 완료
```

---

## 🔐 인증 시스템

### AuthContext

전역 인증 상태 관리

```typescript
interface User {
  id: string
  email: string
  name: string
  picture?: string
}

const AuthContext = createContext<{
  user: User | null
  isAuthenticated: boolean
  login: (access_token: string) => Promise<void>
  logout: () => void
}>()
```

### 보호된 라우트

```typescript
<ProtectedRoute>
  <ChatbotPage />
</ProtectedRoute>
```

인증되지 않은 사용자는 자동으로 로그인 페이지로 리다이렉트됩니다.

---

## 📸 스크린샷

### 🏠 메인 화면

```
┌────────────────────────────────────────────────────┐
│  LawMate                    [사용자님] [로그아웃]   │
├────────────────────────────────────────────────────┤
│                                                    │
│        환영합니다! 법률 상담을 시작하세요          │
│                                                    │
│              [💬 AI 상담 시작하기]                │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 💬 채팅 화면

```
┌─────────────┬──────────────────────────────────────┐
│ 대화 기록   │  LawMate 챗봇                        │
│             │                                      │
│ [새 대화]   │  ┌────────────────────────────────┐  │
│             │  │ LawMate:                       │  │
│ ○ 계약서 분석│  │ 안녕하세요! 무엇을 도와드릴까요?│  │
│ ○ 법률 상담  │  └────────────────────────────────┘  │
│ ○ 새로운 대화│                                      │
│             │  ┌────────────────────────────────┐  │
│             │  │ 사용자:                        │  │
│             │  │ 계약서 검토 부탁드립니다       │  │
│             │  └────────────────────────────────┘  │
│             │                                      │
│             │  [📎] [무엇이든 물어보세요...] [전송]│
└─────────────┴──────────────────────────────────────┘
```

### 📄 파일 업로드 화면

```
┌──────────────────────────────────────────────────┐
│            파일 업로드                           │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │                                          │   │
│  │         📄                               │   │
│  │     파일 업로드                          │   │
│  │                                          │   │
│  │  여기에 드래그하거나 클릭하세요          │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│       다른 서비스에서 가져오기                   │
│                                                  │
│     [📧 Gmail]  [💾 Drive]  [📅 Calendar]      │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🎨 디자인 시스템

### 색상 팔레트

```css
주색상:
  Primary:   #1d4ed8  (파란색)
  Secondary: #475569  (회색)
  Success:   #10b981  (초록색)
  Error:     #ef4444  (빨간색)

배경색:
  Base:      #ffffff  (흰색)
  Surface:   #f8fafc  (연한 회색)
  Hover:     #eff6ff  (연한 파란색)

텍스트:
  Primary:   #1e293b  (진한 회색)
  Secondary: #64748b  (회색)
  Muted:     #94a3b8  (연한 회색)
```

### 타이포그래피

```
제목:     1.5rem - 2rem (볼드)
본문:     1rem (레귤러)
작은텍스트: 0.875rem (레귤러)
```

---

## 🔧 API 엔드포인트

### 인증 (Auth)

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/auth/google/url` | Google OAuth URL 생성 |
| `GET` | `/auth/google/callback` | OAuth 콜백 처리 |
| `GET` | `/auth/users/me` | 현재 사용자 정보 |

### 챗봇 (Chat)

| Method | Endpoint | 설명 |
|--------|----------|------|
| `WS` | `/chat/ws` | 실시간 채팅 스트림 |
| `GET` | `/chat/history/user/:id` | 채팅 이력 조회 |

### OCR

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/ocr/extract` | 이미지/PDF 텍스트 추출 |
| `POST` | `/ocr/analyze` | 계약서 분석 |

### MCP (Google Services)

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/tasks` | Gmail/Drive/Calendar 작업 |

---

## 🧪 테스트

```bash
# 유닛 테스트 (향후 추가 예정)
npm run test

# E2E 테스트 (향후 추가 예정)
npm run test:e2e
```

---

## 🚧 향후 개발 계획

- [ ] 🧪 테스트 코드 작성 (Jest, React Testing Library)
- [ ] 🎨 다크 모드 지원
- [ ] 🌍 다국어 지원 (i18n)
- [ ] 📱 반응형 모바일 UI 개선
- [ ] 🔔 실시간 알림 기능
- [ ] 📊 대시보드 및 통계
- [ ] 🤖 AI 모델 선택 기능
- [ ] 💾 대화 내보내기 (PDF, TXT)
- [ ] 🔍 대화 검색 기능
- [ ] ⚡ PWA 지원

---

## 🤝 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. 🍴 Fork the Project
2. 🔀 Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the Branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

### 코딩 컨벤션

```typescript
// ✅ Good
const handleSubmit = async (event: FormEvent) => {
  // ...
}

// ❌ Bad
const HandleSubmit = async (event) => {
  // ...
}
```

---

## 📝 라이선스

This project is private and proprietary.

---

## 👥 팀

<div align="center">

**자바2 팀프로젝트**

Made with ❤️ by LawMate Team

</div>

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 별점을 남겨주세요! ⭐**

```
╔══════════════════════════════════════╗
║  Thank you for using LawMate! 🙏    ║
╚══════════════════════════════════════╝
```

</div>
