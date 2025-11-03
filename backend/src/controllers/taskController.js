const taskModel = require('../models/TaskModel');

// 1. Controller para listar todas as tarefas
const getAll = async (req, res) => {
    try {
        const tasks = await taskModel.getAll();
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar tarefas.' });
    }
};

// 2. Controller para criar uma nova tarefa
const createTask = async (req, res) => {
    try {
        // Pega o corpo da requisição
        const createdTask = await taskModel.createTask(req.body);
        // Retorna a tarefa criada, incluindo o ID (inserido pelo Model)
        return res.status(201).json(createdTask);
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        return res.status(500).json({ message: 'Erro interno do servidor ao criar tarefa.' });
    }
};

// 3. Controller para deletar uma tarefa
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await taskModel.deleteTask(id);
        // Resposta 204 (No Content) é padrão para sucesso sem corpo de resposta
        return res.status(204).end();
    } catch (error) {
        console.error(`Erro ao deletar tarefa ID ${id}:`, error);
        return res.status(500).json({ message: 'Erro interno do servidor ao deletar tarefa.' });
    }
};

// 4. Controller para atualizar uma tarefa
const updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await taskModel.updateTask(id, req.body);
        
        // Verifica se a atualização afetou alguma linha (se afetou 0, o ID não existia)
        if (result.affectedRows === 0) {
             return res.status(404).json({ message: 'Tarefa não encontrada.' });
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