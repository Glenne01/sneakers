'use client'

import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
interface UserData {
  firstName: string
  lastName: string
  phone?: string
}

interface AuthResponse {
  data: unknown
  error: unknown
}

interface AuthContextType {
  signUp: (email: string, password: string, userData: UserData) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const supabase = createClientComponentClient()
  const { setUser, setProfile, setLoading, signOut: clearAuth } = useAuthStore()

  const fetchUserProfile = useCallback(async (authUserId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error)
        return
      }

      if (profile) {
        setProfile(profile)
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }, [supabase, setProfile])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true)
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true)

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, setUser, setProfile, setLoading, fetchUserProfile])

  const signUp = async (email: string, password: string, userData: UserData) => {
    try {
      setLoading(true)

      // Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          }
        }
      })

      if (authError) {
        throw authError
      }

      // If user is created, create profile in users table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_user_id: data.user.id,
            email: data.user.email!,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: 'customer'
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Don't throw here as the auth user was created successfully
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      clearAuth()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      return { data, error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  }

  const value: AuthContextType = {
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}