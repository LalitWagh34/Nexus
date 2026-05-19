import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google'
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}>
      
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <MessageSquare size={24} style={{ color: 'var(--text-primary)' }} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              Nexus
            </h1>
            <p className="text-sm mt-1"
              style={{ color: 'var(--text-secondary)' }}>
              Real-time messaging, built different.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl border p-8 flex flex-col gap-4"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)'
          }}>
          
          <div className="text-center">
            <h2 className="text-base font-medium"
              style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h2>
            <p className="text-sm mt-1"
              style={{ color: 'var(--text-secondary)' }}>
              Sign in to continue to Nexus
            </p>
          </div>

          {/* Google Button */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-10 flex items-center gap-3 rounded-lg font-medium text-sm"
            style={{
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)'
            }}
            variant="outline"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Continue with Google
          </Button>

        </div>

        {/* Footer */}
        <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
          By continuing, you agree to our Terms of Service
        </p>

      </div>
    </div>
  )
}