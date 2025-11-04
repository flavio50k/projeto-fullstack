// ./backend/src/middlewares/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    // O objeto 'req.user' é definido pelo 'authMiddleware' e contém { id, username, role }.
    const user = req.user;

    // 1. Verificar se o token foi decodificado e se a role existe
    if (!user || !user.role) {
        return res.status(401).json({ error: { message: 'Acesso negado: Token inválido ou ausente.' } });
    }

    // 2. Verificar se a role é 'admin'
    if (user.role !== 'admin') {
        // Retorna 403 Forbidden (Proibido) se não for admin
        return res.status(403).json({ error: { message: 'Acesso negado: Requer permissões de administrador.' } });
    }

    // 3. Se for admin, continua para o próximo handler (controller)
    next();
};

module.exports = adminMiddleware;