import { useEffect, useState } from 'react';
import { http } from '../../api/http.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await http.get('/api/admin/users');
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(u, status) {
    try {
      await http.patch(`/api/admin/users/${u._id}/status`, { accountStatus: status });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <BackButton to="/admin/dashboard" label="Back to dashboard" />
      <h1 style={{ marginTop: 12 }}>Manage users</h1>
      {error ? <p className="yy-err">{error}</p> : null}
      <div className="yy-table-wrap yy-glass">
        <table className="yy-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Viewed</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.accountStatus}</td>
                <td>{u.recipesViewedCount}</td>
                <td>
                  {u.role !== 'admin' ? (
                    <>
                      <button type="button" className="yy-btn yy-btn-ghost" onClick={() => toggleStatus(u, 'suspended')}>
                        Suspend
                      </button>{' '}
                      <button type="button" className="yy-btn yy-btn-primary" onClick={() => toggleStatus(u, 'active')}>
                        Activate
                      </button>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
