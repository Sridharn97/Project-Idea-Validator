import React, { useState, useEffect, useContext } from 'react';
import axios from '../../axiosConfig';
import { Send, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

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
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Discussion</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-grow">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none"
                rows="3"
                disabled={loading}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Markdown is supported</p>
            </div>
            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              className={`mt-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                (loading || !commentText.trim()) ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
              }`}
              aria-label="Post comment"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-8 border border-blue-100">
          <p className="text-blue-800">
            <a href="/login" className="font-semibold underline hover:text-blue-600 transition-colors">Sign in</a> to join the conversation
          </p>
        </div>
      )}

      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-3 w-32 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-400 flex flex-col items-center">
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400">Start the discussion!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map(comment => (
            <div key={comment._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                    <span className="font-semibold text-gray-900">{comment.user?.username || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="prose prose-sm max-w-none mt-2 text-gray-700">
                    {comment.content}
                  </div>
                </div>
                
                {(isAuthenticated && (user?._id === comment.user?._id || isAdmin)) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                    aria-label="Delete comment"
                  >
                    <Trash className="h-4 w-4" />
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
