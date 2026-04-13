import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http.js';
import { recipeImage } from '../lib/assets.js';

export function Saved() {
  const [tab, setTab] = useState('favorite');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await http.get('/api/users/me/saved', { params: { kind: tab } });
        if (!cancelled) setRecipes(data.recipes || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  async function remove(recipeId) {
    try {
      await http.delete(`/api/users/me/saved/${recipeId}`, { params: { kind: tab } });
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Saved</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          className={`yy-btn ${tab === 'favorite' ? 'yy-btn-primary' : 'yy-btn-ghost'}`}
          onClick={() => setTab('favorite')}
        >
          Favorites
        </button>
        <button
          type="button"
          className={`yy-btn ${tab === 'cook_later' ? 'yy-btn-primary' : 'yy-btn-ghost'}`}
          onClick={() => setTab('cook_later')}
        >
          Cook later
        </button>
      </div>
      {error ? <p className="yy-err">{error}</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recipes.map((r) => (
          <div
            key={r._id}
            className="yy-glass"
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gap: 16,
              alignItems: 'center',
              padding: '0.75rem 1rem',
            }}
          >
            <img
              src={recipeImage(r.imageUrl)}
              alt=""
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <Link to={`/recipes/${r._id}`} style={{ fontWeight: 700, color: 'var(--yy-text)' }}>
                {r.title}
              </Link>
              <div style={{ fontSize: '0.85rem', color: 'var(--yy-muted)' }}>
                {r.cookingTimeMinutes} mins · ★ {r.averageRating || 0} · {r.category?.name}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to={`/recipes/${r._id}`} className="yy-btn yy-btn-primary">
                View
              </Link>
              <button type="button" className="yy-btn yy-btn-danger" onClick={() => remove(r._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {!recipes.length ? <p style={{ color: 'var(--yy-muted)' }}>Nothing here yet.</p> : null}
    </div>
  );
}
