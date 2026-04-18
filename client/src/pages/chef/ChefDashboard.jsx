import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../../api/http.js';
import { recipeImage, IMG } from '../../lib/assets.js';

function TrashIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9 3h6m-8 4h10m-9 0 1 14h6l1-14M10 11v7m4-7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChefDashboard() {
  const [stats, setStats] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  async function load() {
    const [s, r] = await Promise.all([http.get('/api/chef/dashboard'), http.get('/api/chef/recipes')]);
    setStats(s.data);
    setRecipes(r.data.recipes || []);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onDelete(recipeId) {
    const ok = window.confirm('Delete this recipe? This cannot be undone.');
    if (!ok) return;
    setError('');
    setBusyId(recipeId);
    try {
      await http.delete(`/api/recipes/${recipeId}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId('');
    }
  }

  const recent = recipes.slice(0, 6);

  return (
    <div className="yy-page">
      <div className="yy-banner" style={{ backgroundImage: `url(${IMG.banner})` }}>
        <h1>Chef studio</h1>
        <p style={{ position: 'relative', zIndex: 1, margin: '0.5rem 0 0', color: 'var(--yy-muted)' }}>
          Track engagement and manage recipes.
        </p>
      </div>
      {error ? <p className="yy-err">{error}</p> : null}
      {stats ? (
        <div className="yy-stat-row">
          {[
            [stats.totalLikes, 'Likes'],
            [stats.followers || 0, 'Followers'],
            [stats.totalRecipes, 'Recipes'],
            [stats.totalViews, 'Views'],
          ].map(([n, l]) => (
            <div key={l} className="yy-stat yy-glass">
              <div className="num">{n}</div>
              <div className="lbl">{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="yy-loading">Loading…</p>
      )}
      <div className="yy-frame" style={{ marginTop: 16, padding: '1.6rem' }}>
        <div className="yy-page-head" style={{ marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Recently added</h2>
            <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
              Manage your latest recipes (edit or delete).
            </p>
          </div>
          <Link to="/chef/recipes/new" className="yy-btn yy-btn-primary">
            Add recipe
          </Link>
        </div>

        <div className="yy-grid-recipes" style={{ marginTop: 8 }}>
        {recent.map((r) => (
          <div key={r._id} className="yy-card-recipe yy-glass" style={{ position: 'relative' }}>
            <div className="yy-card-actions">
              <button
                type="button"
                className="yy-icon-btn yy-icon-btn--danger"
                title="Delete recipe"
                aria-label="Delete recipe"
                onClick={() => onDelete(r._id)}
                disabled={busyId === r._id}
                style={busyId === r._id ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
              >
                <TrashIcon />
              </button>
            </div>
            <img src={recipeImage(r.imageUrl)} alt="" />
            <h3>{r.title}</h3>
            <div className="meta">
              {r.category?.name} · {r.cookingTimeMinutes} mins · <em>{r.status}</em>
            </div>
            <Link to={`/chef/recipes/${r._id}/edit`} className="yy-btn yy-btn-ghost">
              Edit recipe
            </Link>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
