<template>
  <li class="task-item">
    <div class="task-content">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle-complete', task.id, !task.completed)"
      />

      <input
        v-if="isEditing"
        type="text"
        v-model="editableTitle"
        class="edit-input"
        @keyup.enter="saveEdit"
      />

      <span
        v-else
        :class="{ completed: task.completed }"
        @click="startEdit"
        title="Clique para editar"
        class="task-title-text"
      >
        {{ task.title }}
        <small>(ID: {{ task.id }})</small>
        <span v-if="userRole === 'admin'" class="admin-tag">(Admin)</span>
      </span>
    </div>

    <div class="task-actions">
      <button v-if="isEditing" @click="saveEdit" class="save-btn">Salvar</button>
      <button
        v-if="userRole === 'admin'"
        @click="$emit('delete-task', task.id)"
        class="delete-btn"
      >
        Excluir
      </button>
    </div>
  </li>
</template>

<script>
export default {
  name: "TaskItem",
  props: {
    task: {
      type: Object,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
  },
  // O componente TaskItem agora emite um evento de atualização
  emits: ["delete-task", "toggle-complete", "update-task"],

  data() {
    return {
      isEditing: false,
      editableTitle: this.task.title, // Copia o título para um estado editável
    };
  },

  watch: {
    // Garante que o input seja atualizado se a task mudar de fora
    "task.title": function (newTitle) {
      this.editableTitle = newTitle;
    },
  },

  methods: {
    startEdit() {
      this.isEditing = true;
      // Próximo tick: foca no input
      this.$nextTick(() => {
        const input = this.$el.querySelector(".edit-input");
        if (input) input.focus();
      });
    },

    saveEdit() {
      // Verifica se o título mudou e não está vazio
      if (this.editableTitle.trim() && this.editableTitle !== this.task.title) {
        // Emite o evento 'update-task' para o componente pai (App.vue)
        this.$emit("update-task", this.task.id, { title: this.editableTitle });
      }
      this.isEditing = false;
    },
  },
};
</script>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 8px;
  border-radius: 4px;
  background: #f9f9f9;
}
.task-content {
  display: flex;
  align-items: center;
  flex-grow: 1; /* Ocupa o espaço restante */
}
.task-title-text {
  cursor: pointer; /* Indica que é clicável */
  flex-grow: 1;
  margin-left: 10px;
}
.completed {
  text-decoration: line-through;
  color: #888;
}
.admin-tag {
  margin-left: 10px;
  padding: 2px 5px;
  background: #4a90e2;
  color: white;
  border-radius: 3px;
  font-size: 0.75em;
}
.task-actions {
  display: flex;
  gap: 8px; /* Espaço entre os botões */
}
.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.save-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.edit-input {
  flex-grow: 1;
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #3498db;
  border-radius: 3px;
}
</style>
