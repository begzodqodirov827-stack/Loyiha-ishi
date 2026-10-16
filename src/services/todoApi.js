import { todoService } from './todoService';

const API_URL = 'http://localhost:4000';

const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1200);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    // Rethrow to let caller fallback or handle
    throw err;
  }
};

export const todoApi = {
  getTodos: async (userId) => {
    try {
      const data = await request(`/todos?userId=${userId}`);
      if (Array.isArray(data)) {
        return data;
      }
      return todoService.getTodos(userId);
    } catch {
      return todoService.getTodos(userId);
    }
  },

  createTodo: async (todo) => {
    try {
      return await request('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
    } catch {
      return todoService.createTodo(todo);
    }
  },

  updateTodo: async (id, patch) => {
    try {
      return await request(`/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch {
      return todoService.updateTodo(id, patch);
    }
  },

  deleteTodo: async (id) => {
    try {
      await request(`/todos/${id}`, { method: 'DELETE' });
      return id;
    } catch {
      return todoService.deleteTodo(id);
    }
  },
};
