import factory from '@adonisjs/lucid/factories'
import Interview from '#models/interview'

export const InterviewFactory = factory
  .define(Interview, async ({ faker }) => {
    return {}
  })
  .build()