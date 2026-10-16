import { todoApi } from './todoApi';

const PRIORITY_KEYS = ['high', 'medium', 'low'];

const countByPriority = (todos) => {
  const result = { high: 0, medium: 0, low: 0 };
  todos.forEach((todo) => {
    const key = PRIORITY_KEYS.includes(todo.priority) ? todo.priority : 'medium';
    result[key] += 1;
  });
  return result;
};

export const statsService = {
  async fetchStats(userId) {
    const todos = await todoApi.getTodos(userId);
    const list = Array.isArray(todos) ? todos : [];

    const total = list.length;
    const done = list.filter((todo) => todo.completed).length;
    const byPriority = countByPriority(list.filter((todo) => !todo.completed));

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    const highTotal = list.filter((todo) => todo.priority === 'high').length;
    const highDone = list.filter((todo) => todo.priority === 'high' && todo.completed).length;

    return {
      total,
      done,
      active: total - done,
      percent,
      byPriority,
      highTotal,
      highDone,
    };
  },
};

export default statsService;
