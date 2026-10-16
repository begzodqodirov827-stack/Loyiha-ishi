import React, { memo, useEffect, useRef, useState } from 'react';
import { useSearch } from '../../context';

const PRIORITY_ORDER = ['low', 'medium', 'high'];

const PRIORITY_LABELS = {
  low: 'Past',
  medium: "O'rta",
  high: 'Yuqori',
};

const HighlightText = ({ text, query }) => {
  const trimmed = query?.trim();
  if (!trimmed) return text;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={index} className="search-highlight">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};

const TodoItem = ({ todo, onToggle, onDelete, onEdit, onEditPriority }) => {
  const { searchQuery } = useSearch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(todo.text);
    setEditing(true);
  };

  const saveEdit = () => {
    const value = draft.trim();
    if (value && value !== todo.text) onEdit(todo.id, value);
    setEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') saveEdit();
    if (event.key === 'Escape') setEditing(false);
  };

  const priority = PRIORITY_ORDER.includes(todo.priority) ? todo.priority : 'medium';

  const cyclePriority = () => {
    const next = PRIORITY_ORDER[(PRIORITY_ORDER.indexOf(priority) + 1) % PRIORITY_ORDER.length];
    onEditPriority(todo.id, next);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
      <button
        type="button"
        className="todo-check"
        aria-label={todo.completed ? 'Bajarildi' : 'Bajarilmagan'}
        onClick={() => onToggle(todo)}
      >
        {todo.completed ? '✓' : ''}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className="todo-edit-input"
          value={draft}
          maxLength={80}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          aria-label="Vazifani tahrirlash"
        />
      ) : (
        <>
          <button
            type="button"
            className={`priority-badge priority-badge--${priority}`}
            title="Muhimlikni o'zgartirish"
            onClick={cyclePriority}
          >
            {PRIORITY_LABELS[priority]}
          </button>
          <span className="todo-text" title="Tahrirlash uchun ikki marta bosing" onDoubleClick={startEdit}>
            <HighlightText text={todo.text} query={searchQuery} />
          </span>
        </>
      )}

      {!editing && (
        <button
          type="button"
          className="todo-edit"
          aria-label="Tahrirlash"
          onClick={startEdit}
        >
          ✎
        </button>
      )}

      <button
        type="button"
        className="todo-delete"
        aria-label="O'chirish"
        onClick={() => onDelete(todo.id)}
      >
        ✕
      </button>
    </li>
  );
};

export default memo(TodoItem);
