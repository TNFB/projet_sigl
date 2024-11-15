import factory from '@adonisjs/lucid/factories'
import Apprentice from '#models/apprentice'

export const ApprenticeFactory = factory
  .define(Apprentice, async ({ faker }) => {
    return {}
  })
  .build()