import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Acteur from '../../app/models/acteur.js'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await Acteur.createMany([
      {
        nom: 'nomTest',
        prenom: 'prenomTest',
        date_naissance: DateTime.now(),
        email: 'test@example.com',
        password: 'password123',
        telephone: '0000000000',
        actif: true,
      },
      {
        nom: 'nomTest2',
        prenom: 'prenomTest2',
        date_naissance: DateTime.now(),
        email: 'test@example.com',
        password: 'password123',
        telephone: '0000000000',
        actif: true,
      },
      {
        nom: 'nomTest3',
        prenom: 'prenomTest3',
        date_naissance: DateTime.now(),
        email: 'test@example.com',
        password: 'password123',
        telephone: '0000000000',
        actif: true,
      },
    ])
  }
}
