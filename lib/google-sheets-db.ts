// Google Sheets CSV Database Integration
// This allows using Google Sheets as a simple database without Google Console

import { GOOGLE_SHEETS_CONFIG } from './auth/google-sheets-config'

const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Users'

export interface UserRecord {
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

export interface GoogleSheetsConfig {
  sheetId: string
  sheetName: string
  apiKey?: string // Optional: for private sheets
}

class GoogleSheetsDB {
  private config: GoogleSheetsConfig

  constructor(sheetId: string = GOOGLE_SHEETS_CONFIG.SHEET_ID) {
    this.config = {
      sheetId,
      sheetName: 'Users'
    }
  }

  private getCsvUrl(): string {
    // Public Google Sheets CSV export URL
    return `https://docs.google.com/spreadsheets/d/${this.config.sheetId}/gviz/tq?tqx=out:csv&sheet=${this.config.sheetName}`
  }

  private parseCsvRow(row: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      const nextChar = row[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  private parseCsvData(csvText: string): UserRecord[] {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) return []

    // Remove the first line if it contains Google visualization header
    const dataLines = lines[0].includes('visualization') ? lines.slice(1) : lines
    
    if (dataLines.length < 2) return []

    const headers = this.parseCsvRow(dataLines[0])
    const users: UserRecord[] = []

    for (let i = 1; i < dataLines.length; i++) {
      const values = this.parseCsvRow(dataLines[i])
      if (values.length >= 7) { // Minimum required fields
        const user: UserRecord = {
          id: values[0] || Date.now().toString() + i,
          firstName: values[1] || '',
          lastName: values[2] || '',
          email: values[3] || '',
          password: values[4] || '',
          patientId: values[5] || '',
          role: (values[6] as 'patient' | 'doctor' | 'admin') || 'patient',
          phone: values[7],
          dateOfBirth: values[8],
          createdAt: values[9] || new Date().toISOString()
        }
        users.push(user)
      }
    }

    return users
  }

  async getAllUsers(): Promise<UserRecord[]> {
    try {
      const response = await fetch(this.getCsvUrl())
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const csvText = await response.text()
      return this.parseCsvData(csvText)
    } catch (error) {
      console.error('Error fetching users from Google Sheets:', error)
      return []
    }
  }

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const users = await this.getAllUsers()
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  async findUserByPatientId(patientId: string): Promise<UserRecord | null> {
    const users = await this.getAllUsers()
    return users.find(user => user.patientId === patientId) || null
  }

  // Note: Writing to Google Sheets via CSV is not possible without proper API
  // This is a limitation of using CSV export approach
  // For a complete solution, you would need to:
  // 1. Use Google Sheets API with proper authentication
  // 2. Or use a form-to-sheet service like Google Forms
  // 3. Or use a third-party service like SheetDB
  
  async createUser(userData: Omit<UserRecord, 'id' | 'createdAt'>): Promise<UserRecord | null> {
    // This is a placeholder - in a real implementation, you would:
    // 1. Use Google Sheets API with write permissions
    // 2. Or use a form submission approach
    // 3. Or use a service like SheetDB
    
    console.warn('Direct user creation via CSV is not supported. Consider using Google Sheets API or a form service.')
    
    // For demo purposes, we'll return a mock user
    const newUser: UserRecord = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    return newUser
  }
}

// Default configuration - users should replace with their own sheet ID
const defaultConfig: GoogleSheetsConfig = {
  sheetId: 'YOUR_GOOGLE_SHEETS_ID_HERE', // Replace with your Google Sheets ID
  sheetName: 'Users'
}

export const googleSheetsDB = new GoogleSheetsDB(defaultConfig.sheetId)

// Utility function to create a Google Sheets template
export function createGoogleSheetsTemplate(): string {
  return `Google Sheets Template for User Database:

1. Create a new Google Sheets document
2. Name the first sheet "Users"
3. Add these headers in row 1 (columns A-J):
   A: ID, B: FirstName, C: LastName, D: Email, E: Password, F: PatientId, G: Role, H: Phone, I: DateOfBirth, J: CreatedAt

4. Add sample user data (starting from row 2):
   Row 2: 1, John, Doe, john@example.com, password123, UHR-2024-001, patient, 555-1234, 1990-01-01, 2024-01-01T00:00:00Z
   Row 3: 2, Jane, Smith, jane@example.com, password456, UHR-2024-002, patient, 555-5678, 1985-05-15, 2024-01-02T00:00:00Z

5. Make the sheet publicly accessible (File > Share > Publish to web)
6. Copy the sheet ID from the URL and replace YOUR_GOOGLE_SHEETS_ID_HERE in the code

Note: For production use, consider using Google Sheets API with proper authentication instead of CSV export.`
}

// Alternative: Use a form submission approach for creating users
export async function submitUserToGoogleForm(formUrl: string, userData: any): Promise<boolean> {
  try {
    const formData = new FormData()
    
    // Map user data to form fields (you'll need to adjust based on your form)
    formData.append('entry.123456789', userData.firstName) // Replace with your form field IDs
    formData.append('entry.234567890', userData.lastName)
    formData.append('entry.345678901', userData.email)
    formData.append('entry.456789012', userData.password)
    formData.append('entry.567890123', userData.patientId)
    formData.append('entry.678901234', userData.role)
    formData.append('entry.789012345', userData.phone || '')
    formData.append('entry.890123456', userData.dateOfBirth || '')
    
    const response = await fetch(formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Important for Google Forms
    })
    
    return true // Form submission is successful even if we can't read response due to no-cors
  } catch (error) {
    console.error('Error submitting to Google Form:', error)
    return false
  }
}