import React, { useState, useEffect, useContext } from 'react';
import axios from '../../axiosConfig';
import { Send, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';
import './CommentBox.css';

const CommentBox = ({ ideaId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments/${ideaId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`/api/comments/${ideaId}`, {
        content: commentText
      });
      setComments(prevComments => [response.data, ...prevComments]);
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setLoading(true);
      const url = isAdmin 
        ? `/api/admin/comments/${commentId}`
        : `/api/comments/${commentId}`;
      
      await axios.delete(url);
      setComments(prevComments => prevComments.filter(c => c._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">Discussion</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="comment-form-layout">
            <div className="comment-input-wrapper">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="comment-textarea"
                disabled={loading}
              ></textarea>
              <p className="comment-hint">Markdown is supported</p>
            </div>
            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              className="comment-submit-btn"
              aria-label="Post comment"
            >
              <Send className="icon-sm" />
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p>
            <a href="/login">Sign in</a> to join the conversation
          </p>
        </div>
      )}

      {loading && comments.length === 0 ? (
        <div className="comments-loading">
          <div className="pulse-skeleton">
            <div className="skeleton-line-1"></div>
            <div className="skeleton-line-2"></div>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="empty-comments">
          <div>
            <p>No comments yet</p>
            <p className="empty-comments-sub">Start the discussion!</p>
          </div>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-layout">
                <div className="comment-content-wrapper">
                  <div className="comment-header">
                    <span className="comment-author">{comment.user?.username || 'Anonymous'}</span>
                    <span className="meta-separator">•</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="comment-body">
                    {comment.content}
                  </div>
                </div>
                
                {(isAuthenticated && (user?._id === comment.user?._id || isAdmin)) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="comment-delete-btn"
                    aria-label="Delete comment"
                  >
                    <Trash className="icon-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
