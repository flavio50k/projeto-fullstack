# 🚀 Projeto Fullstack com Docker Compose — Node.js + Vue.js + MySQL + phpMyAdmin

Um **projeto Fullstack completo e orquestrado com Docker Compose**, unindo **Node.js (Express)** no backend, **Vue.js 3 (com Nginx)** no frontend e **MySQL 8.0** como banco de dados, acompanhado do **phpMyAdmin** para administração.  
Totalmente containerizado, modular e pronto para desenvolvimento ou implantação em produção.  

---

## 🧱 Arquitetura de Contêineres

| Serviço | Tecnologia | Descrição |
|----------|-------------|------------|
| **backend** | Node.js + Express | API REST responsável pela autenticação, regras de negócio e persistência de dados. |
| **vue-app** | Vue.js 3 + Nginx | Interface do usuário moderna e responsiva. |
| **db** | MySQL 8.0 | Banco de dados relacional. |
| **phpmyadmin** | phpMyAdmin | Ferramenta web para gerenciamento e consultas SQL. |

Todos os serviços são orquestrados pelo **Docker Compose**, garantindo isolamento, escalabilidade e portabilidade entre ambientes.

---

## ⚙️ Tecnologias Utilizadas

### 🖥️ Backend
- **Node.js + Express**
- **JWT (JSON Web Token)** para autenticação segura
- **RBAC (Role-Based Access Control)** para controle de permissões
- **Joi** para validação de dados
- **MySQL 8.0** com integração via ORM
- **Nodemon** para desenvolvimento com recarga automática

### 🌐 Frontend
- **Vue.js 3** com composição moderna e componentes reutilizáveis
- **Nginx** como servidor estático e proxy reverso
- Integração total com a API REST do backend

### 🗄️ Banco de Dados
- **MySQL 8.0** — persistência de dados confiável
- **phpMyAdmin** — interface de administração SQL

---

## 🔒 Segurança e Regras de Negócio

O backend implementa um **sistema robusto de autenticação e autorização**, baseado em **JWT** e **RBAC**, garantindo acesso seguro e segmentado às funcionalidades da aplicação.

### Perfis de Usuário

| Perfil | Permissões |
|---------|-------------|
| 🧍 **Usuário Comum (`user`)** | Pode **visualizar, criar e editar/concluir** apenas **suas próprias tarefas**. |
| 👑 **Administrador (`admin`)** | Pode **visualizar todas as tarefas** e **excluir tarefas de qualquer usuário**. |

- Tokens JWT com expiração configurável  
- Middleware de autenticação e autorização em todas as rotas protegidas  
- Hash seguro de senhas (bcrypt)  
- Boas práticas de CORS, tratamento de erros e variáveis de ambiente  

---

## 🧩 Estrutura de Pastas

```bash
PROJETO_FULLSTACK (WSL)
├── .vscode/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── middlewares/
│   │   │   ├── adminMiddleware.js
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── taskValidation.js
│   │   ├── models/
│   │   │   ├── TaskModel.js
│   │   │   └── UserModel.js
│   │   └── routes/
│   │       ├── taskRoutes.js
│   │       └── userRoutes.js
│   ├── Dockerfile
│   ├── nodemon.json
│   ├── package-lock.json
│   ├── package.json
│   └── servers.js
├── vue-app/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── TaskItem.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── Dockerfile
│   ├── package.json
├── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── docker-compose.yml
└── README.md


## 🐳 Como Executar o Projeto

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/flavio50k/projeto-fullstack.git
cd projeto-fullstack

### 🐳 Como Executar o Projeto

#### 2️⃣ Crie o arquivo `.env` na raiz (baseado em `.env.example`)
```bash
# Variáveis de ambiente
MYSQL_ROOT_PASSWORD=sua_senha_root_aqui
MYSQL_DATABASE=projeto_db

# NOVO: CHAVE SECRETA DO JWT (OBRIGATÓRIO: Use uma string longa e aleatória!)
JWT_SECRET=uma_chave_secreta_muito_longa_e_aleatoria_para_proteger_os_tokens_em_producao
JWT_EXPIRES_IN=1d

### 🐳 Construa e inicie os containers

```bash
docker-compose up -d --build

## 4️⃣ Acesse os serviços

| Serviço | URL |
|---------|-----|
| 🌐 **Frontend (Vue + Nginx)** | http://localhost:8080 |
| ⚙️ **Backend (API Express)** | http://localhost:3000 |
| 🗄️ **phpMyAdmin** | http://localhost:8081 |
| 🛢️ **MySQL** | localhost:3306 |

---

## 🧠 Exemplos de Rotas da API

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| POST   | /auth/login   | Login de usuário               | Pública        |
| POST   | /tasks        | Cria uma nova tarefa           | user/admin     |
| GET    | /tasks        | Lista tarefas (todas ou próprias) | user/admin |
| PUT    | /tasks/:id    | Atualiza uma tarefa própria   | user/admin     |
| DELETE | /tasks/:id    | Exclui tarefa (somente admin) | admin          |

---

## 🧰 Comandos Úteis

```bash
# Parar containers
docker-compose down

# Remover containers, volumes e imagens
docker-compose down --volumes --rmi all

# Ver logs em tempo real
docker-compose logs -f

## 🏁 Conclusão

Este projeto foi desenvolvido com foco em **segurança, modularidade e escalabilidade**.  
Com **Docker Compose**, toda a stack — backend, frontend, banco e phpMyAdmin — é inicializada com um único comando.

> 💡 Ideal para quem busca uma base sólida para aplicações web seguras, com autenticação, autorização e gerenciamento de tarefas multiusuário.

---

### 👨‍💻 Autor

**Flávio Luiz Bé**  
💼 Desenvolvedor Fullstack  
📧 flavio50k@protonmail.com  
🌐 [github.com/flavio50k](https://github.com/flavio50k)
