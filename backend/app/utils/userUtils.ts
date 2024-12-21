import User from '#models/user'

// Définissez une interface pour le résultat
interface UserResult {
    password: string
    id_user: number
  }

export async function findUserByEmail(email: string): Promise<UserResult | null> {
  return await User.query()
    .where('email', email)
    .select('password', 'id_user')
    .first() as UserResult | null
}
