/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Route from '@adonisjs/core/services/router'

const UserController = () => import('../app/controllers/users_controller.js')
const Connexion = () => import('../app/controllers/connexions_controller.js')

// Définir les routes
Route.group(() => {
  Route.get('/', [UserController, 'getAllUsers'])
  Route.get('/:id', [UserController, 'getUserById'])
  Route.post('/', [UserController, 'createUser'])
}).prefix('/user')

Route.get('connexion', [Connexion, 'connexionUser'])
