import api from '../../nexus-client/src/lib/axios'
import type { Conversation } from '../../nexus-client/src/types'

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get('/conversations')
  return data.conversations
}

export const getConversationById = async (id: string): Promise<Conversation> => {
  const { data } = await api.get(`/conversations/${id}`)
  return data.conversation
}

export const createConversation = async (targetUserId: string): Promise<Conversation> => {
  const { data } = await api.post('/conversations', { targetUserId })
  return data.conversation
}

export const createGroupConversation = async (
  name: string,
  memberIds: string[]
): Promise<Conversation> => {
  const { data } = await api.post('/conversations/group', { name, memberIds })
  return data.conversation
}