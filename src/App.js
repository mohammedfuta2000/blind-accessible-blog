import React, { useState, useEffect, useRef, useCallback } from 'react';

// Mock Firebase functions for demonstration
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with Web Accessibility',
    content: 'Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. This involves creating content that can be perceived, understood, navigated, and interacted with by users of all abilities.',
    publishDate: '2025-09-15',
    category: 'Accessibility',
    image: null,
    imageAlt: ''
  },
  {
    id: '2', 
    title: 'Building Semantic HTML',
    content: 'Semantic HTML provides meaning to web content beyond just presentation. Using elements like article, section, nav, and proper heading hierarchy creates a logical document structure that assistive technologies can understand.',
    publishDate: '2025-09-10',
    category: 'Development',
    image: null,
    imageAlt: ''
  },
  {
    id: '3',
    title: 'ARIA Best Practices',
    content: 'ARIA (Accessible Rich Internet Applications) attributes provide semantic information about elements to assistive technologies. They should be used to enhance, not replace, semantic HTML.',
    publishDate: '2025-09-05',
    category: 'Accessibility',
    image: null,
    imageAlt: ''
  },
  {
    id: '4',
    title: 'Responsive Design Principles',
    content: 'Responsive design ensures your content works across all device sizes and orientations. This includes flexible layouts, scalable images, and touch-friendly interfaces.',
    publishDate: '2025-08-30',
    category: 'Design',
    image: null,
    imageAlt: ''
  }
];

// Announcement System Component
const AnnouncementSystem = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [politeRegion, setPoliteRegion] = useState('');
  const [assertiveRegion, setAssertiveRegion] = useState('');

  // Global announcement function
  window.announceToScreenReader = (message, priority = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveRegion(message);
      setTimeout(() => setAssertiveRegion(''), 1000);
    } else {
      setPoliteRegion(message);
      setTimeout(() => setPoliteRegion(''), 1000);
    }
  };

  return (
    <div className="announcement-system">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
        role="status"
      >
        {politeRegion}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="visually-hidden"
        role="alert"
      >
        {assertiveRegion}
      </div>
    </div>
  );
};

// Skip Link Component
const SkipLink = () => (
  <div className="skip-links">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <a href="#search" className="skip-link">Skip to search</a>
    <a href="#admin" className="skip-link">Skip to add post</a>
  </div>
);

