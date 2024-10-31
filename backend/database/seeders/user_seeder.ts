import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'Alice Dupont',
        email: 'alice@example.com',
        password: await hash.make('password123'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
      {
        fullName: 'Bob Martin',
        email: 'bob@example.com',
        password: await hash.make('password123'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
      {
        fullName: 'Charlie Durant',
        email: 'charlie@example.com',
        password: await hash.make('password123'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
      {
        fullName: 'David Léger',
        email: 'david@example.com',
        password: await hash.make('password123'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
      {
        fullName: 'Emma Martin',
        email: 'emma@example.com',
        password: await hash.make('password123'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
    ])
  }
}