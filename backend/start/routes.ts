/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Route from '@adonisjs/core/services/router'

const ActeurController = () => import('../app/controllers/acteur_controller.js')
const Connexion = () => import('../app/controllers/connexion.js')

// Définir les routes
Route.group(() => {
  Route.get('/', [ActeurController, 'getAllActeurs'])
  Route.get('/:id', [ActeurController, 'getActeurById'])
  Route.post('/', [ActeurController, 'createActeur'])
}).prefix('/acteur')

Route.get('connexion', [Connexion, 'connexionActeur'])
