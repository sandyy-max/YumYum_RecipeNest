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
        <BackButton to="/" />
        <h1 className="yy-section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
          Contact admin
        </h1>
        <p className="yy-section-sub" style={{ textAlign: 'left', marginTop: -10 }}>
          Send your name, email, and message. Admin can review your submission.
        </p>
        <div className="yy-glass" style={{ marginTop: 18, padding: '1.25rem' }}>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

