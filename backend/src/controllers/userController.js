const userModel = require('../models/UserModel');
const bcrypt = require('bcryptjs'); // Usamos o bcryptjs
const jwt = require('jsonwebtoken'); // Usamos o jsonwebtoken

// Chave secreta: DEVE ser armazenada em variáveis de ambiente em um projeto real!
const JWT_SECRET = 'seu_super_secreto_aqui_e_muito_mais_longo'; 
const saltRounds = 10; // Custo do hash (quanto maior, mais lento/seguro)

// --- REGISTRO ---
const register = async (req, res) => {
    const { username, password } = req.body;

    // 1. Verificação básica (você pode melhorar isso com Joi, como fizemos nas tarefas)
    if (!username || !password) {
        return res.status(400).json({ error: { message: 'Username e senha são obrigatórios.' } });
    }

    // 2. Verifica se o usuário já existe
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
        return res.status(409).json({ error: { message: 'Nome de usuário já existe.' } });
    }

    try {
        // 3. Hash da senha
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Cria o usuário no DB
        const userId = await userModel.createUser(username, hashedPassword);

        // 5. Gera o Token JWT para login imediato após o registro
        const token = jwt.sign({ id: userId, username: username }, JWT_SECRET, {
            expiresIn: '1h' // Token expira em 1 hora
        });

        return res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            token: token,
            userId: userId
        });
    } catch (error) {
        // O Middleware de Erro Global (errorMiddleware) irá capturar isso
        throw error;
    }
};

// --- LOGIN ---
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: { message: 'Username e senha são obrigatórios.' } });
    }

    // 1. Busca o usuário
    const user = await userModel.findByUsername(username);
    
    // Se o usuário não existir, ou a senha estiver errada, retorna 401 Unauthorized
    if (!user) {
        // Para segurança, sempre use uma mensagem genérica para não dar dicas aos atacantes
        return res.status(401).json({ error: { message: 'Credenciais inválidas.' } });
    }

    // 2. Compara a senha (plaintext) com o hash (DB)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: { message: 'Credenciais inválidas.' } });
    }

    // 3. Gera o Token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h' // Token expira em 1 hora
    });

    return res.status(200).json({
        message: 'Login bem-sucedido!',
        token: token,
        userId: user.id
    });
};

module.exports = {
    register,
    login
};