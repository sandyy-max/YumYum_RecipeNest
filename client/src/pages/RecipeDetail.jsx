import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { recipeImage } from '../lib/assets.js';
import { IMG } from '../lib/assets.js';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { BackButton } from '../components/BackButton.jsx';
import landingHeroBg from '../assets/landing-hero-bg.png';

export function RecipeDetail({ showHeader = true, backTo = '/recipes' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ data: r }, { data: rev }] = await Promise.all([
          http.get(`/api/recipes/${id}`),
          http.get(`/api/recipes/${id}/reviews`),
        ]);
        if (!cancelled) {
          setRecipe(r.recipe);
          setReviews(rev.reviews || []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function requireAuth() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/recipes/${id}` } } });
      return false;
    }
    return true;
  }

  async function toggleLike() {
    if (!(await requireAuth())) return;
    try {
      await http.post(`/api/recipes/${id}/like`);
      const { data: r } = await http.get(`/api/recipes/${id}`);
      setRecipe(r.recipe);
    } catch (e) {
      setError(e.message);
    }
  }

  async function save(kind) {
    if (!(await requireAuth())) return;
    try {
      await http.post('/api/users/me/saved', { recipeId: id, kind });
    } catch (e) {
      setError(e.message);
    }
  }

  async function postReview(e) {
    e.preventDefault();
    if (!(await requireAuth())) return;
    try {
      await http.post(`/api/recipes/${id}/reviews`, { comment });
      setComment('');
      const { data: rev } = await http.get(`/api/recipes/${id}/reviews`);
      setReviews(rev.reviews || []);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !recipe) {
    return (
      <>
        <div className="yy-bg-blur" style={{ backgroundImage: `url(${landingHeroBg})` }} />
        {showHeader ? <PublicHeader search={q} onSearchChange={setQ} /> : null}
        <p className="yy-err" style={{ padding: 24 }}>
          {error}
        </p>
      </>
    );
  }
  if (!recipe) {
    return (
      <>
        <div className="yy-bg-blur" style={{ backgroundImage: `url(${landingHeroBg})` }} />
        {showHeader ? <PublicHeader search={q} onSearchChange={setQ} /> : null}
        <div className="yy-loading">Loading…</div>
      </>
    );
  }

  return (
    <>
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${landingHeroBg})` }} />
      <div className="yy-overlay" />
      {showHeader ? <PublicHeader search={q} onSearchChange={setQ} /> : null}
      <section className="yy-section">
        <div className="yy-detail-wrap">
          <BackButton to={backTo} label="Back to recipes" />
          <div className="yy-detail-hero yy-glass" style={{ padding: '1.5rem', marginTop: 16 }}>
            <img className="yy-detail-img" src={recipeImage(recipe.imageUrl)} alt="" />
            <div>
              <h1 style={{ margin: '0 0 0.5rem' }}>{recipe.title}</h1>
              <p style={{ color: 'var(--yy-muted)', margin: '0 0 0.75rem' }}>
                {recipe.cookingTimeMinutes} min · {recipe.averageRating || 0} rating · Chef {recipe.chef?.name}
              </p>
              <span className="yy-pill">{recipe.category?.name}</span>
              <p>{recipe.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                <button type="button" className="yy-btn yy-btn-ghost" onClick={toggleLike}>
                  Like ({recipe.likes?.length ?? 0})
                </button>
                <button type="button" className="yy-btn yy-btn-ghost" onClick={() => save('favorite')}>
                  Favorite
                </button>
                <button type="button" className="yy-btn yy-btn-ghost" onClick={() => save('cook_later')}>
                  Cook later
                </button>
              </div>
              {error ? <p className="yy-err">{error}</p> : null}
            </div>
          </div>
          <div className="yy-two-col">
            <div className="yy-glass" style={{ padding: '1.25rem' }}>
              <h2 style={{ marginTop: 0 }}>Ingredients</h2>
              <ul>
                {(recipe.ingredients || []).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="yy-glass" style={{ padding: '1.25rem' }}>
              <h2 style={{ marginTop: 0 }}>Instructions</h2>
              <ol>
                {(recipe.instructions || []).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="yy-glass" style={{ padding: '1.25rem', marginTop: 16 }}>
            <h2 style={{ marginTop: 0 }}>Reviews</h2>
            <form onSubmit={postReview} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment…"
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: '0.65rem',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(0,0,0,0.35)',
                  color: '#fff',
                }}
              />
              <button type="submit" className="yy-btn yy-btn-primary">
                Post
              </button>
            </form>
            {reviews.length ? (
              <ul>
                {reviews.map((rv) => (
                  <li key={rv._id} style={{ marginTop: 8 }}>
                    <strong>{rv.user?.name}</strong>: {rv.comment}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--yy-muted)' }}>No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
