// O Express reconhece que este é um middleware de erro por ter 4 parâmetros.
const errorMiddleware = (err, req, res, next) => {
    // 1. Loga o erro no console do servidor para fins de debug
    console.error('Erro Capturado Pelo Middleware:', err);

    // 2. Define o status da resposta: 
    //    Se o erro tiver um status definido (ex: se criássemos um erro 401 customizado), usa ele.
    //    Caso contrário, usa 500 (Internal Server Error) para erros não tratados.
    const status = err.status || 500;
    
    // 3. Retorna a resposta JSON padronizada
    return res.status(status).json({
        error: {
            // Em produção, você não deve expor a mensagem exata do erro interno do sistema, 
            // mas para desenvolvimento, é útil.
            message: err.message || 'Erro interno não especificado.'
        }
    });
};

module.exports = errorMiddleware;