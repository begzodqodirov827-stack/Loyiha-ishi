const TODOS_KEY = 'todos';

const INITIAL_TODOS = [
  {
    id: 1,
    userId: 1,
    text: "Loyiha navbar va topbarini chiroyli qilish ✨",
    completed: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    text: "Login va Register ga show password qo'shish 👁️",
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 1,
    text: "Statistika ko'rsatkichlarini tekshirish 📊",
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    userId: 2,
    text: "Valining birinchi vazifasi",
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
];

const readTodos = () => {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) {
      localStorage.setItem(TODOS_KEY, JSON.stringify(INITIAL_TODOS));
      return INITIAL_TODOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TODOS;
  } catch {
    return INITIAL_TODOS;
  }
};

const writeTodos = (todos) => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

export const todoService = {
  getTodos(userId) {
    const todos = readTodos();
    return todos.filter((todo) => String(todo.userId) === String(userId));
  },

  createTodo(todo) {
    const todos = readTodos();
    const newTodo = {
      ...todo,
      id: todo.id || Date.now().toString(),
    };
    todos.unshift(newTodo);
    writeTodos(todos);
    return newTodo;
  },

  updateTodo(id, patch) {
    const todos = readTodos();
    const index = todos.findIndex((t) => String(t.id) === String(id));
    if (index !== -1) {
      todos[index] = { ...todos[index], ...patch };
      writeTodos(todos);
      return todos[index];
    }
    return { id, ...patch };
  },

  deleteTodo(id) {
    const todos = readTodos();
    const filtered = todos.filter((t) => String(t.id) !== String(id));
    writeTodos(filtered);
    return id;
  },

  saveTodos(userId, userTodos) {
    const others = readTodos().filter((todo) => String(todo.userId) !== String(userId));
    writeTodos([...others, ...userTodos]);
  },
};
