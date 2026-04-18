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
        <div className="yy-container">
          <div className="yy-page">
            <BackButton to="/" />
            <div className="yy-frame" style={{ marginTop: 16 }}>
              <div className="yy-page-head">
                <div>
                  <h1 style={{ margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>About YumYum</h1>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
                    A modern recipe platform where great food stories are shared, reviewed, and trusted.
                  </p>
                </div>
              </div>

              <div className="yy-glass" style={{ padding: '1.6rem', maxWidth: 980 }}>
                <h2 style={{ marginTop: 0 }}>Our mission</h2>
                <p style={{ color: 'var(--yy-muted)' }}>
                  YumYum is built to make discovering recipes simple and reliable. We combine chef creativity with
                  quality moderation, so users get recipes they can actually trust and cook confidently at home.
                </p>

                <h2>Why people use YumYum</h2>
                <p style={{ color: 'var(--yy-muted)' }}>
                  Visitors can explore approved recipes without friction. Signed-in users can save favorites, add
                  reviews, and build their own cooking journey. Every interaction is designed to feel clean, fast, and
                  useful.
                </p>

                <h2>How quality is maintained</h2>
                <p style={{ color: 'var(--yy-muted)' }}>
                  Chef submissions pass through a moderation workflow before they become public. This keeps content
                  standards high and helps maintain a consistent experience for every user.
                </p>

                <h2>What makes us different</h2>
                <ul style={{ margin: '0.5rem 0 0', color: 'var(--yy-muted)' }}>
                  <li>Chef-first publishing with clear approvals and feedback.</li>
                  <li>Clean role-based workflows for users, chefs, and admins.</li>
                  <li>A focused interface built for everyday cooking, not clutter.</li>
                </ul>
              </div>

              <div className="yy-glass" style={{ marginTop: '1.25rem', padding: '1.3rem', maxWidth: 980 }}>
                <h2 style={{ marginTop: 0 }}>Our promise</h2>
                <p style={{ color: 'var(--yy-muted)', marginBottom: 0 }}>
                  We keep improving the platform so it remains professional, easy to use, and genuinely helpful for
                  anyone who loves food.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

