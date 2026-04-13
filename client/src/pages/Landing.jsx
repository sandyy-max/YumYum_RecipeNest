import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { http } from '../api/http.js';
import { IMG, recipeImage } from '../lib/assets.js';
import { Logo } from '../components/Logo.jsx';

function pickCategoryImage(cat) {
  const key = `${cat?.slug || ''} ${cat?.name || ''}`.toLowerCase();
  if (key.includes('breakfast')) return IMG.catBreakfast;
  if (key.includes('dessert')) return IMG.catDessert;
  if (key.includes('appetizer') || key.includes('starter')) return IMG.catApp;
  if (key.includes('main')) return IMG.catMain;
  return IMG.recipeFallback;
}

export function Landing() {
  const [q, setQ] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [r, c, cat] = await Promise.all([
          http.get('/api/recipes', { params: { limit: 9 } }),
          http.get('/api/chefs'),
          http.get('/api/categories'),
        ]);
        if (cancelled) return;
        const approvedWithPics = (r.data.recipes || []).filter(
          (x) => x.imageUrl && String(x.imageUrl).length > 1
        );
        setRecipes(approvedWithPics);
        setChefs(c.data.chefs || []);
        const counts = new Map();
        for (const recipe of r.data.recipes || []) {
          const id = String(recipe.category?._id || '');
          if (!id) continue;
          counts.set(id, (counts.get(id) || 0) + 1);
        }
        const withCounts = (cat.data.categories || []).map((x) => ({
          ...x,
          count: counts.get(String(x._id)) || 0,
          image: pickCategoryImage(x),
        }));
        setCategories(withCounts);
      } catch (e) {
        if (!cancelled) setCategories([]);
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
      <PublicHeader search={q} onSearchChange={setQ} />

      <section className="yy-hero yy-anchor-section" id="home">
        <div>
          <div className="yy-badge">Trending now - 500+ recipes</div>
          <h1 className="yy-h1">YumYum</h1>
          <p className="yy-tagline">Where Every Recipe Finds a Home.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/register" className="yy-btn yy-btn-ghost">
              Sign Up
            </Link>
            <Link to="/login" className="yy-btn yy-btn-primary">
              Login
            </Link>
            <Link to="/recipes" className="yy-btn yy-btn-ghost">
              Explore recipes
            </Link>
          </div>
        </div>
        <img className="yy-hero-img" src={IMG.heroSalad} alt="" />
      </section>

      <section className="yy-section yy-anchor-section yy-landing-animate" id="stats" style={{ background: `url(${IMG.wood}) center/cover fixed` }}>
        <div className="yy-glass yy-hover-lift" style={{ padding: '2rem 1rem' }}>
          <h2 className="yy-section-title">Stats</h2>
          <p className="yy-section-sub">Community at a glance</p>
          <div className="yy-stat-row">
            {[
              ['500+', 'Recipes'],
              ['3500+', 'Happy users'],
              ['35k+', '5-star reviews'],
              ['130+', 'Active chefs'],
            ].map(([n, l]) => (
              <div key={l} className="yy-stat yy-glass" style={{ textAlign: 'center' }}>
                <div className="num">{n}</div>
                <div className="lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="yy-section yy-anchor-section yy-landing-animate" id="recipes">
        <h2 className="yy-section-title">Recipes</h2>
        <p className="yy-section-sub">Approved recipes with pictures</p>
        <div className="yy-grid-recipes">
          {loading ? <div className="yy-loading">Loading…</div> : null}
          {!loading && recipes.length
            ? recipes.map((r) => (
                <div key={r._id} className="yy-card-recipe yy-glass yy-hover-lift">
                  <img src={recipeImage(r.imageUrl)} alt="" />
                  <h3>{r.title}</h3>
                  <div className="meta">
                    {r.category?.name || 'Category'} · {r.cookingTimeMinutes} mins
                  </div>
                  <Link to={`/recipes/${r._id}`} className="yy-btn yy-btn-primary">
                    View recipe
                  </Link>
                </div>
              ))
            : null}
          {!loading && !recipes.length ? <p style={{ color: 'var(--yy-muted)' }}>No recipes yet.</p> : null}
        </div>
      </section>

      <section className="yy-section yy-anchor-section yy-landing-animate" id="chefs">
        <h2 className="yy-section-title">Chefs</h2>
        <p className="yy-section-sub">Active chefs and their approved recipes</p>
        <div className="yy-staff-grid">
          {loading ? <div className="yy-loading">Loading…</div> : null}
          {!loading && chefs.length
            ? chefs.map((c) => (
                <article key={c._id} className="yy-glass yy-staff-card yy-hover-lift">
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16, alignItems: 'start' }}>
                    <img
                      src={recipeImage(c.avatarUrl)}
                      alt=""
                      style={{ width: 84, height: 84, borderRadius: 18, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div>
                      <h3 style={{ margin: 0 }}>{c.name}</h3>
                      <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>{c.cuisineSpecialty || 'Specialty not set'}</p>
                      <p style={{ margin: '0.75rem 0 0', color: 'var(--yy-green)' }}>{c.recipesCount || 0} recipes</p>
                    </div>
                  </div>
                </article>
              ))
            : null}
          {!loading && !chefs.length ? <p style={{ color: 'var(--yy-muted)' }}>No active chefs found.</p> : null}
        </div>
        <div style={{ marginTop: 14 }}>
          <Link to="/staff" className="yy-btn yy-btn-ghost">
            View all chefs
          </Link>
        </div>
      </section>

      <section className="yy-section yy-anchor-section yy-landing-animate" id="categories">
        <h2 className="yy-section-title">Categories</h2>
        <p className="yy-section-sub">Connected to chef recipe category selection</p>
        <div className="yy-grid-recipes" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/recipes?category=${cat._id}`}
              className="yy-glass yy-hover-lift"
              style={{
                position: 'relative',
                minHeight: 200,
                borderRadius: 16,
                overflow: 'hidden',
                display: 'block',
                backgroundImage: `linear-gradient(180deg,transparent 40%,rgba(0,0,0,.85)),url(${cat.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <strong style={{ fontSize: '1.25rem' }}>{cat.name}</strong>
                <div style={{ color: 'var(--yy-muted)', fontSize: '0.85rem' }}>{cat.count} recipes</div>
              </div>
            </Link>
          ))}
          {!loading && !categories.length ? <p style={{ color: 'var(--yy-muted)' }}>No categories yet.</p> : null}
        </div>
      </section>

      <footer className="yy-footer">
        <div className="yy-footer-grid">
          <div>
            <strong><Logo /></strong>
            Jawalakhel, Lalitpur
            <br />
            +977 9800000000
            <br />
            hello@yumyum.local
          </div>
          <div>
            <strong>Links</strong>
            <Link to="/about">About</Link>
            <br />
            <Link to="/contact">Contact</Link>
            <br />
            <Link to="/recipes">Recipes</Link>
          </div>
          <div>
            <strong>Connect</strong>
            Support · Events · News
          </div>
          <div>
            <strong>Follow</strong>
            FB · IG · X · YouTube
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.8rem', color: 'var(--yy-muted)' }}>
          © {new Date().getFullYear()} YumYum · Privacy · Terms
        </p>
      </footer>
    </>
  );
}
