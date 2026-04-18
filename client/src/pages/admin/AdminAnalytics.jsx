import { useEffect, useState } from 'react';
import { http } from '../../api/http.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminAnalytics() {
  const [overview, setOverview] = useState(null);
  const [cats, setCats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [o, c] = await Promise.all([
          http.get('/api/admin/analytics'),
          http.get('/api/admin/analytics/categories'),
        ]);
        if (!cancelled) {
          setOverview(o.data);
          setCats(c.data.breakdown || []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="yy-page">
      <BackButton to="/admin/dashboard" label="Back to dashboard" />
      <h1 style={{ marginTop: 12 }}>Analytics</h1>
      {error ? <p className="yy-err">{error}</p> : null}
      {overview ? (
        <div className="yy-stat-row">
          {[
            [overview.totalUsers, 'Users'],
            [overview.totalChefs, 'Chefs'],
            [overview.approvedRecipes, 'Approved'],
            [overview.totalLikes, 'Likes'],
            [overview.totalSaved, 'Saves'],
          ].map(([n, l]) => (
            <div key={l} className="yy-stat yy-glass">
              <div className="num">{n}</div>
              <div className="lbl">{l}</div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="yy-frame" style={{ marginTop: 16 }}>
        <h2 style={{ color: 'var(--yy-muted)', fontSize: '1rem', marginTop: 0 }}>By category</h2>
        <ul className="yy-glass" style={{ padding: '1rem 1.5rem', margin: 0 }}>
        {cats.map((row) => (
          <li key={row.category?._id || row.category?.slug}>
            {row.category?.name}: <strong>{row.count}</strong>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}
