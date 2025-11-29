import { useState } from 'react'
import type { FormEvent } from 'react'
import '../styles/common.css'
import '../styles/AgentPage.css'

type AgentAction = 'gmail' | 'drive' | 'calendar'

type AgentForm = {
  subject?: string
  body?: string
  recipient?: string
  fileUrl?: string
  eventTitle?: string
  eventDate?: string
  eventDescription?: string
}

const labelMap: Record<AgentAction, string> = {
  gmail: 'Gmail 보내기',
  drive: 'Google Drive로 계약서 전송',
  calendar: 'Google Calendar에 일정 등록',
}

function AgentPage() {
  const [result, setResult] = useState('')

  const handleAgentSubmit = (type: AgentAction) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload: AgentForm = Object.fromEntries(form.entries())

    setResult(
      JSON.stringify(
        {
          agent: type,
          payload,
          status: 'MCP 서버 연동 시 실제 처리 결과가 표시됩니다.',
        },
        null,
        2,
      ),
    )
    event.currentTarget.reset()
  }

  return (
    <div className="page">
      <section className="panel">
        <h1>LawMate 에이전트</h1>
        <p className="muted">
          MCP 서버 연동을 통해 Gmail, Google Drive, Google Calendar 작업을 자동화할 수 있습니다.
        </p>

        <div className="agent-grid">
          <article className="agent-card">
            <h3>{labelMap.gmail}</h3>
            <form className="form" onSubmit={handleAgentSubmit('gmail')}>
              <label>
                받는 사람
                <input name="recipient" type="email" placeholder="client@example.com" required />
              </label>
              <label>
                제목
                <input name="subject" placeholder="메일 제목" required />
              </label>
              <label>
                내용
                <textarea name="body" placeholder="메일 내용을 작성하세요." rows={4} required />
              </label>
              <button type="submit">메일 전송</button>
            </form>
            <footer>OAuth 인증 후 Gmail API 호출 로직을 연결하세요.</footer>
          </article>

          <article className="agent-card">
            <h3>{labelMap.drive}</h3>
            <form className="form" onSubmit={handleAgentSubmit('drive')}>
              <label>
                파일 링크
                <input name="fileUrl" placeholder="https://drive.google.com/…" required />
              </label>
              <label>
                공유 대상
                <input name="recipient" placeholder="lawyer@firm.com" required />
              </label>
              <button type="submit">계약서 공유</button>
            </form>
            <footer>파일 ID 파싱과 권한 설정을 MCP 서버에서 처리하면 됩니다.</footer>
          </article>

          <article className="agent-card">
            <h3>{labelMap.calendar}</h3>
            <form className="form" onSubmit={handleAgentSubmit('calendar')}>
              <label>
                일정 제목
                <input name="eventTitle" placeholder="계약서 서명" required />
              </label>
              <label>
                일정 날짜
                <input name="eventDate" type="datetime-local" required />
              </label>
              <label>
                설명
                <textarea name="eventDescription" placeholder="중요 참고 사항을 남겨주세요." rows={3} />
              </label>
              <button type="submit">일정 등록</button>
            </form>
            <footer>캘린더 ID와 타임존 처리를 MCP 서버와 연결해 주세요.</footer>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>최근 실행 결과</h2>
        {result ? (
          <pre>{result}</pre>
        ) : (
          <p className="muted">폼을 제출하면 요청 정보와 상태가 표시됩니다.</p>
        )}
      </section>
    </div>
  )
}

export default AgentPage
