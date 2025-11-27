import { useState, useRef } from "react"
import type { FormEvent, ChangeEvent, DragEvent } from "react"
import "./pages.css"
import contractIcon from "../assets/contract.png"

type AgentAction = "gmail" | "drive" | "calendar"

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
  gmail: "Gmail에서 가져오기"
  ,drive: "Google Drive에서 가져오기"
  ,calendar: "Google Calendar에서 가져오기"
  ,
}

function AgentPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentAction | null>(null)
  const [result, setResult] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const file_input = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setResult(
        JSON.stringify(
          {
            agent: "upload",
            payload: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            },
            status: "파일 다이얼로그로 선택됨",
          },
          null,
          2,
        ),
      )
    }
  }

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setResult(
        JSON.stringify(
          {
            agent: "upload",
            payload: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            },
            status: "파일 드래그됨",
          },
          null,
          2,
        ),
      )
    }
  }

  const handleAgentClick = (type: AgentAction) => {
    setSelectedAgent(type)
    setResult("")
  }

  const closePopup = () => {
    setSelectedAgent(null)
  }

  const handleAgentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAgent) return

    const form = new FormData(event.currentTarget)
    const payload: AgentForm = Object.fromEntries(form.entries())

    setResult(
      JSON.stringify(
        {
          agent: selectedAgent,
          payload,
          status: "MCP 서버 연동 시 실제 처리 결과가 표시됩니다.",
        },
        null,
        2,
      ),
    )
  }

  return (
    <div className="page">
      <section className="panel">
        <h1 style={{ textAlign: "center"}}>어떤 작업을 할까요?</h1>
        <p className="muted" style={{ textAlign: "center"}}>
          예를 들면 계약서를 첨부해서 분석해볼까요? {/*랜덤 문구로?*/}
        </p>
        <div className="agent-button-grid">
          <button
            className={`agent-button ${isDragging ? "dragging" : ""}`}
            onClick={() => file_input.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={file_input}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <div className="icon-placeholder">
              <img src={contractIcon} alt="계약서 업로드" width="48" height="48" />
            </div>
            <span>{isDragging ? "여기에 드래그해보세요!" : "계약서 파일 업로드"}</span> {/*==true 없어도 됨*/}
          </button>

          <button className="agent-button" onClick={() => handleAgentClick("gmail")}>
            <div className="icon-placeholder">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png?20221017173631" 
                alt="Gmail" 
                width="48" 
                height="38" 
              />
            </div>
            <span>{labelMap.gmail}</span>
          </button>
          <button className="agent-button" onClick={() => handleAgentClick("drive")}>
            <div className="icon-placeholder">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/512px-Google_Drive_icon_%282020%29.svg.png?20221103153031" 
                alt="Google Drive" 
                width="48" 
                height="48" 
              />
            </div>
            <span>{labelMap.drive}</span>
          </button>

          <button className="agent-button" onClick={() => handleAgentClick("calendar")}>
            <div className="icon-placeholder">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png?20221017173603" 
                alt="Google Calendar" 
                width="48" 
                height="48" 
              />
            </div>
            <span>{labelMap.calendar}</span>
          </button>
        </div>
      </section>

      {selectedAgent && (
        <div className="modal-overlay" onClick={closePopup}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>{labelMap[selectedAgent]}</h3>
              <button className="close-button" onClick={closePopup}>&times;</button>
            </header>
            
            {selectedAgent === "gmail" && (
              <form className="form" onSubmit={handleAgentSubmit}>
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
                <footer className="muted" style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                  OAuth 인증 후 Gmail API 호출 로직을 연결하세요.
                </footer>
              </form>
            )}

            {selectedAgent === "drive" && (
              <form className="form" onSubmit={handleAgentSubmit}>
                <label>
                  파일 링크
                  <input name="fileUrl" placeholder="https://drive.google.com/…" required />
                </label>
                <label>
                  공유 대상
                  <input name="recipient" placeholder="lawyer@firm.com" required />
                </label>
                <button type="submit">계약서 공유</button>
                <footer className="muted" style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                  파일 ID 파싱과 권한 설정을 MCP 서버에서 처리하면 됩니다.
                </footer>
              </form>
            )}

            {selectedAgent === "calendar" && (
              <form className="form" onSubmit={handleAgentSubmit}>
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
                <footer className="muted" style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                  캘린더 ID와 타임존 처리를 MCP 서버와 연결해 주세요.
                </footer>
              </form>
            )}

            {result && (
              <div className="feedback">
                <pre style={{ margin: 0, background: "transparent", padding: 0, color: "inherit" }}>
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentPage
