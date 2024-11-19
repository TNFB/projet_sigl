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
const DocumentsController = () => import('../app/controllers/documents_controller.js')
const TraningDiaryController = () => import('../app/controllers/training_diaries_controller.js')

// Définir les routes
Route.group(() => {
  Route.get('/', [UserController, 'getAllUsers']).as('GetAllUser')
  Route.post('/getUser/:id', [UserController, 'getUserById']).as('getUserById')
  Route.post('/createUser', [UserController, 'createUser']).as('createUser')
  Route.post('/changePassword', [UserController, 'changePassword']).as('changePassword')
}).prefix('/user')

Route.post('connection', [UserController, 'connectionUser']).as('connectionUser')
Route.get('logout', [UserController, 'logoutUser']).as('logoutUser')

Route.post('dropDocument', [DocumentsController, 'dropDocument']).as('dropDocument')

Route.post('createTraningDiary', [TraningDiaryController, 'createTraningDiary']).as(
  'createTraningDiary'
)

// Swagger

Route.get('/swagger', async () => {
  return AutoSwagger.default.docs(Route.toJSON(), swagger)
})

Route.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})
