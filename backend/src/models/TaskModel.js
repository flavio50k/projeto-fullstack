// Importa o pool de conexões criado e exportado pelo database.js
const pool = require('../config/database');

// 1. Função para buscar todas as tarefas (MODIFICADA: WHERE user_id)
const getAll = async (user_id) => {
    // Busca apenas as tarefas que pertencem ao user_id
    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?', [user_id]);
    return tasks;
};

// 2. Função para criar uma nova tarefa (MODIFICADA: RECEBE user_id)
const createTask = async (task, user_id) => {
    const { title } = task;
    // Insere o user_id junto com o título
    const [result] = await pool.execute(
        'INSERT INTO tasks (title, user_id) VALUES (?, ?)', 
        [title, user_id]
    );
    return result;
};

// 3. Função para deletar uma tarefa (MODIFICADA: WHERE id AND user_id)
const deleteTask = async (id, user_id) => {
    // Só deleta se o ID da tarefa corresponder ao ID do usuário autenticado
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, user_id]);
    return result; 
};

// 4. Função para atualizar uma tarefa (MODIFICADA: WHERE id AND user_id)
const updateTask = async (id, task, user_id) => {
    let { title, completed } = task; 

    // 1. Busca a tarefa existente no DB (AGORA FILTRA POR user_id)
    const [existingTaskRows] = await pool.execute('SELECT title, completed FROM tasks WHERE id = ? AND user_id = ?', [id, user_id]);
    
    // Se a tarefa não existir ou não pertencer a este usuário
    if (existingTaskRows.length === 0) {
        return { affectedRows: 0 }; 
    }
    
    // ... (lógica de finalTitle e finalCompleted permanece a mesma) ...
    const existingTask = existingTaskRows[0];
    const finalTitle = title !== undefined ? title : existingTask.title;
    const finalCompleted = completed !== undefined ? completed : existingTask.completed;

    // 3. Executa o UPDATE com os valores finais
    // A query de update não precisa do user_id, pois já filtramos na busca anterior, 
    // mas o WHERE garante a segurança final
    const query = 'UPDATE tasks SET title = ?, completed = ? WHERE id = ? AND user_id = ?';
    const [result] = await pool.execute(query, [finalTitle, finalCompleted, id, user_id]);
    
    return result; 
};

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};