import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import bcrypt from 'bcrypt'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'avril.corentin@gmail.com',
        password: await bcrypt.hash('MdpPourCorentinAvrilReseauEseo', 10),
        name: 'Avril',
        last_name: 'Corentin',
        telephone: '1234567890',
        role: 'admins',
      },
      {
        email: 'tom.herault4986@gmail.com',
        password: await bcrypt.hash('MdpPourTomHeraultReseauEseo', 10),
        name: 'Herault',
        last_name: 'Tom',
        telephone: '9876543210',
        role: 'apprentice_masters',
      },
      {
        email: 'maximegonnord2002@gmail.com',
        password: await bcrypt.hash('MdpPourMaximeGonnordReseauEseo', 10),
        name: 'Gonnord',
        last_name: 'Maxime',
        telephone: '1928374655',
        role: 'educational_tutors',
      },
    ])
  }
}
