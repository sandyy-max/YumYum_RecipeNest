import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './Logo.jsx';

const linkClass = ({ isActive }) => (isActive ? 'active' : '');

export function ChefShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="yy-shell">
      <aside className="yy-sidebar">
        <Logo to="/chef/dashboard" />
        <p style={{ color: 'var(--yy-muted)', fontSize: '0.8rem', margin: '0.5rem 0 1rem' }}>
          Chef · {user?.name}
        </p>
        <NavLink to="/chef/dashboard" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/chef/recipes/new" className={linkClass}>
          Add Recipe
        </NavLink>
        <NavLink to="/chef/profile" className={linkClass}>
          Profile
        </NavLink>
        <button
          type="button"
          className="logout"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Log out
        </button>
      </aside>
      <main className="yy-main">
        <Outlet />
      </main>
    </div>
  );
}
