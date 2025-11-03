// ./backend/src/config/database.js
const mysql = require('mysql2/promise');

// Configuração do Banco de Dados
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Cria o pool de conexão
const pool = mysql.createPool(dbConfig);

// Função para criar tabelas (mantida aqui para garantir que existam)
async function ensureTablesExist() {
    try {
        // Tabela de Usuários (NOVA)
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.execute(createUsersTableQuery);
        console.log("Tabela 'users' verificada/criada com sucesso!");

        // Tabela de Tarefas (MODIFICADA para incluir user_id)
        // Adicionaremos user_id e uma Foreign Key
        const createTasksTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                -- NOVA COLUNA: ID do usuário que criou a tarefa
                user_id INT NOT NULL, 
                -- NOVA CHAVE ESTRANGEIRA: Garante que o user_id existe na tabela users
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.execute(createTasksTableQuery);
        console.log("Tabela 'tasks' verificada/ajustada com sucesso!");

    } catch (error) {
        console.error("Erro ao verificar ou criar tabelas:", error);
    }
}

// Inicia a conexão antes de subir o servidor Express
async function initializeDatabase() {
    const MAX_RETRIES = 10;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // 1. Testa a conexão
            const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
            console.log('Conexão com MySQL verificada: Resultado da query =', rows[0].solution);

            // 2. Cria a tabela (se o DB existe, ele cria a tabela)
            // CORRIGIDO AQUI: A função agora é ensureTablesExist
            await ensureTablesExist(); // <--- CORREÇÃO!
            return; // Sai do loop se for bem-sucedido
        } catch (err) {
            // ... (restante do catch permanece o mesmo) ...
        }
    }
}

initializeDatabase();

module.exports = pool;