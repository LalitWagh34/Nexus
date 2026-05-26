import { MessageSquare, Sun, Moon, LogOut } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'

interface Props {
  selectedId: string | null
  onSelect: (id: string) => void
}

// Temporary mock data — will replace with real API later
const mockConversations = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', time: '2m', avatar: null, isGroup: false },
  { id: '2', name: 'Design Team', lastMessage: 'Can you share the files?', time: '1h', avatar: null, isGroup: true },
  { id: '3', name: 'Jane Smith', lastMessage: 'See you tomorrow!', time: '3h', avatar: null, isGroup: false },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Sidebar({ selectedId, onSelect }: Props) {
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
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {mockConversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
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
              flexShrink: 0
            }}>
              {getInitials(conv.name)}
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
                }}>{conv.name}</span>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  flexShrink: 0,
                  marginLeft: '8px'
                }}>{conv.time}</span>
              </div>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '2px'
              }}>{conv.lastMessage}</p>
            </div>
          </div>
        ))}
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