import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import { authService, DEMO_ACCOUNTS } from '../../services/authService';
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
  UserIcon,
} from '../../components/common/Icons';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setError('');
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleLogin = useCallback(
    (event) => {
      event?.preventDefault();
      setError('');
      setLoading(true);

      setTimeout(() => {
        const result = authService.login(form);
        setLoading(false);

        if (!result.ok) {
          setError(result.error);
          return;
        }

        authService.saveSession(result.user, rememberMe);
        dispatch(loginSuccess(result.user));
        navigate('/');
      }, 250);
    },
    [dispatch, navigate, form, rememberMe],
  );

  const handleQuickLogin = (demo) => {
    setForm({ email: demo.email, password: demo.password });
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = authService.login(demo);
      setLoading(false);
      if (result.ok) {
        authService.saveSession(result.user, true);
        dispatch(loginSuccess(result.user));
        navigate('/');
      }
    }, 200);
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-up">
        {/* Header */}
        <div className="login-brand-header">
          <div className="login-icon-badge">
            <SparklesIcon size={26} />
          </div>
          <h2 className="login-title">TodoMaster</h2>
          <span className="login-pill">Xavfsiz Tizim</span>
        </div>

        <p className="login-subtitle">O‘z hisobingizga kiring va vazifalarni boshqaring</p>

        {/* Demo Fast Login */}
        <div className="demo-accounts-box">
          <div className="demo-accounts-title">⚡ Tezkor kirish (Demo hisob):</div>
          <div className="demo-accounts-buttons">
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                className="btn-demo-pill"
                onClick={() => handleQuickLogin(demo)}
                title={`${demo.name} hisobi bilan darhol kirish`}
              >
                <UserIcon size={14} />
                <span>{demo.name}</span>
                <span className="demo-pill-badge">{demo.password}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-divider">
          <span>yoki email orqali</span>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Elektron pochta
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <MailIcon size={18} />
              </span>
              <input
                id="login-email"
                className="login-input with-left-icon"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="namuna@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password with Show/Hide toggle */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Parol
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <LockIcon size={18} />
              </span>
              <input
                id="login-password"
                className="login-input with-left-icon with-right-icon"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Parolingizni kiriting..."
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                tabIndex={0}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="login-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="custom-checkbox"
              />
              <span>Meni eslab qol</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error-alert animate-fade-in" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn--primary btn--block btn--lg"
            disabled={loading || !form.email || !form.password}
          >
            {loading ? 'Kirilmoqda... ⏳' : 'Tizimga kirish ✨'}
          </button>
        </form>

        <p className="login-switch">
          Hisobingiz yo‘qmi?{' '}
          <Link to="/register" className="auth-link">
            Ro‘yxatdan o‘tish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
