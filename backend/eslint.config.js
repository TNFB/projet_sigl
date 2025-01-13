import { configApp } from '@adonisjs/eslint-config'

export default {
  ...configApp(),
  rules: {
    ...configApp().rules,
    'camelcase': 'off',
  },
}