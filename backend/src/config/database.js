// ./backend/src/config/database.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// ... (dbConfig permanece igual) ...
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
const pool = mysql.createPool(dbConfig);
const saltRounds = 10; 

// --- FUNÇÕES DE CRIAÇÃO/VERIFICAÇÃO DE TABELAS ---

async function ensureTablesExist() {
    try {
        // 1. Tabela de Usuários (com a coluna 'role')
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.execute(createUsersTableQuery);
        console.log("Tabela 'users' verificada/criada.");

        // 1.1. MIGRATION: Adiciona a coluna 'role' se a tabela já existia sem ela
        try {
            // Este comando tentará adicionar a coluna 'role'. Se ela já existir, o MySQL
            // pode gerar um erro, mas ele será capturado e ignorado no bloco catch.
            await pool.execute(
                "ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password"
            );
            console.log("Coluna 'role' adicionada/verificada na tabela 'users'.");
        } catch (alterError) {
            // Error code 1060: Duplicate column name 'role'
            if (alterError.code !== 'ER_DUP_FIELDNAME') {
                // Ignora o erro se a coluna já existia. Se for outro erro, exibe.
                console.warn("Aviso na MIGRATION users/role (IGNORADO se for 'ER_DUP_FIELDNAME'):", alterError.message);
            }
        }
        
        // 2. Tabela de Tarefas
        const createTasksTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.execute(createTasksTableQuery);
        console.log("Tabela 'tasks' verificada/criada.");

        // 3. Garante que haja um usuário ADMIN padrão (útil para o primeiro uso)
        await ensureDefaultAdminUser();

    } catch (error) {
        console.error("ERRO CRÍTICO ao verificar ou criar tabelas:", error);
    }
}


// --- NOVO: FUNÇÃO PARA CRIAR ADMIN PADRÃO (se não existir) ---

async function ensureDefaultAdminUser() {
    const adminUsername = 'admin';
    const adminPassword = 'adminpassword'; // Mude esta senha!

    try {
        // Verifica se o usuário admin já existe
        const [users] = await pool.execute("SELECT id FROM users WHERE username = ? AND role = 'admin'", [adminUsername]);
        
        if (users.length === 0) {
            // Se não existe, cria
            const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

            await pool.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [adminUsername, hashedPassword, 'admin']
            );
            console.log(`Usuário Admin padrão (${adminUsername}) criado com sucesso! Senha: ${adminPassword}`);
        } else {
            //console.log(`Usuário Admin padrão (${adminUsername}) já existe.`);
        }
    } catch (error) {
        // Ignora erros (ex: tabela users ainda está sendo criada, ou erro de hash)
        console.error("Aviso: Falha ao tentar criar usuário Admin padrão:", error.message);
    }
}


// --- FUNÇÃO DE INICIALIZAÇÃO (Retry) ---

async function initializeDatabase() {
    const MAX_RETRIES = 10;
    const RETRY_DELAY_MS = 3000; // 3 segundos
    console.log('Iniciando conexão com o MySQL...');

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // 1. Testa a conexão
            const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
            console.log('Conexão com MySQL verificada. Tentativa:', i + 1);
            
            // 2. Cria/Verifica tabelas e roles
            await ensureTablesExist();
            return; // Sucesso: Sai do loop
        } catch (err) {
            console.error(`Falha na conexão ou inicialização (Tentativa ${i + 1}/${MAX_RETRIES}):`, err.message);
            if (i === MAX_RETRIES - 1) {
                console.error("Falha na inicialização do DB após várias tentativas. Encerrando.");
                // Em um ambiente de produção, aqui você encerraria o processo.
                // process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
}

initializeDatabase();
module.exports = pool;