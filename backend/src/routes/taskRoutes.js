// taskRoutes.js (CORRIGIDO)

const express = require('express');
const taskController = require('../controllers/taskController');
const { validateBody } = require('../middlewares/taskValidation');
const authMiddleware = require('../middlewares/authMiddleware'); 

// 1. Cria a instância do roteador
const router = express.Router();

// 2. Aplica o middleware de autenticação a todas as rotas de tarefa
router.use(authMiddleware);

// 3. Define as rotas usando o router (agora protegidas)
// READ - GET /tasks
router.get('/', taskController.getAll); 

// CREATE - POST /tasks (CORRIGIDO: Usando 'create' em vez de 'createTask')
router.post('/', validateBody, taskController.create); 

// DELETE - DELETE /tasks/:id (CORRIGIDO: Usando 'exclude' em vez de 'deleteTask')
router.delete('/:id', taskController.exclude);

// UPDATE - PUT /tasks/:id (CORRIGIDO: Usando 'update' em vez de 'updateTask')
router.put('/:id', validateBody, taskController.update);

// 4. Exporta o roteador para ser usado no server.js
module.exports = router;