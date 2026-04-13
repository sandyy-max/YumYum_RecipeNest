import { useState } from 'react';
import { http } from '../api/http.js';

export function ContactForm({ onSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim()) return setError('Name is required');
    if (!email.trim()) return setError('Email is required');
    if (!reason.trim()) return setError('Message is required');

    setSubmitting(true);
    try {
      await http.post('/api/contact', { name, email, reason });
      setSuccess('Message sent. Admin will review it.');
      setName('');
      setEmail('');
      setReason('');
      onSubmitted?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <div className="yy-two-col">
        <label className="yy-input">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label className="yy-input">
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" type="email" />
        </label>
      </div>
      <label className="yy-input">
        Message
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={5} placeholder="Write your reason / message to admin" />
      </label>
      {error ? <p className="yy-err" style={{ margin: 0 }}>{error}</p> : null}
      {success ? <p style={{ margin: 0, color: 'var(--yy-green)' }}>{success}</p> : null}
      <button type="submit" className="yy-btn yy-btn-primary" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}

