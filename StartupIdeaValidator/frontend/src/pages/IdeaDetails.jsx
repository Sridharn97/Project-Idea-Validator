import React, { useState, useEffect, useContext } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Edit, Trash, AlertCircle } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import CommentBox from '../components/comments/CommentBox';
import AuthContext from '../context/AuthContext';
import DOMPurify from 'dompurify';
import './IdeaDetails.css';

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

  // Fetch idea - uses configured axios with auth headers
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

  // Handle vote - uses configured axios with auth headers
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

  // Handle delete - uses configured axios with auth headers
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

  // Handle status change - uses configured axios with auth headers
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
      <div className="dashboard-loader" style={{ padding: '5rem 0' }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderTopColor: 'var(--primary)', borderRightColor: 'var(--primary)', borderBottomColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="empty-state" style={{ marginTop: '3rem' }}>
        <h2 className="empty-state-title">Idea Not Found</h2>
        <p className="empty-state-desc">
          The idea you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="back-link" style={{ justifyContent: 'center' }}>
          <ArrowLeft className="icon-sm" />
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
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'badge badge-approved';
      case 'Rejected': return 'badge badge-rejected';
      case 'Pending': return 'badge badge-pending';
      default: return 'badge badge-default';
    }
  };

  // Sanitize HTML description
  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="idea-details-page">
      <div>
        <Link to="/" className="back-link">
          <ArrowLeft className="icon-sm" />
          Back to ideas
        </Link>
      </div>

      <div className="idea-details-card">
        <div className="idea-details-header">
          <div className="idea-title-row">
            <h1 className="idea-title">{idea.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={getStatusBadgeClass(idea.status)}>
                {idea.status}
              </span>
              
              {isAdmin && (
                <div className="admin-action-btns">
                  <button
                    onClick={() => handleStatusChange('Approved')}
                    disabled={idea.status === 'Approved'}
                    className="admin-btn admin-btn-approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange('Rejected')}
                    disabled={idea.status === 'Rejected'}
                    className="admin-btn admin-btn-reject"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange('Pending')}
                    disabled={idea.status === 'Pending'}
                    className="admin-btn admin-btn-pending"
                  >
                    Pending
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="idea-meta-row">
            <span>By <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{idea.user?.username || 'Anonymous'}</span></span>
            <span className="meta-separator">•</span>
            <span>Posted on {formatDate(idea.createdAt)}</span>
            {idea.createdAt !== idea.updatedAt && (
              <>
                <span className="meta-separator">•</span>
                <span>Updated on {formatDate(idea.updatedAt)}</span>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {idea.status === 'Rejected' && (
            <div className="rejection-banner">
              <AlertCircle className="rejection-icon icon-md" />
              <div>
                <p className="rejection-title">This idea was rejected</p>
                <p className="rejection-desc">
                  The idea does not meet our community guidelines or has been deemed unfeasible.
                </p>
              </div>
            </div>
          )}

          <div 
            className="idea-description-content quill-content"
            dangerouslySetInnerHTML={createMarkup(idea.description)}
          />

          <div className="idea-details-section">
            <h3 className="section-title">Category:</h3>
            <span className="badge badge-default">
              {idea.category}
            </span>
          </div>

          <div className="idea-details-section">
            <h3 className="section-title">Tech Stack:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {idea.techStack && idea.techStack.map((tech, index) => (
                <span key={index} className="badge" style={{ background: '#faf5ff', color: '#7e22ce', border: '1px solid #f3e8ff' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="idea-details-footer">
          <div className="vote-actions">
            <button
              onClick={() => handleVote('up')}
              disabled={voteLoading}
              className="vote-btn upvote"
            >
              <ThumbsUp className="icon-md" />
              <span style={{ fontSize: '1.125rem' }}>{idea.votes?.up || 0}</span>
              <span className="vote-label">Upvotes</span>
            </button>
            <button
              onClick={() => handleVote('down')}
              disabled={voteLoading}
              className="vote-btn downvote"
            >
              <ThumbsDown className="icon-md" />
              <span style={{ fontSize: '1.125rem' }}>{idea.votes?.down || 0}</span>
              <span className="vote-label">Downvotes</span>
            </button>
          </div>
          
          {isAuthenticated && (user?._id === idea.user?._id || isAdmin) && (
            <div className="owner-actions">
              {user?._id === idea.user?._id && (
                <Link
                  to={`/dashboard/edit/${idea._id}`}
                  className="owner-btn owner-btn-edit"
                >
                  <Edit className="icon-sm" />
                  <span>Edit</span>
                </Link>
              )}
              <button
                onClick={handleDelete}
                className="owner-btn owner-btn-delete"
              >
                <Trash className="icon-sm" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Section */}
      <CommentBox ideaId={id} />
    </div>
  );
};

export default IdeaDetails;
