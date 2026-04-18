import { useEffect, useState } from 'react';
import { http } from '../../api/http.js';
import { recipeImage } from '../../lib/assets.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminPending() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  async function load() {
    try {
      const { data } = await http.get('/api/admin/recipes/pending');
      setRecipes(data.recipes || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(recipeId, status) {
    try {
      await http.patch(`/api/admin/recipes/${recipeId}/status`, {
        status,
        rejectionReason: status === 'rejected' ? 'Does not meet guidelines' : '',
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const filtered = recipes.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title?.toLowerCase().includes(q) ||
      r.chef?.name?.toLowerCase().includes(q) ||
      r.category?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="yy-page">
      <BackButton to="/admin/dashboard" label="Back to dashboard" />
      <h1 style={{ marginTop: 12 }}>Recipe approvals</h1>
      <p style={{ marginTop: -4, color: 'var(--yy-muted)' }}>Review and approve recipes submitted by chefs</p>
      <div className="yy-stat-row">
        <div className="yy-stat yy-glass"><div className="num" style={{ color: '#ffd76e' }}>{recipes.length}</div><div className="lbl">Pending</div></div>
        <div className="yy-stat yy-glass"><div className="num">{0}</div><div className="lbl">Approved</div></div>
        <div className="yy-stat yy-glass"><div className="num" style={{ color: 'var(--yy-danger)' }}>{0}</div><div className="lbl">Rejected</div></div>
      </div>
      <input
        className="yy-admin-search"
        placeholder="Search recipes by title, chef, or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error ? <p className="yy-err">{error}</p> : null}
      <div className="yy-admin-cards">
        {filtered.map((r) => (
          <div
            key={r._id}
            className="yy-glass"
            style={{ overflow: 'hidden' }}
          >
            <img src={recipeImage(r.imageUrl)} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            <div style={{ padding: '0.9rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>{r.title}</strong>
              <p style={{ margin: '0.35rem 0', color: 'var(--yy-muted)', minHeight: 42 }}>
                {r.description || 'No description provided.'}
              </p>
              <div style={{ fontSize: '0.86rem', color: 'var(--yy-muted)' }}>
                Chef {r.chef?.name} · {r.category?.name} · {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, padding: '0 0.9rem 0.9rem' }}>
              <button type="button" className="yy-btn yy-btn-ghost">Review</button>
              <button type="button" className="yy-btn yy-btn-primary" onClick={() => setStatus(r._id, 'approved')}>
                ✓
              </button>
              <button type="button" className="yy-btn yy-btn-danger" onClick={() => setStatus(r._id, 'rejected')}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      {!filtered.length ? <p style={{ color: 'var(--yy-muted)' }}>No pending recipes.</p> : null}
    </div>
  );
}
