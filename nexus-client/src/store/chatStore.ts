import { create } from 'zustand'
import type { Conversation, Message } from '../types'

interface ChatStore {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  messages: Message[]
  nextCursor: string | null
  isLoadingConversations: boolean
  isLoadingMessages: boolean

  setConversations: (conversations: Conversation[]) => void
  setSelectedConversation: (conversation: Conversation | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setNextCursor: (cursor: string | null) => void
  setLoadingConversations: (loading: boolean) => void
  setLoadingMessages: (loading: boolean) => void
  updateLastMessage: (conversationId: string, message: Message) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  nextCursor: null,
  isLoadingConversations: false,
  isLoadingMessages: false,

  setConversations: (conversations) => set({ conversations }),
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setNextCursor: (cursor) => set({ nextCursor: cursor }),
  setLoadingConversations: (loading) => set({ isLoadingConversations: loading }),
  setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
  updateLastMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, lastMessage: message }
        : conv
    )
  }))
}))