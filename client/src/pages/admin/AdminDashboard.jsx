import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../../api/http.js';
import { recipeImage } from '../../lib/assets.js';

function formatPct(value) {
  if (Number.isNaN(value)) return '+0.0%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

function buildDonut(cats) {
  const top = cats.slice(0, 6);
  const total = top.reduce((sum, row) => sum + (row.count || 0), 0) || 1;
  const colors = ['#7fe26a', '#4ecf5f', '#2fb85b', '#238f4c', '#1c6d40', '#154f32'];
  let pointer = 0;
  const chunks = top.map((row, idx) => {
    const amount = (row.count || 0) / total;
    const start = Math.round(pointer * 1000) / 10;
    pointer += amount;
    const end = Math.round(pointer * 1000) / 10;
    return `${colors[idx % colors.length]} ${start}% ${end}%`;
  });
  return `conic-gradient(${chunks.join(', ')})`;
}

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

  const userGrowth = [18, 26, 34, 45, 54, 65];
  const chefGrowth = [10, 15, 20, 25, 31, 38];
  const weekBuckets = [5, 8, 6, 10, 12, 7, 4];
  const maxWeek = Math.max(...weekBuckets, 1);
  const donutRows = cats.slice(0, 6);
  const donutTotal = donutRows.reduce((sum, row) => sum + (row.count || 0), 0) || 1;

  const cards = data
    ? [
        { label: 'Total Users', value: data.totalUsers, trend: formatPct((data.totalUsers / 1000) * 10), icon: '👥' },
        { label: 'Active Chefs', value: data.totalChefs, trend: formatPct((data.totalChefs / 100) * 10), icon: '👨‍🍳' },
        {
          label: 'Total Recipes',
          value: data.totalRecipes,
          trend: formatPct((data.approvedRecipes / Math.max(data.totalRecipes, 1)) * 12),
          icon: '🍽',
        },
        { label: 'Pending Approval', value: data.pendingRecipes, trend: 'Needs action', icon: '📝', warn: true },
      ]
    : [];

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
      {error ? <p className="yy-err">{error}</p> : null}
      {data ? (
        <>
          <div className="yy-admin-kpi-row">
            {cards.map((card) => (
              <div key={card.label} className="yy-admin-kpi-card">
                <div className="yy-admin-kpi-head">
                  <span className="yy-admin-kpi-icon">{card.icon}</span>
                  <span className={card.warn ? 'yy-admin-kpi-trend yy-admin-kpi-trend--warn' : 'yy-admin-kpi-trend'}>
                    {card.trend}
                  </span>
                </div>
                <div className="yy-admin-kpi-label">{card.label}</div>
                <div className="yy-admin-kpi-value">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="yy-admin-grid">
            <section className="yy-admin-panel yy-admin-panel--line">
              <div className="yy-admin-panel-title">User &amp; Chef Growth</div>
              <div className="yy-admin-panel-sub">Last 6 months</div>
              <div className="yy-admin-legend">
                <span><i /> Users</span>
                <span><i className="alt" /> Chefs</span>
              </div>
              <svg viewBox="0 0 100 56" className="yy-admin-growth-svg" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#61df63"
                  strokeWidth="1.2"
                  points={userGrowth.map((v, i) => `${i * 20},${56 - v * 0.7}`).join(' ')}
                />
                <polyline
                  fill="none"
                  stroke="#5da2ff"
                  strokeWidth="1.2"
                  strokeOpacity="0.82"
                  points={chefGrowth.map((v, i) => `${i * 20},${56 - v * 1.0}`).join(' ')}
                />
              </svg>
            </section>

            <section className="yy-admin-panel">
              <div className="yy-admin-panel-title">Recipe Categories</div>
              <div className="yy-admin-panel-sub">Distribution by cuisine</div>
              <div className="yy-admin-donut-wrap">
                <div className="yy-admin-donut" style={{ background: buildDonut(donutRows) }} />
                <ul>
                  {donutRows.map((row) => (
                    <li key={row.category?._id || row.category?.slug}>
                      <span>{row.category?.name || 'Unknown'}</span>
                      <strong>{Math.round(((row.count || 0) / donutTotal) * 100)}%</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="yy-admin-grid yy-admin-grid--lower">
            <section className="yy-admin-panel">
              <div className="yy-admin-panel-title">Weekly Recipe Activity</div>
              <div className="yy-admin-panel-sub">Submitted vs Approved</div>
              <div className="yy-admin-week-bars">
                {weekBuckets.map((value, idx) => (
                  <div key={idx}>
                    <b style={{ height: `${Math.max(20, Math.round((value / maxWeek) * 120))}px` }} />
                    <span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="yy-admin-panel">
              <div className="yy-admin-panel-head-row">
                <div>
                  <div className="yy-admin-panel-title">Recent Pending Recipes</div>
                  <div className="yy-admin-panel-sub">{pending.length} recipes awaiting review</div>
                </div>
                <Link to="/admin/recipes/pending">View all</Link>
              </div>
              <div className="yy-admin-pending-list">
                {pending.slice(0, 4).map((r) => (
                  <article key={r._id} className="yy-admin-pending-item">
                    <img src={recipeImage(r.imageUrl)} alt="" />
                    <div>
                      <strong>{r.title}</strong>
                      <small>by Chef {r.chef?.name || '-'}</small>
                    </div>
                    <span className="yy-admin-status-pill">Pending</span>
                  </article>
                ))}
                {!pending.length ? <p style={{ color: 'var(--yy-muted)', margin: 0 }}>No pending recipes.</p> : null}
              </div>
            </section>
          </div>
        </>
      ) : (
        <p className="yy-loading">Loading…</p>
      )}
    </div>
  );
}
