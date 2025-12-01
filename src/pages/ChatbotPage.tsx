import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import AgentPage from "./AgentPage"
import './pages.css'

type Chat = {
  id: string
  title: string
  messages: Message[]
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  visible?: boolean //섀도우 포스트
  image?: string
}

const chat_history: Chat[] = [
  {
    id: "1",
    title: "새로운 대화",
    messages: [
      {
        id: "1",
        role: "assistant",
        content: "안녕하세요! 고객님 손 안의 AI 법률 상담사, LawMate입니다. 궁금한 게 있으시다면 무엇이든 물어보세요.",
      },
    ],
  },
]

function ChatbotPage() {
  const [chats, setChats] = useState<Chat[]>(chat_history)
  const [chatID, setChatID] = useState(chats[0]?.id ?? '')
  const [input, setInput] = useState('')
  const [showAgentPopup, setShowAgentPopup] = useState(false)

  const active_chat = useMemo(
    () => chats.find((chat) => chat.id === chatID) ?? chats[0],
    [chats, chatID],
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!input.trim() || !active_chat) return
    const new_message: Message = {
      id: crypto.randomUUID()
      ,role: "user"
      ,content: input.trim()
      ,
    }
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === active_chat.id
          ?{
              ...chat
              ,messages: [...chat.messages, new_message]
              ,
            }
          :chat
          ,
      )
      ,
    )
    setInput('')
    try {
      const response = await fetch("http://localhost:8000/chat/"
        , {
        method: "POST"
        ,headers: {
          "accept": "application/json"
          ,"Content-Type": "application/json"
        }
        ,body: JSON.stringify({
          message: new_message.content
          ,session_id: active_chat.id
          ,conversation_history: //[]
            active_chat.messages
          ,
        })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} 오류`);
      const result = await response.json();
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === active_chat.id
            ? {
                ...chat
                ,messages: [
                  ...chat.messages
                  ,
                  {
                    id: crypto.randomUUID()
                    ,role: "assistant"
                    ,content: result.response || "지금은 답변할 수 없어요. 나중에 다시 시도해주세요.",
                  },
                ],
              }
            :chat
            ,
        ),
      )
    } catch (error) {
      console.error(`리퀘실패: ${error}`);  //HACK
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === active_chat.id
            ? {
                ...chat
                ,messages: [
                  ...chat.messages
                  ,{
                    id: crypto.randomUUID()
                    ,role: "assistant"
                    ,content: "오류가 발생했습니다. 잠시 후에 다시 시도해주세요."
                    ,
                  },
                ],
              }
            : chat
            ,
        ),
      )
    }
  }

  return (
    <div className="page chat-layout">
      <aside className="panel chat-log">
        <div className="chat-log-header">
          <h2>대화 기록</h2>  {/*TODO: 대화 기록 삭제 기능*/}
          <button
            onClick={() => {
              const id = crypto.randomUUID()
              setChats((prev) => [
                {id, title: '새로운 대화', messages: [] },
                ...prev,
              ])
              setChatID(id)
            }}
          >
            새 대화
          </button> {/*FIXME: 다크모드 버그?*/}
        </div>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={chat.id === active_chat?.id ? 'active' : ''}
              onClick={() => setChatID(chat.id)}
            >
              {chat.title}
              <small className="muted block">{chat.messages.at(-1)?.content}</small>
            </li>
          ))}
        </ul>
      </aside>
      <section className="panel chat-window">
        {/* <header>
          <h1>LawMate 챗봇</h1>
          <p className="muted">좌측 로그에서 과거 대화를 찾아보고 계속 이어갈 수 있습니다.</p>
        </header> */}
        <div className="messages">
          {active_chat?.messages.length ? (
            active_chat.messages.filter(m => m.visible !== false).map((message) => (  //섀도우 포스트
              <article key={message.id} className={`message ${message.role}`}>
                <strong>{message.role === 'user' ? '사용자' : 'LawMate'}</strong>
                {message.image && <img src={message.image} alt="업로드 이미지" style={{ maxWidth: '300px', borderRadius: '8px', display: 'block', marginBottom: '0.5rem' }} />}
                <span>{message.content}</span>
              </article>
            ))
          ) : (
            <p className="muted">메시지를 입력하면 이 영역에 대화가 표시됩니다.</p>
          )}
        </div>
        <form className="chat-input form" onSubmit={handleSubmit}>
          {/*HACK: experimental^^7*/}
          <button
            type="button"
            onClick={() => setShowAgentPopup(true)}
            style={
              {
              minWidth: "auto"
              ,width: "48px"
              ,height: "48px"
              ,padding: "0.5rem"
              ,borderRadius: "50%"
              ,display: "flex"
              ,alignItems: "center"
              ,justifyContent: "center"
              ,alignSelf: "center"
              ,marginRight: "0.5rem"
              ,marginBottom: "4px"
              ,
            }
          }>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 33 32" enableBackground="new 0 0 33 32" xmlSpace="preserve" fill="currentColor">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="0.66"> <g> <path fill="currentColor" d="M20.219,8.125c0.198-0.193,0.202-0.51,0.009-0.707c-0.193-0.198-0.509-0.201-0.707-0.009L7.325,19.313 c-0.799,0.78-1.239,1.822-1.239,2.934s0.44,2.154,1.239,2.934c1.647,1.608,4.329,1.608,5.976,0l13.892-13.561 c1.313-1.282,2.036-2.993,2.036-4.819c0-1.826-0.723-3.538-2.036-4.819c-2.712-2.647-7.127-2.647-9.838,0L2.764,16.226 C0.981,17.965,0,20.288,0,22.766c0,2.479,0.981,4.802,2.764,6.542c1.842,1.798,4.263,2.698,6.683,2.698 c2.42,0,4.841-0.899,6.683-2.698l16.72-16.321c0.198-0.193,0.202-0.51,0.009-0.707c-0.192-0.198-0.509-0.201-0.707-0.009 l-16.72,16.321c-3.3,3.222-8.67,3.222-11.969,0C1.874,27.042,1,24.973,1,22.767s0.875-4.275,2.462-5.825L18.053,2.698 c2.327-2.272,6.114-2.273,8.442,0c1.118,1.092,1.734,2.549,1.734,4.104c0,1.554-0.616,3.011-1.734,4.103L12.603,24.466 c-1.263,1.232-3.317,1.232-4.58,0c-0.604-0.59-0.938-1.378-0.938-2.218s0.333-1.628,0.938-2.218L20.219,8.125z"/> </g> </g>
            </svg>
          </button>
          <textarea
            placeholder="무엇이든 물어보세요."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" style={{ minWidth: '80px' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />  {/*AI: Copilot - svg 생성*/} {/*TODO: Ctrl+Enter 단축키 연결*/}
            </svg>
          </button>
        </form>
      </section>
      {showAgentPopup && (
        <div className="modal-overlay" onClick={() => setShowAgentPopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <header className="modal-header">
              <button className="close-button" onClick={() => setShowAgentPopup(false)}>&times;</button>
            </header>
            <AgentPage
              embedded={true}
              onUploadSuccess={(result, isImage, file) => {
                setShowAgentPopup(false)
                const imageUrl = isImage && file ? URL.createObjectURL(file) : undefined

                setChats((prev) =>
                  prev.map((chat) =>
                    chat.id === active_chat.id
                      ? {
                          ...chat
                          ,messages: [
                            ...chat.messages,
                            ...(isImage ? [{
                              id: crypto.randomUUID()
                              ,role: "user" as const
                              ,content: `[OCR 추출 텍스트]\n${result.text}` //AI: Copilot - 대괄호를 붙이는 편이 좋음
                              ,visible: false
                            }] : []),
                            ...(isImage && imageUrl ? [{
                              id: crypto.randomUUID()
                              ,role: "user" as const
                              ,content: ""
                              ,image: imageUrl
                            }] : []),
                            {
                              id: crypto.randomUUID()
                              ,role: "assistant"
                              ,content: isImage 
                                ? "보내주신 이미지를 확인했어요. 이걸로 어떤 대화를 나눠볼까요?" 
                                : "보내주신 자료를 잘 받았어요! 이걸로 어떤 대화를 나눠볼까요?"
                            },
                          ],
                        }
                      :chat
                      ,
                  ),
                )
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatbotPage
