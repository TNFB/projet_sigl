import factory from '@adonisjs/lucid/factories'
import Compagy from '#models/compagy'

export const CompagyFactory = factory
  .define(Compagy, async ({ faker }) => {
    return {}
  })
  .build()