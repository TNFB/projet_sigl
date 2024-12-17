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
const AdminController = () => import('../app/controllers/admin_controller.js')
const ApprenticeMastersController = () =>
  import('../app/controllers/apprentice_masters_controller.js')
const EducationalTutorsController = () =>
  import('../app/controllers/educational_tutors_controller.js')
const CompanyRepresentativesController = () =>
  import('../app/controllers/compagny_representatives_controller.js')
const DepositsController = () => import('../app/controllers/deposits_controller.js')
const CompaniesController = () => import('../app/controllers/compagies_controller.js')
const ProfessionalsController = () => import('../app/controllers/professionals_controller.js')

// Définir les routes
Route.group(() => {
  Route.post('/getUserEmails', [UserController, 'getUserEmails']).as('getUserEmails')
  Route.post('/getUser/:id', [UserController, 'getUserById']).as('getUserById')
  Route.post('/createUser', [UserController, 'createUser']).as('createUser')
  Route.post('/changePassword', [UserController, 'changePassword']).as('changePassword')
}).prefix('/user')

Route.group(() => {
  Route.post('/overritePassword', [AdminController, 'overritePassword']).as('overritePassword')
  Route.post('/deleteUser', [AdminController, 'deleteUser']).as('deleteUser')
}).prefix('/admin')

Route.group(() => {
  Route.post('/addApprenticesApprenticeMaster', [ApprenticeMastersController, 'addApprentices']).as(
    'addApprenticesApprenticeMaster'
  )
  Route.post('/createOrUpdateApprenticeMaster', [
    ApprenticeMastersController,
    'createOrUpdateApprenticeMaster',
  ]).as('createOrUpdateApprenticeMaster')
}).prefix('/apprenticeMaster')

Route.group(() => {
  Route.post('/addApprenticesEducationalTutor', [EducationalTutorsController, 'addApprentices']).as(
    'addApprenticesEducationalTutor'
  )
  Route.post('/assignEducationalTutorRole', [
    EducationalTutorsController,
    'assignEducationalTutorRole',
  ]).as('assignEducationalTutorRole')
}).prefix('/educationalTutor')

Route.group(() => {
  Route.post('/addMissionToApprentice', [
    CompanyRepresentativesController,
    'addMissionToApprentice',
  ]).as('addMissionToApprentice')
}).prefix('/CompanyRepresentatives')

Route.post('connection', [UserController, 'connectionUser']).as('connectionUser')
Route.get('logout', [UserController, 'logoutUser']).as('logoutUser')

Route.group(() => {
  Route.post('dropDocument', [DocumentsController, 'dropDocument']).as('dropDocument')
  Route.post('importUsers', [DocumentsController, 'importUsers']).as('importUsers')
}).prefix('/document')

Route.post('createTraningDiary', [TraningDiaryController, 'createTraningDiary']).as(
  'createTraningDiary'
)

Route.group(() => {
  Route.post('getAllDeposits', [DepositsController, 'getAllDeposits']).as('getAllDeposits')
  Route.post('addDeposit', [DepositsController, 'addDeposit']).as('addDeposit')
  Route.post('deleteDeposit', [DepositsController, 'deleteDeposit']).as('deleteDeposit')
}).prefix('/deposit')

Route.group(() => {
  Route.post('createCompany', [CompaniesController, 'createCompany']).as('createCompany')
  Route.get('getAllNames', [CompaniesController, 'getAllCompanyNames']).as('getAllCompanyNames')
}).prefix('/company')

Route.group(() => {
  Route.post('createOrUpdateProfessional', [
    ProfessionalsController,
    'createOrUpdateProfessional',
  ]).as('createOrUpdateProfessional')
}).prefix('/professional')

// Swagger
Route.get('/swagger', async () => {
  return AutoSwagger.default.docs(Route.toJSON(), swagger)
})

Route.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})
