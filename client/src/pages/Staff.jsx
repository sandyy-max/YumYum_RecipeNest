import { useEffect, useState } from 'react';
import { http } from '../api/http.js';
import { recipeImage, IMG } from '../lib/assets.js';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton.jsx';
import { PublicHeader } from '../components/PublicHeader.jsx';

export function Staff() {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await http.get('/api/chefs');
        if (!cancelled) setChefs(data.chefs || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${IMG.bgFood})` }} />
      <div className="yy-overlay" />
      <PublicHeader search={search} onSearchChange={setSearch} />
      <section className="yy-section">
        <BackButton to="/" />
        <h1 className="yy-section-title" style={{ textAlign: 'left' }}>
          Chefs
        </h1>
        <p className="yy-section-sub" style={{ textAlign: 'left' }}>
          Active chefs and their approved recipes
        </p>

        {loading ? <div className="yy-loading">Loading…</div> : null}
        {error ? <p className="yy-err">{error}</p> : null}

        {!loading && !error ? (
          <div className="yy-staff-grid" style={{ marginTop: 16 }}>
            {chefs.map((c) => (
              <article key={c._id} className="yy-glass yy-staff-card">
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16, alignItems: 'start' }}>
                  <img
                    src={recipeImage(c.avatarUrl)}
                    alt=""
                    style={{ width: 84, height: 84, borderRadius: 18, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{c.name}</h2>
                    <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>{c.cuisineSpecialty || 'Specialty not set'}</p>
                    <p style={{ margin: '0.75rem 0 0', color: 'var(--yy-green)' }}>{c.recipesCount || 0} recipes</p>
                  </div>
                </div>

                {c.recipes?.length ? (
                  <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                    {c.recipes.map((r) => (
                      <div key={r._id} className="yy-glass" style={{ padding: 12 }}>
                        <img
                          src={recipeImage(r.imageUrl)}
                          alt=""
                          style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                        <div style={{ marginTop: 10, fontWeight: 650, color: 'var(--yy-text)' }}>{r.title}</div>
                        <div style={{ marginTop: 6, color: 'var(--yy-muted)', fontSize: '0.85rem' }}>
                          {r.category?.name || 'Category'} · {r.cookingTimeMinutes} min
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to="/recipes" className="yy-btn yy-btn-ghost">
                    View recipes
                  </Link>
                </div>
              </article>
            ))}
            {!chefs.length ? <p style={{ color: 'var(--yy-muted)' }}>No active chefs found.</p> : null}
          </div>
        ) : null}
      </section>
    </>
  );
}

