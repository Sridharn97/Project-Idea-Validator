import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, Check, X, AlertCircle, Trash2, Search, Loader2, Users, Lightbulb, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import './Admin.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminPanel = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'ideas'
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch ideas and stats on mount
  useEffect(() => {
    if (!authLoading) {
      if (user?.token) {
        fetchIdeas();
        fetchStats();
      } else {
        setLoading(false);
      }
    }
  }, [statusFilter, searchQuery, user?.token, authLoading]);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

  const fetchIdeas = async (retryCount = 0) => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get('/api/admin/ideas', { params });
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        if (retryCount < 2) {
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
      fetchStats(); // Update stats
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
        fetchStats(); // Update stats
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ideas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ideas.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-header">
        <h1 className="admin-title text-gradient">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage and review submitted ideas</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart2 className="icon-sm" /> Overview
        </button>
        <button 
          className={`admin-tab ${activeTab === 'ideas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ideas')}
        >
          <Users className="icon-sm" /> Manage Ideas
        </button>
      </div>

      {loading && !stats ? (
        <div className="dashboard-loader">
          <Loader2 className="dashboard-loader-icon spinner" />
        </div>
      ) : activeTab === 'overview' && stats ? (
        <div className="dashboard-overview">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon-wrapper blue">
                <Lightbulb className="stat-icon" />
              </div>
              <div className="stat-content">
                <h3>Total Ideas</h3>
                <p className="stat-value">{stats.totalIdeas}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper green">
                <Users className="stat-icon" />
              </div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>Ideas by Status</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.ideasByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.ideasByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3>Ideas by Category</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.ideasByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {stats.ideasByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="filters-bar">
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
                <table className="admin-table clean-table">
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
                    {currentItems.map(idea => (
                      <tr key={idea._id}>
                        <td>
                          <div className="td-idea-title">
                            <Link to={`/ideas/${idea._id}`}>{idea.title}</Link>
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
                                className="icon-btn success"
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
                                className="icon-btn danger"
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
            
            {/* Results Info and Pagination */}
            {ideas.length > 0 && (
              <div className="admin-results-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0 1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  Showing <span style={{ fontWeight: 600 }}>{indexOfFirstItem + 1}</span> to <span style={{ fontWeight: 600 }}>{Math.min(indexOfLastItem, ideas.length)}</span> of{' '}
                  <span style={{ fontWeight: 600 }}>{ideas.length}</span> results
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
        </>
      )}
    </div>
  );
};

export default AdminPanel;