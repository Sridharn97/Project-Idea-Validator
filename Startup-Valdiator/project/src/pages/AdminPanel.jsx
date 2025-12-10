import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, Check, X, AlertCircle, Trash2, Search, Loader2 } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch ideas on mount and when filters change
  useEffect(() => {
    if (user?.token && !authLoading) {
      console.log('Fetching admin panel ideas...', { admin: user.role, token: !!user.token });
      fetchIdeas();
    }
  }, [statusFilter, searchQuery, user?.token, authLoading]);

  const fetchIdeas = async (retryCount = 0) => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      console.log('Making admin panel ideas request with params:', params);
      // ✅ API call now uses full backend URL automatically
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

      toast.success(`Idea ${status.toLowerCase()} successfully`, {
        icon: status === 'Approved' ? '✅' : '❌'
      });
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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and review submitted ideas</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ideas..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 pl-0 pr-8 border-0 bg-transparent font-medium text-gray-700 focus:ring-0 focus:outline-none appearance-none"
            >
              <option value="All">All Ideas</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {statusFilter === 'All' ? 'All Ideas' : `${statusFilter} Ideas`}
              {ideas.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {ideas.length} {ideas.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </h2>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : ideas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">No ideas found</h3>
            <p className="mt-1 text-gray-500 max-w-md mx-auto">
              {statusFilter === 'All' 
                ? 'There are no ideas submitted yet. Check back later.' 
                : `No ${statusFilter.toLowerCase()} ideas found. Try changing the filter.`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idea Title
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
                {ideas.map(idea => (
                  <tr key={idea._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/ideas/${idea._id}`} className="hover:text-blue-600 hover:underline">
                              {idea.title}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {idea.description.substring(0, 80)}...
                          </div>
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
      
      {ideas.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing <span className="font-medium">1</span> to <span className="font-medium">{ideas.length}</span> of{' '}
            <span className="font-medium">{ideas.length}</span> results
          </div>
          {/* Pagination would go here */}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;