import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { http } from '../api/http.js';
import { IMG, recipeImage } from '../lib/assets.js';
import { Logo } from '../components/Logo.jsx';
import landingHeroBg from '../assets/landing-hero-bg.png';
import heroImg from '../assets/hero_img.png';

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

  const featured = recipes.slice(0, 3);

  return (
    <>
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${landingHeroBg})` }} />
      <div className="yy-overlay" />
      <PublicHeader search={q} onSearchChange={setQ} />

      <section className="yy-section yy-section--tight yy-anchor-section" id="home">
        <div className="yy-container">
          <div className="yy-hero yy-hero-grid yy-hero-direct">
            <div className="yy-hero-copy">
              <div className="yy-badge">Trending now · 500+ recipes</div>
              <h1 className="yy-h1 yy-hero-title yy-hero-anim yy-hero-anim--1">YumYum</h1>
              <p className="yy-tagline yy-hero-anim yy-hero-anim--2">Where every recipe finds a home.</p>
              <div className="yy-hero-actions yy-hero-anim yy-hero-anim--3">
                <Link to="/register" className="yy-btn yy-btn-ghost">
                  Sign Up
                </Link>
                <Link to="/login" className="yy-btn yy-btn-primary">
                  Login
                </Link>
              </div>
            </div>
            <div className="yy-hero-media yy-hero-anim yy-hero-anim--2">
              <img className="yy-hero-img yy-hero-img-float yy-hero-img-serve" src={heroImg} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="yy-section yy-section--muted yy-anchor-section yy-landing-animate" id="recipes">
        <div className="yy-container">
          <h2 className="yy-section-title">Recipes</h2>
          <p className="yy-section-sub">Handpicked by our community of food lovers</p>
          <div className="yy-grid-recipes yy-grid-recipes--3">
            {loading ? <div className="yy-loading">Loading...</div> : null}
            {!loading && featured.length
              ? featured.map((r) => (
                  <div key={r._id} className="yy-card-recipe yy-surface yy-hover-lift" style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
                    <img src={recipeImage(r.imageUrl)} alt="" />
                    <h3>{r.title}</h3>
                    <div className="meta">
                      {r.category?.name || 'Category'} · {r.cookingTimeMinutes} mins · Chef {r.chef?.name || '-'}
                    </div>
                    <Link to={`/recipes/${r._id}`} className="yy-btn yy-btn-ghost">
                      View Full Recipe <span className="yy-next-ico" aria-hidden="true">→</span>
                    </Link>
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>

      <section className="yy-section yy-anchor-section yy-landing-animate" id="stats">
        <div className="yy-container">
          <div className="yy-surface yy-hover-lift" style={{ padding: '2rem 1rem' }}>
            <h2 className="yy-section-title">Stats</h2>
            <p className="yy-section-sub">Community at a glance</p>
            <div className="yy-stat-row">
              {[
                ['500+', 'Recipes'],
                ['3500+', 'Happy users'],
                ['35k+', '5-star reviews'],
                ['130+', 'Active chefs'],
              ].map(([n, l]) => (
                <div key={l} className="yy-stat yy-surface" style={{ textAlign: 'center', boxShadow: 'none' }}>
                  <div className="num">{n}</div>
                  <div className="lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="yy-section yy-section--muted yy-anchor-section yy-landing-animate"
        id="categories"
      >
        <div className="yy-container">
          <h2 className="yy-section-title">Explore Categories</h2>
          <p className="yy-section-sub">Browse recipes by your favorite cuisine type</p>
          <div className="yy-grid-recipes yy-grid-recipes--2" style={{ maxWidth: 980, margin: '0 auto' }}>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/recipes?category=${cat._id}`}
                className="yy-card-link yy-hover-lift"
                style={{ ['--yy-cat-bg']: `url(${cat.image})` }}
              >
                <div className="yy-cat-card">
                  <div className="yy-cat-card-content">
                    <strong className="yy-cat-card-title">{cat.name}</strong>
                    <div className="yy-cat-card-meta">{cat.count} recipes</div>
                  </div>
                </div>
              </Link>
            ))}
            {!loading && !categories.length ? <p style={{ color: 'var(--yy-muted)' }}>No categories yet.</p> : null}
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
            <strong>Helpful links</strong>
            <Link to="/about">About</Link>
            <br />
            <Link to="/contact">Contact</Link>
            <br />
            <Link to="/recipes">Recipes</Link>
          </div>
          <div>
            <strong>Connect with us</strong>
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
