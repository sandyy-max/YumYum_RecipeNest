import { Link, useNavigate } from 'react-router-dom';

export function BackButton({ to = '/', label = 'Go back' }) {
  const navigate = useNavigate();

  function handleClick(e) {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      e.preventDefault();
      navigate(-1);
    }
  }

  return (
    <Link to={to} className="yy-back-btn" aria-label={label} title={label} onClick={handleClick}>
      <span aria-hidden="true">←</span>
    </Link>
  );
}

