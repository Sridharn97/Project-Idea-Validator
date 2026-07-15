import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Lightbulb, LogOut, User } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Lightbulb className="logo-icon" />
            <span className="logo-text">
              ProjectInsight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            {isAdmin && (
              <Link
                to="/manage-ideas"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Ideas
              </Link>
            )}


            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link
                    to="/dashboard"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}


                {isAdmin && (
                  <Link to="/admin" className="nav-link">
                    Admin Panel
                  </Link>
                )}

                <div className="navbar-user-menu">
                  <span className="user-greeting">
                    Welcome, {user?.username}
                  </span>
                  <button onClick={handleLogout} className="btn btn-primary btn-logout">
                    <LogOut className="icon-sm" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="nav-link nav-login">
                  <User className="icon-sm" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
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
              <Link
                to="/manage-ideas"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Ideas
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <div className="mobile-user-greeting">
                  Welcome, {user?.username}
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="mobile-nav-link mobile-logout"
                >
                  <LogOut className="icon-sm" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-nav-link mobile-register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;