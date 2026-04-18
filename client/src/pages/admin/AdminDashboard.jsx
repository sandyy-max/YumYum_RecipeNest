import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../../api/http.js';

export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [cats, setCats] = useState([]);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, c, p] = await Promise.all([
          http.get('/api/admin/analytics'),
          http.get('/api/admin/analytics/categories'),
          http.get('/api/admin/recipes/pending'),
        ]);
        if (!cancelled) {
          setData(a.data);
          setCats(c.data.breakdown || []);
          setPending((p.data.recipes || []).slice(0, 6));
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
      <div className="yy-admin-topbar">
        <div>
          <h1 style={{ margin: 0 }}>Dashboard Overview</h1>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <input className="yy-admin-search" placeholder="Search..." />
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '12px 0 20px' }}>
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
        <>
        <div className="yy-stat-row">
          {[
            [data.totalUsers, 'Total Users'],
            [data.totalChefs, 'Active Chefs'],
            [data.totalRecipes, 'Total Recipes'],
            [data.pendingRecipes, 'Pending Approval', true],
          ].map(([n, l, warn], i) => (
            <div key={l} className="yy-stat yy-glass yy-admin-kpi">
              <div style={{ color: 'var(--yy-muted)', fontSize: '0.9rem' }}>KPI {i + 1}</div>
              <div className="num" style={warn ? { color: '#ffd76e' } : undefined}>
                {n}
              </div>
              <div className="lbl" style={{ fontSize: '0.85rem' }}>{l}</div>
            </div>
          ))}
        </div>
        <div className="yy-admin-grid">
          <div className="yy-glass" style={{ padding: '1rem 1.2rem' }}>
            <h3 style={{ margin: 0 }}>User & Chef Growth</h3>
            <p style={{ margin: '0.2rem 0 0.9rem', color: 'var(--yy-muted)', fontSize: '0.9rem' }}>Last 6 months</p>
            <div className="yy-admin-chart-line">
              {[120, 180, 240, 320, 390, 470].map((v, idx) => (
                <div key={idx} style={{ height: `${Math.max(18, v / 7)}px` }} />
              ))}
            </div>
          </div>
          <div className="yy-glass" style={{ padding: '1rem 1.2rem' }}>
            <h3 style={{ margin: 0 }}>Recipe Categories</h3>
            <p style={{ margin: '0.2rem 0 0.9rem', color: 'var(--yy-muted)', fontSize: '0.9rem' }}>Distribution by cuisine</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {cats.slice(0, 6).map((row) => (
                <li key={row.category?._id || row.category?.slug} style={{ marginBottom: 6 }}>
                  {row.category?.name}: <strong>{row.count}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="yy-glass" style={{ padding: '1rem 1.2rem', marginTop: 16 }}>
          <h3 style={{ margin: 0 }}>Recent Pending Recipes</h3>
          <p style={{ margin: '0.2rem 0 0.9rem', color: 'var(--yy-muted)', fontSize: '0.9rem' }}>
            {pending.length} recipes awaiting review
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            {pending.map((r) => (
              <div key={r._id} className="yy-admin-row">
                <div>
                  <strong>{r.title}</strong>
                  <div style={{ color: 'var(--yy-muted)', fontSize: '0.88rem' }}>by Chef {r.chef?.name || '-'}</div>
                </div>
                <span className="yy-pill">Pending</span>
              </div>
            ))}
            {!pending.length ? <p style={{ color: 'var(--yy-muted)', margin: 0 }}>No pending recipes.</p> : null}
          </div>
        </div>
        </>
      ) : (
        <p className="yy-loading">Loading…</p>
      )}
    </div>
  );
}
