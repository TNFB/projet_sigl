import factory from '@adonisjs/lucid/factories'
import Admin from '#models/admin'

export const AdminFactory = factory
  .define(Admin, async ({ faker }) => {
    return {}
  })
  .build()