import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Target, ShieldCheck, Users, CheckCircle, Star } from 'lucide-react';
import './Home.css';

const stats = [
  { value: '50,000+', label: 'Ideas Validated' },
  { value: '12,000+', label: 'Active Founders' },
  { value: '1M+',     label: 'Feedback Points' },
  { value: '88%',     label: 'Success Rate' },
];

const features = [
  {
    icon: <Lightbulb className="icon-md" />,
    title: 'Smart Idea Structuring',
    desc: 'Our template ensures you articulate the problem, solution, and market clearly before seeking feedback.',
  },
  {
    icon: <Users className="icon-md" />,
    title: 'Targeted Community',
    desc: 'Get feedback from developers, designers, and serial entrepreneurs who give you honest input.',
  },
  {
    icon: <ShieldCheck className="icon-md" />,
    title: 'Honest Validation',
    desc: 'Verify if your concept has legs. No more wasted months building products nobody wants.',
  },
];

const steps = [
  { num: '01', title: 'Submit Your Pitch', desc: 'Detail your startup concept, define the problem, and explain your proposed solution.' },
  { num: '02', title: 'Community Review', desc: 'Our network of founders and builders reviews your idea and provides actionable feedback.' },
  { num: '03', title: 'Iterate & Launch', desc: 'Use the feedback to refine your idea and start building with confidence.' },
];

const Home = () => {

  return (
    <div className="hp-page">

      {/* HERO */}
      <section className="hp-hero">
        <div className="hp-container">
          <div className="hp-hero-layout">
            <div className="hp-hero-content">
              <div className="hp-badge">
                <span className="hp-badge-dot" />
                Community Feedback Platform
              </div>

              <h1 className="hp-headline">
                Validate Your Startup Idea<br />
                <span className="hp-headline-accent">Before You Build</span>
              </h1>

              <p className="hp-sub">
                Put your startup concepts in front of experienced builders and get honest feedback to find product-market fit.
              </p>

              <div className="hp-hero-actions">
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Start Validating Free</Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>Sign In</Link>
              </div>

              <div className="hp-social-proof">
                <div className="hp-avatars">
                  {['JD', 'AS', 'MK', 'RB'].map((init) => (
                    <div key={init} className="hp-avatar">{init}</div>
                  ))}
                </div>
                <div>
                  <div className="hp-stars">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="icon-sm" style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                    ))}
                  </div>
                  <p className="hp-social-text">Trusted by <strong>12,000+</strong> founders</p>
                </div>
              </div>
            </div>

            <div className="hp-hero-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80" 
                alt="Startup founder working on laptop" 
                className="hp-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="hp-stats">
        <div className="hp-container">
          <div className="hp-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="hp-stat">
                <p className="hp-stat-value">{s.value}</p>
                <p className="hp-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="hp-section-alt">
        <div className="hp-container">
          <div className="hp-section-head">
            <p className="hp-eyebrow">Why StartupValidator?</p>
            <h2 className="hp-section-title">The Smartest Way to Validate</h2>
            <p className="hp-section-desc">
              Built with proven validation frameworks designed by experienced founders to ensure you never waste time on unproven ideas.
            </p>
          </div>
          <div className="hp-features-grid">
            {features.map((f) => (
              <div key={f.title} className="hp-feature-card">
                <div className="hp-feature-icon">{f.icon}</div>
                <h3 className="hp-feature-title">{f.title}</h3>
                <p className="hp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="hp-steps-section">
        <div className="hp-container">
          <div className="hp-section-head">
            <p className="hp-eyebrow">Simple Process</p>
            <h2 className="hp-section-title">Three Steps to Validation</h2>
            <p className="hp-section-desc">We've simplified the complex world of product validation into a streamlined 3-step experience.</p>
          </div>
          <div className="hp-steps-grid">
            {steps.map((step) => (
              <div key={step.num} className="hp-step-card">
                <div className="hp-step-num">{step.num}</div>
                <h4 className="hp-step-title">{step.title}</h4>
                <p className="hp-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hp-cta">
        <div className="hp-container">
          <h2 className="hp-cta-title">Start Validating Your Idea Today</h2>
          <p className="hp-cta-desc">
            Join 12,000+ founders who have already found their perfect product-market fit. Free to get started.
          </p>
          <div className="hp-cta-buttons">
            <Link to="/register" className="hp-cta-btn-white">Create Free Account</Link>
            <Link to="/login" className="hp-cta-btn-outline">Sign In</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
