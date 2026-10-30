import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SearchCheck } from 'lucide-react';
import { useAuth } from '../services/auth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth(), nav = useNavigate();
  const link = ({ isActive }) => 'px-2 font-semibold text-ink ' + (isActive ? 'underline underline-offset-4' : '');
  return (
    <header className="sticky top-3 z-10 px-4 pt-3">
      <nav aria-label="Main" className="mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-2 rounded-3xl md:rounded-full bg-soft border border-hairline px-5 py-2 shadow-sm transition-colors duration-200">
        <Link to="/" className="flex items-center gap-2 text-lg text-ink" style={{ fontWeight: 650 }}>
          <SearchCheck aria-hidden="true" size={22} />
          <span>Lost &amp; Found</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/items" className={link}>Browse</NavLink>
          {user && <NavLink to="/my-reports" className={link}>My reports</NavLink>}
          {user ? (
            <button onClick={() => { logout(); nav('/'); }} className="px-2 font-semibold text-ink">
              Log out
            </button>
          ) : (
            <NavLink to="/login" className={link}>Log in</NavLink>
          )}
          <ThemeToggle />
          <Link to="/report" className="btn ml-1">Report item</Link>
        </div>
      </nav>
    </header>
  );
}
