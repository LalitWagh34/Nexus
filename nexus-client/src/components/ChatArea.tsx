import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import { getMessages, sendMessage } from '../api/messages'
import type { Conversation } from '../types'

interface Props {
  conversation: Conversation | null
}

export default function ChatArea({ conversation }: Props) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, setMessages, addMessage, setLoadingMessages } = useChatStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!conversation) return

    const fetch = async () => {
      setLoadingMessages(true)
      try {
        const data = await getMessages(conversation.id)
        // Messages come desc from API, reverse for display
        setMessages([...data.messages].reverse())
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      } finally {
        setLoadingMessages(false)
      }
    }

    fetch()
  }, [conversation?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !conversation || sending) return
    setSending(true)
    try {
      const message = await sendMessage(conversation.id, input.trim())
      addMessage(message)
      setInput('')
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }

  if (!conversation) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500' }}>
          Select a conversation
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Choose from your existing conversations or start a new one
        </p>
      </div>
    )
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        height: '57px',
        padding: '0 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          overflow: 'hidden'
        }}>
          {conversation.avatar
            ? <img src={conversation.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (conversation.name?.[0] || 'U').toUpperCase()
          }
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
            {conversation.name || 'Unknown'}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {conversation.isGroup
              ? `${conversation.members?.length || 0} members`
              : 'Online'
            }
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {messages.map(msg => {
          const isMine = msg.senderId === user?.id
          return (
            <div
              key={msg.id}
              style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}
            >
              <div style={{
                maxWidth: '65%',
                padding: '10px 14px',
                borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: isMine ? 'var(--bubble-sent)' : 'var(--bubble-received)',
                color: isMine ? 'var(--bubble-sent-text)' : 'var(--bubble-received-text)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {/* Show sender name in groups */}
                {conversation.isGroup && !isMine && (
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    opacity: 0.7
                  }}>
                    {msg.sender?.name}
                  </p>
                )}
                {msg.content}
                <p style={{
                  fontSize: '10px',
                  marginTop: '4px',
                  opacity: 0.6,
                  textAlign: 'right'
                }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            height: '40px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            padding: '0 14px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: sending || !input.trim() ? 'var(--bg-hover)' : 'var(--bubble-sent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            transition: 'background-color 0.15s'
          }}
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  )
}