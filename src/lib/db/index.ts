import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Enable connection caching
// neonConfig.fetchConnectionCache = true

// Ensure DATABASE_URL is provided and valid
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('Environment variable DATABASE_URL not found or invalid')
}

// Initialize the SQL connection using the validated DATABASE_URL
const sql = neon(databaseUrl)

// Export the database connection for use in the application
export const db = drizzle(sql)

/**
 * Example retry mechanism for database operations
 *
 * @param {Function} fn - The function to retry
 * @param {number} retries - The number of retry attempts
 * @param {number} delay - The delay between retry attempts in milliseconds
 */
const retry = async (fn: Function, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i < retries - 1) {
        console.log(`Retrying... (${i + 1}/${retries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw err
      }
    }
  }
}
