import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCurrentUser = useCallback(async () => {
    if (!tokenStorage.get()) {
      setIsLoading(false)
      return
    }
    try {
      const currentUser = await authService.me()
      setUser(currentUser)
    } catch {
      tokenStorage.clear()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  const applyAuthResponse = (authResponse) => {
    tokenStorage.set(authResponse.accessToken)
    setUser(authResponse.user)
  }

  const login = async (email, password) => {
    const response = await authService.login({ email, password })
    applyAuthResponse(response)
    toast.success(`Welcome back, ${response.user.name.split(' ')[0]}`)
    return response.user
  }

  const signup = async (name, email, password) => {
    const response = await authService.signup({ name, email, password })
    applyAuthResponse(response)
    const mailStatus = await authService.emailStatus().catch(() => null)
    toast.success(mailStatus?.resetEmailConfigured
      ? 'Account created! Check your inbox to verify your email.'
      : mailStatus
        ? 'Account created. Email delivery is not configured, so verification email was not sent.'
        : 'Account created. Check your inbox if email delivery is configured; otherwise contact support to verify your account.')
    return response.user
  }

  /** Called by the /oauth2/redirect page once Spring Security hands back a token in the URL. */
  const applyToken = async (token) => {
    tokenStorage.set(token)
    const currentUser = await authService.me()
    setUser(currentUser)
    toast.success(`Welcome, ${currentUser.name.split(' ')[0]}`)
    return currentUser
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore network errors on logout - we clear client state regardless.
    }
    tokenStorage.clear()
    setUser(null)
    toast.success('Logged out')
  }

  const updateUser = (patch) => setUser((prev) => (prev ? { ...prev, ...patch } : prev))

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: !!user?.roles?.includes('ROLE_ADMIN'),
      isLoading,
      login,
      signup,
      logout,
      applyToken,
      updateUser,
      refresh: loadCurrentUser,
    }),
    [user, isLoading, loadCurrentUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
