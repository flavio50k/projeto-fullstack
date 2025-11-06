# Projeto Fullstack - Lista de Tarefas (To-Do List)

Este projeto implementa uma aplicação **Fullstack de Lista de Tarefas** completa, demonstrando uma **arquitetura moderna, escalável e 100% containerizada** utilizando Docker Compose.

O foco principal do projeto está na **segurança**, na **performance** e na segregação clara de responsabilidades entre os serviços.

---

## Stack Tecnológica

| Componente | Tecnologia | Função | Container | Porta Padrão |
| :--- | :--- | :--- | :--- | :--- |
| **Backend (API)** | Node.js (Express) | API RESTful com rotas protegidas por JWT. | `app_backend` | 3000 |
| **Frontend (SPA)** | Vue.js 3 + Nginx | Single Page Application (SPA) para a interface do usuário. | `app_frontend` | 8080 (Acesso) |
| **Banco de Dados** | MySQL 8.0 | Armazenamento persistente das tarefas e usuários. | `db_mysql` | 3306 |
| **Gerenciamento DB** | phpMyAdmin | Interface web para administração e monitoramento do MySQL. | `db_admin` | 8081 |
| **Orquestração** | Docker Compose | Gerencia a construção, configuração e interconexão de todos os 4 serviços. | N/A | N/A |

---

## Segurança e Regras de Negócio (RBAC)

O Backend implementa um sistema robusto de **Autenticação (JWT)** e **Autorização (Role-Based Access Control - RBAC)**, com os seguintes perfis:

* **Usuário Comum (`user`):** Pode visualizar, criar e editar/concluir apenas suas **próprias** tarefas.
* **Administrador (`admin`):** Possui permissão para visualizar **todas** as tarefas do sistema e excluir tarefas de **qualquer** usuário.

---

## Pré-requisitos

Para executar o projeto, você precisa ter instalado na sua máquina:

* **Docker:** (Inclui o Docker Engine e o Docker CLI)
* **Docker Compose:** (Geralmente incluído na instalação do Docker Desktop)

---

## Como Executar o Projeto

Siga os passos abaixo para colocar a aplicação no ar em minutos.

### 1. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e defina as variáveis de ambiente necessárias para o MySQL:

```bash
MYSQL_ROOT_PASSWORD=minha_senha_segura
MYSQL_DATABASE=todo_list_db