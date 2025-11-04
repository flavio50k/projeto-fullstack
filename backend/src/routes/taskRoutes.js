// taskRoutes.js

const express = require('express');
const taskController = require('../controllers/taskController');
const { validateBody } = require('../middlewares/taskValidation');
const authMiddleware = require('../middlewares/authMiddleware'); // NOVO

// 1. Cria a instância do roteador
const router = express.Router();

// 2. Aplica o middleware de autenticação a todas as rotas de tarefa
// O authMiddleware será executado antes do validateBody ou do taskController.
router.use(authMiddleware); // NOVO

// 3. Define as rotas usando o router (agora protegidas)
// READ - GET /tasks (Protegida)
router.get('/', taskController.getAll); 

// CREATE - POST /tasks (Protegida)
// Aplica o middleware de validação antes de chamar o controller
router.post('/', validateBody, taskController.createTask);

// DELETE - DELETE /tasks/:id (Protegida)
router.delete('/:id', taskController.deleteTask);

// UPDATE - PUT /tasks/:id (Protegida)
// Aplica o middleware de validação antes de atualizar
router.put('/:id', validateBody, taskController.updateTask);

// 4. Exporta o roteador para ser usado no server.js
module.exports = router;