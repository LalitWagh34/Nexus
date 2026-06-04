import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/axios'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')

    if (!accessToken || !refreshToken) {
      navigate('/login')
      return
    }

    // Store tokens first
    setTokens(accessToken, refreshToken)

    // Fetch user profile
    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user)
        navigate('/')
      })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Signing you in...
      </p>
    </div>
  )
}