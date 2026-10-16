import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import NavBar from './NavBar';
import {
  SparklesIcon,
  ClockIcon,
  LogoutIcon,
  ChartIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from '../common/Icons';

export const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const todos = useSelector((state) => state.todos.items);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [prevPath, setPrevPath] = useState(location.pathname);

  const dropdownRef = useRef(null);

  // Close menus on route change during render
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (dropdownOpen) setDropdownOpen(false);
  }

  // Live Clock & Date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', weekday: 'short' });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="topbar-brand">
          <div className="topbar-logo-icon">
            <SparklesIcon size={20} />
          </div>
          <div className="topbar-brand-text">
            <span className="topbar-title">TodoMaster</span>
            <span className="topbar-badge-pro">PRO</span>
          </div>
        </Link>

        {/* Center NavBar (Desktop) */}
        {isAuthenticated && (
          <div className="topbar-nav-desktop">
            <NavBar />
          </div>
        )}

        {/* Right Section */}
        <div className="topbar-right">
          {/* Live Date / Time */}
          {currentTime && (
            <div className="topbar-clock" title="Hozirgi vaqt">
              <ClockIcon size={15} />
              <span className="topbar-clock-time">{currentTime}</span>
              <span className="topbar-clock-sep">•</span>
              <span className="topbar-clock-date">{currentDate}</span>
            </div>
          )}

          {isAuthenticated ? (
            <>
              {/* User profile dropdown trigger */}
              <div className="topbar-user-menu" ref={dropdownRef}>
                <button
                  type="button"
                  className={`topbar-user-trigger ${dropdownOpen ? 'topbar-user-trigger--active' : ''}`}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="topbar-avatar-wrap">
                    <span className="topbar-avatar" aria-hidden="true">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <span className="topbar-avatar-status" title="Onlayn" />
                  </div>
                  <div className="topbar-user-details">
                    <span className="topbar-name">{user?.name || 'Foydalanuvchi'}</span>
                    <span className="topbar-role">Faol hisob</span>
                  </div>
                  <ChevronDownIcon
                    size={16}
                    className={`topbar-chevron ${dropdownOpen ? 'topbar-chevron--open' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Card */}
                {dropdownOpen && (
                  <div className="profile-dropdown animate-fade-down" role="menu">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="profile-dropdown-info">
                        <div className="profile-dropdown-name">{user?.name || 'Foydalanuvchi'}</div>
                        <div className="profile-dropdown-email">{user?.email || 'email@example.com'}</div>
                      </div>
                    </div>

                    <div className="profile-dropdown-stats">
                      <div className="dropdown-stat-item">
                        <span className="dropdown-stat-val">{activeCount}</span>
                        <span className="dropdown-stat-lbl">Faol</span>
                      </div>
                      <div className="dropdown-stat-item">
                        <span className="dropdown-stat-val">{completedCount}</span>
                        <span className="dropdown-stat-lbl">Bajarilgan</span>
                      </div>
                      <div className="dropdown-stat-item">
                        <span className="dropdown-stat-val">{percent}%</span>
                        <span className="dropdown-stat-lbl">Natija</span>
                      </div>
                    </div>

                    <div className="profile-dropdown-menu">
                      <Link
                        to="/statistika"
                        className="profile-dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ChartIcon size={16} />
                        <span>Statistika ko‘rish</span>
                      </Link>
                      <button
                        type="button"
                        className="profile-dropdown-link profile-dropdown-link--danger"
                        onClick={handleLogout}
                      >
                        <LogoutIcon size={16} />
                        <span>Tizimdan chiqish</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="topbar-mobile-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
              >
                {mobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
              </button>
            </>
          ) : (
            <div className="topbar-auth-links">
              <Link
                to="/login"
                className={`btn btn--ghost btn--sm ${location.pathname === '/login' ? 'btn--ghost-active' : ''}`}
              >
                Kirish
              </Link>
              <Link
                to="/register"
                className={`btn btn--primary btn--sm ${location.pathname === '/register' ? 'btn--glow' : ''}`}
              >
                Ro‘yxatdan o‘tish
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="topbar-mobile-drawer animate-fade-down">
          <NavBar onNavClick={() => setMobileMenuOpen(false)} />
          <div className="topbar-mobile-footer">
            <div className="topbar-mobile-user">
              <span className="topbar-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <div>
                <div className="topbar-name">{user?.name}</div>
                <div className="topbar-mobile-email">{user?.email}</div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn--danger-ghost btn--sm"
              onClick={handleLogout}
            >
              <LogoutIcon size={16} /> Chiqish
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
