import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem('accessToken')
    socket = io('http://localhost:3000', {
      auth: { token: `Bearer ${token}` },
      autoConnect: false,
    })
  }
  return socket
}

export const connectSocket = () => {
  const s = getSocket()
  if (!s.connected) s.connect()
}

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect()
    socket = null
  }
}