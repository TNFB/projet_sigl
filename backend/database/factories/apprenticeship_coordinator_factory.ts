import factory from '@adonisjs/lucid/factories'
import ApprenticeshipCoordinator from '#models/apprenticeship_coordinator'

export const ApprenticeshipCoordinatorFactory = factory
  .define(ApprenticeshipCoordinator, async ({ faker }) => {
    return {}
  })
  .build()