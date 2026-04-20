import { useEffect, useState } from 'react';
import { http } from '../api/http.js';
import { recipeImage, IMG } from '../lib/assets.js';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton.jsx';
import { PublicHeader } from '../components/PublicHeader.jsx';
import landingHeroBg from '../assets/landing-hero-bg.png';

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
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${landingHeroBg})` }} />
      <div className="yy-overlay" />
      <PublicHeader search={search} onSearchChange={setSearch} />
      <section className="yy-section">
        <div className="yy-container">
          <div className="yy-page">
            <BackButton to="/" />
            <div className="yy-frame yy-staff-frame" style={{ marginTop: 16 }}>
              <div className="yy-page-head">
                <div>
                  <h1 style={{ margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Chefs</h1>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
                    Active chefs and their approved recipes
                  </p>
                </div>
              </div>

              {loading ? <div className="yy-loading">Loading…</div> : null}
              {error ? <p className="yy-err">{error}</p> : null}

              {!loading && !error ? (
                <div className="yy-staff-grid" style={{ marginTop: 16 }}>
                  {chefs.map((c) => (
                    <article key={c._id} className="yy-glass yy-staff-card">
                      <div className="yy-staff-head">
                        <img className="yy-staff-avatar" src={recipeImage(c.avatarUrl)} alt="" />
                        <div className="yy-staff-meta">
                          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{c.name}</h2>
                          <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
                            {c.cuisineSpecialty || 'Specialty not set'}
                          </p>
                          <p style={{ margin: '0.75rem 0 0', color: 'var(--yy-green)' }}>
                            {c.recipesCount || 0} recipes
                          </p>
                        </div>
                      </div>

                      {c.recipes?.length ? (
                        <div className="yy-staff-recipe-grid">
                          {c.recipes.map((r) => (
                            <div key={r._id} className="yy-glass yy-staff-recipe-card">
                              <img className="yy-staff-recipe-img" src={recipeImage(r.imageUrl)} alt="" />
                              <div className="yy-staff-recipe-title">{r.title}</div>
                              <div className="yy-staff-recipe-sub">
                                {r.category?.name || 'Category'} · {r.cookingTimeMinutes} min
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to={`/recipes?chef=${c._id}`} className="yy-btn yy-btn-ghost">
                          View recipes <span className="yy-next-ico" aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                  {!chefs.length ? <p style={{ color: 'var(--yy-muted)' }}>No active chefs found.</p> : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

