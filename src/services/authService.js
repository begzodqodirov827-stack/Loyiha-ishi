const USERS_KEY = 'users';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const DEMO_ACCOUNTS = [
  { name: 'Ali', email: 'ali@example.com', password: '1234' },
  { name: 'Vali', email: 'vali@example.com', password: '12345' },
];

const readUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_ACCOUNTS));
      return DEMO_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_ACCOUNTS));
    return DEMO_ACCOUNTS;
  } catch {
    return DEMO_ACCOUNTS;
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  getDemoUsers() {
    return DEMO_ACCOUNTS;
  },

  register({ name, email, password, confirmPassword }) {
    const users = readUsers();
    const emailNorm = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanName || !emailNorm || !password) {
      return { ok: false, error: 'Barcha maydonlarni to‘ldiring.' };
    }

    if (cleanName.length < 2) {
      return { ok: false, error: 'Ism kamida 2 ta harfdan iborat bo‘lsin.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNorm)) {
      return { ok: false, error: 'Haqiqiy email manzilini kiriting.' };
    }

    if (password.length < 4) {
      return { ok: false, error: 'Parol kamida 4 ta belgidan iborat bo‘lishi lozim.' };
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { ok: false, error: 'Kiritilgan parollar bir-biriga mos kelmadi.' };
    }

    if (users.some((user) => user.email === emailNorm)) {
      return { ok: false, error: 'Bu email allaqachon ro‘yxatdan o‘tgan. Boshqa email tanlang yoki tizimga kiring.' };
    }

    const newUser = {
      id: users.length + 1,
      name: cleanName,
      email: emailNorm,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    return {
      ok: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  },

  login({ email, password }) {
    const emailNorm = (email || '').trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email === emailNorm && u.password === password);

    if (!user) {
      return { ok: false, error: 'Email yoki parol noto‘g‘ri. Qayta tekshirib ko‘ring.' };
    }

    return {
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
    };
  },

  saveSession(user, remember = true) {
    const token = `token_${user.id}_${Date.now()}`;
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  getSession() {
    try {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return {
        token,
        user: userRaw ? JSON.parse(userRaw) : null,
      };
    } catch {
      return { token: null, user: null };
    }
  },
};
