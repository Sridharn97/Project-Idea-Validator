import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, Check, X, AlertCircle, Trash2, Search, Loader2, Edit, User as UserIcon, Calendar, Tag } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const ManageUserIdeas = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'SaaS', 'E-commerce', 'Mobile App', 'FinTech', 'HealthTech', 'EdTech', 'Social Media', 'AI/ML', 'IoT', 'Other'];

  useEffect(() => {
    // Only fetch when auth is ready
    if (!authLoading && user?.token) {
      fetchIdeas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, authLoading, user?.token]);
  
  // Fetch all ideas from admin endpoint
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Use admin endpoint to get ALL ideas regardless of status
      // Only filter by status if not 'All'
      if (statusFilter !== 'All') params.status = statusFilter;

      const response = await axios.get('/api/admin/ideas', { params });
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

      toast.success(`Idea ${status.toLowerCase()} successfully`, {
        icon: status === 'Approved' ? '✅' : '❌'
      });

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
        toast.success('Idea deleted successfully', { icon: '🗑️' });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: ideas.length,
    pending: ideas.filter(i => i.status === 'Pending').length,
    approved: ideas.filter(i => i.status === 'Approved').length,
    rejected: ideas.filter(i => i.status === 'Rejected').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage User Ideas</h1>
        <p className="text-gray-600">View, review, and manage all user-submitted ideas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ideas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ideas by title, description, user, category..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 pl-0 pr-8 border-0 bg-transparent font-medium text-gray-700 focus:ring-0 focus:outline-none appearance-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3">
            <Tag className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 pl-0 pr-8 border-0 bg-transparent font-medium text-gray-700 focus:ring-0 focus:outline-none appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 pl-0 pr-8 border-0 bg-transparent font-medium text-gray-700 focus:ring-0 focus:outline-none appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ideas Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {statusFilter === 'All' ? 'All Ideas' : `${statusFilter} Ideas`}
              {filteredIdeas.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredIdeas.length} {filteredIdeas.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">No ideas found</h3>
            <p className="mt-1 text-gray-500 max-w-md mx-auto">
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
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idea Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIdeas.map(idea => (
                  <tr key={idea._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            <Link to={`/ideas/${idea._id}`} className="hover:text-blue-600 hover:underline">
                              {idea.title}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-2">
                            {idea.description.substring(0, 120)}
                            {idea.description.length > 120 && '...'}
                          </div>
                          {idea.techStack && idea.techStack.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {idea.techStack.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                  {tech}
                                </span>
                              ))}
                              {idea.techStack.length > 3 && (
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{idea.techStack.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {idea.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {idea.user?.username?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {idea.user?.username || 'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {idea.user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(idea.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(idea.status)}`}>
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/ideas/${idea._id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        {idea.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Approved')}
                            disabled={isProcessing}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Approve Idea"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {idea.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Rejected')}
                            disabled={isProcessing}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Reject Idea"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {idea.status !== 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Pending')}
                            disabled={isProcessing}
                            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                            title="Set to Pending"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteIdea(idea._id)}
                          disabled={isProcessing}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Idea"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
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

      {/* Results Info */}
      {filteredIdeas.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredIdeas.length}</span> of{' '}
            <span className="font-medium">{filteredIdeas.length}</span> results
            {searchQuery && ideas.length !== filteredIdeas.length && (
              <span className="ml-2 text-gray-400">
                (filtered from {ideas.length} total)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserIdeas;
