// ./backend/src/models/TaskModel.js
const pool = require('../config/database');

// --- ALTERAÇÃO AQUI: getAll agora pode buscar todas as tarefas (se userId for nulo) ---
const getAll = async (userId) => {
    let query;
    let params;

    if (userId) {
        // Usuário comum: Filtra SOMENTE pelas tarefas criadas por este usuário.
        query = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
        params = [userId];
    } else {
        // Administrador: Busca TODAS as tarefas no sistema.
        query = 'SELECT * FROM tasks ORDER BY created_at DESC';
        params = [];
    }
    
    const [tasks] = await pool.execute(query, params);
    return tasks;
};
// --------------------------------------------------------------------------------------


const create = async (userId, title) => {
    const [result] = await pool.execute(
        'INSERT INTO tasks (user_id, title) VALUES (?, ?)',
        [userId, title]
    );
    return result.insertId;
};

// ... (O restante dos métodos 'findById', 'update', 'exclude' e 'excludeAny' permanecem inalterados) ...

const findById = async (id, userId) => {
    // Mantém o filtro por userId para CRUD individual (Usuário só vê as suas)
    const [task] = await pool.execute('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    return task[0];
};

const update = async (id, userId, title, completed) => {
    let setClauses = [];
    let params = [];

    if (title !== undefined) {
        setClauses.push('title = ?');
        params.push(title);
    }

    if (completed !== undefined) {
        setClauses.push('completed = ?');
        params.push(completed ? 1 : 0); 
    }

    if (setClauses.length === 0) {
        return false;
    }

    // Adiciona o ID da tarefa e o ID do usuário como filtro
    params.push(id);
    params.push(userId);
    
    // Mantém o filtro por userId para CRUD individual (Usuário só atualiza as suas)
    const query = `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, params);

    return result.affectedRows > 0;
};

// Exclusão padrão: Exclui a tarefa SOMENTE se pertencer ao usuário logado
const exclude = async (id, userId) => {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
};

// Exclusão de Admin: Exclui qualquer tarefa (não filtra por user_id)
const excludeAny = async (id) => {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
};


module.exports = {
    getAll,
    create,
    findById,
    update,
    exclude,
    excludeAny,
};