// Search Component
const SearchComponent = ({ posts, onFilteredPosts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchInputRef = useRef(null);

  const categories = ['all', ...new Set(posts.map(post => post.category))];

  const handleSearch = useCallback((term, category) => {
    let filtered = posts;

    if (term) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.content.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }

    onFilteredPosts(filtered);
    
    // Announce results to screen reader
    const resultCount = filtered.length;
    const announcement = `Search updated. ${resultCount} ${resultCount === 1 ? 'post' : 'posts'} found${term ? ` for "${term}"` : ''}${category !== 'all' ? ` in ${category}` : ''}.`;
    window.announceToScreenReader(announcement);
  }, [posts, onFilteredPosts]);

  useEffect(() => {
    handleSearch(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, handleSearch]);

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    searchInputRef.current?.focus();
    window.announceToScreenReader('Search cleared. Showing all posts.');
  };

  return (
    <section id="search" className="search-section" aria-labelledby="search-heading">
      <h2 id="search-heading" className="section-title">Search & Filter Posts</h2>
      
      <div className="search-controls">
        <div className="search-group">
          <label htmlFor="search-input" className="search-label">
            Search posts
          </label>
          <div className="search-input-wrapper">
            <input
              ref={searchInputRef}
              type="search"
              id="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or content..."
              className="search-input"
              aria-describedby="search-help"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="clear-search-button"
                aria-label="Clear search"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
          <div id="search-help" className="search-help">
            Search through post titles and content
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  const pageNumbers = [];
  const showPages = 5; // Show 5 page numbers at a time
  
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage < showPages - 1) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page, announcement) => {
    onPageChange(page);
    window.announceToScreenReader(announcement);
  };

  if (totalPages <= 1) return null;

  return (
    <nav role="navigation" aria-label="Blog posts pagination" className="pagination-nav">
      <div className="pagination-info" aria-live="polite">
        Page {currentPage} of {totalPages} ({totalItems} total posts)
      </div>
      
      <ul className="pagination-list">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1, `Moved to page ${currentPage - 1}`)}
              className="pagination-button pagination-prev"
              aria-label="Go to previous page"
            >
              ← Previous
            </button>
          </li>
        )}
        
        {startPage > 1 && (
          <>
            <li>
              <button
                onClick={() => handlePageChange(1, 'Moved to page 1')}
                className="pagination-button"
                aria-label="Go to page 1"
              >
                1
              </button>
            </li>
            {startPage > 2 && <li className="pagination-ellipsis">...</li>}
          </>
        )}
        
        {pageNumbers.map(page => (
          <li key={page}>
            <button
              onClick={() => handlePageChange(page, `Moved to page ${page}`)}
              className={`pagination-button ${currentPage === page ? 'pagination-current' : ''}`}
              aria-label={currentPage === page ? `Current page, page ${page}` : `Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <li className="pagination-ellipsis">...</li>}
            <li>
              <button
                onClick={() => handlePageChange(totalPages, `Moved to page ${totalPages}`)}
                className="pagination-button"
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1, `Moved to page ${currentPage + 1}`)}
              className="pagination-button pagination-next"
              aria-label="Go to next page"
            >
              Next →
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

// Dark Mode Toggle
const DarkModeToggle = ({ isDarkMode, onToggle }) => (
  <button
    onClick={onToggle}
    className="dark-mode-toggle"
    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    aria-pressed={isDarkMode}
  >
    <span aria-hidden="true">{isDarkMode ? '☀️' : '🌙'}</span>
    <span className="dark-mode-text">
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </span>
  </button>
);

// Header Component
const Header = ({ isDarkMode, onDarkModeToggle }) => (
  <header role="banner" className="site-header">
    <div className="header-content">
      <h1 className="site-title">
        <a href="#" aria-label="Accessible Blog - Home">
          Accessible Blog
        </a>
      </h1>
      <div className="header-controls">
        <nav role="navigation" aria-label="Main navigation">
          <ul className="nav-list">
            <li><a href="#search" className="nav-link">Search</a></li>
            <li><a href="#main-content" className="nav-link">Posts</a></li>
            <li><a href="#admin" className="nav-link">Add Post</a></li>
          </ul>
        </nav>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={onDarkModeToggle} />
      </div>
    </div>
  </header>
);

// Post Component
const BlogPost = ({ post, isHighlighted = false }) => (
  <article 
    className={`blog-post ${isHighlighted ? 'blog-post-highlighted' : ''}`}
    aria-labelledby={`post-title-${post.id}`}
  >
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
    
    {post.image && (
      <div className="post-image-wrapper">
        <img 
          src={post.image} 
          alt={post.imageAlt || 'Blog post image'} 
          className="post-image"
          loading="lazy"
        />
      </div>
    )}
    
    <div className="post-content">
      <p>{post.content}</p>
    </div>
  </article>
);

// Posts List Component
const PostsList = ({ posts, isLoading, currentPage, postsPerPage }) => {
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  if (isLoading) {
    return (
      <div 
        className="loading-state" 
        role="status" 
        aria-live="polite"
        aria-label="Loading blog posts"
      >
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No posts match your current search or filter criteria.</p>
      </div>
    );
  }

  return (
    <section 
      className="posts-section"
      aria-label={`${posts.length} blog posts, showing ${currentPosts.length} on page ${currentPage}`}
    >
      <h2 className="section-title">
        Recent Posts
        <span className="posts-count">({posts.length} total)</span>
      </h2>
      <div className="posts-list">
        {currentPosts.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

// Enhanced Admin Form Component
const AdminForm = ({ onAddPost }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null,
    imageAlt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.image && !formData.imageAlt.trim()) {
      newErrors.imageAlt = 'Alt text is required when image is provided';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorCount = Object.keys(errors).length;
      window.announceToScreenReader(`Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please correct and try again.`, 'assertive');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        ...formData,
        id: Date.now().toString(),
        publishDate: new Date().toISOString().split('T')[0]
      };
      
      onAddPost(newPost);
      setFormData({ title: '', content: '', category: '', image: null, imageAlt: '' });
      setSubmitMessage('Post added successfully!');
      window.announceToScreenReader('Post added successfully!');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setSubmitMessage('Error adding post. Please try again.');
      window.announceToScreenReader('Error adding post. Please try again.', 'assertive');
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imageAlt: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    window.announceToScreenReader('Image removed');
  };

  return (
    <section id="admin" className="admin-section" aria-labelledby="admin-heading">
      <h2 id="admin-heading" className="section-title">Add New Post</h2>
      <form 
        onSubmit={handleSubmit} 
        className="admin-form"
        aria-describedby={submitMessage ? 'form-status' : undefined}
        noValidate
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
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={`form-input ${errors.title ? 'form-input-error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <div id="title-error" className="form-error" role="alert">
              {errors.title}
            </div>
          )}
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
            aria-invalid={errors.category ? 'true' : 'false'}
            aria-describedby={errors.category ? 'category-error' : undefined}
            className={`form-input ${errors.category ? 'form-input-error' : ''}`}
            disabled={isSubmitting}
            placeholder="e.g., Development, Design, Accessibility"
          />
          {errors.category && (
            <div id="category-error" className="form-error" role="alert">
              {errors.category}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-image" className="form-label">
            Featured Image (optional)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="post-image"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
            disabled={isSubmitting}
            aria-describedby="image-help"
          />
          <div id="image-help" className="form-help">
            Choose an image to display with your post
          </div>
          
          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Preview" className="preview-image" />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-button"
                aria-label="Remove selected image"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        {formData.image && (
          <div className="form-group">
            <label htmlFor="post-image-alt" className="form-label">
              Image Alt Text *
            </label>
            <input
              type="text"
              id="post-image-alt"
              name="imageAlt"
              value={formData.imageAlt}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-invalid={errors.imageAlt ? 'true' : 'false'}
              aria-describedby={errors.imageAlt ? 'imagealt-error' : 'imagealt-help'}
              className={`form-input ${errors.imageAlt ? 'form-input-error' : ''}`}
              disabled={isSubmitting}
              placeholder="Describe what the image shows"
            />
            <div id="imagealt-help" className="form-help">
              Describe the image for screen reader users
            </div>
            {errors.imageAlt && (
              <div id="imagealt-error" className="form-error" role="alert">
                {errors.imageAlt}
              </div>
            )}
          </div>
        )}

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
            aria-invalid={errors.content ? 'true' : 'false'}
            aria-describedby={errors.content ? 'content-error' : undefined}
            className={`form-textarea ${errors.content ? 'form-input-error' : ''}`}
            rows="8"
            disabled={isSubmitting}
            placeholder="Write your blog post content here..."
          />
          {errors.content && (
            <div id="content-error" className="form-error" role="alert">
              {errors.content}
            </div>
          )}
        </div>

        <button 
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
          aria-describedby="submit-help"
        >
          {isSubmitting ? 'Adding Post...' : 'Add Post'}
        </button>
        
        <div id="submit-help" className="form-help">
          All required fields must be completed
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
      </form>
    </section>
  );
};

// Main App Component
const AccessibleBlog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const postsPerPage = 3;

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Simulate loading posts
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setIsLoading(false);
    };

    loadPosts();
  }, []);

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.title = `Accessible Blog - ${isDarkMode ? 'Dark' : 'Light'} Mode`;
  }, [isDarkMode]);

  const handleAddPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setFilteredPosts(prevPosts => [newPost, ...prevPosts]);
    setCurrentPage(1);
  };

  const handleFilteredPosts = (filtered) => {
    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll to posts section
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    window.announceToScreenReader(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <AnnouncementSystem />
      <SkipLink />
      <Header isDarkMode={isDarkMode} onDarkModeToggle={toggleDarkMode} />
      
      <main id="main-content" tabIndex="-1" role="main" className="main-content">
        <h1 className="visually-hidden">Accessible Blog with Search and Pagination</h1>
        
        <SearchComponent 
          posts={posts} 
          onFilteredPosts={handleFilteredPosts}
        />
        
        <PostsList 
          posts={filteredPosts} 
          isLoading={isLoading}
          currentPage={currentPage}
          postsPerPage={postsPerPage}
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredPosts.length}
        />
        
        <AdminForm onAddPost={handleAddPost} />
      </main>

      <footer role="contentinfo" className="site-footer">
        <p>&copy; 2025 Accessible Blog. Built with advanced accessibility features.</p>
      </footer>

      <style jsx>{`
        /* Base styles */
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
          transition: background-color 0.3s, color 0.3s;
        }

        /* Dark mode */
        .app.dark-mode {
          background-color: #1a1a1a;
          color: #e0e0e0;
        }

        .app.dark-mode .site-header {
          background-color: #000000;
        }

        .app.dark-mode .blog-post {
          background-color: #2a2a2a;
          border-color: #444;
          color: #e0e0e0;
        }

        .app.dark-mode .admin-section {
          background-color: #2a2a2a;
          border-color: #444;
        }

        .app.dark-mode .form-input,
        .app.dark-mode .form-textarea,
        .app.dark-mode .search-input,
        .app.dark-mode .category-filter {
          background-color: #333;
          border-color: #555;
          color: #e0e0e0;
        }

        .app.dark-mode .form-input:focus,
        .app.dark-mode .form-textarea:focus,
        .app.dark-mode .search-input:focus,
        .app.dark-mode .category-filter:focus {
          border-color: #3498db;
        }

        /* Skip links */
        .skip-links {
          position: absolute;
          top: -200px;
          left: 0;
          z-index: 1000;
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #2c3e50;
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 0 0 4px 4px;
          z-index: 1001;
          transition: top 0.3s;
        }

        .skip-link:focus {
          top: 0;
        }

        /* Visually hidden */
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

        .header-controls {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .site-title a {
          color: white;
          text-decoration: none;
          font-size: 1.8rem;
          font-weight: bold;
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

        /* Dark mode toggle */
        .dark-mode-toggle {
          background: none;
          border: 2px solid #3498db;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .dark-mode-toggle:hover,
        .dark-mode-toggle:focus {
          background-color: #3498db;
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .dark-mode-text {
          font-size: 0.9rem;
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

        /* Section titles */
        .section-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 0.5rem;
          display: flex;
          align-items: baseline;
          gap: 1rem;
        }

        .app.dark-mode .section-title {
          color: #e0e0e0;
        }

        .posts-count {
          font-size: 1rem;
          color: #5a6c7d;
          font-weight: normal;
        }

        /* Search section */
        .search-section {
          margin-bottom: 3rem;
          padding: 2rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .app.dark-mode .search-section {
          background-color: #2a2a2a;
          border-color: #444;
        }

        .search-controls {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .search-group {
          display: flex;
          flex-direction: column;
        }

        .search-label,
        .filter-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .app.dark-mode .search-label,
        .app.dark-mode .filter-label {
          color: #e0e0e0;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input,
        .category-filter {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input:focus,
        .category-filter:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .clear-search-button {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #5a6c7d;
          padding: 4px;
          border-radius: 2px;
        }

        .clear-search-button:hover,
        .clear-search-button:focus {
          color: #e74c3c;
          background-color: #f8f9fa;
          outline: 2px solid #3498db;
        }

        .search-help {
          font-size: 0.9rem;
          color: #5a6c7d;
          margin-top: 0.5rem;
        }

        /* Posts */
        .posts-section {
          margin-bottom: 3rem;
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

        .blog-post-highlighted {
          border-color: #3498db;
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
        }

        .post-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .app.dark-mode .post-title {
          color: #e0e0e0;
        }

        .post-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #5a6c7d;
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

        .post-image-wrapper {
          margin: 1rem 0;
        }

        .post-image {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          border-radius: 4px;
        }

        .post-content {
          color: #34495e;
          line-height: 1.8;
        }

        .app.dark-mode .post-content {
          color: #c0c0c0;
        }

        /* Loading states */
        .loading-state {
          text-align: center;
          padding: 3rem;
          color: #5a6c7d;
          font-size: 1.1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #5a6c7d;
          font-size: 1.1rem;
        }

        /* Pagination */
        .pagination-nav {
          margin: 3rem 0;
          text-align: center;
        }

        .pagination-info {
          margin-bottom: 1rem;
          color: #5a6c7d;
          font-size: 0.9rem;
        }

        .pagination-list {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
          flex-wrap: wrap;
        }

        .pagination-button {
          background: white;
          border: 2px solid #e0e0e0;
          color: #2c3e50;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .app.dark-mode .pagination-button {
          background: #333;
          border-color: #555;
          color: #e0e0e0;
        }

        .pagination-button:hover,
        .pagination-button:focus {
          background-color: #3498db;
          border-color: #3498db;
          color: white;
          outline: 2px solid #2980b9;
          outline-offset: 2px;
        }

        .pagination-current {
          background-color: #3498db;
          border-color: #3498db;
          color: white;
          font-weight: bold;
        }

        .pagination-ellipsis {
          padding: 0.5rem;
          color: #5a6c7d;
        }

        /* Admin form */
        .admin-section {
          background-color: #f8f9fa;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          margin-top: 3rem;
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

        .app.dark-mode .form-label {
          color: #e0e0e0;
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

        .form-input-error {
          border-color: #e74c3c;
        }

        .form-input-error:focus {
          border-color: #e74c3c;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }

        .form-error {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-error::before {
          content: "⚠";
          font-size: 1rem;
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

        .image-preview {
          margin-top: 1rem;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          text-align: center;
        }

        .preview-image {
          max-width: 200px;
          max-height: 150px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .remove-image-button {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .remove-image-button:hover,
        .remove-image-button:focus {
          background-color: #c0392b;
          outline: 2px solid #e74c3c;
          outline-offset: 2px;
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
          transition: background-color 0.2s;
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
          color: #5a6c7d;
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

        .app.dark-mode .site-footer {
          background-color: #000000;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-list {
            justify-content: center;
          }

          .main-content {
            padding: 1rem;
          }

          .search-controls {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .blog-post {
            padding: 1.5rem;
          }

          .post-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .pagination-list {
            gap: 0.25rem;
          }

          .pagination-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
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

          .pagination-button:focus {
            outline: 3px solid #000;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
          
          .loading-spinner {
            animation: none;
            border: 4px solid #3498db;
          }
        }

        /* Print styles */
        @media print {
          .skip-links,
          .search-section,
          .admin-section,
          .pagination-nav,
          .dark-mode-toggle {
            display: none !important;
          }

          .blog-post {
            page-break-inside: avoid;
            box-shadow: none;
            border: 1px solid #000;
          }

          .site-header,
          .site-footer {
            background: none !important;
            color: #000 !important;
          }

          body {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AccessibleBlog;