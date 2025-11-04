// ./backend/src/controllers/userController.js (Revisado para garantir a lógica de registro)

const userModel = require('../models/UserModel');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = 'seu_super_secreto_aqui_e_muito_mais_longo'; 
const saltRounds = 10; 

// --- REGISTRO --- 
const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: { message: 'Username e senha são obrigatórios.' } });
    }

    try {
        // 1. Verifica se já existe
        const existingUser = await userModel.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: { message: 'Nome de usuário já existe.' } });
        }
        
        // 2. Cria o usuário
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // userModel.createUser insere com role 'user' por padrão
        const userId = await userModel.createUser(username, hashedPassword); 
        
        // 3. Gera o Token JWT com a role
        const token = jwt.sign({ id: userId, username: username, role: 'user' }, JWT_SECRET, { 
            expiresIn: '1h' 
        });

        // 4. Responde com a role 'user'
        return res.status(201).json({ 
            message: 'Usuário registrado com sucesso!', 
            token: token, 
            userId: userId, 
            role: 'user' 
        });
    } catch (error) {
        // Loga o erro no console para diagnóstico
        console.error("Erro no registro de usuário:", error);
        return res.status(500).json({ error: { message: 'Erro interno do servidor ao registrar.' } });
    }
};

// --- LOGIN ---
const login = async (req, res) => {
    // ... (A função login permanece a mesma) ...
    // Seu código anterior:
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: { message: 'Username e senha são obrigatórios.' } });
    }

    const user = await userModel.findByUsername(username);
    if (!user) {
        return res.status(401).json({ error: { message: 'Credenciais inválidas.' } });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: { message: 'Credenciais inválidas.' } });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { 
        expiresIn: '1h' 
    });

    return res.status(200).json({ message: 'Login bem-sucedido!', token: token, userId: user.id, role: user.role });
};

module.exports = {
    register,
    login
};