import { useEffect, useState } from 'react';
import { http } from '../../api/http.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminChefs() {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await http.get('/api/admin/chefs');
      setChefs(data.chefs || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function patchChef(c, body) {
    try {
      await http.patch(`/api/admin/chefs/${c._id}`, body);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <BackButton to="/admin/dashboard" label="Back to dashboard" />
      <h1 style={{ marginTop: 12 }}>Manage chefs</h1>
      {error ? <p className="yy-err">{error}</p> : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
          gap: 16,
        }}
      >
        {chefs.map((c) => (
          <div key={c._id} className="yy-glass" style={{ padding: '1rem' }}>
            <strong>{c.name}</strong>
            <div style={{ fontSize: '0.85rem', color: 'var(--yy-muted)' }}>{c.email}</div>
            <div style={{ marginTop: 8 }}>
              ★ {c.rating} · {c.totalRecipes} recipes
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="yy-btn yy-btn-danger" onClick={() => patchChef(c, { accountStatus: 'suspended' })}>
                Suspend
              </button>
              <button type="button" className="yy-btn yy-btn-primary" onClick={() => patchChef(c, { accountStatus: 'active' })}>
                Activate
              </button>
            </div>
            <span className="yy-pill" style={{ marginTop: 8, display: 'inline-block' }}>
              {c.accountStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
