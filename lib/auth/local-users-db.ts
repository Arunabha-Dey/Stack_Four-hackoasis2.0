// Local Users Database - Fallback when Google Sheets is not configured
// This provides a temporary storage solution that connects signup and login

export interface LocalUserRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  patientId: string
  role: 'patient' | 'doctor' | 'admin'
  phone?: string
  dateOfBirth?: string
  createdAt: string
}

class LocalUsersDB {
  private readonly STORAGE_KEY = 'healthcare_users_db'

  constructor() {
    // Initialize with demo user if no users exist
    this.initializeDemoUser()
  }

  private initializeDemoUser(): void {
    const existingUsers = this.getAllUsers()
    if (existingUsers.length === 0) {
      const demoUser: LocalUserRecord = {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'demo@healthcare.com',
        password: 'demo123',
        patientId: 'UHR-2024-001',
        role: 'patient',
        createdAt: new Date().toISOString()
      }
      this.createUser(demoUser)
    }
  }

  getAllUsers(): LocalUserRecord[] {
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        return []
      }
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading local users database:', error)
      return []
    }
  }

  private saveUsers(users: LocalUserRecord[]): void {
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        return
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Error saving local users database:', error)
    }
  }

  findUserByEmail(email: string): LocalUserRecord | null {
    const users = this.getAllUsers()
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  findUserByPatientId(patientId: string): LocalUserRecord | null {
    const users = this.getAllUsers()
    return users.find(user => user.patientId === patientId) || null
  }

  createUser(userData: Omit<LocalUserRecord, 'id' | 'createdAt'>): LocalUserRecord | null {
    try {
      const users = this.getAllUsers()
      
      // Check if user already exists
      if (this.findUserByEmail(userData.email)) {
        throw new Error('User with this email already exists')
      }

      const newUser: LocalUserRecord = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      this.saveUsers(users)
      
      return newUser
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  updateUser(email: string, updates: Partial<LocalUserRecord>): LocalUserRecord | null {
    try {
      const users = this.getAllUsers()
      const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase())
      
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      users[userIndex] = { ...users[userIndex], ...updates }
      this.saveUsers(users)
      
      return users[userIndex]
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  deleteUser(email: string): boolean {
    try {
      const users = this.getAllUsers()
      const filteredUsers = users.filter(user => user.email.toLowerCase() !== email.toLowerCase())
      
      if (filteredUsers.length === users.length) {
        throw new Error('User not found')
      }

      this.saveUsers(filteredUsers)
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  clearAllUsers(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      this.initializeDemoUser() // Recreate demo user
    } catch (error) {
      console.error('Error clearing users database:', error)
    }
  }

  // For debugging and testing
  getUserCount(): number {
    return this.getAllUsers().length
  }

  exportUsers(): string {
    const users = this.getAllUsers()
    return JSON.stringify(users, null, 2)
  }

  importUsers(usersJson: string): boolean {
    try {
      const users = JSON.parse(usersJson) as LocalUserRecord[]
      this.saveUsers(users)
      return true
    } catch (error) {
      console.error('Error importing users:', error)
      return false
    }
  }
}

// Export singleton instance
export const localUsersDB = new LocalUsersDB()

// Helper function to migrate from Google Sheets format
export function convertGoogleSheetsUser(googleUser: any): LocalUserRecord {
  return {
    id: googleUser.id || Date.now().toString(),
    firstName: googleUser.firstName || googleUser.FirstName || '',
    lastName: googleUser.lastName || googleUser.LastName || '',
    email: googleUser.email || googleUser.Email || '',
    password: googleUser.password || googleUser.Password || '',
    patientId: googleUser.patientId || googleUser.PatientId || '',
    role: (googleUser.role || googleUser.Role || 'patient') as 'patient' | 'doctor' | 'admin',
    phone: googleUser.phone || googleUser.Phone,
    dateOfBirth: googleUser.dateOfBirth || googleUser.DateOfBirth,
    createdAt: googleUser.createdAt || googleUser.CreatedAt || new Date().toISOString()
  }
}