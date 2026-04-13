import { useEffect, useState } from 'react';
import { http } from '../../api/http.js';
import { recipeImage } from '../../lib/assets.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminPending() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div>
      <BackButton to="/admin/dashboard" label="Back to dashboard" />
      <h1 style={{ marginTop: 12 }}>Recipe approvals</h1>
      {error ? <p className="yy-err">{error}</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recipes.map((r) => (
          <div
            key={r._id}
            className="yy-glass"
            style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 16, padding: '0.75rem 1rem', alignItems: 'center' }}
          >
            <img src={recipeImage(r.imageUrl)} alt="" style={{ width: 88, height: 88, borderRadius: 12, objectFit: 'cover' }} />
            <div>
              <strong>{r.title}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--yy-muted)' }}>Chef: {r.chef?.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="yy-btn yy-btn-primary" onClick={() => setStatus(r._id, 'approved')}>
                Approve
              </button>
              <button type="button" className="yy-btn yy-btn-danger" onClick={() => setStatus(r._id, 'rejected')}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      {!recipes.length ? <p style={{ color: 'var(--yy-muted)' }}>No pending recipes.</p> : null}
    </div>
  );
}
