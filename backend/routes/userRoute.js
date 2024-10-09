const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing user
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   prenom:
 *                     type: string
 *                   date_naissance:
 *                     type: string
 *                     format: date
 *                   genre:
 *                     type: string
 *                   mail:
 *                     type: string
 *                   password:
 *                     type: string
 *                   telephone:
 *                     type: string
 *                   actif:
 *                     type: integer
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Retrieve one user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 date_naissance:
 *                   type: string
 *                   format: date
 *                 genre:
 *                   type: string
 *                 mail:
 *                   type: string
 *                 password:
 *                   type: string
 *                 telephone:
 *                   type: string
 *                 actif:
 *                   type: integer
 */
router.get('/:id', userController.getUsersById);

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               date_naissance:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *               telephone:
 *                 type: string
 *               actif:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 date_naissance:
 *                   type: string
 *                   format: date
 *                 genre:
 *                   type: string
 *                 mail:
 *                   type: string
 *                 password:
 *                   type: string
 *                 telephone:
 *                   type: string
 *                 actif:
 *                   type: integer
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               date_naissance:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *               telephone:
 *                 type: string
 *               actif:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 date_naissance:
 *                   type: string
 *                   format: date
 *                 genre:
 *                   type: string
 *                 mail:
 *                   type: string
 *                 password:
 *                   type: string
 *                 telephone:
 *                   type: string
 *                 actif:
 *                   type: integer
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully.
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
