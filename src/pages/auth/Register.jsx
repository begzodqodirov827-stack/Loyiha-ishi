import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  XIcon,
  SparklesIcon,
} from '../../components/common/Icons';

const calculatePasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: 'Kiritilmagan', colorClass: '' };
  let score = 0;
  if (pwd.length >= 4) score += 25;
  if (pwd.length >= 8) score += 25;
  if (/[0-9]/.test(pwd)) score += 25;
  if (/[a-zA-Z]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) score += 25;
  else if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 20;

  if (score <= 25) return { score: 25, label: 'Kuchsiz', colorClass: 'strength-weak' };
  if (score <= 50) return { score: 50, label: 'Qoniqarli', colorClass: 'strength-fair' };
  if (score <= 75) return { score: 75, label: "O'rta", colorClass: 'strength-medium' };
  return { score: 100, label: 'Kuchli 🔥', colorClass: 'strength-strong' };
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setError('');
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const strength = useMemo(() => calculatePasswordStrength(form.password), [form.password]);

  const passwordsMatch = useMemo(() => {
    if (!form.confirmPassword) return null;
    return form.password === form.confirmPassword;
  }, [form.password, form.confirmPassword]);

  const handleRegister = useCallback(
    (event) => {
      event.preventDefault();
      setError('');

      if (form.password.length < 4) {
        setError('Parol kamida 4 belgidan iborat bo‘lishi shart.');
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Kiritilgan parollar bir-biriga mos kelmadi.');
        return;
      }

      setLoading(true);

      setTimeout(() => {
        const result = authService.register(form);
        setLoading(false);

        if (!result.ok) {
          setError(result.error);
          return;
        }

        setSuccessMsg("Ro'yxatdan muvaffaqiyatli o'tdingiz! Kirilmoqda... ✨");
        authService.saveSession(result.user, true);

        setTimeout(() => {
          dispatch(loginSuccess(result.user));
          navigate('/');
        }, 800);
      }, 300);
    },
    [dispatch, navigate, form],
  );

  return (
    <div className="login-page">
      <div className="login-card animate-fade-up">
        {/* Header */}
        <div className="login-brand-header">
          <div className="login-icon-badge">
            <SparklesIcon size={26} />
          </div>
          <h2 className="login-title">Ro‘yxatdan o‘tish</h2>
          <span className="login-pill">Yangi Foydalanuvchi</span>
        </div>

        <p className="login-subtitle">O‘z akkauntingizni yarating va loyihalaringizni boshlang</p>

        <form className="login-form" onSubmit={handleRegister} noValidate>
          {/* Ism */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              To‘liq ismingiz
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <UserIcon size={18} />
              </span>
              <input
                id="reg-name"
                className="login-input with-left-icon"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Masalan: Sardor Rahimov"
                required
                maxLength={40}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Elektron pochta
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <MailIcon size={18} />
              </span>
              <input
                id="reg-email"
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
            <label className="form-label" htmlFor="reg-password">
              Yangi parol
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <LockIcon size={18} />
              </span>
              <input
                id="reg-password"
                className="login-input with-left-icon with-right-icon"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Kamida 4 belgi..."
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>

            {/* Password strength indicator */}
            {form.password && (
              <div className="strength-meter-wrap animate-fade-in">
                <div className="strength-meter-track">
                  <div
                    className={`strength-meter-bar ${strength.colorClass}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <div className="strength-meter-meta">
                  <span>Parol kuchi:</span>
                  <span className={`strength-label ${strength.colorClass}`}>{strength.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password with Show/Hide toggle */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">
              Parolni tasdiqlang
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <LockIcon size={18} />
              </span>
              <input
                id="reg-confirm-password"
                className={`login-input with-left-icon with-right-icon ${
                  passwordsMatch === false ? 'input-error-border' : passwordsMatch === true ? 'input-success-border' : ''
                }`}
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Parolni qayta kiriting..."
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
              >
                {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>

            {/* Match feedback badge */}
            {passwordsMatch !== null && (
              <div
                className={`match-feedback-badge animate-fade-in ${
                  passwordsMatch ? 'match-feedback--valid' : 'match-feedback--invalid'
                }`}
              >
                {passwordsMatch ? (
                  <>
                    <CheckIcon size={14} /> <span>Parollar mos keldi</span>
                  </>
                ) : (
                  <>
                    <XIcon size={14} /> <span>Parollar mos kelmadi</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Success / Error Messages */}
          {error && (
            <div className="login-error-alert animate-fade-in" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="login-success-alert animate-fade-in" role="status">
              <span>🎉</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn--primary btn--block btn--lg"
            disabled={
              loading ||
              !form.name ||
              !form.email ||
              !form.password ||
              !form.confirmPassword ||
              passwordsMatch === false
            }
          >
            {loading ? 'Yaratilmoqda... ⏳' : 'Hisob yaratish ✨'}
          </button>
        </form>

        <p className="login-switch">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="auth-link">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
