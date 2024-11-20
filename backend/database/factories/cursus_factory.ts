import factory from '@adonisjs/lucid/factories'
import Cursus from '#models/cursus'

export const CursusFactory = factory
  .define(Cursus, async ({ faker }) => {
    return {}
  })
  .build()