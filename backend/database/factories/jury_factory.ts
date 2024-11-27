import factory from '@adonisjs/lucid/factories'
import Jury from '#models/jury'

export const JuryFactory = factory
  .define(Jury, async ({ faker }) => {
    return {}
  })
  .build()