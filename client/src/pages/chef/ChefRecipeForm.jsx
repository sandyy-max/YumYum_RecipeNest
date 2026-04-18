import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../../api/http.js';
import { BackButton } from '../../components/BackButton.jsx';

export function ChefRecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTimeMinutes, setCookingTimeMinutes] = useState(30);
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get('/api/categories');
        const list = data.categories || [];
        setCategories(list);
        if (!isEdit && list.length) {
          setCategory((prev) => prev || String(list[0]._id));
        }
        if (!list.length) {
          setError('No categories found. Contact admin to create categories.');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await http.get(`/api/recipes/${id}`);
        const r = data.recipe;
        if (cancelled || !r) return;
        setTitle(r.title);
        setDescription(r.description || '');
        setCookingTimeMinutes(r.cookingTimeMinutes || 0);
        setCategory(String(r.category?._id || r.category));
        setIngredients((r.ingredients || []).join('\n'));
        setInstructions((r.instructions || []).join('\n'));
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Recipe title is required');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!ingredients.trim() || !instructions.trim()) {
      setError('Ingredients and instructions are required');
      return;
    }
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('cookingTimeMinutes', String(cookingTimeMinutes));
    fd.append('category', category);
    fd.append('ingredients', JSON.stringify(ingredients.split('\n').map((s) => s.trim()).filter(Boolean)));
    fd.append('instructions', JSON.stringify(instructions.split('\n').map((s) => s.trim()).filter(Boolean)));
    if (file) fd.append('image', file);

    try {
      if (isEdit) {
        await http.put(`/api/recipes/${id}`, fd);
      } else {
        await http.post('/api/recipes', fd);
      }
      navigate('/chef/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="yy-page">
      <BackButton to="/chef/dashboard" label="Back to dashboard" />
      <div className="yy-frame" style={{ marginTop: 16, maxWidth: 780 }}>
        <div className="yy-page-head" style={{ marginBottom: 12 }}>
          <div>
            <h1 style={{ margin: 0 }}>{isEdit ? 'Edit recipe' : 'Add new recipe'}</h1>
            <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
              {isEdit ? 'Update your recipe details and re-submit for review.' : 'Create a new recipe for review and approval.'}
            </p>
          </div>
        </div>
        <form className="yy-glass" onSubmit={onSubmit} style={{ padding: '1.5rem', display: 'grid', gap: 14 }}>
        <div className="yy-two-col">
          <label className="yy-input">
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="yy-input">
            Cooking time (min)
            <input
              type="number"
              min={0}
              value={cookingTimeMinutes}
              onChange={(e) => setCookingTimeMinutes(Number(e.target.value))}
            />
          </label>
        </div>
        <label className="yy-input">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loadingCategories}>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label
          className="yy-input"
          style={{
            border: '2px dashed rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          Image (PNG/JPG, max ~2MB)
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <label className="yy-input">
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </label>
        <label className="yy-input">
          Ingredients (one per line)
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={5} />
        </label>
        <label className="yy-input">
          Instructions (one per line)
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={5} />
        </label>
        {error ? <p className="yy-err">{error}</p> : null}
        <button
          type="submit"
          className="yy-btn yy-btn-primary"
          style={{ justifySelf: 'start' }}
          disabled={loadingCategories || !categories.length}
        >
          {isEdit ? 'Save changes' : 'Submit recipe'}
        </button>
        </form>
      </div>
    </div>
  );
}
