<template>
  <div id="app">
    <h1>📋 Projeto FullStack - Tarefas Vue.js</h1>
    <p>Conectado ao Backend em: **{{ apiUrl }}**</p>
    <hr />

    <div v-if="!token" class="auth-section">
      <h2>Acesso ao Sistema</h2>
      <input type="text" v-model="username" placeholder="Usuário" required />
      <input type="password" v-model="password" placeholder="Senha" required />
      <button @click="handleAuth('login')">Entrar</button>
      <button @click="handleAuth('register')">Registrar</button>
      <p v-if="authMessage" :style="{ color: authSuccess ? 'green' : 'red' }">
        {{ authMessage }}
      </p>
    </div>

    <div v-else class="app-section">
      <div class="header">
        <h2>Suas Tarefas (Role: {{ userRole }})</h2>
        <button @click="logout">Sair</button>
      </div>

      <button @click="loadTasks">Carregar/Atualizar Tarefas</button>

      <ul class="task-list">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :userRole="userRole"
          @delete-task="deleteTask"
          @toggle-complete="toggleTaskCompleted"
          @update-task="updateTask"
        />
      </ul>
      <p v-if="!tasks.length">Nenhuma tarefa encontrada ou falha ao carregar.</p>

      <div class="task-create">
        <h3>Nova Tarefa</h3>
        <input type="text" v-model="newTaskTitle" placeholder="Nova tarefa..." required />
        <button @click="createTask" :disabled="!newTaskTitle.length">Criar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TaskItem from "./components/TaskItem.vue";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000/api";

export default {
  name: "App",
  components: {
    TaskItem,
  },
  data() {
    return {
      apiUrl: API_URL,
      token: localStorage.getItem("token") || null,
      userRole: localStorage.getItem("role") || "user",
      tasks: [],
      username: "",
      password: "",
      newTaskTitle: "",
      authMessage: "",
      authSuccess: false,
    };
  },
  mounted() {
    if (this.token) {
      this.loadTasks();
    }
  },
  methods: {
    // ... (handleAuth e handleApiCall são mantidos) ...
    async handleAuth(endpoint) {
      this.authMessage = "";
      const data = { username: this.username, password: this.password };
      try {
        const response = await axios.post(`${API_URL}/users/${endpoint}`, data);

        this.token = response.data.token;
        this.userRole = response.data.role;

        localStorage.setItem("token", this.token);
        localStorage.setItem("role", this.userRole);

        this.authMessage = `Sucesso! Bem-vindo, ${this.username}. Role: ${this.userRole}`;
        this.authSuccess = true;
        this.password = "";
        this.loadTasks();
      } catch (error) {
        this.authSuccess = false;
        this.authMessage = error.response?.data?.error?.message || `Erro ao ${endpoint}.`;
      }
    },

    async handleApiCall(endpoint, error) {
      console.error(`Erro ao ${endpoint}:`, error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Sua sessão expirou ou o token é inválido. Faça login novamente.");
        this.logout();
      }
      return (
        error.response?.data?.error?.message ||
        `Erro ao ${endpoint}: Falha de comunicação.`
      );
    },

    // --- CRUD ---
    async loadTasks() {
      if (!this.token) return;

      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.tasks = response.data;
      } catch (error) {
        this.handleApiCall("carregar tarefas", error);
        this.tasks = [];
      }
    },

    async createTask() {
      if (!this.newTaskTitle.trim()) return;
      try {
        await axios.post(
          `${API_URL}/tasks`,
          { title: this.newTaskTitle },
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.newTaskTitle = "";
        this.loadTasks();
      } catch (error) {
        this.handleApiCall("criar tarefa", error);
      }
    },

    // MÉTODO EXISTENTE (Toggle completed) - Simples PUT
    async toggleTaskCompleted(taskId, completedStatus) {
      this.updateTask(taskId, { completed: completedStatus });
    },

    // NOVO MÉTODO: Edição do Título (PUT geral)
    async updateTask(taskId, data) {
      try {
        await axios.put(
          `${API_URL}/tasks/${taskId}`,
          data, // Pode ser { title: 'novo título' } ou { completed: true/false }
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.loadTasks(); // Recarrega a lista para mostrar a mudança
      } catch (error) {
        this.handleApiCall("atualizar tarefa", error);
      }
    },

    async deleteTask(taskId) {
      if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

      try {
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.loadTasks();
      } catch (error) {
        if (error.response?.status === 403) {
          alert("Ação proibida: Você não tem permissão para excluir esta tarefa.");
        } else {
          this.handleApiCall("excluir tarefa", error);
        }
        this.loadTasks();
      }
    },

    logout() {
      localStorage.clear();
      this.token = null;
      this.userRole = "user";
      this.tasks = [];
      this.authMessage = "Você saiu do sistema.";
      this.authSuccess = true;
    },
  },
};
</script>

<style>
/* CSS básico para organizar visualmente (mantido do original) */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.auth-section,
.app-section {
  padding: 10px;
  margin-top: 20px;
}
.task-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}
.task-create {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
