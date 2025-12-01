import { useState, useRef } from "react"
import type { FormEvent, ChangeEvent, DragEvent } from "react"
import "./pages.css"
import contractIcon from "../assets/contract.png"
import { aiApi } from "../services/api"
import type { ChatMessage } from "../services/api"

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000'
const MCP_API_BASE_URL = import.meta.env.VITE_MCP_API_URL || API_BASE_URL

type AgentAction = "gmail" | "drive" | "calendar"

const label_map: Record<AgentAction, string> = {
  gmail: "Gmail"
  ,drive: "Google Drive"
  ,calendar: "Google Calendar"
  ,
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

type AgentPageProps = {
  embedded?: boolean
  onUploadSuccess?: (result: Record<string, unknown>, isImage?: boolean, file?: File) => void
  onMCPSuccess?: (type: AgentAction, result: any) => void
  chatMessages?: Message[]
}

function AgentPage({ embedded, onUploadSuccess, onMCPSuccess, chatMessages = [] }: AgentPageProps) {
  const [selected_agent, setSelectedAgent] = useState<AgentAction | null>(null)
  const [result, setResult] = useState("")
  const [is_dragging, setIsDragging] = useState(false)
  const [is_uploading, setIsUploading] = useState(false)
  const [is_agent_sending, setIsAgentSending] = useState(false)
  const [prefilled_data, setPrefilledData] = useState<Record<string, any>>({})
  const file_input = useRef<HTMLInputElement>(null)
  const authToken = localStorage.getItem('access_token')

  // Extract information from chat messages using AI
  const extractInfoFromChat = async (type: AgentAction): Promise<Record<string, any>> => {
    if (!chatMessages.length) return {}

    try {
      // Convert messages to ChatMessage format
      const messages: ChatMessage[] = chatMessages.map(m => ({
        role: m.role,
        content: m.content,
        created_at: m.created_at,
      }))

      // Call AI analysis API
      const analysis = await aiApi.analyzeForMCP(type, messages)

      // Update result message based on confidence
      if (analysis.confidence === 'high') {
        setResult("✅ AI가 대화 내용을 분석하여 정보를 자동으로 채웠습니다. 확인 후 수정해주세요.")
      } else if (analysis.confidence === 'medium') {
        setResult(`⚠️ ${analysis.suggestions || "일부 정보가 누락되었을 수 있습니다. 확인 후 추가 입력해주세요."}`)
      } else {
        setResult(`ℹ️ ${analysis.suggestions || "대화에서 충분한 정보를 찾을 수 없습니다. 직접 입력해주세요."}`)
      }

      return analysis.extracted_data
    } catch (error) {
      console.error('AI 분석 실패:', error)
      setResult("⚠️ AI 분석에 실패했습니다. 수동으로 입력해주세요.")
      return {}
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

  const uploadFile = async (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'
    const useExtract = isImage || isPdf
    const uploadUrl = useExtract
      ? `${API_BASE_URL}/ocr/extract`
      : `${API_BASE_URL}/documents/upload`
    const analyzeUrl = `${API_BASE_URL}/ocr/analyze`
    const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {}

    setIsUploading(true)
    setResult(useExtract ? "텍스트 추출 중..." : "문서 업로드 중...")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "accept": "application/json",
          ...authHeaders,
        },
        body: formData
      })

      if (!response.ok) throw new Error(`HTTP ${response.status} 오류`)

      const uploadResult = await response.json()
      const extractedText: string = uploadResult.text || uploadResult.content || ""

      setResult(
        JSON.stringify(
          {
            step: useExtract ? "텍스트 추출 완료" : "업로드 완료"
            ,file: file.name
            ,text_preview: extractedText?.slice(0, 500)
            ,raw: uploadResult
          }
          ,null
          ,2
        )
      )

      if (extractedText) {
        setResult(prev => `${prev}\n\n계약서 검토 중...`)
        const analyzeResponse = await fetch(analyzeUrl, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            text: extractedText,
            filename: file.name
          })
        })

        if (!analyzeResponse.ok) throw new Error(`분석 HTTP ${analyzeResponse.status} 오류`)
        const analyzeResult = await analyzeResponse.json()

        const combined = {
          file: file.name,
          text: extractedText,
          analysis: analyzeResult,
        }
        setResult(JSON.stringify(combined, null, 2))
        if (onUploadSuccess) {
          onUploadSuccess(combined, isImage, file)
        }
      } else {
        setResult(prev => `${prev}\n\n텍스트를 추출하지 못했습니다.`)
        if (onUploadSuccess) {
          onUploadSuccess({ text: "", raw: uploadResult }, isImage, file)
        }
      }
    } catch (error) {
      console.error(`업로드 실패: ${error}`)
      setResult(`업로드 실패: ${error}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAgentClick = async (type: AgentAction) => {
    setSelectedAgent(type)
    setResult("🤖 AI가 대화 내용을 분석하고 있습니다...")
    setPrefilledData({})

    // Extract and prefill data from chat messages using AI
    const extracted = await extractInfoFromChat(type)
    setPrefilledData(extracted)
  }

  const closePopup = () => {
    setSelectedAgent(null)
  }

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === 'string') {
          const base64 = result.split(',')[1] || result
          resolve(base64)
        } else {
          reject(new Error('파일을 읽을 수 없습니다.'))
        }
      }
      reader.onerror = () => reject(reader.error || new Error('파일 읽기 실패'))
      reader.readAsDataURL(file)
    })

  const handleAgentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected_agent) return

    const form = new FormData(event.currentTarget)
    setIsAgentSending(true)

    try {
      if (selected_agent === "gmail") {
        const payload = {
          to: form.get("recipient"),
          subject: form.get("subject"),
          body: form.get("body"),
          cc: [],
          bcc: [],
          html: false,
        }
        const response = await fetch(`${MCP_API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({
            type: "email",
            payload,
            timezone: "Asia/Seoul",
          })
        })
        const data = await response.json()
        setResult(JSON.stringify(data, null, 2))

        // Call success callback if provided
        if (onMCPSuccess) {
          onMCPSuccess("gmail", data)
        }
        return
      }

      if (selected_agent === "calendar") {
        const start_time = form.get("eventDate") as string
        const end_time = form.get("eventEnd") as string || new Date(new Date(start_time).getTime() + 60 * 60 * 1000).toISOString()
        const payload = {
          summary: form.get("eventTitle"),
          start_time,
          end_time,
          description: form.get("eventDescription"),
        }
        const response = await fetch(`${MCP_API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({
            type: "calendar",
            payload,
            timezone: "Asia/Seoul",
          })
        })
        const data = await response.json()
        setResult(JSON.stringify(data, null, 2))

        // Call success callback if provided
        if (onMCPSuccess) {
          onMCPSuccess("calendar", data)
        }
        return
      }

      if (selected_agent === "drive") {
        const fileInput = event.currentTarget.querySelector('input[name="driveFile"]') as HTMLInputElement | null
        const file = fileInput?.files?.[0]
        if (!file) throw new Error("업로드할 파일을 선택해 주세요.")
        const contractName = (form.get("contractName") as string) || file.name
        const folderName = (form.get("folderName") as string) || "Contracts"
        const file_content_b64 = await toBase64(file)

        const payload = {
          contract_name: contractName,
          folder_name: folderName,
          file_name: file.name,
          file_content_b64,
        }

        const response = await fetch(`${MCP_API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({
            type: "drive",
            payload,
            timezone: "Asia/Seoul",
          })
        })
        const data = await response.json()
        setResult(JSON.stringify(data, null, 2))

        // Call success callback if provided
        if (onMCPSuccess) {
          onMCPSuccess("drive", data)
        }
        return
      }
    } catch (error) {
      console.error("에이전트 요청 실패:", error)
      setResult(`에이전트 요청 실패: ${error}`)
    } finally {
      setIsAgentSending(false)
    }
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
                  <input
                    name="recipient"
                    type="email"
                    placeholder="client@example.com"
                    defaultValue={prefilled_data.recipient || ""}
                    required
                  />
                </label>
                <label>
                  제목
                  <input
                    name="subject"
                    placeholder="메일 제목"
                    defaultValue={prefilled_data.subject || ""}
                    required
                  />
                </label>
                <label>
                  내용
                  <textarea
                    name="body"
                    placeholder="메일 내용을 작성하세요."
                    rows={4}
                    defaultValue={prefilled_data.body || ""}
                    required
                  />
                </label>
                <button type="submit" disabled={is_agent_sending}>
                  {is_agent_sending ? "전송 중..." : "메일 전송"}
                </button>
                <footer className="muted" style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                  MCP 서버를 통해 Gmail API로 바로 전송합니다.
                </footer>
              </form>
            )}

            {selected_agent === "drive" && (
              <form className="form" onSubmit={handleAgentSubmit}>
                <label>
                  계약서 이름
                  <input
                    name="contractName"
                    placeholder="2024_계약서.pdf"
                    defaultValue={prefilled_data.contractName || ""}
                  />
                </label>
                <label>
                  저장 폴더
                  <input
                    name="folderName"
                    placeholder="Contracts"
                    defaultValue={prefilled_data.folderName || "Contracts"}
                  />
                </label>
                <label>
                  업로드 파일
                  <input name="driveFile" type="file" required />
                </label>
                <button type="submit" disabled={is_agent_sending}>
                  {is_agent_sending ? "업로드 중..." : "계약서 업로드"}
                </button>
                <footer className="muted" style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                  MCP 서버가 Drive 계약서 전용 폴더에 업로드합니다.
                </footer>
              </form>
            )}

            {selected_agent === "calendar" && (
              <form className="form" onSubmit={handleAgentSubmit}>
                <label>
                  일정 제목
                  <input
                    name="eventTitle"
                    placeholder="계약서 서명"
                    defaultValue={prefilled_data.eventTitle || ""}
                    required
                  />
                </label>
                <label>
                  시작 일시
                  <input
                    name="eventDate"
                    type="datetime-local"
                    defaultValue={prefilled_data.eventDate || ""}
                    required
                  />
                </label>
                <label>
                  종료 일시
                  <input
                    name="eventEnd"
                    type="datetime-local"
                    defaultValue={prefilled_data.eventEnd || ""}
                  />
                </label>
                <label>
                  설명
                  <textarea
                    name="eventDescription"
                    placeholder="중요 참고 사항을 남겨주세요."
                    rows={3}
                    defaultValue={prefilled_data.eventDescription || ""}
                  />
                </label>
                <button type="submit" disabled={is_agent_sending}>
                  {is_agent_sending ? "등록 중..." : "일정 등록"}
                </button>
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
