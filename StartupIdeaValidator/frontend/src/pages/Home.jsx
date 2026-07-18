import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Target, Rocket, ArrowRight, ShieldCheck, Users, CheckCircle, Search, Star, Loader, Filter } from 'lucide-react';
import axios from '../axiosConfig';
import IdeaCard from '../components/ideas/IdeaCard';
import toast from 'react-hot-toast';
import './Home.css';

const stats = [
  { value: '50,000+', label: 'Ideas Validated' },
  { value: '12,000+', label: 'Active Founders' },
  { value: '1M+', label: 'Feedback Points' },
  { value: '88%', label: 'Success Rate' },
];

const features = [
  {
    icon: <Lightbulb className="icon-md" />,
    colorClass: 'purple',
    title: 'Smart Idea Structuring',
    desc: 'Our proprietary template ensures you articulate the problem, solution, and market perfectly before seeking feedback.',
  },
  {
    icon: <Users className="icon-md" />,
    colorClass: 'violet',
    title: 'Targeted Community',
    desc: 'Get feedback from the right people. Our community consists of developers, designers, and serial entrepreneurs.',
  },
  {
    icon: <ShieldCheck className="icon-md" />,
    colorClass: 'emerald',
    title: 'Honest Validation',
    desc: 'Instantly verify if your concept has legs. No more wasted months building products nobody wants to use.',
  },
];

const steps = [
  { num: '01', title: 'Submit Your Pitch', desc: 'Detail your startup concept, define the problem, and explain your unique proposed solution.' },
  { num: '02', title: 'Community Review', desc: 'Our active network of founders and builders will review your idea and provide actionable feedback.' },
  { num: '03', title: 'Iterate & Launch', desc: 'Use the data to pivot, refine, and start building your product with absolute confidence.' },
];

