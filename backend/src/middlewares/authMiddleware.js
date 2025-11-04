// authMiddleware.js

const jwt = require('jsonwebtoken');

// A chave secreta (deve ser a mesma usada no userController)
// IDEALMENTE: Deve ser carregada de process.env!
const JWT_SECRET = 'seu_super_secreto_aqui_e_muito_mais_longo'; 

// Middleware para verificar se o JWT é válido e injetar o user_id na requisição
const authMiddleware = (req, res, next) => {
    // 1. Extrai o token do cabeçalho 'Authorization'
    // O formato esperado é: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401: Não autorizado (Token ausente ou mal formatado)
        return res.status(401).json({ error: { message: 'Acesso negado: Token JWT ausente ou inválido.' } });
    }

    // Pega o token puro (remove 'Bearer ')
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Injeta as informações do usuário (ID e username) na requisição (req.user)
        // O userController armazena { id: userId, username: username }
        req.user = decoded; 

        // 4. Continua para o próximo middleware ou controller
        next();

    } catch (err) {
        // Erro no verify (ex: token expirado, assinatura inválida)
        // 403: Proibido (O token existe, mas não é válido)
        return res.status(403).json({ error: { message: 'Token JWT inválido ou expirado.' } });
    }
};

module.exports = authMiddleware;