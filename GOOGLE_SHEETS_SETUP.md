# Google Sheets Database Setup Guide

## Overview
This guide will help you set up a Google Sheets-based database to store user information without using Google Console or complex APIs.

## Step 1: Create Your Google Sheets Database

1. **Create a new Google Sheets document**
   - Go to [Google Sheets](https://sheets.google.com)
   - Click "+" to create a new blank spreadsheet

2. **Set up the Users sheet**
   - Name your sheet "Users" (or whatever you prefer)
   - Add these headers in row 1 (columns A-J):
     ```
     A: ID
     B: FirstName  
     C: LastName
     D: Email
     E: Password
     F: PatientId
     G: Role
     H: Phone
     I: DateOfBirth
     J: CreatedAt
     ```

3. **Add sample user data** (starting from row 2):
   ```
   Row 2: 1, John, Doe, john@example.com, password123, UHR-2024-001, patient, 555-1234, 1990-01-01, 2024-01-01T00:00:00Z
   Row 3: 2, Jane, Smith, jane@example.com, password456, UHR-2024-002, patient, 555-5678, 1985-05-15, 2024-01-02T00:00:00Z
   ```

## Step 2: Make Your Sheet Publicly Accessible

1. **Publish to web**
   - Go to File → Share → Publish to web
   - Click "Publish" button
   - Copy the URL (you'll need the Sheet ID from this URL)

2. **Get your Sheet ID**
   - Your Google Sheets URL looks like: `https://docs.google.com/spreadsheets/d/ABC123DEF456/edit`
   - The Sheet ID is: `ABC123DEF456` (the long string between `/d/` and `/edit`)

## Step 3: Update Your Code

1. **Replace the Sheet ID in your code**
   - Open `d:\blockchain-health-record\lib\google-sheets-db.ts`
   - Find this line: `sheetId: 'YOUR_GOOGLE_SHEETS_ID_HERE'`
   - Replace with your actual Sheet ID: `sheetId: 'ABC123DEF456'`

## Step 4: Set Up User Registration (Google Forms Method)

Since we can't write directly to Google Sheets via CSV, we'll use Google Forms:

1. **Create a Google Form**
   - Go to [Google Forms](https://forms.google.com)
   - Create a new form with these fields:
     - First Name (short answer)
     - Last Name (short answer) 
     - Email (short answer)
     - Password (short answer)
     - Patient ID (short answer)
     - Role (short answer, default: patient)
     - Phone (short answer, optional)
     - Date of Birth (short answer, optional)

2. **Link form to your sheet**
   - In the Form, go to Responses tab
   - Click the green Sheets icon to create a linked spreadsheet
   - Choose "Create a new spreadsheet" and name it

3. **Get the form submission URL**
   - In your form, click "Send" button
   - Go to the link tab and copy the form URL
   - The URL looks like: `https://docs.google.com/forms/d/e/1FAIpQLSdKx123456789/viewform`
   - Replace `/viewform` with `/formResponse` to get: `https://docs.google.com/forms/d/e/1FAIpQLSdKx123456789/formResponse`

4. **Update the form URL in your code**
   - Open `d:\blockchain-health-record\lib\auth\auth-context.tsx`
   - Find: `const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_RESPONSE_URL_HERE'`
   - Replace with your actual form URL

## Step 5: Test Your Setup

1. **Test login with existing user**
   - Use email: john@example.com, password: password123
   - This should work if your Google Sheets is set up correctly

2. **Test user registration**
   - Go to your signup page
   - Fill out the registration form
   - Check your Google Sheets - the new user should appear in the linked form responses

## Important Security Notes

⚠️ **WARNING**: This approach stores passwords in plain text. For production use:
- Use password hashing (bcrypt, argon2)
- Implement proper authentication
- Use HTTPS for all communications
- Consider using a proper database service

## Troubleshooting

### Login not working?
- Check that your Google Sheets is published to web
- Verify the Sheet ID is correct
- Make sure the email/password in your sheet matches what you're entering
- Check browser console for errors

### Signup not saving users?
- Verify the Google Form URL is correct
- Check that the form fields match the code
- Ensure the form is linked to a spreadsheet
- Check browser console for errors

### CSV parsing issues?
- Make sure your data doesn't contain commas within fields
- Use quotes around fields that contain commas
- Ensure all required fields are populated

## Alternative Solutions

If you want a more robust solution, consider:
1. **SheetDB** (sheetdb.io) - API service for Google Sheets
2. **Google Sheets API** - Requires Google Console setup but more secure
3. **Airtable** - User-friendly database with API
4. **Firebase** - Google's backend service with free tier

## Current Implementation Status

✅ Google Sheets CSV reader implemented
✅ Login validation against Google Sheets data
✅ Signup form integration ready
✅ Error handling added
⚠️ Form submission needs your Google Form URL
⚠️ Sheet ID needs to be updated with your actual ID