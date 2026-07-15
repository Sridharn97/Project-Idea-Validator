import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, Edit, Trash } from 'lucide-react';
import axios from '../../axiosConfig';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './IdeaCard.css';

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge badge-approved';
      case 'Rejected':
        return 'badge badge-rejected';
      case 'Pending':
        return 'badge badge-pending';
      case 'Implemented':
        return 'badge badge-default';
      default:
        return 'badge badge-default';
    }
  };

  return (
    <div className="idea-card">
      <div className="idea-card-body">
        <div className="idea-card-header">
          <div className="idea-card-title-group">
            <h3 className="idea-card-title">
              <Link to={`/ideas/${idea._id}`}>{idea.title}</Link>
            </h3>
            <div className="idea-card-meta">
              <span className="idea-author">{idea.user?.username || 'Anonymous'}</span>
              <span className="meta-dot">•</span>
              <span>{formatDate(idea.createdAt)}</span>
            </div>
          </div>
          <span className={getStatusBadge(idea.status)}>
            {idea.status}
          </span>
        </div>

        <p className="idea-desc">{idea.description}</p>
        
        <div className="idea-tags">
          {idea.category && (
            <span className="idea-tag">
              {idea.category}
            </span>
          )}
          {idea.techStack && idea.techStack.map((tech, index) => (
            <span key={index} className="idea-tag idea-tag-tech">
              {tech}
            </span>
          ))}
        </div>

        {showActions && (
          <div className="idea-card-footer">
            <div className="idea-actions">
              <button
                onClick={() => handleVote('up')}
                disabled={loading}
                className={`idea-action-btn btn-upvote ${activeVote === 'up' ? 'active' : ''}`}
              >
                <ThumbsUp className="icon-sm" />
                <span>{idea.votes?.up || 0}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={loading}
                className={`idea-action-btn btn-downvote ${activeVote === 'down' ? 'active' : ''}`}
              >
                <ThumbsDown className="icon-sm" />
                <span>{idea.votes?.down || 0}</span>
              </button>
              <Link
                to={`/ideas/${idea._id}`}
                className="idea-action-btn"
              >
                <MessageSquare className="icon-sm" />
                <span>Comments</span>
              </Link>
            </div>

            {isAuthenticated && user?._id === idea.user?._id && (
              <div className="idea-admin-actions">
                <Link
                  to={`/dashboard/edit/${idea._id}`}
                  className="admin-action-btn"
                  title="Edit idea"
                >
                  <Edit className="icon-sm" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="admin-action-btn delete"
                  title="Delete idea"
                >
                  <Trash className="icon-sm" />
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
