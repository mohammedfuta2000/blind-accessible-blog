import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

// Search Component
const SearchComponent = ({ posts, onFilteredPosts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    
    const resultCount = filtered.length;
    const announcement = `Search updated. ${resultCount} ${resultCount === 1 ? 'post' : 'posts'} found${term ? ` for "${term}"` : ''}${category !== 'all' ? ` in ${category}` : ''}.`;
    window.announceToScreenReader(announcement);
  }, [posts, onFilteredPosts]);

  React.useEffect(() => {
    handleSearch(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, handleSearch]);

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
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
  const showPages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);
  
  if (endPage - startPage < showPages - 1) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page, announcement) => {
    onPageChange(page);
    window.announceToScreenReader(announcement);
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
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

// Post Card Component
const PostCard = ({ post }) => (
  <article className="post-card" aria-labelledby={`post-title-${post.id}`}>
    {post.image && (
      <div className="post-card-image-wrapper">
        <img 
          src={post.image} 
          alt={post.imageAlt || 'Blog post image'} 
          className="post-card-image"
          loading="lazy"
        />
      </div>
    )}
    
    <div className="post-card-content">
      <header className="post-card-header">
        <h2 id={`post-title-${post.id}`} className="post-card-title">
          <Link to={`/post/${post.id}`} className="post-card-link">
            {post.title}
          </Link>
        </h2>
        <div className="post-card-meta">
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
      
      <div className="post-card-excerpt">
        <p>{post.excerpt}</p>
      </div>
      
      <div className="post-card-actions">
        <Link 
          to={`/post/${post.id}`}
          className="read-more-link"
          aria-label={`Read full post: ${post.title}`}
        >
          Read More →
        </Link>
      </div>
    </div>
  </article>
);

// Main BlogList Component
const BlogList = () => {
  const { posts, loading } = usePosts();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  React.useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  React.useEffect(() => {
    document.title = 'Accessible Blog - Home';
  }, []);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handleFilteredPosts = (filtered) => {
    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  if (loading) {
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

  return (
    <div className="blog-list-page">
      <h1 className="page-title">Latest Blog Posts</h1>
      
      <SearchComponent 
        posts={posts} 
        onFilteredPosts={handleFilteredPosts}
      />
      
      {filteredPosts.length === 0 ? (
        <div className="empty-state" role="status">
          <p>No posts match your current search or filter criteria.</p>
        </div>
      ) : (
        <>
          <section 
            className="posts-section"
            aria-label={`${filteredPosts.length} blog posts, showing ${currentPosts.length} on page ${currentPage}`}
          >
            <h2 className="section-title">
              Posts
              <span className="posts-count">({filteredPosts.length} total)</span>
            </h2>
            <div className="posts-grid">
              {currentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPosts.length}
          />
        </>
      )}
    </div>
  );
};

export default BlogList;