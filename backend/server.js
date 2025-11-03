// ./backend/server.js (Novo e Limpo)
const express = require('express');
const cors = require('cors');
// Importa o arquivo de configuração do banco de dados (que também inicia a conexão)
require('./src/config/database'); 
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const port = 3000;

// Middleware de Configuração
app.use(express.json()); 
app.use(cors()); 

// --- Rotas da Aplicação ---
app.use('/api/tasks', taskRoutes); // Todas as rotas de Tarefas

// Rota de teste de conexão (Mantida como teste básico)
// Requer o pool de conexão para funcionar, por isso o código é um pouco mais longo
const pool = require('./src/config/database'); 
app.get('/api/data', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT "Conexão FullStack OK!" AS message, NOW() as timestamp');
        res.json({
            message: rows[0].message,
            timestamp: rows[0].timestamp
        });
    } catch (error) {
        res.status(500).json({ error: "Falha na conexão com o DB." });
    }
});


// Inicia o servidor Express
app.listen(port, () => {
    console.log(`Backend rodando em http://localhost:${port}`);
});