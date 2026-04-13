import { Link } from 'react-router-dom';

export function BackButton({ to = '/', label = 'Go back' }) {
  return (
    <Link to={to} className="yy-back-btn" aria-label={label} title={label}>
      <span aria-hidden="true">←</span>
    </Link>
  );
}

