import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './Logo.jsx';

const linkClass = ({ isActive }) => (isActive ? 'active' : '');

export function UserShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="yy-shell">
      <aside className="yy-sidebar">
        <Logo to="/home" />
        <p style={{ color: 'var(--yy-muted)', fontSize: '0.8rem', margin: '0.5rem 0 1rem' }}>
          {user?.name}
        </p>
        <NavLink to="/home" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/home/recipes" className={linkClass}>
          Recipes
        </NavLink>
        <NavLink to="/saved" className={linkClass}>
          Favorites / Cook Later
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
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
