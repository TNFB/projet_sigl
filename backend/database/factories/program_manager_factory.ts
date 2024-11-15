import factory from '@adonisjs/lucid/factories'
import ProgramManager from '#models/program_manager'

export const ProgramManagerFactory = factory
  .define(ProgramManager, async ({ faker }) => {
    return {}
  })
  .build()