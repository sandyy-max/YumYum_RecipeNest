import { useEffect, useState } from 'react';
import { http } from '../../api/http.js';
import { BackButton } from '../../components/BackButton.jsx';

export function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await http.get('/api/admin/contacts');
        if (!cancelled) setContacts(data.contacts || []);
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
      <BackButton to="/admin/dashboard" />
      <h1 style={{ marginTop: 12 }}>Contact messages</h1>
      {error ? <p className="yy-err">{error}</p> : null}
      <div className="yy-table-wrap yy-glass" style={{ marginTop: 14 }}>
        <table className="yy-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td style={{ maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.reason}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {!contacts.length && !error ? (
              <tr>
                <td colSpan={4} style={{ color: 'var(--yy-muted)' }}>
                  No messages yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