const Home = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('trending');

  useEffect(() => {
    fetchIdeas();
  }, [category, sortBy]); // Fetch on filter change

  const fetchIdeas = async (searchQuery = search) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/ideas', {
        params: { search: searchQuery, category, sortBy }
      });
      setIdeas(res.data);
    } catch (err) {
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIdeas(search);
  };

  return (
    <div className="sq-page">
      
      {/* ======================== HERO ======================== */}
      <section className="sq-hero">
        <div className="sq-container sq-hero-grid">
          
          {/* Left — Copy */}
          <div className="sq-hero-content">
            {/* Badge */}
            <div className="sq-badge">
              <span className="sq-badge-dot" />
              <span className="sq-badge-text">Powered by Real Community Feedback</span>
            </div>

            {/* Headline */}
            <h1 className="sq-hero-headline sq-text-title">
              Validate Startup Ideas<br />
              <span className="text-primary">Tailored</span>{' '}
              <span className="sq-text-gradient">For Success</span>
            </h1>

            {/* Sub */}
            <p className="sq-hero-desc sq-text-body">
              Skip building in the dark. Our platform puts your startup concepts in front of experienced builders to help you find perfect product-market fit.
            </p>

            {/* Action Bar (Replaces Search Bar) */}
            <form className="sq-hero-action-bar" onSubmit={handleSearchSubmit} style={{ display: 'flex', background: 'white', padding: '0.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <div className="sq-action-text" style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Search className="icon-sm text-primary" style={{ marginLeft: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search for an idea, tech stack..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', padding: '0.5rem', width: '100%', marginLeft: '0.5rem' }}
                />
              </div>
              <button type="submit" className="sq-action-btn" style={{ borderRadius: '0.25rem', padding: '0.5rem 1rem' }}>
                Search
              </button>
            </form>

            {/* Social proof */}
            <div className="sq-social-proof">
              <div className="sq-avatar-group">
                {['JD', 'AS', 'MK', 'RB'].map((init) => (
                  <div key={init} className="sq-avatar">
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="sq-stars">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="icon-sm" style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                  ))}
                </div>
                <p className="sq-social-text">Trusted by <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>12,000+</span> founders this month</p>
              </div>
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="sq-hero-visual">
            <div className="sq-orb-1" />
            <div className="sq-orb-2" />
            
            <div className="sq-hero-image-box">
              <img src="/auth-bg.png" alt="Startup Validation" className="sq-hero-image" />
            </div>

            {/* Floating badge — top left */}
            <div className="sq-floating-badge top-left">
              <div className="sq-badge-icon-box green">
                <CheckCircle className="icon-md" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Idea Status</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Validated! 🎉</p>
              </div>
            </div>

            {/* Floating badge — bottom right */}
            <div className="sq-floating-badge bottom-right">
              <div className="sq-badge-icon-box purple">
                <Target className="icon-md" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Market Fit Score</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)' }}>98% Match ✨</p>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Strip */}
        <div className="sq-container sq-stats-strip">
          <div className="sq-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="sq-stat-card">
                <p className="sq-stat-value">{stat.value}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FEATURES ======================== */}
      <section className="sq-features-section">
        <div className="sq-container">
          <div className="sq-section-header">
            <p className="sq-section-eyebrow">Why Startup Validator?</p>
            <h2 className="sq-section-title sq-text-title">The Smartest Way to Build</h2>
            <p className="sq-text-body" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
              Built with proven validation frameworks and designed by experienced founders to ensure you never waste time on unproven ideas.
            </p>
          </div>

          <div className="sq-features-grid">
            {features.map((f) => (
              <div key={f.title} className="sq-feature-box">
                <div className={`sq-feature-icon-wrapper ${f.colorClass}`}>
                  {f.icon}
                </div>
                <h3 className="sq-text-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p className="sq-text-body" style={{ lineHeight: 1.6, flexGrow: 1 }}>{f.desc}</p>
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <Link to="/register" style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Learn more <ArrowRight className="icon-sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Feature highlight (Split View) */}
          <div className="sq-highlight-box">
            <div className="sq-highlight-content">
              <div className="sq-highlight-badge">
                <Target className="icon-sm text-secondary" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)' }}>Community Feedback Engine</span>
              </div>
              <h3 className="sq-text-title" style={{ fontSize: '1.875rem', lineHeight: 1.2 }}>
                10x More Honest Than Asking Your Friends
              </h3>
              <p className="sq-text-body" style={{ lineHeight: 1.6 }}>
                While friends and family will tell you your idea is great to protect your feelings, our platform puts your concept in front of objective builders who will tell you the truth.
              </p>
              <ul className="sq-highlight-list">
                {['Analyzes problem-solution fit', 'Identifies target market gaps', 'Explains technical feasibility'].map((item) => (
                  <li key={item} className="sq-highlight-item">
                    <CheckCircle className="icon-sm text-primary" />
                    <span className="sq-text-body" style={{ color: 'var(--text-primary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="sq-action-btn" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                Try Validation Free
              </Link>
            </div>
            
            <div className="sq-highlight-visual">
              <div className="sq-highlight-orb" />
              <img src="/startup-auth-bg.png" alt="Validation Process" className="sq-highlight-image" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================== IDEAS FEED ======================== */}
      <section className="sq-features-section" style={{ backgroundColor: '#f9fafb' }}>
        <div className="sq-container">
          <div className="sq-section-header" style={{ marginBottom: '2rem' }}>
            <h2 className="sq-section-title sq-text-title">Explore Startup Ideas</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                <Filter className="icon-sm text-gray-500 mr-2" />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent' }}
                >
                  <option value="">All Categories</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="Social Media">Social Media</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="IoT">IoT</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent' }}
                >
                  <option value="trending">🔥 Trending</option>
                  <option value="newest">✨ Newest</option>
                  <option value="oldest">🕰️ Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <Loader className="spinner" style={{ width: '3rem', height: '3rem', color: 'var(--primary)' }} />
            </div>
          ) : ideas.length > 0 ? (
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {ideas.map((idea) => (
                <div key={idea._id} style={{ background: 'white', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                  <IdeaCard 
                    idea={idea} 
                    onVote={() => fetchIdeas()}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ background: 'white', padding: '4rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <Lightbulb className="icon-md" style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No ideas found</h3>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* ======================== HOW IT WORKS ======================== */}
      <section className="sq-steps-section">
        <div className="sq-container">
          <div className="sq-section-header">
            <p className="sq-section-eyebrow">Simple Process</p>
            <h2 className="sq-section-title sq-text-title">Three Steps to Validation</h2>
            <p className="sq-text-body" style={{ fontSize: '1.125rem' }}>We've simplified the complex world of product validation into a streamlined, 3-step experience.</p>
          </div>

          <div className="sq-steps-container">
            <div className="sq-steps-line" />
            
            {steps.map((step, i) => (
              <div key={step.num} className="sq-step-card">
                <div className="sq-step-number">{step.num}</div>
                <h4 className="sq-text-title" style={{ fontSize: '1.25rem' }}>{step.title}</h4>
                <p className="sq-text-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FINAL CTA ======================== */}
      <section className="sq-cta-section">
        <div className="sq-container" style={{ maxWidth: '48rem' }}>
          <h2 className="sq-cta-title sq-text-title">
            Your Startup Journey Starts Today
          </h2>
          <p className="sq-cta-desc">
            Join 12,000+ founders who have already found their perfect product-market fit. It's free to get started.
          </p>
          <div className="sq-cta-buttons">
            <Link to="/register" className="sq-btn-white">
              Create Free Account
            </Link>
            <Link to="/login" className="sq-btn-outline-white">
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
