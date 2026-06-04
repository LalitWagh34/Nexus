import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { useChatStore } from '../store/chatStore'
import { getConversations } from '../api/conversations'

export default function ChatPage() {
  const {
    conversations,
    selectedConversation,
    setConversations,
    setSelectedConversation,
    setLoadingConversations
  } = useChatStore()

  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true)
      try {
        const data = await getConversations()
        setConversations(data)
      } catch (err) {
        console.error('Failed to fetch conversations:', err)
      } finally {
        setLoadingConversations(false)
      }
    }

    fetchConversations()
  }, [])

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      <Sidebar
        conversations={conversations}
        selectedId={selectedConversation?.id || null}
        onSelect={setSelectedConversation}
      />
      <ChatArea conversation={selectedConversation} />
    </div>
  )
}