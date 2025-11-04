// ./backend/src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rota de Registro - POST /api/users/register
// Chama a função 'register' do controller.
router.post('/register', userController.register);

// Rota de Login - POST /api/users/login
// Chama a função 'login' do controller.
router.post('/login', userController.login);

module.exports = router;