import factory from '@adonisjs/lucid/factories'
import Professor from '#models/professor'

export const ProfessorFactory = factory
  .define(Professor, async ({ faker }) => {
    return {}
  })
  .build()