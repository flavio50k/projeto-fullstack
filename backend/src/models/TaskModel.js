// Importa o pool de conexões criado e exportado pelo database.js
const pool = require('../config/database');

// 1. Função para buscar todas as tarefas
const getAll = async () => {
    // A query SQL é executada aqui
    const [tasks] = await pool.execute('SELECT * FROM tasks');
    return tasks;
};

// 2. Função para criar uma nova tarefa
const createTask = async (task) => {
    const { title } = task;
    const query = 'INSERT INTO tasks (title, completed) VALUES (?, FALSE)';
    // Retorna o resultado, que contém o ID da tarefa inserida
    const [result] = await pool.execute(query, [title]);

    return { insertId: result.insertId, title, completed: false };
};

// 3. Função para deletar uma tarefa
const deleteTask = async (id) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result;
};

// 4. Função para atualizar uma tarefa (PUT)
const updateTask = async (id, task) => {
    let { title, completed } = task; // 'title' ou 'completed' pode ser undefined

    // 1. Busca a tarefa existente no DB
    const [existingTaskRows] = await pool.execute('SELECT title, completed FROM tasks WHERE id = ?', [id]);

    // Se a tarefa não existir (ID inválido)
    if (existingTaskRows.length === 0) {
        return { affectedRows: 0 };
    }

    const existingTask = existingTaskRows[0];

    // 2. Garante que title e completed NUNCA sejam 'undefined' no SQL
    // Se 'title' NÃO foi enviado (é undefined), usa o título existente.
    // Se 'title' FOI enviado (pode ser string), usa o novo valor.
    const finalTitle = title !== undefined ? title : existingTask.title;

    // Se 'completed' NÃO foi enviado (é undefined), usa o status existente.
    // Se 'completed' FOI enviado (pode ser boolean), usa o novo valor.
    // Nota: O MySQL armazena booleanos como 1 (true) ou 0 (false), o JS true/false funciona.
    const finalCompleted = completed !== undefined ? completed : existingTask.completed;

    // 3. Executa o UPDATE com os valores finais (nunca undefined)
    const query = 'UPDATE tasks SET title = ?, completed = ? WHERE id = ?';
    const [result] = await pool.execute(query, [finalTitle, finalCompleted, id]);

    return result;
};

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};