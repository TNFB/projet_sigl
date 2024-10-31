/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Route from '@adonisjs/core/services/router'


// Importer votre UserController
const UserController = () => import('../app/controllers/UserController.js')

// Définir les routes
Route.group(() => {
  Route.get('/', [UserController, 'getAllUser'])
  Route.get('/:id', [UserController, 'getUserById'])
  Route.post('/', [UserController, 'createUser'])
})
.prefix('/users')
