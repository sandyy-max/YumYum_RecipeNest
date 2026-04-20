import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { http } from '../api/http.js';
import { recipeImage, IMG } from '../lib/assets.js';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { BackButton } from '../components/BackButton.jsx';
import landingHeroBg from '../assets/landing-hero-bg.png';

export function Recipes({ showHeader = true, backTo = '/home' }) {
  const [params] = useSearchParams();
  const initial = params.get('q') || '';
  const category = params.get('category') || '';
  const chef = params.get('chef') || '';
  const [search, setSearch] = useState(initial);
  const [data, setData] = useState({ recipes: [], loading: true });

  useEffect(() => {
    setSearch(initial);
  }, [initial]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: body } = await http.get('/api/recipes', {
          params: {
            search,
            ...(category ? { category } : {}),
            ...(chef ? { chef } : {}),
          },
        });
        if (!cancelled) setData({ recipes: body.recipes, loading: false });
      } catch {
        if (!cancelled) setData({ recipes: [], loading: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search, category, chef]);

  return (
    <>
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${landingHeroBg})` }} />
      <div className="yy-overlay" />
      {showHeader ? <PublicHeader search={search} onSearchChange={setSearch} /> : null}
      <section className="yy-section">
        <div className="yy-container">
          <div className="yy-page">
            <BackButton to={showHeader ? '/' : backTo} label="Back" />
            <div className="yy-frame" style={{ marginTop: 16 }}>
              <div className="yy-page-head">
                <div>
                  <h1 style={{ margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recipes</h1>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
                    {chef ? 'Browsing recipes by a chef' : 'Search and browse approved recipes'}
                  </p>
                </div>
              </div>

              {data.loading ? (
                <div className="yy-loading">Loading…</div>
              ) : (
                <div className="yy-grid-recipes">
                  {data.recipes.map((r) => (
                    <div key={r._id} className="yy-card-recipe yy-glass">
                      <img src={recipeImage(r.imageUrl)} alt="" />
                      <h3>{r.title}</h3>
                      <div className="meta">
                        {r.category?.name} · {r.cookingTimeMinutes} mins · ★ {r.averageRating || 0} · Chef{' '}
                        {r.chef?.name || '-'}
                      </div>
                      <Link
                        to={showHeader ? `/recipes/${r._id}` : `/home/recipes/${r._id}`}
                        className="yy-btn yy-btn-primary"
                      >
                        View full recipe <span className="yy-next-ico" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {!data.loading && !data.recipes.length ? (
                <p style={{ color: 'var(--yy-muted)' }}>No recipes yet — add & approve as chef/admin.</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
