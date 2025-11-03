const pool = require('../config/database');

const findByUsername = async (username) => {
    // Busca um usuário pelo nome de usuário
    const [user] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return user[0]; // Retorna o primeiro usuário encontrado (ou undefined)
};

const createUser = async (username, hashedPassword) => {
    // Cria um novo usuário no DB
    const [result] = await pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)', 
        [username, hashedPassword]
    );
    // Retorna o ID do usuário recém-criado
    return result.insertId;
};

module.exports = {
    findByUsername,
    createUser
};