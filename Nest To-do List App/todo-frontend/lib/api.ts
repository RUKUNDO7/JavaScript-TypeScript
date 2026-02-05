const API_URL = 'http://localhost:3000/todos'

export async function getTodos() {
    const res = await fetch(API_URL, { cache: 'no-store'});
    return res.json();
}

export async function addTodo(title: string) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ title}),
    });
    return res.json();
}

export async function updateTodoStatus(id: number, status: boolean) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ status }),
    });
}