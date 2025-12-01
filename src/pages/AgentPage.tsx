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

const label_map: Record<AgentAction, string> = {
  gmail: "Gmail"
  ,drive: "Google Drive"
  ,calendar: "Google Calendar"
  ,
}

type AgentPageProps = {
  embedded?: boolean
  onUploadSuccess?: (result: any, isImage?: boolean) => void
}

function AgentPage({ embedded, onUploadSuccess }: AgentPageProps) {
  const [selected_agent, setSelectedAgent] = useState<AgentAction | null>(null)
  const [result, setResult] = useState("")
  const [is_dragging, setIsDragging] = useState(false)
  const [is_uploading, setIsUploading] = useState(false)
  const file_input = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    const isImage = file.type.startsWith('image/')
    const url = isImage 
      ? "http://localhost:8000/ocr/extract" 
      : "http://localhost:8000/documents/upload"  //AI: Sonnet 4.5 - URL도 삼중조건문 분기 가능
    
    setIsUploading(true)
    setResult(isImage ? "OCR 분석 중..." : "문서 업로드 중...")
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
        },
        body: formData
      })

      if (!response.ok) throw new Error(`HTTP ${response.status} 오류`)

      const result = await response.json()
      setResult(JSON.stringify(result, null, 2))
      if (onUploadSuccess) {
        onUploadSuccess(result, isImage)
      }
    } catch (error) {
      console.error(`업로드 실패: ${error}`)
      setResult(`업로드 실패: ${error}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0])uploadFile(e.target.files[0])
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
    if (e.dataTransfer.files && e.dataTransfer.files[0])uploadFile(e.dataTransfer.files[0])
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
    if (!selected_agent) return

    const form = new FormData(event.currentTarget)
    const payload: AgentForm = Object.fromEntries(form.entries())

    setResult(
      JSON.stringify(
        {
          agent: selected_agent
          ,payload
          ,status: "MCP 서버 연동 시 실제 처리 결과가 표시됩니다."
          ,
        }
        ,null
        ,2
        ,
      )
      ,
    )
  }

  return (
    <div className={embedded ? "" : "page"}>
      <section className={embedded ? "" : "panel"}>
        <h1 style={{ textAlign: "center"}}> 파일 업로드</h1>
        <p className="muted" style={{ textAlign: "center"}}>
          문서 사진, 계약서, 판례 등을 여기에 드래그해보세요. {/*랜덤 문구로?*/}
        </p>
        <div className="agent-layout">
          <div className="agent-main-upload">
            <button
              className={`agent-button upload-button ${is_dragging ? "dragging" : ""}`}
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
                <img src={contractIcon} alt="파일 업로드" width="48" height="48" />
              </div>
              <span>{is_uploading ? "업로드 중..." : is_dragging ? "여기에 드래그해보세요!" : "파일 업로드"}</span>
            </button>
          </div>

          <h3 style={{ fontSize: "1rem", color: "#64748b", margin: "0.5rem 0 0" }}>다른 서비스에서 가져오기</h3>

          <div className="agent-integrations">
            <button className="agent-button small-button" onClick={() => handleAgentClick("gmail")}>
              <div className="icon-placeholder">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png?20221017173631" 
                  alt="Gmail" 
                  width="32" 
                  height="25" 
                />
              </div>
              <span>{label_map.gmail}</span>
            </button>
            <button className="agent-button small-button" onClick={() => handleAgentClick("drive")}>
              <div className="icon-placeholder">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/512px-Google_Drive_icon_%282020%29.svg.png?20221103153031" 
                  alt="Google Drive" 
                  width="32" 
                  height="32" 
                />
              </div>
              <span>{label_map.drive}</span>
            </button>

            <button className="agent-button small-button" onClick={() => handleAgentClick("calendar")}>
              <div className="icon-placeholder">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png?20221017173603" 
                  alt="Google Calendar" 
                  width="32" 
                  height="32" 
                />
              </div>
              <span>{label_map.calendar}</span>
            </button>
          </div>
        </div>
      </section>

      {selected_agent && (
        <div className="modal-overlay" onClick={closePopup}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>{label_map[selected_agent]}</h3>
              <button className="close-button" onClick={closePopup}>&times;</button>
            </header>
            
            {selected_agent === "gmail" && (
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

            {selected_agent === "drive" && (
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

            {selected_agent === "calendar" && (
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
