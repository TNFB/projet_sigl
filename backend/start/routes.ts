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
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";


const UserController = () => import('../app/controllers/users_controller.js')
const Connexion = () => import('../app/controllers/connexions_controller.js')

// Définir les routes
Route.group(() => {
  Route.get('/', [UserController, 'getAllUsers'])
  Route.post('/getUser/:id', [UserController, 'getUserById'])
  Route.post('/createUser', [UserController, 'createUser'])
}).prefix('/user')

Route.post('connexion', [Connexion, 'connexionUser'])



// Swagger

Route.get("/swagger", async () => {
  return AutoSwagger.default.docs(Route.toJSON(), swagger);
});

Route.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
});