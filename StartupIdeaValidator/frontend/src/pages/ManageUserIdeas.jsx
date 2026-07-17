import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, Check, X, AlertCircle, Trash2, Search, Loader2, Edit, User as UserIcon, Calendar, Tag } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import './Admin.css';

const ManageUserIdeas = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ['All', 'SaaS', 'E-commerce', 'Mobile App', 'FinTech', 'HealthTech', 'EdTech', 'Social Media', 'AI/ML', 'IoT', 'Other'];

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, sortBy]);

  useEffect(() => {
    // Only wait for auth to finish loading, then fetch immediately
    if (!authLoading) {
      if (user?.token) {
        console.log('Fetching admin ideas...', { admin: user.role, token: !!user.token });
        fetchIdeas();
      } else {
        // If no user token after loading, set loading to false
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, authLoading, user?.token]);
  
  // Fetch all ideas from admin endpoint with retry logic
  const fetchIdeas = async (retryCount = 0) => {
    try {
      setLoading(true);
      const params = {};
      
      // Use admin endpoint to get ALL ideas regardless of status
      // Only filter by status if not 'All'
      if (statusFilter !== 'All') params.status = statusFilter;

      console.log('Making admin ideas request with params:', params);
      const response = await axios.get('/api/admin/ideas', { params });
      console.log('Admin ideas fetched successfully:', response.data);
      let fetchedIdeas = response.data;

      // Client-side category filtering (since admin endpoint doesn't support it)
      if (categoryFilter !== 'All') {
        fetchedIdeas = fetchedIdeas.filter(idea => idea.category === categoryFilter);
      }

      // Client-side sorting
      fetchedIdeas.sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });

      setIdeas(fetchedIdeas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      
      // Retry logic for network errors
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        if (retryCount < 2) {
          console.log(`Retrying admin ideas fetch... (attempt ${retryCount + 1})`);
          setTimeout(() => fetchIdeas(retryCount + 1), 2000);
          return;
        }
      }
      
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  // Filter ideas based on search query (client-side, no refetch needed)
  const filteredIdeas = React.useMemo(() => {
    if (!searchQuery) return ideas;
    
    const query = searchQuery.toLowerCase();
    return ideas.filter(idea =>
      idea.title.toLowerCase().includes(query) ||
      idea.description.toLowerCase().includes(query) ||
      idea.user?.username?.toLowerCase().includes(query) ||
      idea.category?.toLowerCase().includes(query) ||
      (idea.techStack && idea.techStack.some(tech => tech.toLowerCase().includes(query)))
    );
  }, [ideas, searchQuery]);

  const handleStatusChange = async (ideaId, status) => {
    try {
      setIsProcessing(true);
      await axios.put(`/api/admin/ideas/${ideaId}/status`, { status });

      // Update the idea status in the list
      setIdeas((ideas) =>
        ideas.map((idea) =>
          idea._id === ideaId ? { ...idea, status } : idea
        )
      );

      toast.success(`Idea ${status.toLowerCase()} successfully`);

      // Refetch ideas if status filter is active and idea no longer matches
      if (statusFilter !== 'All' && statusFilter !== status) {
        // Refetch to update the list
        setTimeout(() => {
          fetchIdeas();
        }, 500);
      }
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

  const stats = {
    total: ideas.length,
    pending: ideas.filter(i => i.status === 'Pending').length,
    approved: ideas.filter(i => i.status === 'Approved').length,
    rejected: ideas.filter(i => i.status === 'Rejected').length,
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIdeas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-page animate-fade-in">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title text-gradient">Manage User Ideas</h1>
        <p className="admin-subtitle">View, review, and manage all user-submitted ideas</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p className="stat-label">Total Ideas</p>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-icon-wrapper total">
            <Tag className="icon-md" />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-label">Pending</p>
            <p className="stat-value pending">{stats.pending}</p>
          </div>
          <div className="stat-icon-wrapper pending">
            <AlertCircle className="icon-md" />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-label">Approved</p>
            <p className="stat-value approved">{stats.approved}</p>
          </div>
          <div className="stat-icon-wrapper approved">
            <Check className="icon-md" />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-label">Rejected</p>
            <p className="stat-value rejected">{stats.rejected}</p>
          </div>
          <div className="stat-icon-wrapper rejected">
            <X className="icon-md" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-bar">
        {/* Search */}
        <div className="search-input-wrapper">
          <Search className="search-icon icon-sm" />
          <input
            type="text"
            placeholder="Search ideas by title, description, user, category..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="filter-select-wrapper">
          <Filter className="icon-sm" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-select-wrapper">
          <Tag className="icon-sm" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="filter-select-wrapper">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Ideas Table */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2 className="admin-table-title">
            {statusFilter === 'All' ? 'All Ideas' : `${statusFilter} Ideas`}
            {filteredIdeas.length > 0 && (
              <span className="table-count-badge">
                {filteredIdeas.length} {filteredIdeas.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="dashboard-loader">
            <Loader2 className="dashboard-loader-icon spinner" />
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="empty-state" style={{ border: 'none', boxShadow: 'none' }}>
            <AlertCircle className="empty-state-icon-sm" />
            <h3 className="empty-state-title-sm">No ideas found</h3>
            <p className="empty-state-desc">
              {searchQuery || statusFilter !== 'All' || categoryFilter !== 'All'
                ? 'Try adjusting your filters or search query.'
                : 'There are no ideas submitted yet. Check back later.'}
            </p>
            {(searchQuery || statusFilter !== 'All' || categoryFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setCategoryFilter('All');
                }}
                className="btn btn-text"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Idea Details</th>
                  <th>Category</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(idea => (
                  <tr key={idea._id}>
                    <td>
                      <div className="td-idea-details">
                        <div className="td-idea-title">
                          <Link to={`/ideas/${idea._id}`}>{idea.title}</Link>
                        </div>
                        <div className="td-idea-desc">
                          {idea.description}
                        </div>
                        {idea.techStack && idea.techStack.length > 0 && (
                          <div className="td-tech-tags">
                            {idea.techStack.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="td-tech-tag">
                                {tech}
                              </span>
                            ))}
                            {idea.techStack.length > 3 && (
                              <span className="td-tech-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                                +{idea.techStack.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
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

                        {idea.status !== 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Pending')}
                            disabled={isProcessing}
                            className="icon-btn"
                            style={{ color: 'var(--warning)' }}
                            title="Set to Pending"
                          >
                            {isProcessing ? (
                              <Loader2 className="icon-sm spinner" />
                            ) : (
                              <AlertCircle className="icon-sm" />
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

      {/* Results Info and Pagination */}
      {filteredIdeas.length > 0 && (
        <div className="admin-results-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0 1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            Showing <span style={{ fontWeight: 600 }}>{indexOfFirstItem + 1}</span> to <span style={{ fontWeight: 600 }}>{Math.min(indexOfLastItem, filteredIdeas.length)}</span> of{' '}
            <span style={{ fontWeight: 600 }}>{filteredIdeas.length}</span> results
            {searchQuery && ideas.length !== filteredIdeas.length && (
              <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                (filtered from {ideas.length} total)
              </span>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', gap: '0.25rem' }}>
              <button 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUserIdeas;
