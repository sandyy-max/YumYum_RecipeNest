import { useState } from 'react';
import { http } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { BackButton } from '../components/BackButton.jsx';

export function Profile() {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function saveProfile(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      await http.put('/api/users/me', { name, email });
      await refreshMe();
      setMsg('Profile updated');
    } catch (e) {
      setErr(e.message);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      await http.put('/api/users/me/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setMsg('Password updated');
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ marginTop: 0 }}>Profile</h1>
      {msg ? <p style={{ color: 'var(--yy-green)' }}>{msg}</p> : null}
      {err ? <p className="yy-err">{err}</p> : null}
      <div className="yy-glass" style={{ padding: '1.25rem', marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Personal</h2>
        <form onSubmit={saveProfile} style={{ display: 'grid', gap: 12 }}>
          <label className="yy-input">
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="yy-input">
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <button type="submit" className="yy-btn yy-btn-primary">
            Save changes
          </button>
        </form>
      </div>
      <div className="yy-glass" style={{ padding: '1.25rem' }}>
        <h2 style={{ marginTop: 0 }}>Password</h2>
        <form onSubmit={savePassword} style={{ display: 'grid', gap: 12 }}>
          <label className="yy-input">
            Current
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
            />
          </label>
          <label className="yy-input">
            New
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
          </label>
          <button type="submit" className="yy-btn yy-btn-primary">
            Update password
          </button>
        </form>
      </div>
      <p style={{ marginTop: 16 }}>
        <BackButton to="/home" label="Back to dashboard" />
      </p>
    </div>
  );
}
