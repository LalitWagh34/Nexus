import { Send } from 'lucide-react'
import { useState } from 'react'

interface Props {
  conversationId: string | null
}

export default function ChatArea({ conversationId }: Props) {
  const [message, setMessage] = useState('')

  if (!conversationId) {
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
          color: 'var(--text-secondary)'
        }}>JD</div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
            John Doe
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Online</p>
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
        {/* Received message */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{
            maxWidth: '65%',
            padding: '10px 14px',
            borderRadius: '16px 16px 16px 4px',
            backgroundColor: 'var(--bubble-received)',
            color: 'var(--bubble-received-text)',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Hey! How are you doing?
          </div>
        </div>

        {/* Sent message */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            maxWidth: '65%',
            padding: '10px 14px',
            borderRadius: '16px 16px 4px 16px',
            backgroundColor: 'var(--bubble-sent)',
            color: 'var(--bubble-sent-text)',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            I'm doing great! Working on Nexus 🚀
          </div>
        </div>
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
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setMessage('')}
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
          onClick={() => setMessage('')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--bubble-sent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  )
}