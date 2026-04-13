import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../../api/http.js';

export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: body } = await http.get('/api/admin/analytics');
        if (!cancelled) setData(body);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Admin overview</h1>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <Link to="/admin/users" className="yy-btn yy-btn-ghost">
          Users
        </Link>
        <Link to="/admin/chefs" className="yy-btn yy-btn-ghost">
          Chefs
        </Link>
        <Link to="/admin/recipes/pending" className="yy-btn yy-btn-primary">
          Pending recipes
        </Link>
        <Link to="/admin/analytics" className="yy-btn yy-btn-ghost">
          Analytics
        </Link>
      </div>
      {error ? <p className="yy-err">{error}</p> : null}
      {data ? (
        <div className="yy-stat-row">
          {[
            [data.totalUsers, 'Users'],
            [data.totalChefs, 'Chefs'],
            [data.totalRecipes, 'Recipes'],
            [data.pendingRecipes, 'Pending', true],
          ].map(([n, l, warn]) => (
            <div key={l} className="yy-stat yy-glass">
              <div className="num" style={warn ? { color: 'var(--yy-danger)' } : undefined}>
                {n}
              </div>
              <div className="lbl">{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="yy-loading">Loading…</p>
      )}
    </div>
  );
}
