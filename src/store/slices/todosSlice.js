import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todoApi } from '../../services/todoApi';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { getState }) => {
  const userId = getState().auth.user?.id;
  return todoApi.getTodos(userId);
});

export const addTodoAsync = createAsyncThunk('todos/addTodo', async ({ text, priority }, { getState }) => {
  const todo = {
    text: text.trim(),
    completed: false,
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    userId: getState().auth.user?.id ?? null,
  };
  return todoApi.createTodo(todo);
});

export const editTodoAsync = createAsyncThunk('todos/editTodo', async ({ id, patch }) => {
  return todoApi.updateTodo(id, patch);
});

export const toggleTodoAsync = createAsyncThunk('todos/toggleTodo', async ({ id, completed }) => {
  return todoApi.updateTodo(id, { completed });
});

export const deleteTodoAsync = createAsyncThunk('todos/deleteTodo', async (id) => {
  await todoApi.deleteTodo(id);
  return id;
});

export const clearCompletedAsync = createAsyncThunk(
  'todos/clearCompleted',
  async (_, { getState }) => {
    const completed = getState().todos.items.filter((todo) => todo.completed);
    await Promise.all(completed.map((todo) => todoApi.deleteTodo(todo.id)));
    return completed.map((todo) => todo.id);
  },
);

const initialState = {
  items: [],
  status: 'idle', 
  error: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Vazifalarni yuklashda xatolik.';
      })

      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        const todo = state.items.find((item) => item.id === action.payload.id);
        if (todo) todo.completed = action.payload.completed;
      })

      .addCase(editTodoAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((item) => String(item.id) === String(updated.id));
        if (index !== -1) state.items[index] = { ...state.items[index], ...updated };
        state.items[index].priority = updated.priority || state.items[index].priority;
      })

      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })

      .addCase(clearCompletedAsync.fulfilled, (state, action) => {
        const removed = new Set(action.payload);
        state.items = state.items.filter((item) => !removed.has(item.id));
      });
  },
});

export default todosSlice.reducer;
