import { useEffect, useState } from 'react';
import { http } from '../../api/http.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminChefs() {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

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

  const filtered = chefs.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.cuisineSpecialty?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="yy-page">
      <BackButton to="/admin/dashboard" label="Back to dashboard" />
      <h1 style={{ marginTop: 12 }}>Manage chefs</h1>
      <p style={{ marginTop: -4, color: 'var(--yy-muted)' }}>View and manage all registered chefs</p>
      <input
        className="yy-admin-search"
        placeholder="Search chefs by name, email, or specialty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error ? <p className="yy-err">{error}</p> : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
          gap: 16,
        }}
      >
        {filtered.map((c) => (
          <div key={c._id} className="yy-glass" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <strong>{c.name}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--yy-muted)' }}>{c.cuisineSpecialty || 'Cuisine not set'}</div>
              </div>
              <span className="yy-pill">{c.accountStatus}</span>
            </div>
            <div style={{ marginTop: 8, color: '#ffd76e' }}>★ {c.rating || 0} rating</div>
            <div className="yy-two-col" style={{ marginTop: 10 }}>
              <div className="yy-glass" style={{ padding: '0.65rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{c.totalRecipes}</div>
                <div style={{ color: 'var(--yy-muted)', fontSize: '0.8rem' }}>Recipes</div>
              </div>
              <div className="yy-glass" style={{ padding: '0.65rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                <div style={{ color: 'var(--yy-muted)', fontSize: '0.8rem' }}>Joined</div>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--yy-muted)', marginTop: 10 }}>{c.email}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="yy-btn yy-btn-danger" onClick={() => patchChef(c, { accountStatus: 'suspended' })}>
                Suspend
              </button>
              <button type="button" className="yy-btn yy-btn-primary" onClick={() => patchChef(c, { accountStatus: 'active' })}>
                Activate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
