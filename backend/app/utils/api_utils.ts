import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

// Définissez une interface pour le résultat
interface UserResult {
  idUser: number
  password: string
  email: string
  role: string
}

export async function findUserByEmail(email: string): Promise<UserResult | null> {
  return (await User.query()
    .where('email', email)
    .select('idUser', 'password', 'role', 'email')
    .first()) as UserResult | null
}

export async function isUserTableEmpty(): Promise<boolean> {
  const count = await db.from('users').count('* as total').first()
  return count?.total === 0
}

export async function isValidRole(email: string, requiredRole: string): Promise<boolean> {
  try {
    const userRole = await db.from('users').where('email', email).select('role')

    return userRole[0]?.role === requiredRole
  } catch (error) {
    console.error('Error verifying role:', error)
    return false
  }
}
