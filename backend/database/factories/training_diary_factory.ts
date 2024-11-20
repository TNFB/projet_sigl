import factory from '@adonisjs/lucid/factories'
import TrainingDiary from '#models/training_diary'

export const TrainingDiaryFactory = factory
  .define(TrainingDiary, async ({ faker }) => {
    return {}
  })
  .build()