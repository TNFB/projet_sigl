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
const MonthluNotesController = () => import('../app/controllers/monthly_notes_controller.js')
const ApprenticeshipCoordinatorsController = () =>
  import('../app/controllers/apprenticeship_coordinators_controller.js')

// Définir les routes

// Route Non protégée
Route.post('connection', [UserController, 'connectionUser']).as('connectionUser')

// Route Protégée
Route.group(() => {
  Route.group(() => {
    Route.post('/getUserEmailsByRole', [UserController, 'getUserEmailsByRole']).as('getUserEmailsByRole')
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
    Route.post('/getTrainingDiaryByEmailApprenticeMaster', [
      ApprenticeMastersController,
      'getTrainingDiaryByEmail',
    ]).as('getTrainingDiaryByEmailApprenticeMaster')
    Route.post('/getApprenticeInfoByEmail', [
      ApprenticeMastersController,
      'getApprenticeInfoByEmail',
    ]).as('getApprenticeInfoByEmail')
    Route.post('/getApprenticesByMasterEmail', [
      ApprenticeMastersController,
      'getApprenticesByMasterEmail',
    ]).as('getApprenticesByMasterEmail')
  }).prefix('/apprenticeMaster')
  
  Route.group(() => {
    Route.post('/addApprenticesEducationalTutor', [EducationalTutorsController, 'addApprentices']).as(
      'addApprenticesEducationalTutor'
    )
    Route.post('/assignEducationalTutorRole', [
      EducationalTutorsController,
      'assignEducationalTutorRole',
    ]).as('assignEducationalTutorRole')
    Route.post('/getTrainingDiaryByEmailEducationalTutor', [
      EducationalTutorsController,
      'getTrainingDiaryByEmail',
    ]).as('getTrainingDiaryByEmailEducationalTutor')
    Route.post('createOrUpdateEducationalTutor', [
      EducationalTutorsController,
      'createOrUpdateEducationalTutor',
    ]).as('createOrUpdateEducationalTutor')
    Route.post('/getApprenticesByTutorEmail', [
      EducationalTutorsController,
      'getApprenticesByTutorEmail',
    ]).as('getApprenticesByTutorEmail')
  }).prefix('/educationalTutor')
  
  Route.group(() => {
    Route.post('/addMissionToApprentice', [
      CompanyRepresentativesController,
      'addMissionToApprentice',
    ]).as('addMissionToApprentice')
  }).prefix('/CompanyRepresentatives')
  
  Route.post('logout', [UserController, 'logoutUser']).as('logoutUser')
  
  Route.group(() => {
    Route.post('dropDocument', [DocumentsController, 'dropDocument']).as('dropDocument')
    Route.post('importUsers', [DocumentsController, 'importUsers']).as('importUsers')
  }).prefix('/document')
  
  Route.group(() => {
    Route.post('createTraningDiary', [TraningDiaryController, 'createTraningDiary']).as(
      'createTraningDiary'
    )
  }).prefix('/TraningDiary')
  
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
    Route.post('createOrUpdateProfessionals', [
      ProfessionalsController,
      'createOrUpdateProfessionals',
    ]).as('createOrUpdateProfessional')
  }).prefix('/professional')
  
  Route.group(() => {
    Route.post('createMonthlyNote', [MonthluNotesController, 'createMonthlyNote']).as(
      'createMonthlyNote'
    )
  }).prefix('monthlyNotes')
  
  Route.group(() => {
    Route.post('linkApprentice', [ApprenticeshipCoordinatorsController, 'linkApprentice']).as(
      'linkApprentice'
    )
  }).prefix('ApprenticeshipCoordinator')
}).middleware('auth')
