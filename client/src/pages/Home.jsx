import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { recipeImage, IMG } from '../lib/assets.js';

export function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [d, r] = await Promise.all([
          http.get('/api/users/me/dashboard'),
          http.get('/api/users/me/recent'),
        ]);
        if (!cancelled) {
          setStats(d.data);
          setRecent(r.data.recipes || []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div
        className="yy-banner"
        style={{ backgroundImage: `url(${IMG.banner})` }}
      >
        <h1>Welcome back, {user?.name}</h1>
        <p style={{ position: 'relative', zIndex: 1, margin: '0.5rem 0 0', color: 'var(--yy-muted)' }}>
          Explore favorites and cook-later picks.
        </p>
      </div>
      {error ? <p className="yy-err">{error}</p> : null}
      {stats ? (
        <div className="yy-stat-row">
          {[
            [stats.favorites, 'Favorites'],
            [stats.cookLater, 'Cook later'],
            [stats.recipesViewed, 'Viewed'],
            [stats.reviewsGiven, 'Reviews'],
          ].map(([n, l]) => (
            <div key={l} className="yy-stat yy-glass">
              <div className="num">{n}</div>
              <div className="lbl">{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="yy-muted">Loading…</p>
      )}
      <h2 style={{ fontSize: '1.1rem', color: 'var(--yy-muted)', marginBottom: 12 }}>Recently viewed</h2>
      <div className="yy-grid-recipes">
        {recent.map((rec) => (
          <div key={rec._id} className="yy-card-recipe yy-glass">
            <img src={recipeImage(rec.imageUrl)} alt="" />
            <h3>{rec.title}</h3>
            <div className="meta">
              {rec.category?.name} · {rec.cookingTimeMinutes} mins
            </div>
            <Link to={`/home/recipes/${rec._id}`} className="yy-btn yy-btn-primary">
              View full recipe
            </Link>
          </div>
        ))}
        {!recent.length ? (
          <p style={{ color: 'var(--yy-muted)' }}>Open recipes to build this list.</p>
        ) : null}
      </div>
    </div>
  );
}
