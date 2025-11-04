// taskController.js (Atualizado para incluir Autorização)

const taskModel = require('../models/TaskModel');

// 1. Controller para listar todas as tarefas de um usuário
const getAll = async (req, res) => {
    // Pega o ID do usuário injetado pelo authMiddleware
    const userId = req.user.id; 
    
    try {
        // Passa o userId para o Model
        const tasks = await taskModel.getAll(userId);
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar tarefas.' });
    }
};

// 2. Controller para criar uma nova tarefa (associada ao usuário)
const createTask = async (req, res) => {
    const { title } = req.body;
    // Pega o ID do usuário injetado pelo authMiddleware
    const userId = req.user.id; 
    
    try {
        // Passa o title e o userId para o Model
        const createdTask = await taskModel.createTask(title, userId);
        
        // Retorna a tarefa criada, incluindo o ID e o user_id
        return res.status(201).json(createdTask);
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        // O erro de validação (400) já é capturado pelo middleware validateBody (se houver)
        return res.status(500).json({ message: 'Erro interno do servidor ao criar tarefa.' });
    }
};

// 3. Controller para deletar uma tarefa (se pertencer ao usuário)
const deleteTask = async (req, res) => {
    const { id } = req.params;
    // Pega o ID do usuário injetado pelo authMiddleware
    const userId = req.user.id; 

    try {
        // O Model agora retorna o número de linhas afetadas
        const affectedRows = await taskModel.deleteTask(id, userId);
        
        // Se 0 linhas afetadas, significa que a tarefa não existe OU não pertence ao usuário
        if (affectedRows === 0) {
             // Retorna 404 para não indicar se a tarefa existe, mas não pertence ao usuário
            return res.status(404).json({ message: 'Tarefa não encontrada ou acesso não autorizado.' });
        }

        // Resposta 204 (No Content)
        return res.status(204).end();
    } catch (error) {
        console.error(`Erro ao deletar tarefa ID ${id}:`, error);
        return res.status(500).json({ message: 'Erro interno do servidor ao deletar tarefa.' });
    }
};

// 4. Controller para atualizar uma tarefa (se pertencer ao usuário)
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    // Pega o ID do usuário injetado pelo authMiddleware
    const userId = req.user.id; 

    try {
        // Passa o id, title, completed e userId para o Model
        const result = await taskModel.updateTask(id, title, completed, userId);
        
        // Verifica se a atualização afetou alguma linha (se afetou 0, o ID não existia ou não pertencia ao usuário)
        if (result.affectedRows === 0) {
            // Retorna 404 para não dar dicas sobre a existência vs. permissão
            return res.status(404).json({ message: 'Tarefa não encontrada ou acesso não autorizado.' });
        }
        
        // Se afetou 1 linha (sucesso), retorna 204
        return res.status(204).end();
    } catch (error) {
        console.error(`Erro ao atualizar tarefa ID ${id}:`, error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar tarefa.' });
    }
};

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};