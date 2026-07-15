import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, Edit, Trash } from 'lucide-react';
import axios from '../../axiosConfig';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';

const IdeaCard = ({ idea, onVote, onDelete, showActions = true }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [activeVote, setActiveVote] = useState(null);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote on ideas');
      return;
    }

    setLoading(true);
    setActiveVote(voteType);
    try {
      const response = await axios.post(`/api/ideas/${idea._id}/vote`, { voteType });
      onVote(idea._id, response.data.votes);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    } finally {
      setLoading(false);
      setTimeout(() => setActiveVote(null), 1000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await axios.delete(`/api/ideas/${idea._id}`);
        onDelete(idea._id);
        toast.success('Idea deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete idea');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Implemented':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 group">
      <div className="p-6">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              <Link to={`/ideas/${idea._id}`} className="hover:underline">{idea.title}</Link>
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-gray-700 font-medium">{idea.user?.username || 'Anonymous'}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span>{formatDate(idea.createdAt)}</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(idea.status)}`}>
            {idea.status}
          </span>
        </div>

        <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">{idea.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {idea.category && (
            <span className="text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-3 py-1.5 border border-blue-100">
              {idea.category}
            </span>
          )}
          {idea.techStack && idea.techStack.map((tech, index) => (
            <span key={index} className="text-xs font-medium bg-purple-50 text-purple-700 rounded-full px-3 py-1.5 border border-purple-100">
              {tech}
            </span>
          ))}
        </div>

        {showActions && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex gap-4">
              <button
                onClick={() => handleVote('up')}
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeVote === 'up' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <ThumbsUp className={`h-4 w-4 ${activeVote === 'up' ? 'fill-emerald-500' : ''}`} />
                <span className="text-sm font-medium">{idea.votes?.up || 0}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeVote === 'down' ? 'bg-rose-50 text-rose-600' : 'text-gray-500 hover:bg-gray-50'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <ThumbsDown className={`h-4 w-4 ${activeVote === 'down' ? 'fill-rose-500' : ''}`} />
                <span className="text-sm font-medium">{idea.votes?.down || 0}</span>
              </button>
              <Link
                to={`/ideas/${idea._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Comments</span>
              </Link>
            </div>

            {isAuthenticated && user?._id === idea.user?._id && (
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/edit/${idea._id}`}
                  className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit idea"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete idea"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
