import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import axios from '../../axiosConfig';
import toast from 'react-hot-toast';
import './IdeaForm.css';

const CATEGORIES = [
  'SaaS', 'E-commerce', 'Mobile App', 'FinTech', 'HealthTech', 
  'EdTech', 'Social Media', 'AI/ML', 'IoT', 'Other'
];

const IdeaForm = ({ idea = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    techStack: [],
    visibility: 'public',
    agreedToTerms: false
  });
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || '',
        description: idea.description || '',
        category: idea.category || '',
        techStack: idea.techStack || [],
        visibility: idea.visibility || 'public',
        agreedToTerms: true
      });
    }
  }, [idea]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
  };

  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(techInput.trim())) {
        setFormData({
          ...formData,
          techStack: [...formData.techStack, techInput.trim()]
        });
      }
      setTechInput('');
    }
  };

  const handleAddTech = (tech) => {
    if (!formData.techStack.includes(tech)) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, tech]
      });
    }
  };

  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be 100 characters or less';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 2000) newErrors.description = 'Description must be 2000 characters or less';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.techStack.length === 0) newErrors.techStack = 'At least one technology is required';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms of use';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (idea) {
        await axios.put(`/api/ideas/${idea._id}`, formData);
        toast.success('Idea updated successfully!');
      } else {
        await axios.post('/api/ideas', formData);
        toast.success('Idea submitted successfully!');
      }

      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="idea-form-container">
      {/* Disclaimer Banner */}
      <div className="form-disclaimer">
        <AlertCircle className="disclaimer-icon icon-md" />
        <div className="disclaimer-text">
          Please ensure your idea submission is original. Any form of idea theft or misuse will result in immediate account suspension.
        </div>
      </div>

      {/* Title */}
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a catchy title for your idea"
          className={`form-input ${errors.title ? 'has-error' : ''}`}
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your startup idea in detail..."
          rows="5"
          className={`form-input ${errors.description ? 'has-error' : ''}`}
          style={{ resize: 'vertical' }}
        ></textarea>
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`form-input ${errors.category ? 'has-error' : ''}`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="form-error">{errors.category}</p>}
      </div>

      {/* Tech Stack */}
      <div className="form-group">
        <label htmlFor="techStack" className="form-label">
          Tech Stack *
        </label>
        <div className="tech-stack-tags">
          {formData.techStack.map(tech => (
            <span key={tech} className="tech-tag-editable">
              {tech}
              <button 
                type="button" 
                onClick={() => handleRemoveTech(tech)}
                className="tech-tag-remove"
              >
                <X className="icon-sm" />
              </button>
            </span>
          ))}
        </div>
        <div className="tech-input-group">
          <input
            type="text"
            id="techInput"
            value={techInput}
            onChange={handleTechInputChange}
            onKeyDown={handleTechInputKeyDown}
            placeholder="Type and press Enter to add technology"
            className={`form-input tech-input ${errors.techStack ? 'has-error' : ''}`}
          />
          <button
            type="button"
            onClick={() => {
              if (techInput.trim()) {
                handleAddTech(techInput.trim());
                setTechInput('');
              }
            }}
            className="tech-add-btn"
          >
            Add
          </button>
        </div>
        {errors.techStack && <p className="form-error">{errors.techStack}</p>}
      </div>

      {/* Terms */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="checkbox-text">
            I agree to the terms of use and confirm that this is my original idea.
          </span>
        </label>
        {errors.agreedToTerms && <p className="form-error">{errors.agreedToTerms}</p>}
      </div>

      {/* Buttons */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : idea ? 'Update Idea' : 'Submit Idea'}
        </button>
      </div>
    </form>
  );
};

export default IdeaForm;
