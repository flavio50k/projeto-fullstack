const express = require('express');
const taskController = require('../controllers/taskController');
const { validateBody } = require('../middlewares/taskValidation');

// 1. Cria a instância do roteador
const router = express.Router();

// 2. Define as rotas usando o router
// READ - GET /tasks
router.get('/', taskController.getAll); 

// CREATE - POST /tasks
// Aplica o middleware de validação antes de chamar o controller
router.post('/', validateBody, taskController.createTask);

// DELETE - DELETE /tasks/:id
router.delete('/:id', taskController.deleteTask);

// UPDATE - PUT /tasks/:id
// Aplica o middleware de validação antes de atualizar
router.put('/:id', validateBody, taskController.updateTask);

// 3. Exporta o roteador para ser usado no server.js
module.exports = router;