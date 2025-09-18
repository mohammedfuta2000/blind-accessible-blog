import React, { useState, useEffect } from 'react';

// Mock Firebase functions for demonstration
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with Web Accessibility',
    content: 'Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. This involves creating content that can be perceived, understood, navigated, and interacted with by users of all abilities.',
    publishDate: '2025-09-15',
    category: 'Accessibility'
  },
  {
    id: '2', 
    title: 'Building Semantic HTML',
    content: 'Semantic HTML provides meaning to web content beyond just presentation. Using elements like article, section, nav, and proper heading hierarchy creates a logical document structure that assistive technologies can understand.',
    publishDate: '2025-09-10',
    category: 'Development'
  }
];

// Skip Link Component
const SkipLink = () => (
  <a 
    href="#main-content"
    className="skip-link"
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('main-content')?.focus();
      }
    }}
  >
    Skip to main content
  </a>
);

// Header Component
const Header = () => (
  <header role="banner" className="site-header">
    <div className="header-content">
      <h1 className="site-title">
        <a href="#" aria-label="Accessible Blog - Home">
          Accessible Blog
        </a>
      </h1>
      <nav role="navigation" aria-label="Main navigation">
        <ul className="nav-list">
          <li><a href="#main-content" className="nav-link">Posts</a></li>
          <li><a href="#admin" className="nav-link">Add Post</a></li>
        </ul>
      </nav>
    </div>
  </header>
);

// Post Component
const BlogPost = ({ post }) => (
  <article className="blog-post" aria-labelledby={`post-title-${post.id}`}>
    <header className="post-header">
      <h2 id={`post-title-${post.id}`} className="post-title">
        {post.title}
      </h2>
      <div className="post-meta">
        <time dateTime={post.publishDate} className="post-date">
          {new Date(post.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
          })}
        </time>
        <span className="post-category" aria-label={`Category: ${post.category}`}>
          {post.category}
        </span>
      </div>
    </header>
    <div className="post-content">
      <p>{post.content}</p>
    </div>
  </article>
);

// Posts List Component
const PostsList = ({ posts, isLoading }) => {
  if (isLoading) {
    return (
      <div 
        className="loading-state" 
        role="status" 
        aria-live="polite"
        aria-label="Loading blog posts"
      >
        <p>Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No posts available yet.</p>
      </div>
    );
  }

  return (
    <section 
      className="posts-section"
      aria-label={`${posts.length} blog posts`}
    >
      <h2 className="section-title">Recent Posts</h2>
      <div className="posts-list">
        {posts.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

// Simple Admin Form Component
const AdminForm = ({ onAddPost }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        ...formData,
        id: Date.now().toString(),
        publishDate: new Date().toISOString().split('T')[0]
      };
      
      onAddPost(newPost);
      setFormData({ title: '', content: '', category: '' });
      setSubmitMessage('Post added successfully!');
    } catch (error) {
      setSubmitMessage('Error adding post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="admin" className="admin-section" aria-labelledby="admin-heading">
      <h2 id="admin-heading" className="section-title">Add New Post</h2>
      <div 
        className="admin-form"
        aria-describedby={submitMessage ? 'form-status' : undefined}
      >
        <div className="form-group">
          <label htmlFor="post-title" className="form-label">
            Post Title *
          </label>
          <input
            type="text"
            id="post-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            aria-required="true"
            className="form-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-category" className="form-label">
            Category *
          </label>
          <input
            type="text"
            id="post-category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            aria-required="true"
            className="form-input"
            disabled={isSubmitting}
            placeholder="e.g., Development, Design, Accessibility"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-content" className="form-label">
            Content *
          </label>
          <textarea
            id="post-content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            aria-required="true"
            className="form-textarea"
            rows="8"
            disabled={isSubmitting}
            placeholder="Write your blog post content here..."
          />
        </div>

        <button 
          type="button"
          onClick={handleSubmit}
          className="submit-button"
          disabled={isSubmitting}
          aria-describedby="submit-help"
        >
          {isSubmitting ? 'Adding Post...' : 'Add Post'}
        </button>
        
        <div id="submit-help" className="form-help">
          All fields are required
        </div>

        {submitMessage && (
          <div 
            id="form-status"
            role="status" 
            aria-live="polite"
            className={`form-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}
          >
            {submitMessage}
          </div>
        )}
      </div>
    </section>
  );
};

// Main App Component
const AccessibleBlog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading posts from Firebase
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setIsLoading(false);
    };

    loadPosts();
  }, []);

  const handleAddPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // Focus management for page navigation
  useEffect(() => {
    // Set page title for screen readers
    document.title = 'Accessible Blog - Level AA Compliant';
  }, []);

  return (
    <div className="app">
      <SkipLink />
      <Header />
      
      <main id="main-content" tabIndex="-1" role="main" className="main-content">
        <h1 className="visually-hidden">Blog Posts and Admin</h1>
        <PostsList posts={posts} isLoading={isLoading} />
        <AdminForm onAddPost={handleAddPost} />
      </main>

      <footer role="contentinfo" className="site-footer">
        <p>&copy; 2025 Accessible Blog. Built with accessibility in mind.</p>
      </footer>

      <style jsx>{`
        /* Reset and base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          background-color: #ffffff;
        }

        /* Skip link - hidden until focused */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #2c3e50;
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 0 0 4px 4px;
          z-index: 1000;
          transition: top 0.3s;
        }

        .skip-link:focus {
          top: 0;
        }

        /* Header */
        .site-header {
          background-color: #34495e;
          color: white;
          padding: 1rem 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .site-title a {
          color: white;
          text-decoration: none;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .site-title a:hover,
        .site-title a:focus {
          text-decoration: underline;
          outline: 2px solid #3498db;
          outline-offset: 2px;
        }

        .nav-list {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .nav-link:hover,
        .nav-link:focus {
          background-color: #2c3e50;
          outline: 2px solid #3498db;
          outline-offset: 2px;
        }

        /* Main content */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 70vh;
        }

        .main-content:focus {
          outline: none;
        }

        /* Visually hidden but available to screen readers */
        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        /* Section titles */
        .section-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 0.5rem;
        }

        /* Posts */
        .posts-section {
          margin-bottom: 4rem;
        }

        .blog-post {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.2s;
        }

        .blog-post:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .post-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .post-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #7f8c8d;
        }

        .post-date {
          font-weight: 500;
        }

        .post-category {
          background-color: #3498db;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .post-content {
          color: #34495e;
          line-height: 1.8;
        }

        /* Loading and empty states */
        .loading-state,
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        /* Admin form */
        .admin-section {
          background-color: #f8f9fa;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .admin-form {
          max-width: 600px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .form-input:disabled,
        .form-textarea:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-button {
          background-color: #27ae60;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
          margin-bottom: 1rem;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #229954;
        }

        .submit-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.3);
        }

        .submit-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .form-help {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-bottom: 1rem;
        }

        .form-message {
          padding: 0.75rem;
          border-radius: 4px;
          margin-top: 1rem;
          font-weight: 500;
        }

        .form-message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .form-message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Footer */
        .site-footer {
          background-color: #34495e;
          color: white;
          text-align: center;
          padding: 2rem;
          margin-top: 2rem;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .nav-list {
            justify-content: center;
          }

          .main-content {
            padding: 1rem;
          }

          .blog-post {
            padding: 1.5rem;
          }

          .post-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .blog-post {
            border: 2px solid #000;
          }
          
          .form-input:focus,
          .form-textarea:focus {
            border-color: #000;
            box-shadow: 0 0 0 3px #000;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AccessibleBlog;