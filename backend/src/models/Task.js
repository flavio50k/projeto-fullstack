// ./backend/src/models/Task.js
const pool = require('../config/database');

const Task = {
    // READ (GET)
    findAll: async () => {
        const [rows] = await pool.execute('SELECT * FROM tasks ORDER BY created_at DESC');
        return rows;
    },

    // CREATE (POST)
    create: async (title) => {
        const [result] = await pool.execute(
            'INSERT INTO tasks (title) VALUES (?)',
            [title]
        );
        return { id: result.insertId, title, completed: false };
    },

    // UPDATE (PUT)
    update: async (id, completed) => {
        const [result] = await pool.execute(
            'UPDATE tasks SET completed = ? WHERE id = ?',
            [completed, id]
        );
        return result.affectedRows; // Retorna 1 se atualizado, 0 se não encontrado
    },

    // DELETE (DELETE)
    delete: async (id) => {
        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );
        return result.affectedRows; // Retorna 1 se deletado, 0 se não encontrado
    }
};

module.exports = Task;