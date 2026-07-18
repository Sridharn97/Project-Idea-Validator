import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Lightbulb, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Lightbulb className="logo-icon" />
            <span className="logo-text">StartupValidator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            {isAdmin && (
              <>
                <Link to="/manage-ideas" className="nav-link">Manage Ideas</Link>
                <Link to="/admin" className="nav-link">Admin Panel</Link>
              </>
            )}

            {isAuthenticated && !isAdmin && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}

            {isAuthenticated ? (
              <div className="navbar-user-menu">
                <span className="user-greeting">{user?.username}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-logout">
                  <LogOut className="icon-sm" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="nav-link nav-login">
                  <User className="icon-sm" />
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="navbar-mobile-btn">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-btn">
              {isMenuOpen ? <X className="icon-md" /> : <Menu className="icon-md" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="navbar-mobile-menu">
            {isAdmin && (
              <>
                <Link to="/manage-ideas" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Manage Ideas</Link>
                <Link to="/admin" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
              </>
            )}

            {isAuthenticated && !isAdmin && (
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            )}

            {isAuthenticated ? (
              <>
                <div className="mobile-user-greeting">Signed in as {user?.username}</div>
                <button onClick={handleLogout} className="mobile-nav-link mobile-logout">
                  <LogOut className="icon-sm" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="mobile-nav-link mobile-register" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;