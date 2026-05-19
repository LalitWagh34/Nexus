import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { useEffect } from 'react'
import LoginPage from './pages/LoginPage'
// import ChatPage from './pages/ChatPage'

function App() {
  const { accessToken } = useAuthStore()
  const { isDark } = useThemeStore()

  // Sync theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          accessToken ? <Navigate to="/" /> : <LoginPage />
        } />
        {/* <Route path="/*" element={
          accessToken ? <ChatPage /> : <Navigate to="/login" />
        } /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App