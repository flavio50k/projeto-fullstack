# 🚀 Projeto Fullstack Containerizado - Lista de Tarefas
### Node.js (Express) | MySQL | Vue.js 3 | Docker Compose

Este projeto implementa uma aplicação Fullstack completa de Lista de Tarefas, demonstrando uma arquitetura moderna e containerizada.

| Componente | Tecnologia | Função |
| :--- | :--- | :--- |
| **Backend (API)** | **Node.js (Express)** | API RESTful com rotas protegidas por JWT. |
| **Frontend (SPA)** | **Vue.js 3 + Nginx** | Single Page Application (SPA) para a interface do usuário. |
| **Banco de Dados** | **MySQL 8.0** | Armazenamento persistente das tarefas e usuários. |
| **Orquestração** | **Docker Compose** | Gerencia e interconecta todos os serviços em containers. |

O Backend implementa um sistema de **Autenticação (JWT)** e **Autorização (Role-Based Access Control)**, onde:
* Usuários comuns (`user`) só podem **visualizar, criar e editar** suas próprias tarefas.
* Administradores (`admin`) podem **visualizar todas** as tarefas e **excluir tarefas de qualquer usuário**.

---

## 🐳 Pré-requisitos

Para rodar este projeto, você precisa ter o Docker e o Docker Compose instalados e configurados em seu sistema:

1.  **[Docker Engine e CLI](https://docs.docker.com/get-docker/)**
2.  **[Docker Compose](https://docs.docker.com/compose/)** (Geralmente incluído na instalação do Docker Desktop)

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para colocar a aplicação no ar em minutos usando apenas um comando.

### 1. Configurar Variáveis de Ambiente

Crie um arquivo chamado **`.env`** na raiz do projeto (se ele já não existir) e defina as credenciais para o MySQL.
# .env


## Iniciar os Containers

Na **raiz do projeto**, execute o Docker Compose. O comando irá:

- Construir as imagens (`Node.js`, `Vue.js`, `Nginx`);
- Iniciar todos os serviços;
- Garantir que o **Backend só suba após o MySQL estar saudável** (healthcheck).

docker-compose up -d --build


## Acessar a Aplicação

Aguarde alguns segundos (o Backend tenta se conectar ao DB com *retry*). Quando todos os containers estiverem `healthy`:

| Serviço               | Porta | URL                           |
|-----------------------|-------|-------------------------------|
| **Frontend (Vue App)** | 8080  | [http://localhost:8080](http://localhost:8080) |
| **Backend (API)**      | 3000  | [http://localhost:3000/api](http://localhost:3000/api) |
| **phpMyAdmin (DB)**    | 8000  | [http://localhost:8000](http://localhost:8000) |


## Credenciais Padrão para Teste

Para testar o controle de acesso por **Role**, use as credenciais criadas no setup inicial do banco:

| Usuário                    | Senha              | Role      | Ações Permitidas                              |
|----------------------------|--------------------|------ ----|-----------------------------------------------|
| `admin`                    | `adminpassword`    | **admin** | CRUD completo em **todas** as tarefas         |
| *(Qualquer novo registro)* | *(Sua senha)*      | **user**  | CRUD apenas nas tarefas que **ele criar**     |


## Parar o Projeto

Para desligar e remover **todos os containers, volumes anônimos e redes** criados pelo `docker-compose.yml`:
docker-compose down

**Opcional**: Remover também os **volumes persistentes** (incluindo os dados do MySQL):  
docker-compose down -v


# Senha Root do MySQL (Usada pelo DB e pelo phpMyAdmin)
MYSQL_ROOT_PASSWORD=sua_senha_root_aqui
# Nome do Banco de Dados a ser criado
MYSQL_DATABASE=projeto_db


## Estrutura das Pastas
PROJETO_FULLSTACK (WSL)
├── .vscode/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── env.js
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
│   └── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── docker-compose.yml
└── README.md