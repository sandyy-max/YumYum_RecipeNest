import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IMG } from '../lib/assets.js';
import { Logo } from '../components/Logo.jsx';
import { BackButton } from '../components/BackButton.jsx';
import landingHeroBg from '../assets/landing-hero-bg.png';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${landingHeroBg})` }} />
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
              <label className="yy-input yy-password-field">
                Password
                <div className="yy-password-wrap">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    minLength={6}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="yy-password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M12 6c3.8 0 7 2.2 8.7 6-1.7 3.8-4.9 6-8.7 6S5 15.8 3.3 12C5 8.2 8.2 6 12 6Zm0 2c-2.8 0-5.3 1.6-6.7 4 1.4 2.4 3.9 4 6.7 4s5.3-1.6 6.7-4c-1.4-2.4-3.9-4-6.7-4Zm0 1.5A2.5 2.5 0 1 1 12 16a2.5 2.5 0 0 1 0-5Z"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M2.1 3.5 3.5 2.1l18.4 18.4-1.4 1.4-3-3c-1.7.9-3.6 1.4-5.5 1.4-4.6 0-8.6-2.7-10.7-7 1-2 2.5-3.6 4.3-4.8l-3-3Zm9.9 5.1 3.4 3.4a2.5 2.5 0 0 0-3.4-3.4Zm-2.2 2.2a2.5 2.5 0 0 0 3.4 3.4l-3.4-3.4Zm2.2-7.3c4.6 0 8.6 2.7 10.7 7-.9 1.8-2.2 3.3-3.8 4.4l-2-2c1-.7 1.9-1.7 2.6-2.9-1.4-2.4-3.9-4-6.7-4-.8 0-1.6.1-2.3.3l-2-2c1.4-.5 2.9-.8 4.5-.8Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
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
