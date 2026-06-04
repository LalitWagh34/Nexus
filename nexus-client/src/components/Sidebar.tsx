// import { MessageSquare, Sun, Moon, LogOut } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'
import type { Conversation } from '../types'
import { MessageSquare, Sun, Moon, LogOut, PenSquare } from 'lucide-react'

interface Props {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (conversation: Conversation) => void
}

// Temporary mock data — will replace with real API later


function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Sidebar({ conversations , selectedId, onSelect }: Props) {
  const { isDark, toggle } = useThemeStore()
  const { user, logout } = useAuthStore()

  return (
    <div style={{
      width: '280px',
      minWidth: '280px',
      height: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} color="var(--text-primary)" />
          <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>
            Nexus
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={toggle} style={iconBtnStyle}>
            {isDark ? <Sun size={15} color="var(--text-secondary)" /> : <Moon size={15} color="var(--text-secondary)" />}
          </button>
          <button onClick={logout} style={iconBtnStyle}>
            <LogOut size={15} color="var(--text-secondary)" />
          </button>
        </div>
      </div>
      <button
        onClick={() => console.log('new chat')}
        style={iconBtnStyle}
        title="New conversation"
      >
        <PenSquare size={15} color="var(--text-secondary)" />
      </button>

      {/* Search */}
      <div style={{ padding: '12px 16px' }}>
        <input
          placeholder="Search conversations..."
          style={{
            width: '100%',
            height: '34px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-hover)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            padding: '0 12px',
            outline: 'none',
          }}
        />
      </div>

      {/* Conversations */}
      {/* Conversations */}
<div style={{ flex: 1, overflowY: 'auto' }}>
  {conversations.length === 0 ? (
    <div style={{ padding: '24px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
        No conversations yet
      </p>
    </div>
  ) : (
    conversations.map(conv => (
      <div
        key={conv.id}
        onClick={() => onSelect(conv)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          cursor: 'pointer',
          backgroundColor: selectedId === conv.id ? 'var(--bg-hover)' : 'transparent',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={e => {
          if (selectedId !== conv.id)
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
        }}
        onMouseLeave={e => {
          if (selectedId !== conv.id)
            e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {conv.avatar
            ? <img src={conv.avatar} alt={conv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : getInitials(conv.name || 'U')
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{conv.name || 'Unknown'}</span>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              flexShrink: 0,
              marginLeft: '8px'
            }}>
              {conv.lastMessage
                ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit'
                  })
                : ''
              }
            </span>
          </div>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '2px'
          }}>
            {conv.lastMessage?.content || 'No messages yet'}
          </p>
        </div>
      </div>
    ))
  )}
</div>

      {/* User Profile */}
      {user && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {user.avatar
              ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : getInitials(user.name)
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{user.name}</p>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{user.email}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const iconBtnStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}