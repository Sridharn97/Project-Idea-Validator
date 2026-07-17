import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Target, Rocket, ArrowRight, ShieldCheck, Users, CheckCircle, Search, Star } from 'lucide-react';
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
            <div className="sq-hero-action-bar">
              <div className="sq-action-text">
                <Search className="icon-sm text-primary" />
                <span>Ready to validate your next big idea?</span>
              </div>
              <Link to="/register" className="sq-action-btn">
                Get Started Free
              </Link>
            </div>

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
