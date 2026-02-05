'use client';

import { useEffect, useState } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo } from '@/lib/api';
import TodoItem from '@/components/TodoItem';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, ListTodo } from 'lucide-react';

type Todo = {
  id: number;
  title: string;
  status: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch todos', err);
        setLoading(false);
      });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    // Optimistic update could go here, but simple wait is fine for now
    const newTodo = await addTodo(title);
    setTodos((prev) => [...prev, newTodo]);
    setTitle('');
  }

  async function handleUpdate(id: number, updates: Partial<Todo>) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    await updateTodo(id, updates);
  }

  async function handleDelete(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await deleteTodo(id);
  }

  const completedCount = todos.filter((t) => t.status).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <main className="min-h-screen py-12 px-4 bg-background transition-colors duration-300">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-1 text-foreground">
                Tasks
              </h1>
              <p className="text-muted-foreground">
                {totalCount === 0 
                  ? "Let's get some work done!"
                  : `You've completed ${completedCount} of ${totalCount} tasks.`}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
              <span className="font-bold text-lg">
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </header>

        {/* Input Form */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleAdd} 
          className="relative group"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full p-4 pl-5 pr-14 rounded-2xl border border-input bg-card text-card-foreground shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button 
            type="submit"
            disabled={!title.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-primary-foreground rounded-xl 
                       flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </motion.form>

        {/* Todo List */}
        <section>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              <AnimatePresence mode="popLayout">
                {todos.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground"
                  >
                    <ListTodo className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg">No tasks yet.</p>
                    <p className="text-sm">Add one above to get started.</p>
                  </motion.div>
                ) : (
                  todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </AnimatePresence>
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
