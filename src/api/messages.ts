import api from '../../nexus-client/src/lib/axios'
import type { Message } from '../../nexus-client/src/types'

export const getMessages = async (
  conversationId: string,
  cursor?: string
): Promise<{ messages: Message[]; nextCursor: string | null }> => {
  const { data } = await api.get(`/conversations/${conversationId}/messages`, {
    params: { cursor, limit: 30 }
  })
  return data
}

export const sendMessage = async (
  conversationId: string,
  content: string,
  type: string = 'TEXT'
): Promise<Message> => {
  const { data } = await api.post(`/conversations/${conversationId}/messages`, {
    content,
    type
  })
  return data.message
}

export const deleteMessage = async (messageId: string): Promise<void> => {
  await api.delete(`/messages/${messageId}`)
}