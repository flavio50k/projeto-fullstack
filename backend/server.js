// backend/server.js

const express = require('express');
const cors = require('cors');
require('express-async-errors');
const taskRoutes = require('./src/routes/taskRoutes'); 
const userRoutes = require('./src/routes/userRoutes');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const env = require('./src/config/env'); // IMPORTAÇÃO

// Garante que a conexão com o DB seja estabelecida antes de começar a ouvir
require('./src/config/database'); 

const app = express();
const port = env.PORT; // USANDO VARIÁVEL DE AMBIENTE

// Middleware global
app.use(cors()); 
app.use(express.json()); 

// =========================================================o
// ROTEAMENTO
// =========================================================

// Rotas de Autenticação
app.use('/api/users', userRoutes);

// Configura o roteador de tarefas
app.use('/api/tasks', taskRoutes); 

// =========================================================
// TRATAMENTO DE ERROS (DEVE SER O ÚLTIMO MIDDLEWARE)
// =========================================================

// Captura qualquer erro que tenha sido lançado (throw) nas rotas ou controllers.
app.use(errorMiddleware); // NOVO

// Inicia o servidor Express
app.listen(port, () => {
    console.log(`Backend rodando em http://localhost:${port}`);
});