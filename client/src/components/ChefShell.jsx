import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './Logo.jsx';
import landingHeroBg from '../assets/landing-hero-bg.png';

const linkClass = ({ isActive }) => (isActive ? 'active' : '');

export function ChefShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="yy-shell" style={{ ['--yy-shell-bg']: `url(${landingHeroBg})` }}>
      <aside className="yy-sidebar">
        <div className="yy-sidebar-logo">
          <Logo to="/chef/dashboard" />
        </div>
        <p className="yy-sidebar-user">
          {user?.name}
          <small>Chef</small>
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
