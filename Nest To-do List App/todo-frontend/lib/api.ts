const API_URL = "http://localhost:3000/todos";

export async function getTodos() {
  const res = await fetch(API_URL, { cache: "no-store" });
  return res.json();
}

export async function addTodo(title: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

interface UpdateTodoDto {
  title?: string;
  status?: boolean;
}

export async function updateTodo(id: number, updates: UpdateTodoDto) {
  await fetch(`${API_URL}/id/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteTodo(id: number) {
  await fetch(`${API_URL}/id/${id}`, {
    method: "DELETE",
  });
}
