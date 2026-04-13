import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IMG } from '../lib/assets.js';
import { Logo } from '../components/Logo.jsx';
import { BackButton } from '../components/BackButton.jsx';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const u = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (u.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (u.role === 'chef') navigate('/chef/dashboard', { replace: true });
      else navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${IMG.bgFood})` }} />
      <div className="yy-overlay" />
      <div className="yy-auth-wrap">
        <div className="yy-auth-card yy-glass">
          <div
            className="yy-auth-visual"
            style={{ backgroundImage: `url(${IMG.authPizza})` }}
            role="presentation"
          >
            <div className="yy-auth-back-wrap">
              <BackButton to="/" />
            </div>
          </div>
          <div className="yy-auth-form">
            <p style={{ margin: 0, color: 'var(--yy-muted)', fontSize: '0.95rem' }}>Login to</p>
            <div className="yy-auth-logo-row">
              <Logo auth />
            </div>
            <h1 style={{ textAlign: 'center', margin: '0 0 0.75rem' }}>Welcome back</h1>
            <form onSubmit={onSubmit} className="yy-auth-form-fields">
              <label className="yy-input">
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </label>
              <label className="yy-input">
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </label>
              {error ? <p className="yy-err">{error}</p> : null}
              <button type="submit" className="yy-auth-submit">
                Login
              </button>
            </form>
            <p className="yy-auth-foot">
              Don&apos;t have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
