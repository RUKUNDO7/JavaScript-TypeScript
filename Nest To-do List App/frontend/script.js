const API_URL = 'http://localhost:3000/todos';

const list = document.getElementById('todo-list');
const form = document.getElementById('todo-form');
const titleInput = document.getElementById('title');

// Load tasks
async function loadTodos() {
  const res = await fetch(API_URL);
  const todos = await res.json();

  list.innerHTML = '';
  todos.forEach(todo => renderTodo(todo));
}

// Render one todo
function renderTodo(todo) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.status;

  const span = document.createElement('span');
  span.textContent = todo.title;

  if (todo.status) span.classList.add('completed');

  checkbox.addEventListener('change', async () => {
    await fetch(`${API_URL}/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: checkbox.checked })
    });

    span.classList.toggle('completed', checkbox.checked);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  list.appendChild(li);
}

// Add new task
form.addEventListener('submit', async e => {
  e.preventDefault();

  const title = titleInput.value;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  const todo = await res.json();
  renderTodo(todo);

  titleInput.value = '';
});

// Initial load
loadTodos();
