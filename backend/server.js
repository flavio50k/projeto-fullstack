// /backend/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); 
const app = express();
const port = 3000;

// --- Configuração do Banco de Dados
const dbConfig = {
    host: process.env.DB_HOST, 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

async function createTasksTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.execute(createTableQuery);
        console.log("Tabela 'tasks' verificada/criada com sucesso!");
    } catch (err) {
        console.error("ERRO: Falha ao criar/verificar a tabela 'tasks':", err.message);
    }
}

async function initializeDatabase() {
    try {
        // 1. Cria o pool de conexão
        pool = mysql.createPool(dbConfig);
        console.log("Pool de conexão MySQL criado com sucesso!");
        
        // 2. Testa a conexão
        const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
        console.log('Conexão com MySQL verificada: Resultado da query =', rows[0].solution);
        
        // 3. Cria a tabela (aqui garantimos que ela exista)
        await createTasksTable();

    } catch (err) {
        console.error("ERRO FATAL: Falha ao conectar ao MySQL. Verifique o serviço 'db' e as credenciais:", err.message);
    }
}

// --- Inicia a conexão antes de subir o servidor Express
initializeDatabase();

// --- Configurações para acesso à API
app.use(express.json()); // Habilita o Express a ler JSON do corpo da requisição (para o POST)
app.use(cors()); 

// --- Rota CREATE (POST /api/tasks) ---
app.post('/api/tasks', async (req, res) => {
    const { title } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: "O campo 'title' é obrigatório." });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO tasks (title) VALUES (?)',
            [title]
        );
        res.status(201).json({ 
            id: result.insertId, 
            title, 
            completed: false 
        });
    } catch (error) {
        console.error("Erro ao inserir tarefa:", error.message);
        res.status(500).json({ error: "Falha ao criar tarefa no banco de dados." });
    }
});

// --- Rota READ (GET /api/tasks) ---
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao listar tarefas:", error.message);
        res.status(500).json({ error: "Falha ao buscar tarefas no banco de dados." });
    }
});

// --- Rota de teste de conexão (Mantida como teste básico)
app.get('/api/data', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT "Conexão FullStack OK!" AS message, NOW() as timestamp');
        res.json({
            message: rows[0].message,
            timestamp: rows[0].timestamp
        });
    } catch (error) {
        res.status(500).json({ error: "Falha na conexão com o DB." });
    }
});

// --- Rota UPDATE (PUT /api/tasks/:id) ---
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    // O corpo da requisição deve conter o campo 'completed' (true ou false)
    const { completed } = req.body; 

    if (typeof completed === 'undefined') {
        return res.status(400).json({ error: "O campo 'completed' é obrigatório para atualização." });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE tasks SET completed = ? WHERE id = ?',
            [completed, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Tarefa não encontrada." });
        }

        // 200 OK com uma mensagem de sucesso
        res.status(200).json({ message: "Tarefa atualizada com sucesso." });
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error.message);
        res.status(500).json({ error: "Falha ao atualizar tarefa no banco de dados." });
    }
});

// --- Rota DELETE (DELETE /api/tasks/:id) ---
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            // Se nenhuma linha foi afetada, a tarefa com esse ID não existe.
            return res.status(404).json({ error: "Tarefa não encontrada." });
        }

        // 204 No Content é a resposta padrão para DELETE bem-sucedido
        res.status(204).send(); 
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error.message);
        res.status(500).json({ error: "Falha ao deletar tarefa no banco de dados." });
    }
});

// Inicia o servidor Express
app.listen(port, () => {
    console.log(`Backend rodando em http://localhost:${port}`);
});
