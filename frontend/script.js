const API_URL = 'http://localhost:3000/api';



// Elementos DOM

const authSection = document.getElementById('auth-section');

const appSection = document.getElementById('app-section');

const taskForm = document.getElementById('task-form');

const taskInput = document.getElementById('task-input');

const tasksList = document.getElementById('tasks-list');

const authForm = document.getElementById('auth-form');

const authMessage = document.getElementById('auth-message');



// Variável para armazenar a role do usuário (user ou admin)

let userRole = localStorage.getItem('role') || 'user';





// ----------------------------------------------------

// FUNÇÕES DE AUTENTICAÇÃO

// ----------------------------------------------------



/**

* Lida com a resposta bem-sucedida de login ou registro.

* @param {object} data - Objeto de dados da API, contendo token, userId e role.

*/

const handleAuthResponse = (data) => {

const { token, userId, role } = data; // Extrai a 'role'



// Armazenar as credenciais e a role no localStorage

localStorage.setItem('token', token);

localStorage.setItem('userId', userId);

localStorage.setItem('role', role);

userRole = role; // Atualiza a variável global



// Exibe a seção de tarefas e esconde a de autenticação

authSection.style.display = 'none';

appSection.style.display = 'block';

authMessage.textContent = '';


loadTasks();

};



/**

* Lida com a submissão do formulário de Login/Registro.

*/

authForm.addEventListener('submit', async (event) => {

event.preventDefault();

// Determina se o botão clicado foi 'register-button' ou 'login-button'

const isRegister = event.submitter.id === 'register-button';

const username = document.getElementById('auth-username').value;

const password = document.getElementById('auth-password').value;



const endpoint = isRegister ? '/register' : '/login';


try {

const response = await fetch(`${API_URL}/users${endpoint}`, {

method: 'POST',

headers: { 'Content-Type': 'application/json' },

body: JSON.stringify({ username, password })

});



const data = await response.json();



if (response.ok) {

handleAuthResponse(data);

} else {

authMessage.textContent = data.error?.message || 'Erro de autenticação.';

}

} catch (error) {

authMessage.textContent = 'Erro de conexão com o servidor.';

}

});



/**

* Processa o logout do usuário.

*/

document.getElementById('logout-button').addEventListener('click', () => {

localStorage.removeItem('token');

localStorage.removeItem('userId');

localStorage.removeItem('role');

userRole = 'user';



appSection.style.display = 'none';

authSection.style.display = 'block';

tasksList.innerHTML = '';

});





// ----------------------------------------------------

// FUNÇÕES DE TAREFAS (CRUD)

// ----------------------------------------------------



/**

* Carrega e renderiza as tarefas do usuário.

*/

const loadTasks = async () => {

const token = localStorage.getItem('token');

if (!token) return;



tasksList.innerHTML = '<li>Carregando tarefas...</li>';



try {

const response = await fetch(`${API_URL}/tasks`, {

headers: { 'Authorization': `Bearer ${token}` }

});



if (response.ok) {

const tasks = await response.json();

renderTasks(tasks);

} else if (response.status === 401 || response.status === 403) {

// Token expirado ou inválido

document.getElementById('logout-button').click();

} else {

tasksList.innerHTML = '<li>Erro ao carregar tarefas.</li>';

}

} catch (error) {

console.error('Erro ao carregar tarefas:', error);

tasksList.innerHTML = '<li>Erro de conexão com a API.</li>';

}

};



/**

* Renderiza a lista de tarefas no DOM.

*/

const renderTasks = (tasks) => {

tasksList.innerHTML = '';



if (tasks.length === 0) {

tasksList.innerHTML = '<li>Nenhuma tarefa cadastrada.</li>';

return;

}



tasks.forEach(task => {

tasksList.appendChild(createListItem(task));

});

};



/**

* Cria o elemento <li> para uma tarefa, com lógica de permissão.

*/

