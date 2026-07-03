import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const token    = localStorage.getItem('token');
  const role     = localStorage.getItem('userRole');
  const name     = localStorage.getItem('userFirstName');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const dashboardPath = role === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard';

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">Y</div>
          <span className="navbar-logo-text">YalaDars</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {!token ? (
            <>
              <Link to="/tutors" className="nav-link">Browse Tutors</Link>
              <Link to="/login"  className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : (
            <>
              <Link to="/tutors" className="nav-link">Browse Tutors</Link>
              <Link to={dashboardPath} className="nav-link">Dashboard</Link>
              <div className="navbar-user">
                <div className="navbar-avatar">{name?.charAt(0) || 'U'}</div>
                <div className="navbar-dropdown">
                  <Link to={dashboardPath} className="dropdown-item">Dashboard</Link>
                  <button onClick={handleLogout} className="dropdown-item danger">Sign Out</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className={`navbar-hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/tutors"    className="mobile-nav-link">Browse Tutors</Link>
          {!token ? (
            <>
              <Link to="/login"    className="mobile-nav-link">Sign In</Link>
              <Link to="/register" className="mobile-nav-link primary">Get Started</Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} className="mobile-nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="mobile-nav-link danger">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
