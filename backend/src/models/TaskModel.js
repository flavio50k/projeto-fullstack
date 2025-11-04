// TaskModel.js (Atualizado para incluir user_id)

const pool = require('../config/database');

// Função de utilidade para formatar a data
const formatarData = (date) => {
    return date.toISOString().replace('T', ' ').substring(0, 19);
};

// --- READ (Busca todas as tarefas de um usuário específico) ---
const getAll = async (userId) => {
    // Adiciona o filtro WHERE user_id = ?
    const [tasks] = await pool.execute(
        'SELECT * FROM tasks WHERE user_id = ?', 
        [userId]
    );
    return tasks;
};

// --- CREATE (Cria uma nova tarefa associada ao usuário) ---
const createTask = async (title, userId) => {
    const dateUTC = new Date(Date.now());
    
    // Adiciona o user_id na query INSERT
    const [result] = await pool.execute(
        'INSERT INTO tasks (title, completed, created_at, user_id) VALUES (?, ?, ?, ?)', 
        [title, 0, formatarData(dateUTC), userId]
    );

    // Retorna a tarefa criada (útil para o frontend)
    return { 
        id: result.insertId, 
        title, 
        completed: 0, 
        created_at: dateUTC,
        user_id: userId
    };
};

// --- DELETE (Deleta a tarefa, verificando o ID da tarefa E o ID do usuário) ---
const deleteTask = async (taskId, userId) => {
    // Deleta a tarefa SE E SOMENTE SE o ID da tarefa E o ID do usuário coincidirem
    const [result] = await pool.execute(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?', 
        [taskId, userId]
    );
    // Retorna o número de linhas afetadas (0 se não encontrou, 1 se deletou)
    return result.affectedRows;
};

// --- UPDATE (Atualiza uma tarefa, verificando o ID da tarefa E o ID do usuário) ---
const updateTask = async (taskId, title, completed, userId) => {
    // 1. Constrói a query e os valores dinamicamente
    let queryParts = [];
    let values = [];

    // Inclui o 'title' apenas se for fornecido (não for nulo/undefined)
    if (title !== undefined && title !== null) {
        queryParts.push('title = ?');
        values.push(title);
    }
    
    // Inclui o 'completed' apenas se for fornecido
    if (completed !== undefined && completed !== null) {
        queryParts.push('completed = ?');
        // O valor booleano é mapeado para 1 ou 0 no MySQL
        values.push(completed ? 1 : 0);
    }

    if (queryParts.length === 0) {
        // Nada para atualizar
        return { affectedRows: 0 }; 
    }

    // 2. Constrói a query final
    const updateQuery = `UPDATE tasks SET ${queryParts.join(', ')} WHERE id = ? AND user_id = ?`;
    
    // 3. Adiciona os IDs no final dos valores
    values.push(taskId, userId);

    // 4. Executa
    const [result] = await pool.execute(updateQuery, values);
    
    // Retorna o número de linhas afetadas (0 se não encontrou ou 1 se atualizou)
    return result;
};


module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};