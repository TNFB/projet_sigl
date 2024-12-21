import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import bcrypt from 'bcrypt'

// Définissez une interface pour le résultat
interface UserResult {
  id_user: number
  password: string
  email: string
  role: string
}

export async function findUserByEmail(email: string): Promise<UserResult | null> {
  return await User.query()
    .where('email', email)
    .select('id_user', 'password', 'role', 'email')
    .first() as UserResult | null
}

export async function isUserTableEmpty(): Promise<boolean> {
  const count = await db.from('users').count('* as total').first()
  return count?.total === 0
}

export async function isValidTokenAndRole(token: string, requiredRole: string): Promise<boolean> {
  try {
    const users = await db
      .from('users')
      .select('token', 'role', 'expired_date')

      for (const user of users) {
        const isTokenMatch = await bcrypt.compare(token, user.token)
        if (isTokenMatch) {
          // Check if token is expired
          if (user.expired_date && DateTime.fromJSDate(user.expired_date) < DateTime.now()) {
            return false // Token is expired
          }
          // Check if user has the required role
          return user.role === requiredRole
        }
      }
  
      return false // No matching token found
  
    } catch (error) {
      console.error('Error verifying token and role:', error)
      return false
    }
  }