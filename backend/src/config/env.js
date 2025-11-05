// backend/src/config/env.js

/**
 * Arquivo central de configuração do ambiente.
 * As variáveis sensíveis são lidas de process.env.
 */
module.exports = {
    // Variáveis do Banco de Dados
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT || 3000,
    
    // VARIÁVEIS DE SEGURANÇA (JWT)
    // O fallback deve ser USADO APENAS EM DESENVOLVIMENTO se o .env não for carregado
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_para_dev_nao_usar_em_prod', 
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d' 
};