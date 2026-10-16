import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  addTodoAsync,
  toggleTodoAsync,
  deleteTodoAsync,
  clearCompletedAsync,
  editTodoAsync,
} from '../../store/slices/todosSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import TodoItem from '../../components/common/TodoItem';
import { useSearch } from '../../context';
import { SearchIcon, XIcon } from '../../components/common/Icons';

const FILTERS = [
  { key: 'all', label: 'Hammasi' },
  { key: 'active', label: 'Faol' },
  { key: 'completed', label: 'Bajarilgan' },
];

const SORTS = [
  { key: 'newest', label: 'Yangi ↓' },
  { key: 'oldest', label: 'Eski ↑' },
  { key: 'priority', label: 'Muhimlik' },
];

const PRIORITIES = [
  { value: 'low', label: 'Past' },
  { value: 'medium', label: "O'rta" },
  { value: 'high', label: 'Yuqori' },
];

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

const filterTodos = (todos, filter, search, sort) => {
  const query = (search || '').trim().toLowerCase();
  let result = todos;

  if (query) result = result.filter((todo) => todo.text.toLowerCase().includes(query));

  switch (filter) {
    case 'active':
      result = result.filter((todo) => !todo.completed);
      break;
    case 'completed':
      result = result.filter((todo) => todo.completed);
      break;
    default:
      break;
  }

  if (sort === 'priority') {
    result = [...result].sort(
      (a, b) => (PRIORITY_WEIGHT[b.priority] || 2) - (PRIORITY_WEIGHT[a.priority] || 2),
    );
  } else if (sort === 'oldest') {
    result = [...result].slice().reverse();
  }

  return result;
};

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items: todos, status, error } = useSelector((state) => state.todos);

  const { searchQuery, setSearchQuery, clearSearch, isSearching, searchInputRef } = useSearch();

  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useLocalStorage('todoFilter', 'all');
  const [sort, setSort] = useLocalStorage('todoSort', 'newest');

  useEffect(() => {
    if (user) dispatch(fetchTodos());
  }, [dispatch, user]);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter, searchQuery, sort),
    [todos, filter, searchQuery, sort],
  );

  const { total, done, percent } = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((todo) => todo.completed).length;
    return {
      total,
      done,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [todos]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const value = text.trim();
      if (!value) return;
      dispatch(addTodoAsync({ text: value, priority }));
      setText('');
      setPriority('medium');
    },
    [dispatch, text, priority],
  );

  const handleToggle = useCallback((todo) => dispatch(toggleTodoAsync({ id: todo.id, completed: !todo.completed })), [dispatch]);
  const handleDelete = useCallback((id) => dispatch(deleteTodoAsync(id)), [dispatch]);
  const handleEdit = useCallback((id, newText) => dispatch(editTodoAsync({ id, patch: { text: newText } })), [dispatch]);
  const handleEditPriority = useCallback((id, newPriority) => dispatch(editTodoAsync({ id, patch: { priority: newPriority } })), [dispatch]);
  const handleClearCompleted = useCallback(() => dispatch(clearCompletedAsync()), [dispatch]);

  return (
    <div className="page">
      <header className="app-header">
        <div>
          <h1 className="app-title">📝 Todo App</h1>
          <p className="app-subtitle">
            Bugun {done}/{total} ta ish bajarildi.
          </p>
        </div>
      </header>

      {/* Todo creation form */}
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="todo-input"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Yangi vazifa yozing..."
          maxLength={80}
        />
        <select
          className="todo-select"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          aria-label="Muhimlik darajasi"
        >
          {PRIORITIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn--primary" disabled={!text.trim()}>
          Qo&apos;shish
        </button>
      </form>

      {/* Enhanced Search Input */}
      <div className="todo-search-wrap">
        <SearchIcon size={18} className="todo-search-icon" />
        <input
          ref={searchInputRef}
          className="todo-search-input"
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Vazifalarni qidirish... (Ctrl+K yoki /)"
          aria-label="Vazifalarni qidirish"
        />
        {isSearching && (
          <button
            type="button"
            className="todo-search-clear-btn"
            onClick={clearSearch}
            title="Qidiruvni tozalash"
          >
            <XIcon size={14} />
            <span>Tozalash</span>
          </button>
        )}
      </div>

      {/* Search results badge banner */}
      {isSearching && (
        <div className="search-results-banner animate-fade-in">
          <div className="search-results-info">
            <span className="search-results-badge">Natija</span>
            <span>
              &ldquo;<strong>{searchQuery}</strong>&rdquo; so‘rovi bo‘yicha{' '}
              <strong>{visibleTodos.length}</strong> ta vazifa topildi
            </span>
          </div>
          <button type="button" className="search-results-reset" onClick={clearSearch}>
            ✕ Qidiruvni tozalash
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="todo-meta">
        <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-label">{percent}%</span>
      </div>

      {/* Filters and sorting */}
      <div className="todo-filters">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`filter-btn ${filter === key ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
        {done > 0 && (
          <button type="button" className="filter-btn filter-btn--danger" onClick={handleClearCompleted}>
            Tozalash ({done})
          </button>
        )}
        <span className="filters-divider" aria-hidden="true" />
        {SORTS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`filter-btn ${sort === key ? 'filter-btn--active' : ''}`}
            onClick={() => setSort(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List / Empty State / Loading */}
      {status === 'failed' && <p className="todo-error">❌ {error}</p>}
      {status === 'loading' ? (
        <p className="todo-empty">Yuklanmoqda... ⏳</p>
      ) : visibleTodos.length === 0 ? (
        isSearching ? (
          <div className="empty-search-card animate-fade-in">
            <div className="empty-search-icon">🔍</div>
            <h3 className="empty-search-title">Hech qanday vazifa topilmadi</h3>
            <p className="empty-search-text">
              &ldquo;{searchQuery}&rdquo; so‘zi bo‘yicha birorta ham vazifa topilmadi.
            </p>
            <button type="button" className="btn btn--primary btn--sm" onClick={clearSearch}>
              Qidiruvni tozalash ✨
            </button>
          </div>
        ) : (
          <p className="todo-empty">Vazifalar yo&apos;q. Yuqoridan qo&apos;shib boshlang ✨</p>
        )
      ) : (
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onEditPriority={handleEditPriority}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
