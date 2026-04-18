import { IMG } from '../lib/assets.js';
import { ContactForm } from '../components/ContactForm.jsx';
import { BackButton } from '../components/BackButton.jsx';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { useState } from 'react';

export function Contact() {
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
                  <h1 style={{ margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact admin</h1>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--yy-muted)' }}>
                    Send your name, email, and message. Admin can review your submission.
                  </p>
                </div>
              </div>
              <div className="yy-glass" style={{ padding: '1.25rem' }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

