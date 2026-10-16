import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ListTodoIcon, ChartIcon } from '../common/Icons';

export const NavBar = ({ onNavClick }) => {
  const todos = useSelector((state) => state.todos.items);
  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <nav className="navbar" aria-label="Asosiy navigatsiya">
      <NavLink
        to="/"
        end
        onClick={onNavClick}
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
      >
        <ListTodoIcon size={18} />
        <span>Vazifalar</span>
        {activeCount > 0 && (
          <span className="nav-badge" title={`${activeCount} ta bajarilmagan vazifa`}>
            {activeCount}
          </span>
        )}
      </NavLink>

      <NavLink
        to="/statistika"
        onClick={onNavClick}
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
      >
        <ChartIcon size={18} />
        <span>Statistika</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
