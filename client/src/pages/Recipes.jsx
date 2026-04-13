import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { http } from '../api/http.js';
import { recipeImage, IMG } from '../lib/assets.js';
import { PublicHeader } from '../components/PublicHeader.jsx';

export function Recipes() {
  const [params] = useSearchParams();
  const initial = params.get('q') || '';
  const [search, setSearch] = useState(initial);
  const [data, setData] = useState({ recipes: [], loading: true });

  useEffect(() => {
    setSearch(initial);
  }, [initial]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: body } = await http.get('/api/recipes', { params: { search } });
        if (!cancelled) setData({ recipes: body.recipes, loading: false });
      } catch {
        if (!cancelled) setData({ recipes: [], loading: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search]);

  return (
    <>
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${IMG.bgFood})` }} />
      <div className="yy-overlay" />
      <PublicHeader search={search} onSearchChange={setSearch} />
      <section className="yy-section">
        <h1 className="yy-section-title" style={{ textAlign: 'left' }}>
          Recipes
        </h1>
        <p className="yy-section-sub" style={{ textAlign: 'left' }}>
          Search and browse approved recipes
        </p>
        {data.loading ? (
          <div className="yy-loading">Loading…</div>
        ) : (
          <div className="yy-grid-recipes">
            {data.recipes.map((r) => (
              <div key={r._id} className="yy-card-recipe yy-glass">
                <img src={recipeImage(r.imageUrl)} alt="" />
                <h3>{r.title}</h3>
                <div className="meta">
                  {r.category?.name} · {r.cookingTimeMinutes} mins · ★ {r.averageRating || 0}
                </div>
                <Link to={`/recipes/${r._id}`} className="yy-btn yy-btn-primary">
                  View full recipe
                </Link>
              </div>
            ))}
          </div>
        )}
        {!data.loading && !data.recipes.length ? (
          <p style={{ color: 'var(--yy-muted)' }}>No recipes yet — add & approve as chef/admin.</p>
        ) : null}
      </section>
    </>
  );
}
