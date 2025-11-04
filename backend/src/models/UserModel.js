// UserModel.js (Atualizado para incluir a coluna 'role')

const pool = require('../config/database');

const findByUsername = async (username) => {
    // Agora seleciona a coluna 'role'
    const [user] = await pool.execute('SELECT id, username, password, role FROM users WHERE username = ?', [username]);
    return user[0]; // Retorna o primeiro usuário encontrado (ou undefined)
};

const createUser = async (username, hashedPassword) => {
    // Cria um novo usuário com a role padrão 'user'
    const [result] = await pool.execute(
        // Adiciona 'role' no INSERT
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        // O valor padrão para novos cadastros é 'user'
        [username, hashedPassword, 'user'] 
    );
    // Retorna o ID do usuário recém-criado
    return result.insertId;
};

// NOVO: Função para criar um usuário Admin
// Esta função pode ser usada manualmente para cadastrar o primeiro admin,
// ou por um endpoint de setup que seria removido em produção.
const createAdminUser = async (username, hashedPassword) => {
    const [result] = await pool.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, 'admin'] // Role definida como 'admin'
    );
    return result.insertId;
};

module.exports = {
    findByUsername,
    createUser,
    createAdminUser // Exporta a função para uso (se necessário para setup manual)
};