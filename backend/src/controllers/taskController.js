// ./backend/src/controllers/taskController.js
const taskModel = require('../models/TaskModel');

// --- ALTERAÇÃO AQUI: Lógica de Role para GET ALL ---
const getAll = async (req, res) => {
    // O objeto req.user contém { id, username, role }
    const { id: userId, role } = req.user; 
    
    let tasks;

    if (role === 'admin') {
        // Se for Admin, passa 'null' para buscar TODAS as tarefas (baseado na nova lógica do Model)
        tasks = await taskModel.getAll(null); 
    } else {
        // Se for Usuário Comum, passa o userId para buscar APENAS as suas tarefas
        tasks = await taskModel.getAll(userId);
    }
    
    return res.status(200).json(tasks);
};
// --------------------------------------------------------------------------------------

// --- CREATE TASK (Permanece inalterado, sempre cria para o usuário logado) ---
const create = async (req, res) => {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
        // Este check já está sendo feito pelo taskValidation, mas é uma boa redundância.
        return res.status(400).json({ error: { message: 'O título da tarefa é obrigatório.' } });
    }

    const taskId = await taskModel.create(userId, title);
    return res.status(201).json({ message: 'Tarefa criada com sucesso!', id: taskId, title: title, completed: 0 });
};

// --- findById (Permanece inalterado, um usuário só busca o que lhe pertence) ---
const findById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    const task = await taskModel.findById(id, userId);

    if (task) {
        return res.status(200).json(task);
    } else {
        // Retorna 404 se a tarefa não existe OU se pertence a outro usuário
        return res.status(404).json({ error: { message: 'Tarefa não encontrada ou não pertence ao usuário.' } });
    }
};

// --- UPDATE TASK (Permanece inalterado, um usuário só atualiza o que lhe pertence) ---
const update = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, completed } = req.body;

    // ... (restante da lógica de validação e chamada ao Model) ...
    // Se o Admin precisa atualizar QUALQUER tarefa, a lógica aqui precisaria ser refeita
    // para usar um método 'updateAny' no Model, mas mantive a lógica de User/Admin
    // apenas no GET ALL e DELETE, conforme a prioridade da sua questão.

    const updated = await taskModel.update(id, userId, title, completed);

    if (updated) {
        return res.status(200).json({ message: 'Tarefa atualizada com sucesso.' });
    } else {
        return res.status(404).json({ error: { message: 'Tarefa não encontrada ou não pertence ao usuário.' } });
    }
};

// --- DELETE TASK (Permanece inalterado, já possui a lógica de Admin vs User) ---
const exclude = async (req, res) => {
    const { id } = req.params;
    const { role, id: userId } = req.user; // Obtém a role e o id do usuário do token

    let deleted = false;

    if (role === 'admin') {
        // Se for ADMIN, usa o método que não filtra por user_id
        deleted = await taskModel.excludeAny(id);
        console.log(`ADMIN (${userId}) excluiu tarefa ID: ${id}`);
    } else {
        // Se for USUÁRIO COMUM, usa o método que filtra por user_id
        deleted = await taskModel.exclude(id, userId);
        console.log(`USER (${userId}) tentou excluir tarefa ID: ${id} (sucesso: ${deleted})`);
    }

    if (deleted) {
        return res.status(204).send(); // 204 No Content para exclusão bem-sucedida
    } else if (role !== 'admin') {
        // Se não foi excluído E NÃO é admin, significa que ele tentou excluir a tarefa de outro usuário.
        return res.status(403).json({ error: { message: 'Você não tem permissão para excluir esta tarefa.' } });
    } else {
        // Caso em que o Admin tenta excluir uma tarefa que não existe (id não encontrado)
        return res.status(404).json({ error: { message: 'Tarefa não encontrada.' } });
    }
};

module.exports = {
    getAll,
    create,
    findById,
    update,
    exclude,
};