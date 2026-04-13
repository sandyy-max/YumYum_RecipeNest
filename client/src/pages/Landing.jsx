import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { ContactForm } from '../components/ContactForm.jsx';
import { http } from '../api/http.js';
import { IMG, recipeImage } from '../lib/assets.js';
import { Logo } from '../components/Logo.jsx';

export function Landing() {
  const [q, setQ] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [r, c] = await Promise.all([
          http.get('/api/recipes', { params: { limit: 9 } }),
          http.get('/api/chefs'),
        ]);
        if (cancelled) return;
        const approvedWithPics = (r.data.recipes || []).filter(
          (x) => x.imageUrl && String(x.imageUrl).length > 1
        );
        setRecipes(approvedWithPics);
        setChefs(c.data.chefs || []);
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

      <section className="yy-section yy-anchor-section" id="stats" style={{ background: `url(${IMG.wood}) center/cover fixed` }}>
        <div className="yy-glass" style={{ padding: '2rem 1rem' }}>
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

      <section className="yy-section yy-anchor-section" id="chefs">
        <h2 className="yy-section-title">Chefs</h2>
        <p className="yy-section-sub">Active chefs and their approved recipes</p>
        <div className="yy-staff-grid">
          {loading ? <div className="yy-loading">Loading…</div> : null}
          {!loading && chefs.length
            ? chefs.map((c) => (
                <article key={c._id} className="yy-glass yy-staff-card">
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

      <section className="yy-section">
        <h2 className="yy-section-title">Explore categories</h2>
        <p className="yy-section-sub">Browse by cuisine type</p>
        <div className="yy-grid-recipes" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {[
            ['Breakfast', IMG.catBreakfast, '50+'],
            ['Dessert', IMG.catDessert, '40+'],
            ['Appetizer', IMG.catApp, '60+'],
            ['Main course', IMG.catMain, '120+'],
          ].map(([name, src, count]) => (
            <Link
              key={name}
              to="/recipes"
              className="yy-glass"
              style={{
                position: 'relative',
                minHeight: 200,
                borderRadius: 16,
                overflow: 'hidden',
                display: 'block',
                backgroundImage: `linear-gradient(180deg,transparent 40%,rgba(0,0,0,.85)),url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <strong style={{ fontSize: '1.25rem' }}>{name}</strong>
                <div style={{ color: 'var(--yy-muted)', fontSize: '0.85rem' }}>{count} recipes</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="yy-section yy-anchor-section" id="about">
        <div className="yy-glass" style={{ padding: '2rem', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h2 className="yy-section-title" style={{ marginBottom: '0.75rem' }}>
            About YumYum
          </h2>
          <p style={{ color: 'var(--yy-muted)', margin: '0 auto 1.25rem', maxWidth: 720 }}>
            YumYum is a community-driven recipe platform where chefs publish, users discover, and everyone learns to cook with confidence.
          </p>
          <div className="yy-grid-recipes" style={{ marginTop: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
            {[
              ['Curated quality', 'Better recipes through moderation and approvals.'],
              ['Community supported', 'Save favorites and keep track of what you love.'],
              ['Chef-first workflow', 'Chefs manage their recipes with a clear status pipeline.'],
            ].map(([t, d]) => (
              <article key={t} className="yy-card-recipe yy-glass" style={{ textAlign: 'left' }}>
                <h3 style={{ marginTop: 0 }}>{t}</h3>
                <p className="meta" style={{ marginBottom: 0, fontSize: '0.9rem' }}>
                  {d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="yy-section yy-anchor-section" id="recipes">
        <h2 className="yy-section-title">Recipes</h2>
        <p className="yy-section-sub">Approved recipes with pictures</p>
        <div className="yy-grid-recipes">
          {loading ? <div className="yy-loading">Loading…</div> : null}
          {!loading && recipes.length
            ? recipes.map((r) => (
                <div key={r._id} className="yy-card-recipe yy-glass">
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

      <section className="yy-section yy-anchor-section" id="contact">
        <div className="yy-glass" style={{ padding: '2rem', maxWidth: 980, margin: '0 auto' }}>
          <h2 className="yy-section-title" style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
            Contact admin
          </h2>
          <p className="yy-section-sub" style={{ textAlign: 'left', marginTop: -8 }}>
            Send your name, email, and message. Admin can review your submission.
          </p>
          <div style={{ marginTop: 18 }}>
            <ContactForm />
          </div>
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
            <Link to="/#about">About</Link>
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
