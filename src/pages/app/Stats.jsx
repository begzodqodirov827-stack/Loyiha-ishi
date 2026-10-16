import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { statsService } from '../../services/statsService';

const PRIORITIES = [
  { key: 'high', label: 'Yuqori', className: 'stat-bar-fill--high' },
  { key: 'medium', label: "O'rta", className: 'stat-bar-fill--medium' },
  { key: 'low', label: 'Past', className: 'stat-bar-fill--low' },
];

const Stats = () => {
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setStatus('loading');
        setError(null);
        const data = await statsService.fetchStats(user?.id);
        if (!cancelled) {
          setStats(data);
          setStatus('succeeded');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Statistikani yuklashda xatolik.');
          setStatus('failed');
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (status === 'loading') {
    return (
      <div className="page">
        <p className="todo-empty">Statistika yuklanmoqda... ⏳</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="page">
        <p className="todo-error">❌ {error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="app-header">
        <div>
          <h1 className="app-title">📊 Statistika</h1>
          <p className="app-subtitle">Foydalanuvchi darajasidagi bajarilish ko'rsatkichlari.</p>
        </div>
      </header>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-card-value">{stats.total}</span>
          <span className="stat-card-label">Jami vazifa</span>
        </div>
        <div className="stat-card stat-card--done">
          <span className="stat-card-value">{stats.done}</span>
          <span className="stat-card-label">Bajarilgan</span>
        </div>
        <div className="stat-card stat-card--active">
          <span className="stat-card-value">{stats.active}</span>
          <span className="stat-card-label">Faol</span>
        </div>
        <div className="stat-card stat-card--percent">
          <span className="stat-card-value">{stats.percent}%</span>
          <span className="stat-card-label">O'rtacha bajarilish</span>
        </div>
      </div>

      <section className="stat-panel">
        <h2 className="stat-panel-title">Faol vazifalar — muhimlik bo'yicha</h2>
        {PRIORITIES.map(({ key, label, className }) => {
          const count = stats.byPriority[key];
          const max = Math.max(stats.byPriority.high, stats.byPriority.medium, stats.byPriority.low, 1);
          return (
            <div className="stat-bar" key={key}>
              <span className="stat-bar-label">{label}</span>
              <div className="stat-bar-track">
                <div className={`stat-bar-fill ${className}`} style={{ width: `${Math.round((count / max) * 100)}%` }} />
              </div>
              <span className="stat-bar-count">{count}</span>
            </div>
          );
        })}
      </section>

      <section className="stat-panel">
        <h2 className="stat-panel-title">Yuqori muhimlik</h2>
        <p className="stat-panel-text">
          {stats.highTotal === 0
            ? 'Yuqori muhimlikdagi vazifa yo\'q. ✨'
            : `Yuqori muhimlikdagi ${stats.highTotal} ta vazifadan ${stats.highDone} tasi bajarilgan.`}
        </p>
      </section>
    </div>
  );
};

export default Stats;
