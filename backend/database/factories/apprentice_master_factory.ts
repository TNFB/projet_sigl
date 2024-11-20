import factory from '@adonisjs/lucid/factories'
import ApprenticeMaster from '#models/apprentice_master'

export const ApprenticeMasterFactory = factory
  .define(ApprenticeMaster, async ({ faker }) => {
    return {}
  })
  .build()