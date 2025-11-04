// ./backend/src/models/TaskModel.js (Atualizado para incluir exclusão de Admin)

const pool = require('../config/database');

const getAll = async (userId) => {
    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    return tasks;
};

const create = async (userId, title) => {
    const [result] = await pool.execute(
        'INSERT INTO tasks (user_id, title) VALUES (?, ?)',
        [userId, title]
    );
    return result.insertId;
};

const update = async (id, userId, title, completed) => {
    let setClauses = [];
    let params = [];

    if (title !== undefined) {
        setClauses.push('title = ?');
        params.push(title);
    }

    if (completed !== undefined) {
        // Garante que completed é um booleano ou 0/1
        setClauses.push('completed = ?');
        params.push(completed ? 1 : 0); 
    }

    if (setClauses.length === 0) {
        return false; // Nada para atualizar
    }

    // Adiciona o ID da tarefa e o ID do usuário como filtro
    params.push(id);
    params.push(userId);
    
    const query = `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, params);

    return result.affectedRows > 0;
};

// Exclusão padrão: Exclui a tarefa SOMENTE se pertencer ao usuário logado
const exclude = async (id, userId) => {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
};

// NOVO: Exclusão para Administradores: Exclui qualquer tarefa por ID
const excludeAny = async (id) => {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAll,
    create,
    update,
    exclude,
    excludeAny // Exporta a nova função para uso pelo Task Controller
};