import factory from '@adonisjs/lucid/factories'
import OralPresentation from '#models/oral_presentation'

export const OralPresentationFactory = factory
  .define(OralPresentation, async ({ faker }) => {
    return {}
  })
  .build()