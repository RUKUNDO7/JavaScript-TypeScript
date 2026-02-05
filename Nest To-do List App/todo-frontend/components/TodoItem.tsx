'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

type Todo = {
  id: number;
  title: string;
  status: boolean;
};

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete?: (id: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'group flex items-center justify-between p-4 mb-3 rounded-2xl border transition-all duration-200',
        'bg-card text-card-foreground shadow-sm hover:shadow-md',
        todo.status ? 'border-primary/20 bg-muted/30' : 'border-border'
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onUpdate(todo.id, { status: !todo.status })}
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            todo.status
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/30 hover:border-primary/50'
          )}
        >
          {todo.status && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </motion.button>
        
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="flex-1 bg-transparent border-b border-primary focus:outline-none text-lg font-medium"
            />
          </div>
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={cn(
              'text-lg font-medium transition-all duration-300 flex-1 cursor-text',
              todo.status ? 'text-muted-foreground line-through' : 'text-foreground'
            )}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
           // Save/Cancel handled by blur/enter, but visual cues are good too?
           // Actually simplicity is better. Blur saves.
           null
        ) : (
            <button
            onClick={() => {
                setIsEditing(true);
                setEditTitle(todo.title);
            }}
            className="p-2 text-muted-foreground hover:text-primary transition-all"
            title="Edit"
            >
            <Pencil size={18} />
            </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-muted-foreground hover:text-red-500 transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </motion.li>
  );
}
