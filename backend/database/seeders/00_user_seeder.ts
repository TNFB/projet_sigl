import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import bcrypt from 'bcrypt'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'email1@test.com',
        password: await bcrypt.hash('MdpPourAdminAdmin', 10),
        name: 'Admin',
        last_name: 'Admin',
        telephone: '1234567890',
        role: 'admins',
      },
      {
        email: 'email2@test.com',
        password: await bcrypt.hash('MdpPourMaitreApprentissage', 10),
        name: 'Maitre',
        last_name: 'Apprentissage',
        telephone: '9876543210',
        role: 'apprentice_masters',
      },
      {
        email: 'email3@test.com',
        password: await bcrypt.hash('MdpPourTuteurPedagogique', 10),
        name: 'Tuteur',
        last_name: 'Pedagogique',
        telephone: '1928374655',
        role: 'educational_tutors',
      },
    ])
  }
}
