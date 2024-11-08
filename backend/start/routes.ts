/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Route from '@adonisjs/core/services/router'

const ActeurController = () => import('../app/controllers/user_controller.js')
const Connexion = () => import('../app/controllers/connexion_controller.js')

// Définir les routes
Route.group(() => {
  Route.get('/', [ActeurController, 'getAllUsers'])
  Route.get('/:id', [ActeurController, 'getUserById'])
  Route.post('/', [ActeurController, 'createUser'])
}).prefix('/acteur')

Route.get('connexion', [Connexion, 'connexionUser'])
