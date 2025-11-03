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

// Função para criar a tabela (mantida aqui para garantir que exista)
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

// Inicia a conexão antes de subir o servidor Express
async function initializeDatabase() {
    const MAX_RETRIES = 10;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // 1. Testa a conexão
            const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
            console.log('Conexão com MySQL verificada: Resultado da query =', rows[0].solution);
            
            // 2. Cria a tabela (se o DB existe, ele cria a tabela)
            await createTasksTable();
            return; // Sai do loop se for bem-sucedido
        } catch (err) {
            if (i === MAX_RETRIES - 1) {
                console.error("ERRO FATAL: Falha máxima de conexão com MySQL. Verifique o serviço 'db':", err.message);
                process.exit(1);
            }
            console.log(`Aguardando conexão com o DB (${i + 1}/${MAX_RETRIES}). Erro: ${err.message}.`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
        }
    }
}

initializeDatabase();

module.exports = pool;