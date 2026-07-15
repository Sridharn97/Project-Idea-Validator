import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, Check, X, AlertCircle, Trash2, Search, Loader2 } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import './Admin.css';

const AdminPanel = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch ideas on mount and when filters change
  useEffect(() => {
    // Only wait for auth to finish loading, then fetch immediately
    if (!authLoading) {
      if (user?.token) {
        console.log('Fetching admin panel ideas...', { admin: user.role, token: !!user.token });
        fetchIdeas();
      } else {
        // If no user token after loading, set loading to false
        setLoading(false);
      }
    }
  }, [statusFilter, searchQuery, user?.token, authLoading]);

  const fetchIdeas = async (retryCount = 0) => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      console.log('Making admin panel ideas request with params:', params);
      // API call now uses full backend URL automatically
      const response = await axios.get('/api/admin/ideas', { params });
      console.log('Admin panel ideas fetched successfully:', response.data);
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      
      // Retry logic for network errors
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        if (retryCount < 2) {
          console.log(`Retrying admin panel fetch... (attempt ${retryCount + 1})`);
          setTimeout(() => fetchIdeas(retryCount + 1), 2000);
          return;
        }
      }
      
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ideaId, status) => {
    try {
      setIsProcessing(true);
      await axios.put(`/api/admin/ideas/${ideaId}/status`, { status });

      setIdeas((ideas) =>
        ideas.map((idea) =>
          idea._id === ideaId ? { ...idea, status } : idea
        )
      );

      toast.success(`Idea ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    if (window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      try {
        setIsProcessing(true);
        await axios.delete(`/api/admin/ideas/${ideaId}`);
        setIdeas((ideas) => ideas.filter((idea) => idea._id !== ideaId));
        toast.success('Idea deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete idea');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'badge badge-approved';
      case 'Rejected': return 'badge badge-rejected';
      case 'Pending': return 'badge badge-pending';
      default: return 'badge badge-default';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage and review submitted ideas</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <div className="search-input-wrapper">
            <Search className="search-icon icon-sm" />
            <input
              type="text"
              placeholder="Search ideas..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-select-wrapper">
            <Filter className="icon-sm" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Ideas</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2 className="admin-table-title">
            {statusFilter === 'All' ? 'All Ideas' : `${statusFilter} Ideas`}
            {ideas.length > 0 && (
              <span className="table-count-badge">
                {ideas.length} {ideas.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </h2>
        </div>
        
        {loading ? (
          <div className="dashboard-loader">
            <Loader2 className="dashboard-loader-icon spinner" />
          </div>
        ) : ideas.length === 0 ? (
          <div className="empty-state" style={{ border: 'none', boxShadow: 'none' }}>
            <AlertCircle className="empty-state-icon-sm" />
            <h3 className="empty-state-title-sm">No ideas found</h3>
            <p className="empty-state-desc">
              {statusFilter === 'All' 
                ? 'There are no ideas submitted yet. Check back later.' 
                : `No ${statusFilter.toLowerCase()} ideas found. Try changing the filter.`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-text"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Idea Title</th>
                  <th>Category</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map(idea => (
                  <tr key={idea._id}>
                    <td>
                      <div className="td-idea-details">
                        <div className="td-idea-title">
                          <Link to={`/ideas/${idea._id}`}>{idea.title}</Link>
                        </div>
                        <div className="td-idea-desc" style={{ WebkitLineClamp: 1 }}>
                          {idea.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-default">
                        {idea.category}
                      </span>
                    </td>
                    <td>
                      <div className="td-user-info">
                        <div className="td-user-avatar">
                          {idea.user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="td-user-details">
                          <div className="td-username">
                            {idea.user?.username || 'Anonymous'}
                          </div>
                          <div className="td-user-email">
                            {idea.user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="td-date">{formatDate(idea.createdAt)}</div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(idea.status)}>
                        {idea.status}
                      </span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <Link
                          to={`/ideas/${idea._id}`}
                          className="icon-btn"
                          title="View Details"
                        >
                          <Eye className="icon-sm" />
                        </Link>
                        
                        {idea.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Approved')}
                            disabled={isProcessing}
                            className="icon-btn"
                            style={{ color: 'var(--success)' }}
                            title="Approve Idea"
                          >
                            {isProcessing ? (
                              <Loader2 className="icon-sm spinner" />
                            ) : (
                              <Check className="icon-sm" />
                            )}
                          </button>
                        )}
                        
                        {idea.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Rejected')}
                            disabled={isProcessing}
                            className="icon-btn"
                            style={{ color: 'var(--danger)' }}
                            title="Reject Idea"
                          >
                            {isProcessing ? (
                              <Loader2 className="icon-sm spinner" />
                            ) : (
                              <X className="icon-sm" />
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteIdea(idea._id)}
                          disabled={isProcessing}
                          className="icon-btn delete"
                          title="Delete Idea"
                        >
                          {isProcessing ? (
                            <Loader2 className="icon-sm spinner" />
                          ) : (
                            <Trash2 className="icon-sm" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {ideas.length > 0 && (
        <div className="admin-results-info">
          <div>
            Showing <span style={{ fontWeight: 500 }}>1</span> to <span style={{ fontWeight: 500 }}>{ideas.length}</span> of{' '}
            <span style={{ fontWeight: 500 }}>{ideas.length}</span> results
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;