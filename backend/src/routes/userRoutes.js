const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rota de Registro
router.post('/register', userController.register);

// Rota de Login
router.post('/login', userController.login);

module.exports = router;