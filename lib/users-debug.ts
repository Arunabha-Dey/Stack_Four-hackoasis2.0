// Debug utility to check and manage local users database
import { localUsersDB } from './auth/local-users-db'

export function debugUsers() {
  console.log('=== LOCAL USERS DATABASE DEBUG ===')
  
  const users = localUsersDB.getAllUsers()
  console.log(`Total users: ${users.length}`)
  
  if (users.length === 0) {
    console.log('No users found in database')
  } else {
    console.log('Users in database:')
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Patient ID: ${user.patientId}`)
    })
  }
  
  console.log('=== END DEBUG ===')
  return users
}

export function clearAllUsers() {
  if (confirm('Are you sure you want to clear all users? This will reset the demo user.')) {
    localUsersDB.clearAllUsers()
    console.log('All users cleared. Demo user recreated.')
    debugUsers()
  }
}

export function exportUsers() {
  const usersJson = localUsersDB.exportUsers()
  console.log('Current users database:')
  console.log(usersJson)
  return usersJson
}

// Auto-debug on page load (in development)
if (typeof window !== 'undefined') {
  console.log('Healthcare Users Database initialized')
  debugUsers()
  
  // Make debug functions available globally for testing
  ;(window as any).debugUsers = debugUsers
  ;(window as any).clearAllUsers = clearAllUsers
  ;(window as any).exportUsers = exportUsers
}