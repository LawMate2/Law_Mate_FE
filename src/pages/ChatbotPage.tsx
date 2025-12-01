import { useMemo, useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import AgentPage from "./AgentPage"
import { useAuth } from '../contexts/AuthContext'
import './pages.css'

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000'

type Chat = {
  id: string
  title: string
  messages: Message[]
  created_at?: string
  updated_at?: string
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

type UserChatHistory = {
  chats: Chat[]
  total: number
}

type StoredChats = {
  chats: Chat[]
}

const createEmptyChat = (title = '새로운 대화'): Chat => ({
  id: crypto.randomUUID(),
  title,
  messages: [],
  created_at: new Date().toISOString(),
})

const getStorageKey = (userId?: string) =>
  userId ? `lawmate_chats_${userId}` : ''

const buildWsUrl = () => {
  try {
    const url = new URL(API_BASE_URL)
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    url.pathname = url.pathname.replace(/\/$/, '') + '/chat/ws'
    return url.toString()
  } catch {
    return API_BASE_URL.replace(/^http/i, 'ws') + '/chat/ws'
  }
}

const formatTime = (isoTime?: string) => {
  if (!isoTime) return ''
  const date = new Date(isoTime)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function ChatbotPage() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [chatID, setChatID] = useState('')
  const [input, setInput] = useState('')
  const [showAgentPopup, setShowAgentPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  // Load cached chats from localStorage for quick restore on refresh/navigation
  useEffect(() => {
    if (!user?.id) return
    const key = getStorageKey(user.id)
    const raw = localStorage.getItem(key)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as StoredChats | Chat[]
      const savedChats = Array.isArray(parsed) ? parsed : parsed.chats
      if (savedChats?.length) {
        setChats(savedChats)
        setChatID(savedChats[0].id)
        setIsLoadingHistory(false)
      }
    } catch (error) {
      console.error('로컬 채팅 복원 실패:', error)
    }
  }, [user?.id])

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.id) {
        setIsLoadingHistory(false)
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/chat/history/user/${user.id}?skip=0&limit=100`,
          {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} 오류`)
        }

        const data: UserChatHistory = await response.json()

        if (data.chats && data.chats.length > 0) {
          setChats(data.chats)
          setChatID(data.chats[0].id)
        }
      } catch (error) {
        console.error('채팅 히스토리 로드 실패:', error)
        // 실패 시 빈 상태로 유지 (새 대화 시작 가능)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchChatHistory()
  }, [user?.id])

  // Ensure at least one chat exists for immediate use
  useEffect(() => {
    if (!user?.id || isLoadingHistory) return
    if (!chats.length) {
      const freshChat = createEmptyChat()
      setChats([freshChat])
      setChatID(freshChat.id)
      return
    }
    if (!chatID) {
      setChatID(chats[0].id)
    }
  }, [chatID, chats, isLoadingHistory, user?.id])

  // Persist chats locally so refresh/navigation keeps history
  useEffect(() => {
    if (!user?.id) return
    const key = getStorageKey(user.id)
    localStorage.setItem(key, JSON.stringify({ chats }))
  }, [chats, user?.id])

  const active_chat = useMemo(
    () => chats.find((chat) => chat.id === chatID) ?? chats[0],
    [chats, chatID],
  )

  const userName = user?.name || '사용자'

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => {
      const filtered = prev.filter((chat) => chat.id !== chatId)
      if (filtered.length === 0) {
        const fresh = createEmptyChat()
        setChatID(fresh.id)
        return [fresh]
      }
      if (chatId === chatID) {
        setChatID(filtered[0].id)
      }
      return filtered
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!input.trim() || !active_chat || isLoading || !user?.id) return
    const new_message: Message = {
      id: crypto.randomUUID()
      ,role: "user"
      ,content: input.trim()
      ,created_at: new Date().toISOString()
      ,
    }
    const pendingAssistantId = crypto.randomUUID()
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === active_chat.id
          ?{
              ...chat
              ,messages: [
                ...chat.messages,
                new_message,
                {
                  id: pendingAssistantId,
                  role: "assistant",
                  content: "",
                  created_at: new Date().toISOString(),
                },
              ]
              ,
            }
          :chat
          ,
      )
      ,
    )
    setInput('')
    setIsLoading(true)
    const ws = new WebSocket(buildWsUrl())
    const history = [...active_chat.messages, new_message].map(({ role, content }) => ({
      role,
      content,
    }))
    let buffered = ''

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          message: new_message.content,
          session_id: active_chat.id,
          conversation_history: history,
        }),
      )
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string)
        if (data.event === 'token') {
          buffered += data.token ?? ''
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === active_chat.id
                ? {
                    ...chat,
                    messages: chat.messages.map((msg) =>
                      msg.id === pendingAssistantId ? { ...msg, content: buffered } : msg,
                    ),
                  }
                : chat,
            ),
          )
        } else if (data.event === 'done') {
          const sessionFromServer = data.session_id as string | undefined
          const finalResponse =
            data.response || buffered || '지금은 답변할 수 없어요. 나중에 다시 시도해주세요.'
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== active_chat.id) return chat
              const updatedMessages = chat.messages.map((msg) =>
                msg.id === pendingAssistantId ? { ...msg, content: finalResponse } : msg,
              )
              return {
                ...chat,
                id: sessionFromServer || chat.id,
                messages: updatedMessages,
              }
            }),
          )
          if (sessionFromServer && sessionFromServer !== active_chat.id) {
            setChatID(sessionFromServer)
          }
          setIsLoading(false)
          ws.close()
        } else if (data.event === 'error') {
          throw new Error(data.detail || '스트리밍 중 오류가 발생했습니다.')
        }
      } catch (error) {
        console.error('스트리밍 처리 실패:', error)
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === active_chat.id
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === pendingAssistantId
                      ? {
                          ...msg,
                          content: '오류가 발생했습니다. 잠시 후에 다시 시도해주세요.',
                        }
                      : msg,
                  ),
                }
              : chat,
          ),
        )
        setIsLoading(false)
        ws.close()
      }
    }

    ws.onerror = (event) => {
      console.error('웹소켓 오류:', event)
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === active_chat.id
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === pendingAssistantId
                    ? {
                        ...msg,
                        content: '연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                      }
                    : msg,
                ),
              }
            : chat,
        ),
      )
      setIsLoading(false)
      ws.close()
    }

    ws.onclose = (event) => {
      if (!event.wasClean && isLoading) {
        setIsLoading(false)
      }
    }
  }

  // Show loading indicator while fetching chat history
  if (isLoadingHistory) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 4rem)',
        fontSize: '1.2rem',
        color: '#475569'
      }}>
        <div>채팅 히스토리 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="page chat-layout">
      <aside className="panel chat-log">
        <div className="chat-log-header">
          <h2>대화 기록</h2>  {/*TODO: 대화 기록 삭제 기능*/}
          <button
            onClick={() => {
              const chat = createEmptyChat()
              setChats((prev) => [chat, ...prev])
              setChatID(chat.id)
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
              <div className="chat-list-text">
                <span>{chat.title}</span>
                <small className="muted block">{chat.messages.at(-1)?.content}</small>
              </div>
              <button
                className="chat-delete"
                aria-label="대화 삭제"
                onClick={(event) => {
                  event.stopPropagation()
                  handleDeleteChat(chat.id)
                }}
              >
                삭제
              </button>
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
            <>
              {active_chat.messages.map((message) => (
                <article key={message.id} className={`message ${message.role}`}>
                  <div className="message-card">
                    <div className="message-meta">
                      <strong>{message.role === 'user' ? userName : 'LawMate'}</strong>
                      <time className="message-time">
                        {formatTime(message.created_at) || '방금'}
                      </time>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </article>
              ))}
              {isLoading && (
                <article className="message assistant">
                  <div className="message-card">
                    <div className="message-meta">
                      <strong>LawMate</strong>
                      <time className="message-time">방금</time>
                    </div>
                    <div className="loading-dots">
                      <span>답변을 생성하고 있습니다</span>
                      <div className="dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </div>
                    </div>
                  </div>
                </article>
              )}
            </>
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
          <button type="submit" style={{ minWidth: '80px', height: '48px', alignSelf: 'center' }}>
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
              onUploadSuccess={(result, isImage) => {
                setShowAgentPopup(false)
                const initialMessage = {
                  id: crypto.randomUUID(),
                  role: "assistant" as const,
                  content: isImage
                    ? `계약서 이미지를 받아서 OCR을 진행했어요.\n\n${result.text || '텍스트를 추출하지 못했습니다.'}\n\n추가 질문이 있으면 말씀해주세요.`
                    : "계약서를 새 대화로 준비했어요. 궁금한 점을 알려주세요!",
                  created_at: new Date().toISOString(),
                }
                const newChat = {
                  ...createEmptyChat("계약서 분석"),
                  messages: [initialMessage],
                }
                setChats((prev) => [newChat, ...prev])
                setChatID(newChat.id)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatbotPage
