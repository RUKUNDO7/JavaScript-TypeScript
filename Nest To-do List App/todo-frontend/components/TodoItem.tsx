'use client';

type Todo = {
    id: number;
    title: string;
    status: boolean;
};

export default function TodoItem({
    todo,
    onToggle,
}: {
    todo: Todo;
    onToggle: (id: number, status: boolean) => void;
}) {
    return (
        <li className="flex items-center gap-3 py-2">
            <input
                type="checkbox"
                checked={todo.status}
                onChange={(e) => onToggle(todo.id, e.target.checked)}
            />
            <span className={todo.status ? 'line-through text-gray-400' : ''}>
                {todo.title}
            </span>     
        </li>
    );
}
