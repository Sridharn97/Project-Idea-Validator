import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import IdeaDetails from './pages/IdeaDetails';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ManageUserIdeas from './pages/ManageUserIdeas';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import AuthContext from './context/AuthContext';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHomePage = location.pathname === '/';

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? "auth-main" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage-ideas" element={
            <AdminRoute>
              <ManageUserIdeas />
            </AdminRoute>
          } />
          <Route path="/ideas/:id" element={<IdeaDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {isHomePage && <Footer />}
    </div>
  );
}

export default App;