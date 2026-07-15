import React, { useState, useEffect, useContext } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Edit, Trash, AlertCircle } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import CommentBox from '../components/comments/CommentBox';
import AuthContext from '../context/AuthContext';

const IdeaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  // ✅ Fetch idea - uses configured axios with auth headers
  const fetchIdea = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/ideas/${id}`);
      setIdea(response.data);
    } catch (error) {
      console.error('Error fetching idea:', error);
      toast.error('Failed to load idea details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle vote - uses configured axios with auth headers
  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote on ideas');
      return;
    }

    setVoteLoading(true);
    try {
      const response = await axios.post(`/api/ideas/${id}/vote`, { voteType });
      setIdea(prev => ({
        ...prev,
        votes: response.data.votes
      }));
      toast.success('Vote recorded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    } finally {
      setVoteLoading(false);
    }
  };

  // ✅ Handle delete - uses configured axios with auth headers
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        const url = isAdmin
          ? `/api/admin/ideas/${id}`
          : `/api/ideas/${id}`;
        await axios.delete(url);
        toast.success('Idea deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete idea');
      }
    }
  };

  // ✅ Handle status change - uses configured axios with auth headers
  const handleStatusChange = async (status) => {
    if (!isAdmin) return;

    try {
      await axios.put(`/api/admin/ideas/${id}/status`, { status });
      setIdea(prev => ({
        ...prev,
        status
      }));
      toast.success(`Idea marked as ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Idea Not Found</h2>
        <p className="text-gray-600 mb-4">
          The idea you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to ideas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{idea.title}</h1>
            
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getStatusColor(idea.status)}`}>
                {idea.status}
              </span>
              
              {isAdmin && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleStatusChange('Approved')}
                    disabled={idea.status === 'Approved'}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      idea.status === 'Approved'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange('Rejected')}
                    disabled={idea.status === 'Rejected'}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      idea.status === 'Rejected'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange('Pending')}
                    disabled={idea.status === 'Pending'}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      idea.status === 'Pending'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>By {idea.user?.username || 'Anonymous'}</span>
              <span className="mx-2">•</span>
              <span>Posted on {formatDate(idea.createdAt)}</span>
              {idea.createdAt !== idea.updatedAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>Updated on {formatDate(idea.updatedAt)}</span>
                </>
              )}
            </div>

            {idea.status === 'Rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-start">
                <AlertCircle className="text-red-500 h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">This idea was rejected</p>
                  <p className="text-red-700 text-sm">
                    The idea does not meet our community guidelines or has been deemed unfeasible.
                  </p>
                </div>
              </div>
            )}

            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700">{idea.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Category:</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {idea.category}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Tech Stack:</h3>
              <div className="flex flex-wrap gap-2">
                {idea.techStack && idea.techStack.map((tech, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between py-4 border-t border-gray-100">
            <div className="flex space-x-6">
              <button
                onClick={() => handleVote('up')}
                disabled={voteLoading}
                className={`flex items-center space-x-2 text-gray-700 hover:text-green-600 transition ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsUp className="h-5 w-5" />
                <span className="font-medium">{idea.votes?.up || 0}</span>
                <span className="sr-only md:not-sr-only md:inline text-sm">Upvotes</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={voteLoading}
                className={`flex items-center space-x-2 text-gray-700 hover:text-red-600 transition ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsDown className="h-5 w-5" />
                <span className="font-medium">{idea.votes?.down || 0}</span>
                <span className="sr-only md:not-sr-only md:inline text-sm">Downvotes</span>
              </button>
            </div>
            
            {isAuthenticated && (user?._id === idea.user?._id || isAdmin) && (
              <div className="flex space-x-2 mt-4 sm:mt-0">
                {user?._id === idea.user?._id && (
                  <Link
                    to={`/dashboard/edit/${idea._id}`}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                )}
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Comment Section */}
      <CommentBox ideaId={id} />
    </div>
  );
};

export default IdeaDetails;
