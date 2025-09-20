// Google Sheets Database Configuration
// Replace these values with your actual Google Sheets and Form URLs

export const GOOGLE_SHEETS_CONFIG = {
  // Your Google Sheets ID (get this from your sheet URL)
  SHEET_ID: 'YOUR_GOOGLE_SHEETS_ID_HERE',
  
  // Name of the sheet tab (default: 'Users')
  SHEET_NAME: 'Users',
  
  // Your Google Form response URL (for user registration)
  // Get this by creating a Google Form and using /formResponse endpoint
  FORM_URL: 'YOUR_GOOGLE_FORM_RESPONSE_URL_HERE',
  
  // Demo credentials (fallback when Google Sheets is not configured)
  DEMO_EMAIL: 'demo@healthcare.com',
  DEMO_PASSWORD: 'demo123',
  DEMO_NAME: 'Sarah Johnson',
  DEMO_PATIENT_ID: 'UHR-2024-001'
}

// Instructions to get these values:
// 
// 1. Google Sheets ID:
//    - Open your Google Sheets
//    - Copy the ID from URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
//    - Replace YOUR_GOOGLE_SHEETS_ID_HERE with the actual ID
//
// 2. Google Form URL:
//    - Create a Google Form with fields: FirstName, LastName, Email, Password, PatientId, Role, Phone, DateOfBirth
//    - Go to Send → Link tab
//    - Copy the URL and replace /viewform with /formResponse
//    - Replace YOUR_GOOGLE_FORM_RESPONSE_URL_HERE with this URL
//
// 3. Make sure your Google Sheets is published to web (File → Share → Publish to web)