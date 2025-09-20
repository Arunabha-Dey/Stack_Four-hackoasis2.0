"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from 'next/navigation'
import { googleSheetsDB, submitUserToGoogleForm } from '../google-sheets-db'
import { GOOGLE_SHEETS_CONFIG } from './google-sheets-config'
import { localUsersDB } from './local-users-db'
import { debugUsers } from '../users-debug'

interface User {
  id: string
  name: string
  email: string
  patientId: string
  role: 'patient' | 'doctor' | 'admin'
  phone?: string
  dateOfBirth?: string
}

interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (userData: SignUpData) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: Check local database first (for users created via signup)
      const localUser = localUsersDB.findUserByEmail(email)
      if (localUser && localUser.password === password) {
        const userData = {
          id: localUser.id,
          name: `${localUser.firstName} ${localUser.lastName}`,
          email: localUser.email,
          patientId: localUser.patientId,
          role: localUser.role,
          phone: localUser.phone,
          dateOfBirth: localUser.dateOfBirth,
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('auth-token', 'mock-jwt-token')
        document.cookie = 'auth-token=mock-jwt-token; path=/; max-age=86400'
        router.push('/dashboard')
        return
      }

      // Step 2: Check Google Sheets (for pre-existing users)
      const googleUser = await googleSheetsDB.findUserByEmail(email)
      if (googleUser && googleUser.password === password) {
        // Add this user to local database for future logins
        const newLocalUser = localUsersDB.createUser({
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          password: googleUser.password,
          patientId: googleUser.patientId,
          role: googleUser.role,
          phone: googleUser.phone,
          dateOfBirth: googleUser.dateOfBirth,
        })

        if (newLocalUser) {
          const userData = {
            id: newLocalUser.id,
            name: `${newLocalUser.firstName} ${newLocalUser.lastName}`,
            email: newLocalUser.email,
            patientId: newLocalUser.patientId,
            role: newLocalUser.role,
            phone: newLocalUser.phone,
            dateOfBirth: newLocalUser.dateOfBirth,
          }
          
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('auth-token', 'mock-jwt-token')
          document.cookie = 'auth-token=mock-jwt-token; path=/; max-age=86400'
          router.push('/dashboard')
          return
        }
      }

      // Step 3: Check demo credentials (fallback)
      if (email === GOOGLE_SHEETS_CONFIG.DEMO_EMAIL && password === GOOGLE_SHEETS_CONFIG.DEMO_PASSWORD) {
        const userData = {
          id: "1",
          name: "Sarah Johnson",
          email: "demo@healthcare.com",
          patientId: "UHR-2024-001",
          role: "patient" as const,
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('auth-token', 'mock-jwt-token')
        document.cookie = 'auth-token=mock-jwt-token; path=/; max-age=86400'
        router.push('/dashboard')
        return
      }

      // If none of the above worked
      throw new Error('Invalid credentials')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: SignUpData) => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: Check if user already exists in local database
      const existingLocalUser = localUsersDB.findUserByEmail(userData.email)
      if (existingLocalUser) {
        throw new Error('User with this email already exists')
      }

      // Step 2: Check if user exists in Google Sheets (optional)
      try {
        const existingGoogleUser = await googleSheetsDB.findUserByEmail(userData.email)
        if (existingGoogleUser) {
          throw new Error('User with this email already exists')
        }
      } catch (googleError) {
        // If Google Sheets check fails, continue with local signup
        console.warn('Google Sheets check failed, proceeding with local signup:', googleError)
      }
      
      // Step 3: Generate patient ID
      const patientId = `UHR-${Date.now().toString().slice(-6)}`
      
      // Step 4: Create user in local database (this connects signup to login)
      const newLocalUser = localUsersDB.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // Note: In production, hash this password
        patientId: patientId,
        role: "patient",
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
      })

      if (!newLocalUser) {
        throw new Error('Failed to create user account')
      }
      
      // Step 5: Optionally submit to Google Form (for backup/external storage)
      const GOOGLE_FORM_URL = GOOGLE_SHEETS_CONFIG.FORM_URL
      if (GOOGLE_FORM_URL && GOOGLE_FORM_URL !== 'YOUR_GOOGLE_FORM_RESPONSE_URL_HERE') {
        const newUserRecord = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          patientId: patientId,
          role: "patient" as const,
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth,
        }
        
        try {
          await submitUserToGoogleForm(GOOGLE_FORM_URL, newUserRecord)
        } catch (formError) {
          console.warn('Google Form submission failed, but user was created locally:', formError)
        }
      }
      
      // Step 6: Create user object for the app and auto-login
      const newUser: User = {
        id: newLocalUser.id,
        name: `${newLocalUser.firstName} ${newLocalUser.lastName}`,
        email: newLocalUser.email,
        patientId: newLocalUser.patientId,
        role: newLocalUser.role,
        phone: newLocalUser.phone,
        dateOfBirth: newLocalUser.dateOfBirth,
      }
      
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('auth-token', 'mock-jwt-token')
      document.cookie = 'auth-token=mock-jwt-token; path=/; max-age=86400'
      
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('auth-token')
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signUp,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
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
