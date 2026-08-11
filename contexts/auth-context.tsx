"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { AuthError, Session, User } from "@supabase/supabase-js"

import { supabase } from "@/lib/supabase"

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: string | null
  status: string | null
  group_id: string | null
  avatar_url: string | null
}

interface AuthResult<T> {
  data: T | null
  error: AuthError | null
}

interface AuthValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult<{ user: User | null; session: Session | null }>>
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<AuthResult<{ user: User | null; session: Session | null }>>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult<object>>
  updatePassword: (newPassword: string) => Promise<AuthResult<{ user: User | null }>>
  fetchProfile: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()
    setProfile((data as Profile) ?? null)
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { data, error }
  }

  async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    return { data, error }
  }

  async function updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  }
  return ctx
}
