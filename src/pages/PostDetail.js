import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost, posts } = usePosts();
  const post = getPost(id);

  React.useEffect(() => {
    if (post) {
      document.title = `${post.title} - Accessible Blog`;
    }
  }, [post]);

  React.useEffect(() => {
    // Announce page change for screen readers
    if (post) {
      window.announceToScreenReader(`Viewing post: ${post.title}`);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="post-not-found">
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist or may have been removed.</p>
        <Link to="/" className="back-link">
          ← Back to Blog List
        </Link>
      </div>
    );
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <article className="post-detail" aria-labelledby="post-title">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol className="breadcrumb-list">
          <li>
            <Link to="/" className="breadcrumb-link">Home</Link>
          </li>
          <li aria-current="page" className="breadcrumb-current">
            {post.title}
          </li>
        </ol>
      </nav>

      <header className="post-header">
        <h1 id="post-title" className="post-title">
          {post.title}
        </h1>
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
        <figure className="post-image-wrapper">
          <img 
            src={post.image} 
            alt={post.imageAlt || 'Blog post image'} 
            className="post-image"
          />
          {post.imageAlt && (
            <figcaption className="post-image-caption">
              {post.imageAlt}
            </figcaption>
          )}
        </figure>
      )}

      <div className="post-content">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <footer className="post-footer">
        <nav aria-label="Post navigation" className="post-navigation">
          <Link 
            to="/" 
            className="back-to-list-link"
            onClick={() => window.announceToScreenReader('Returning to blog list')}
          >
            ← Back to All Posts
          </Link>
        </nav>

        {relatedPosts.length > 0 && (
          <aside className="related-posts" aria-labelledby="related-heading">
            <h2 id="related-heading" className="related-title">
              Related Posts in {post.category}
            </h2>
            <ul className="related-posts-list">
              {relatedPosts.map(relatedPost => (
                <li key={relatedPost.id} className="related-post-item">
                  <Link 
                    to={`/post/${relatedPost.id}`}
                    className="related-post-link"
                    aria-label={`Read related post: ${relatedPost.title}`}
                  >
                    <h3 className="related-post-title">{relatedPost.title}</h3>
                    <p className="related-post-excerpt">{relatedPost.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </footer>
    </article>
  );
};

export default PostDetail;