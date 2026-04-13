import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './Logo.jsx';

export function PublicHeader({ search, onSearchChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const homeHref = user ? '/home' : '/';
  const navClass = ({ isActive }) => (isActive ? 'yy-nav-active' : '');

  return (
    <header className="yy-glass yy-nav">
      <Logo />
      <nav className="yy-nav-links">
        <NavLink to={homeHref} end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/recipes" className={navClass}>
          Recipes
        </NavLink>
        <NavLink to="/staff" className={navClass}>
          Chefs
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={navClass}>
          Contact
        </NavLink>
      </nav>
      <div className="yy-search-pill">
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate(`/recipes?q=${encodeURIComponent(search || '')}`);
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {user ? (
          <>
            <Link to="/redirect" className="yy-btn yy-btn-primary">
              Dashboard
            </Link>
            <button type="button" className="yy-btn yy-btn-ghost" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="yy-btn yy-btn-ghost">
              Sign Up
            </Link>
            <Link to="/login" className="yy-btn yy-btn-primary">
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
