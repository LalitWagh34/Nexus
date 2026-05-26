import Sidebar from '../components/Sidebar.tsx'
import ChatArea from '../components/ChatArea'
import { useState } from 'react'

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      <Sidebar
        selectedId={selectedConversationId}
        onSelect={setSelectedConversationId}
      />
      <ChatArea conversationId={selectedConversationId} />
    </div>
  )
}