const createListItem = (task) => {

const li = document.createElement('li');

li.dataset.taskId = task.id;

li.className = task.completed ? 'completed' : '';



// Checkbox de Conclusão (Permitido para todos)

const checkbox = document.createElement('input');

checkbox.type = 'checkbox';

checkbox.checked = task.completed;

checkbox.addEventListener('change', () => toggleTaskCompleted(task.id, checkbox.checked));



// Span do Título (Permitido para todos)

const titleSpan = document.createElement('span');

titleSpan.textContent = task.title;

titleSpan.classList.add('task-title');


// Contêiner de botões de ação

const actionContainer = document.createElement('div');

actionContainer.classList.add('action-container');



// Botão de Edição (Permitido para todos)

const editButton = document.createElement('button');

editButton.textContent = 'Editar';

editButton.classList.add('edit-btn');

editButton.addEventListener('click', () => editTask(task.id, titleSpan.textContent));


li.appendChild(checkbox);

li.appendChild(titleSpan);

actionContainer.appendChild(editButton);



// Renderização condicional do botão de exclusão

if (userRole === 'admin') {

const deleteButton = document.createElement('button');

deleteButton.textContent = 'Excluir';

deleteButton.classList.add('delete-btn');

deleteButton.addEventListener('click', () => deleteTask(task.id));

actionContainer.appendChild(deleteButton);

}


li.appendChild(actionContainer);


return li;

};



/**

* Adiciona uma nova tarefa.

*/

taskForm.addEventListener('submit', async (event) => {

event.preventDefault();

const title = taskInput.value.trim();

if (!title) return;



const token = localStorage.getItem('token');


try {

const response = await fetch(`${API_URL}/tasks`, {

method: 'POST',

headers: {

'Content-Type': 'application/json',

'Authorization': `Bearer ${token}`

},

body: JSON.stringify({ title })

});



if (response.status === 201) {

taskInput.value = ''; // Limpa o input

loadTasks(); // Recarrega a lista

} else {

alert('Falha ao criar tarefa.');

}

} catch (error) {

alert('Erro de comunicação com a API.');

}

});



/**

* Alterna o status de conclusão de uma tarefa.

*/

const toggleTaskCompleted = async (id, completed) => {

const token = localStorage.getItem('token');


try {

const response = await fetch(`${API_URL}/tasks/${id}`, {

method: 'PUT',

headers: {

'Content-Type': 'application/json',

'Authorization': `Bearer ${token}`

},

body: JSON.stringify({ completed })

});



if (response.ok) {

const li = document.querySelector(`li[data-task-id="${id}"]`);

if (li) {

li.className = completed ? 'completed' : '';

}

} else {

alert('Falha ao atualizar o status da tarefa.');

loadTasks();

}

} catch (error) {

alert('Erro de comunicação com a API.');

}

};



/**

* Edita o título de uma tarefa (simplificado para um prompt).

*/

const editTask = async (id, currentTitle) => {

const newTitle = prompt('Editar tarefa:', currentTitle);



if (newTitle && newTitle.trim() !== currentTitle) {

const token = localStorage.getItem('token');

try {

const response = await fetch(`${API_URL}/tasks/${id}`, {

method: 'PUT',

headers: {

'Content-Type': 'application/json',

'Authorization': `Bearer ${token}`

},

body: JSON.stringify({ title: newTitle })

});



if (response.ok) {

// Atualiza o DOM sem recarregar tudo

const titleSpan = document.querySelector(`li[data-task-id="${id}"] .task-title`);

if (titleSpan) {

titleSpan.textContent = newTitle;

}

} else {

alert('Falha ao editar tarefa.');

loadTasks();

}

} catch (error) {

alert('Erro de comunicação com a API.');

}

}

};





/**

* Exclui uma tarefa (Permitido apenas para Admin no Backend).

*/

const deleteTask = async (id) => {

if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {

return;

}



const token = localStorage.getItem('token');



try {

const response = await fetch(`${API_URL}/tasks/${id}`, {

method: 'DELETE',

headers: { 'Authorization': `Bearer ${token}` }

});



if (response.status === 204) {

// Exclusão bem-sucedida (Admin)

loadTasks();

} else if (response.status === 403) {

// Ação proibida pelo Backend (Usuário normal tentou excluir)

const errorData = await response.json();

alert(errorData.error?.message || 'Ação proibida: Você não tem permissão para excluir tarefas.');

loadTasks();

} else {

alert('Falha ao excluir tarefa.');

loadTasks();

}

} catch (error) {

alert('Erro de comunicação com a API.');

}

};





// ----------------------------------------------------

// INICIALIZAÇÃO

// ----------------------------------------------------



/**

* Verifica se há um token ao carregar a página e inicializa o app.

*/

const checkAuthAndInitialize = () => {

const token = localStorage.getItem('token');

const role = localStorage.getItem('role');



if (token) {

userRole = role || 'user'; // Garante que userRole está definido

authSection.style.display = 'none';

appSection.style.display = 'block';

loadTasks();

} else {

authSection.style.display = 'block';

appSection.style.display = 'none';

}

};



// Inicia a verificação de autenticação ao carregar a página

document.addEventListener('DOMContentLoaded', checkAuthAndInitialize);