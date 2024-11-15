import factory from '@adonisjs/lucid/factories'
import Professional from '#models/professional'

export const ProfessionalFactory = factory
  .define(Professional, async ({ faker }) => {
    return {}
  })
  .build()