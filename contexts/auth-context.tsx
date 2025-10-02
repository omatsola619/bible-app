import AsyncStorage from '@react-native-async-storage/async-storage'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  hasCompletedOnboarding: boolean
  completeOnboarding: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const USER_STORAGE_KEY = "@biblia2_user";
const ONBOARDING_STORAGE_KEY = '@biblia2_onboarding_completed'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  // Load user and onboarding status from storage
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        // Get initial session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name:
              session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          }
          setUser(userData)
        }

        // Load onboarding status
        const onboardingData = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
        if (onboardingData === 'true') {
          setHasCompletedOnboarding(true)
        }
      } catch (error) {
        console.log('Error loading auth state:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name:
            session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        }
        setUser(userData)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('Login error:', error.message)
        return false
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
        }
        setUser(userData)
        return true
      }

      return false
    } catch (error) {
      console.log('Login error:', error)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        console.log('Signup error:', error.message)
        return false
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || name,
        }
        setUser(userData)
        return true
      }

      return false
    } catch (error) {
      console.log('Signup error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.log('Logout error:', error.message)
        throw error
      }

      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY)
      setUser(null)
      setHasCompletedOnboarding(false)
    } catch (error) {
      console.log('Logout error:', error)
      throw error
    }
  }

  const completeOnboarding = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
      setHasCompletedOnboarding(true)
    } catch (error) {
      console.log('Error completing onboarding:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        hasCompletedOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
