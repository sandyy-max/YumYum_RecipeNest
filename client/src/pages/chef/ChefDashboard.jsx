import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../../api/http.js';
import { recipeImage, IMG } from '../../lib/assets.js';

export function ChefDashboard() {
  const [stats, setStats] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, r] = await Promise.all([
          http.get('/api/chef/dashboard'),
          http.get('/api/chef/recipes'),
        ]);
        if (!cancelled) {
          setStats(s.data);
          setRecipes(r.data.recipes || []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recent = recipes.slice(0, 6);

  return (
    <div>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ margin: 0, color: 'var(--yy-muted)' }}>Recently added</h2>
        <Link to="/chef/recipes/new" className="yy-btn yy-btn-primary">
          Add recipe
        </Link>
      </div>
      <div className="yy-grid-recipes" style={{ marginTop: 16 }}>
        {recent.map((r) => (
          <div key={r._id} className="yy-card-recipe yy-glass">
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
  );
}
