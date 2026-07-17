import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, Lightbulb, Edit2, Trash2, ChevronRight, Loader, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';
import IdeaForm from '../components/ideas/IdeaForm';
import IdeaCard from '../components/ideas/IdeaCard';
import AuthContext from '../context/AuthContext';
import './Dashboard.css';

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
    // Only wait for auth to finish loading, then fetch immediately
    if (!authLoading) {
      if (user?.token) {
        console.log('Fetching user ideas...', { user: user._id, token: !!user.token });
        fetchUserIdeas();
      } else {
        // If no user token after loading, set loading to false
        setLoading(false);
      }
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

  // Fetch all ideas of the logged-in user with retry logic
  const fetchUserIdeas = async (retryCount = 0) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ideas/user/ideas');
      console.log('Ideas fetched successfully:', response.data);
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      console.error('Full error:', error.response?.data);
      
      // Retry logic for network errors
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        if (retryCount < 2) {
          console.log(`Retrying... (attempt ${retryCount + 1})`);
          setTimeout(() => fetchUserIdeas(retryCount + 1), 2000);
          return;
        }
      }
      
      toast.error('Failed to load your ideas');
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific idea for editing
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

  // Delete idea
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
        return <CheckCircle className="icon-sm" />;
      case 'Rejected':
        return <XCircle className="icon-sm" />;
      default:
        return <Clock className="icon-sm" />;
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    if (activeTab === 'all') return true;
    return idea.status === activeTab;
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title text-gradient">
            {showForm ? (
              editing ? 'Edit Your Idea' : 'Share Your New Idea'
            ) : (
              'My Idea Dashboard'
            )}
          </h1>
          {!showForm && (
            <p className="dashboard-subtitle">
              {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'} found
            </p>
          )}
        </div>
        
        {!showForm && (
          <button onClick={handleNewIdea} className="btn btn-primary">
            <PlusCircle className="icon-sm" />
            <span>New Idea</span>
          </button>
        )}
      </div>

      {showForm ? (
        <div className="form-wrapper">
          <IdeaForm 
            idea={currentIdea} 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="dashboard-loader">
              <Loader className="dashboard-loader-icon spinner" />
              <p>Loading your ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon-wrapper">
                <Lightbulb className="empty-state-icon" />
              </div>
              <h2 className="empty-state-title">No Ideas Yet</h2>
              <p className="empty-state-desc">
                Your brilliant ideas deserve to be shared! Submit your first startup idea and get feedback.
              </p>
              <button onClick={handleNewIdea} className="btn btn-primary">
                <PlusCircle className="icon-sm" />
                <span>Submit Your First Idea</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="tabs-container">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`tab-btn ${activeTab === 'all' ? 'active-all' : ''}`}
                >
                  All Ideas
                </button>
                <button
                  onClick={() => setActiveTab('Pending')}
                  className={`tab-btn ${activeTab === 'Pending' ? 'active-pending' : ''}`}
                >
                  <Clock className="icon-sm" />
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('Approved')}
                  className={`tab-btn ${activeTab === 'Approved' ? 'active-approved' : ''}`}
                >
                  <CheckCircle className="icon-sm" />
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab('Rejected')}
                  className={`tab-btn ${activeTab === 'Rejected' ? 'active-rejected' : ''}`}
                >
                  <XCircle className="icon-sm" />
                  Rejected
                </button>
              </div>

              <div className="dashboard-grid">
                {filteredIdeas.map(idea => (
                  <div key={idea._id} className="dashboard-card-wrapper">
                    <IdeaCard 
                      idea={idea} 
                      showActions={false}
                    />
                    <div className="dashboard-card-footer">
                      <div className={`status-indicator ${idea.status.toLowerCase()}`}>
                        {getStatusIcon(idea.status)}
                        <span>{idea.status}</span>
                      </div>
                      <div className="dashboard-card-actions">
                        <button
                          onClick={() => handleEditIdea(idea)}
                          className="icon-btn edit"
                          title="Edit idea"
                        >
                          <Edit2 className="icon-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteIdea(idea._id)}
                          className="icon-btn delete"
                          title="Delete idea"
                        >
                          <Trash2 className="icon-sm" />
                        </button>
                        <button
                          onClick={() => navigate(`/ideas/${idea._id}`)}
                          className="icon-btn"
                          title="View details"
                        >
                          <ChevronRight className="icon-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredIdeas.length === 0 && (
                <div className="empty-state" style={{ marginTop: '2rem' }}>
                  <Lightbulb className="empty-state-icon-sm" />
                  <h3 className="empty-state-title-sm">
                    No {activeTab === 'all' ? '' : activeTab.toLowerCase() + ' '}ideas found
                  </h3>
                  <p className="empty-state-desc">
                    {activeTab === 'all' 
                      ? 'You have no ideas yet' 
                      : `You have no ${activeTab.toLowerCase()} ideas`}
                  </p>
                  {activeTab !== 'all' && (
                    <button
                      onClick={() => setActiveTab('all')}
                      className="btn btn-text"
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
