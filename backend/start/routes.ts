/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Route from '@adonisjs/core/services/router'

//Auto-Swagger
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

const UserController = () => import('../app/controllers/users_controller.js')

// Définir les routes
Route.group(() => {
  Route.get('/', [UserController, 'getAllUsers']).as('GetAllUser')
  Route.post('/getUser/:id', [UserController, 'getUserById']).as('getUserById')
  Route.post('/createUser', [UserController, 'createUser']).as('createUser')
}).prefix('/user')

Route.post('connection', [UserController, 'connectionUser']).as('connectionUser')

// Swagger

Route.get('/swagger', async () => {
  return AutoSwagger.default.docs(Route.toJSON(), swagger)
})

Route.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})
