/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import db from '@adonisjs/lucid/services/db'
import router from '@adonisjs/core/services/router'
const UserController = () => import('../app/controllers/user_Controller.js')

router.get('/', async () => {
  const users = await db.from('users').select('*')
  return { users }
})

router.group(() => {
  router
    .group(() => {
      router.get('/:id', [UserController, 'getUserById'])
      router.post('/', [UserController, 'createUser'])
    })
    .prefix('user')
})
