import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, Lightbulb, Edit2, Trash2, ChevronRight, Loader, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import IdeaForm from '../components/ideas/IdeaForm';
import IdeaCard from '../components/ideas/IdeaCard';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentIdea, setCurrentIdea] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Fetch ideas when user is authenticated and auth context is done loading
    if (user?.token && !authLoading) {
      fetchUserIdeas();
    }
  }, [user?.token, authLoading]);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.includes('edit') && pathParts.length > 3) {
      const editIdea = ideas.find(idea => idea._id === pathParts[3]);
      if (editIdea) {
        setCurrentIdea(editIdea);
        setEditing(true);
        setShowForm(true);
      } else if (ideas.length > 0) {
        fetchIdeaToEdit(pathParts[3]);
      }
    }
  }, [window.location.pathname, ideas]);

  // ✅ Fetch all ideas of the logged-in user
  const fetchUserIdeas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ideas/user/ideas');
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      console.error('Full error:', error.response?.data);
      toast.error('Failed to load your ideas');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch specific idea for editing
  const fetchIdeaToEdit = async (ideaId) => {
    try {
      const response = await axios.get(`/api/ideas/${ideaId}`);
      if (response.data.user._id === user._id) {
        setCurrentIdea(response.data);
        setEditing(true);
        setShowForm(true);
      } else {
        toast.error("You don't have permission to edit this idea");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching idea to edit:', error);
      toast.error('Failed to load idea for editing');
      navigate('/dashboard');
    }
  };

  const handleNewIdea = () => {
    setCurrentIdea(null);
    setEditing(false);
    setShowForm(true);
  };

  const handleEditIdea = (idea) => {
    setCurrentIdea(idea);
    setEditing(true);
    setShowForm(true);
    window.history.pushState({}, '', `/dashboard/edit/${idea._id}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentIdea(null);
    setEditing(false);
    fetchUserIdeas();
    if (editing) {
      window.history.pushState({}, '', '/dashboard');
    }
    toast.success(editing ? 'Idea updated successfully!' : 'Idea submitted successfully!');
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentIdea(null);
    setEditing(false);
    if (editing) {
      window.history.pushState({}, '', '/dashboard');
    }
  };

  // ✅ Delete idea
  const handleDeleteIdea = async (ideaId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this idea?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/ideas/${ideaId}`);
      setIdeas(ideas.filter(idea => idea._id !== ideaId));
      toast.success('Idea deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete idea');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    if (activeTab === 'all') return true;
    return idea.status === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {showForm ? (
              editing ? 'Edit Your Idea' : 'Share Your New Idea'
            ) : (
              'My Idea Dashboard'
            )}
          </h1>
          {!showForm && (
            <p className="text-gray-600 mt-1">
              {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'} found
            </p>
          )}
        </div>
        
        {!showForm && (
          <button
            onClick={handleNewIdea}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Idea</span>
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <IdeaForm 
            idea={currentIdea} 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="animate-spin h-12 w-12 text-blue-500 mb-4" />
              <p className="text-gray-600">Loading your ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Ideas Yet</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your brilliant ideas deserve to be shared! Submit your first startup idea and get feedback.
              </p>
              <button
                onClick={handleNewIdea}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Submit Your First Idea</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All Ideas
                </button>
                <button
                  onClick={() => setActiveTab('Pending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${activeTab === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Clock className="h-4 w-4" />
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('Approved')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${activeTab === 'Approved' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab('Rejected')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${activeTab === 'Rejected' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <XCircle className="h-4 w-4" />
                  Rejected
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredIdeas.map(idea => (
                  <div 
                    key={idea._id} 
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100"
                  >
                    <IdeaCard 
                      idea={idea} 
                      showActions={false}
                    />
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {getStatusIcon(idea.status)}
                        <span className={`${idea.status === 'Approved' ? 'text-green-700' : idea.status === 'Rejected' ? 'text-red-700' : 'text-yellow-700'}`}>
                          {idea.status}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditIdea(idea)}
                          className="text-gray-500 hover:text-blue-600 transition p-1.5 rounded-full hover:bg-blue-50"
                          title="Edit idea"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIdea(idea._id)}
                          className="text-gray-500 hover:text-red-600 transition p-1.5 rounded-full hover:bg-red-50"
                          title="Delete idea"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/ideas/${idea._id}`)}
                          className="text-gray-500 hover:text-gray-700 transition p-1.5 rounded-full hover:bg-gray-100"
                          title="View details"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredIdeas.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                  <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No {activeTab === 'all' ? '' : activeTab.toLowerCase() + ' '}ideas found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'all' 
                      ? 'You have no ideas yet' 
                      : `You have no ${activeTab.toLowerCase()} ideas`}
                  </p>
                  {activeTab !== 'all' && (
                    <button
                      onClick={() => setActiveTab('all')}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View all ideas
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
