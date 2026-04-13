import { IMG } from '../lib/assets.js';
import { BackButton } from '../components/BackButton.jsx';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { useState } from 'react';

export function About() {
  const [search, setSearch] = useState('');

  return (
    <>
      <div className="yy-bg-blur" style={{ backgroundImage: `url(${IMG.bgFood})` }} />
      <div className="yy-overlay" />
      <PublicHeader search={search} onSearchChange={setSearch} />
      <section className="yy-section">
        <BackButton to="/" />
        <h1 className="yy-section-title" style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
          About YumYum
        </h1>
        <p className="yy-section-sub" style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
          A recipe nest built for quality, trust, and learning.
        </p>

        <div className="yy-two-col">
          <div className="yy-glass" style={{ padding: '1.25rem' }}>
            <h2 style={{ marginTop: 0 }}>Why this platform</h2>
            <p style={{ color: 'var(--yy-muted)' }}>
              Chefs publish recipes through a clear status pipeline. Admin moderation helps ensure recipes meet quality
              standards before they appear in the public experience.
            </p>
          </div>
          <div className="yy-glass" style={{ padding: '1.25rem' }}>
            <h2 style={{ marginTop: 0 }}>How it works</h2>
            <p style={{ color: 'var(--yy-muted)' }}>
              Users can browse and view recipe details without login. Authenticated users can like, save, and review
              approved recipes. Chefs manage their own submissions.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }} className="yy-glass">
          <div style={{ padding: '1.25rem' }}>
            <h2 style={{ marginTop: 0 }}>Core values</h2>
            <p style={{ color: 'var(--yy-muted)' }}>
              Clear moderation, respectful community feedback, and a smooth workflow for chefs so the best recipes stay
              visible.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

