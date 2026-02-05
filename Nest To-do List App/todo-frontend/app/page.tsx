'use client';

import { useEffect, useState } from 'react';
import { getTodos, addTodo, updateTodoStatus } from '@/lib/api';
import TodoItem from '@/components/TodoItem';

type Todo = {
  id: number;
  title: string;
  status: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos().then(setTodos);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = await addTodo(title);
    setTodos((prev) => [...prev, newTodo]);
    setTitle('');
  }

  async function toggleStatus(id: number, status: boolean) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    await updateTodoStatus(id, status);
  }

  return (
    <main className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">📝 My Tasks</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button className="bg-black text-white px-4 rounded">
          Add
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleStatus}
          />
        ))}
      </ul>
    </main>
  );
}
