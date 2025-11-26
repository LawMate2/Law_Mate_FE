import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
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
}

const seedChats: Chat[] = [
  {
    id: '1',
    title: '상담 - 계약서 검토',
    messages: [
      { id: '1', role: 'user', content: '계약서에서 갑의 책임 조항 정리해줘' },
      {
        id: '2',
        role: 'assistant',
        content: '3.1, 3.2 조항에서 갑의 의무가 명시되어 있고 전자서명 절차를 먼저 검증해야 합니다.',
      },
    ],
  },
  {
    id: '2',
    title: '고객 메일 초안',
    messages: [
      { id: '3', role: 'user', content: '고객에게 보낼 요약 메일 써줘' },
      {
        id: '4',
        role: 'assistant',
        content: '안녕하세요. 요청하신 사건은 이번 주 내로 초안 검토 예정입니다. 필요한 자료를 공유해 주세요.',
      },
    ],
  },
]

function ChatbotPage() {
  const [chats, setChats] = useState<Chat[]>(seedChats)
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id ?? '')
  const [input, setInput] = useState('')

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [chats, activeChatId],
  )

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!input.trim() || !activeChat) return
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                newMessage,
                {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: 'MCP 서버 연동 후 답변이 여기에 표시됩니다.',
                },
              ],
            }
          : chat,
      ),
    )
    setInput('')
  }

  return (
    <div className="page chat-layout">
      <aside className="panel chat-log">
        <div className="chat-log-header">
          <h2>대화 기록</h2>
          <button
            onClick={() => {
              const id = crypto.randomUUID()
              setChats((prev) => [
                { id, title: '새로운 대화', messages: [] },
                ...prev,
              ])
              setActiveChatId(id)
            }}
          >
            새 대화
          </button>
        </div>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={chat.id === activeChat?.id ? 'active' : ''}
              onClick={() => setActiveChatId(chat.id)}
            >
              {chat.title}
              <small className="muted block">{chat.messages.at(-1)?.content}</small>
            </li>
          ))}
        </ul>
      </aside>
      <section className="panel chat-window">
        <header>
          <h1>LawMate 챗봇</h1>
          <p className="muted">좌측 로그에서 과거 대화를 찾아보고 계속 이어갈 수 있습니다.</p>
        </header>
        <div className="messages">
          {activeChat?.messages.length ? (
            activeChat.messages.map((message) => (
              <article key={message.id} className={`message ${message.role}`}>
                <strong>{message.role === 'user' ? '사용자' : 'LawMate'}</strong>
                <span>{message.content}</span>
              </article>
            ))
          ) : (
            <p className="muted">메시지를 입력하면 이 영역에 대화가 표시됩니다.</p>
          )}
        </div>
        <form className="chat-input form" onSubmit={handleSubmit}>
          <textarea
            placeholder="메시지를 입력하세요."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit">전송</button>
        </form>
      </section>
    </div>
  )
}

export default ChatbotPage
