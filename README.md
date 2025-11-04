# 📋 Projeto Fullstack - Lista de Tarefas (Node.js, Express, MySQL, Docker)

Este projeto implementa uma aplicação Fullstack de Lista de Tarefas, utilizando Node.js e Express para o Backend (API), MySQL como banco de dados, e um Frontend em HTML/JavaScript vanilla para interação, tudo orquestrado via Docker Compose.

O Backend possui um sistema de **Autenticação (JWT)** e **Autorização** (o usuário só manipula as suas próprias tarefas).

## 🐳 Pré-requisitos

Para executar o projeto, você precisa ter instalado:

1.  **Docker:** (Inclui o Docker Engine e o Docker CLI)
2.  **Docker Compose:** (Geralmente incluído na instalação do Docker Desktop)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para colocar a aplicação no ar em minutos.

### 1. Configurar Variáveis de Ambiente

Crie um arquivo chamado **`.env`** na raiz do projeto e defina as variáveis de ambiente necessárias para o MySQL.

```bash
# .env

# Senha Root do MySQL (Usada pelo DB e pelo phpMyAdmin)
MYSQL_ROOT_PASSWORD=sua_senha_root_aqui
# Nome do Banco de Dados a ser criado
MYSQL_DATABASE=projeto_db