// ./backend/src/controllers/taskController.js
const taskModel = require('../models/TaskModel');

// --- GET ALL TASKS ---
const getAll = async (req, res) => {
    // O ID do usuário logado é extraído do token pelo authMiddleware
    const userId = req.user.id; 
    
    const tasks = await taskModel.getAll(userId);
    return res.status(200).json(tasks);
};

// --- CREATE TASK ---
const create = async (req, res) => {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: { message: 'O título da tarefa é obrigatório.' } });
    }

    const taskId = await taskModel.create(userId, title);
    return res.status(201).json({ message: 'Tarefa criada com sucesso!', id: taskId, title: title, completed: 0 });
};

// --- UPDATE TASK ---
const update = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, completed } = req.body;

    // Validação
    if (!title && completed === undefined) {
        return res.status(400).json({ error: { message: 'Pelo menos o título ou o status "completed" deve ser fornecido.' } });
    }

    const updated = await taskModel.update(id, userId, title, completed);

    if (updated) {
        return res.status(200).json({ message: 'Tarefa atualizada com sucesso.' });
    } else {
        // Task não encontrada ou usuário não tem permissão para a task (404 é uma boa prática aqui)
        return res.status(404).json({ error: { message: 'Tarefa não encontrada ou não pertence ao usuário.' } });
    }
};

// --- DELETE TASK (Lógica de Permissão Administrador/Usuário Comum) ---
const exclude = async (req, res) => {
    const { id } = req.params;
    const { role, id: userId } = req.user; // Obtém a role e o id do usuário do token

    let deleted = false;

    if (role === 'admin') {
        // Se for ADMIN, exclui a tarefa, independentemente de quem a criou
        deleted = await taskModel.excludeAny(id);
        console.log(`ADMIN (${userId}) excluiu tarefa ID: ${id}`);
    } else {
        // Se for USUÁRIO COMUM, exclui SOMENTE se for sua própria tarefa
        deleted = await taskModel.exclude(id, userId);
        console.log(`USER (${userId}) tentou excluir tarefa ID: ${id} (sucesso: ${deleted})`);
    }

    if (deleted) {
        return res.status(204).send(); // 204 No Content para exclusão bem-sucedida
    } else if (role !== 'admin') {
        // Se não foi excluído E NÃO é admin, significa que ele tentou excluir a tarefa de outro usuário.
        // Retornamos 403 (Proibido) se a exclusão falhou por falta de permissão na tarefa.
        return res.status(403).json({ error: { message: 'Você não tem permissão para excluir esta tarefa.' } });
    }
    
    // Se o Admin não conseguiu excluir, é porque a task não existia.
    return res.status(404).json({ error: { message: 'Tarefa não encontrada.' } });
};

module.exports = {
    getAll,
    create,
    update,
    exclude,
};