import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Lightbulb, LogOut, User } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-yellow-300 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold text-xl bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
              ProjectInsight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <Link
                to="/manage-ideas"
                className="block px-3 py-2 hover:bg-blue-700 rounded-md"
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
                    className="block px-3 py-2 hover:bg-blue-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}


                {isAdmin && (
                  <Link to="/admin" className="hover:text-blue-200 transition duration-300">
                    Admin Panel
                  </Link>
                )}

                <div className="flex items-center ml-4 space-x-4">
                  <span className="text-blue-100">
                    Welcome, {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md transition duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 hover:text-blue-200 transition duration-300"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md transition duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {isAdmin && (
              <Link
                to="/manage-ideas"
                className="block px-3 py-2 hover:bg-blue-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Ideas
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 hover:bg-blue-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 hover:bg-blue-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <div className="px-3 py-2 text-blue-100">
                  Welcome, {user?.username}
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 w-full text-left px-3 py-2 hover:bg-blue-700 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 hover:bg-blue-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-white text-blue-600 hover:bg-blue-100 rounded-md"
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