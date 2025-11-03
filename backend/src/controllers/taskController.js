// ./backend/src/controllers/taskController.js
const Task = require('../models/Task');

const taskController = {
    // READ
    listTasks: async (req, res) => {
        try {
            const tasks = await Task.findAll();
            res.json(tasks);
        } catch (error) {
            console.error("Erro ao listar tarefas:", error.message);
            res.status(500).json({ error: "Falha ao buscar tarefas no banco de dados." });
        }
    },

    // CREATE
    createTask: async (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "O campo 'title' é obrigatório." });
        }
        try {
            const newTask = await Task.create(title);
            res.status(201).json(newTask);
        } catch (error) {
            console.error("Erro ao inserir tarefa:", error.message);
            res.status(500).json({ error: "Falha ao criar tarefa no banco de dados." });
        }
    },

    // UPDATE
    updateTask: async (req, res) => {
        const { id } = req.params;
        const { completed } = req.body; 

        if (typeof completed === 'undefined') {
            return res.status(400).json({ error: "O campo 'completed' é obrigatório para atualização." });
        }

        try {
            const affectedRows = await Task.update(id, completed);

            if (affectedRows === 0) {
                return res.status(404).json({ error: "Tarefa não encontrada." });
            }
            res.status(200).json({ message: "Tarefa atualizada com sucesso." });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error.message);
            res.status(500).json({ error: "Falha ao atualizar tarefa no banco de dados." });
        }
    },

    // DELETE
    deleteTask: async (req, res) => {
        const { id } = req.params;

        try {
            const affectedRows = await Task.delete(id);

            if (affectedRows === 0) {
                return res.status(404).json({ error: "Tarefa não encontrada." });
            }
            res.status(204).send();
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error.message);
            res.status(500).json({ error: "Falha ao deletar tarefa no banco de dados." });
        }
    }
};

module.exports = taskController;