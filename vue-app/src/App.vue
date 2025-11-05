<template>
  <div id="app">
    <h1>📋 Projeto FullStack - Tarefas Vue.js</h1>
    <p>Conectado ao Backend em: **{{ apiUrl }}**</p>
    <hr>

    <div v-if="!token" class="auth-section">
      <h2>Acesso ao Sistema</h2>
      <input type="text" v-model="username" placeholder="Usuário" required>
      <input type="password" v-model="password" placeholder="Senha" required>
      <button @click="handleAuth('login')">Entrar</button>
      <button @click="handleAuth('register')">Registrar</button>
      <p v-if="authMessage" :style="{ color: authSuccess ? 'green' : 'red' }">{{ authMessage }}</p>
    </div>

    <div v-else class="app-section">
      <div class="header">
        <h2>Suas Tarefas (Role: {{ userRole }})</h2>
        <button @click="logout">Sair</button>
      </div>

      <button @click="loadTasks">Carregar/Atualizar Tarefas</button>
      
      <ul>
        <li v-for="task in tasks" :key="task.id">
          {{ task.title }} (Criada por: {{ task.user_id }}) 
          <span v-if="userRole === 'admin'">(Admin pode deletar)</span>
        </li>
      </ul>
      <p v-if="!tasks.length">Nenhuma tarefa encontrada ou falha ao carregar.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

// Variável de Ambiente: Deve ser injetada pelo build do Vue (VUE_APP_API_URL)
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

export default {
  name: 'App',
  data() {
    return {
      apiUrl: API_URL,
      username: '',
      password: '',
      token: localStorage.getItem('token') || null,
      userRole: localStorage.getItem('role') || 'user',
      tasks: [],
      authMessage: '',
      authSuccess: false,
    };
  },
  mounted() {
    // Tenta carregar as tarefas se já houver um token
    if (this.token) {
      this.loadTasks();
    }
  },
  methods: {
    async handleAuth(endpoint) {
      this.authMessage = '';
      
      try {
        const response = await axios.post(`${API_URL}/users/${endpoint}`, {
          username: this.username,
          password: this.password,
        });

        const { token, role } = response.data;

        // Armazena no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // Atualiza o estado do componente
        this.token = token;
        this.userRole = role;
        this.authSuccess = true;
        this.authMessage = endpoint === 'login' ? 'Login bem-sucedido!' : 'Registro bem-sucedido! Faça o login.';
        
        // Limpa inputs e carrega as tarefas se for login
        this.username = '';
        this.password = '';
        if (endpoint === 'login') {
            this.loadTasks();
        }

      } catch (error) {
        this.authSuccess = false;
        this.authMessage = error.response?.data?.error?.message || `Erro ao ${endpoint}: Falha de comunicação.`;
        this.token = null;
        this.userRole = 'user';
        localStorage.clear();
      }
    },

    async loadTasks() {
      if (!this.token) return;

      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        this.tasks = response.data;
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        // Se a API retornar 401/403 (token inválido/expirado), faz logout
        if (error.response?.status === 401 || error.response?.status === 403) {
            alert('Sua sessão expirou ou o token é inválido. Faça login novamente.');
            this.logout();
        }
        this.tasks = [];
      }
    },
    
    logout() {
      localStorage.clear();
      this.token = null;
      this.userRole = 'user';
      this.tasks = [];
      this.authMessage = 'Você saiu do sistema.';
      this.authSuccess = true;
    }
  },
};
</script>

<style>
/* CSS básico para organizar visualmente (pode ser movido para App.css) */
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
.auth-section, .app-section {
    padding: 10px;
    margin-top: 20px;
}
</style>