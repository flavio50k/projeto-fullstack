// ./backend/src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Rotas para /api/tasks
router.get('/', taskController.listTasks); // GET /api/tasks
router.post('/', taskController.createTask); // POST /api/tasks

// Rotas para /api/tasks/:id
router.put('/:id', taskController.updateTask); // PUT /api/tasks/:id
router.delete('/:id', taskController.deleteTask); // DELETE /api/tasks/:id

module.exports = router;