import { Link } from 'react-router-dom';
import logo from '../assets/yumyum-logo.png';

export function Logo({ to = '/', auth = false }) {
  return (
    <Link to={to} className="yy-logo" style={{ textDecoration: 'none' }}>
      <img
        src={logo}
        alt="YumYum"
        style={{ height: auth ? 72 : 44, width: 'auto', display: 'block' }}
      />
    </Link>
  );
}
