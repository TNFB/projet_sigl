import factory from '@adonisjs/lucid/factories'
import Document from '#models/document'

export const DocumentFactory = factory
  .define(Document, async ({ faker }) => {
    return {}
  })
  .build()