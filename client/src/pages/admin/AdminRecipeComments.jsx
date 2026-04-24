import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../../api/http.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminRecipeComments() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  async function load() {
    try {
      const { data } = await http.get('/api/admin/recipe-comments');
      setComments(data.comments || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteComment(id) {
    try {
      setDeletingId(id);
      await http.delete(`/api/admin/reviews/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId('');
    }
  }

  return (
    <div className="yy-page">
      <BackButton to="/admin/dashboard" label="Back to dashboard" />
      <h1 style={{ marginTop: 12 }}>Recipe comments</h1>
      <p style={{ marginTop: -4, color: 'var(--yy-muted)' }}>
        See comments with the exact recipe post and remove unwanted ones.
      </p>
      {error ? <p className="yy-err">{error}</p> : null}
      <div className="yy-table-wrap yy-glass" style={{ marginTop: 14 }}>
        <table className="yy-table">
          <thead>
            <tr>
              <th>Recipe post</th>
              <th>Comment</th>
              <th>User</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c._id}>
                <td>
                  <div style={{ display: 'grid', gap: 4 }}>
                    <strong>{c.recipe?.title || 'Deleted recipe'}</strong>
                    {c.recipe?._id ? (
                      <Link to={`/recipes/${c.recipe._id}`} style={{ color: 'var(--yy-green)', fontSize: '0.86rem' }}>
                        Open post
                      </Link>
                    ) : null}
                  </div>
                </td>
                <td style={{ maxWidth: 420 }}>{c.comment}</td>
                <td>{c.user?.name || c.user?.email || '-'}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="yy-icon-btn yy-icon-btn--danger"
                    title="Delete comment"
                    disabled={deletingId === c._id}
                    onClick={() => deleteComment(c._id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {!comments.length && !error ? (
              <tr>
                <td colSpan={5} style={{ color: 'var(--yy-muted)' }}>
                  No comments yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
