import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IMG } from '../lib/assets.js';
import { Logo } from '../components/Logo.jsx';
import { BackButton } from '../components/BackButton.jsx';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const u = await register({ name, email, password, role });
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
            <p style={{ margin: 0, color: 'var(--yy-muted)', fontSize: '0.95rem' }}>Sign up to</p>
            <div className="yy-auth-logo-row">
              <Logo auth />
            </div>
            <h1 style={{ textAlign: 'center', margin: '0 0 0.75rem' }}>Create account</h1>
            <form onSubmit={onSubmit} className="yy-auth-form-fields">
              <label className="yy-input">
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
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
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="chef">Chef</option>
                </select>
              </label>
              <label className="yy-input">
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  minLength={6}
                  placeholder="Enter your password"
                  required
                />
              </label>
              {error ? <p className="yy-err">{error}</p> : null}
              <button type="submit" className="yy-auth-submit">
                Sign up
              </button>
            </form>
            <p className="yy-auth-foot">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
