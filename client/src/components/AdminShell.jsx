import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './Logo.jsx';
import landingHeroBg from '../assets/landing-hero-bg.png';

const linkClass = ({ isActive }) => (isActive ? 'active' : '');

export function AdminShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="yy-shell" style={{ ['--yy-shell-bg']: `url(${landingHeroBg})` }}>
      <aside className="yy-sidebar">
        <div className="yy-sidebar-logo">
          <Logo to="/admin/dashboard" />
        </div>
        <p className="yy-sidebar-user">
          {user?.name}
          <small>Admin</small>
        </p>
        <NavLink to="/admin/dashboard" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          Manage Users
        </NavLink>
        <NavLink to="/admin/chefs" className={linkClass}>
          Manage Chefs
        </NavLink>
        <NavLink to="/admin/recipes/pending" className={linkClass}>
          Recipe Approval
        </NavLink>
        <NavLink to="/admin/contacts" className={linkClass}>
          Contact messages
        </NavLink>
        <NavLink to="/admin/analytics" className={linkClass}>
          Analytics
        </NavLink>
        <NavLink to="/admin/profile" className={linkClass}>
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
