import factory from '@adonisjs/lucid/factories'
import Deposit from '#models/deposit'

export const DepositFactory = factory
  .define(Deposit, async ({ faker }) => {
    return {}
  })
  .build()