import React, { createContext, useContext, useState, useEffect } from 'react';

const PostContext = createContext();

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with Web Accessibility',
    content: 'Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. This involves creating content that can be perceived, understood, navigated, and interacted with by users of all abilities.\n\nKey principles include providing alternative text for images, ensuring proper color contrast, using semantic HTML elements, and making sure all functionality is keyboard accessible. Screen readers and other assistive technologies rely on well-structured markup to convey information to users.\n\nImplementing accessibility from the start is much easier than retrofitting it later. Consider it an essential part of the development process, not an afterthought.',
    publishDate: '2025-09-15',
    category: 'Accessibility',
    image: null,
    imageAlt: '',
    excerpt: 'Learn the fundamentals of web accessibility and why it matters for creating inclusive digital experiences.'
  },
  {
    id: '2', 
    title: 'Building Semantic HTML',
    content: 'Semantic HTML provides meaning to web content beyond just presentation. Using elements like article, section, nav, and proper heading hierarchy creates a logical document structure that assistive technologies can understand.\n\nInstead of using div elements for everything, choose HTML elements that best describe your content. Use headings (h1-h6) in logical order, employ lists for grouped items, and utilize landmarks like main, aside, and footer.\n\nSemantic markup improves SEO, accessibility, and code maintainability. It makes your content more meaningful to both humans and machines.',
    publishDate: '2025-09-10',
    category: 'Development',
    image: null,
    imageAlt: '',
    excerpt: 'Discover how semantic HTML elements create better structure and accessibility for your web content.'
  },
  {
    id: '3',
    title: 'ARIA Best Practices',
    content: 'ARIA (Accessible Rich Internet Applications) attributes provide semantic information about elements to assistive technologies. They should be used to enhance, not replace, semantic HTML.\n\nCommon ARIA attributes include aria-label for accessible names, aria-describedby for additional descriptions, and aria-live for dynamic content updates. Use roles sparingly and only when semantic HTML is insufficient.\n\nRemember: the first rule of ARIA is don\'t use ARIA if you can accomplish the same thing with semantic HTML. Always test with actual screen readers to ensure your ARIA implementation works as expected.',
    publishDate: '2025-09-05',
    category: 'Accessibility',
    image: null,
    imageAlt: '',
    excerpt: 'Master ARIA attributes to enhance accessibility for complex web applications and dynamic content.'
  }
];

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from Firebase
    const loadPosts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const addPost = (newPost) => {
    const post = {
      ...newPost,
      id: Date.now().toString(),
      publishDate: new Date().toISOString().split('T')[0],
      excerpt: newPost.content.substring(0, 150) + '...'
    };
    setPosts(prevPosts => [post, ...prevPosts]);
    return post;
  };

  const getPost = (id) => {
    return posts.find(post => post.id === id);
  };

  const value = {
    posts,
    loading,
    addPost,
    getPost
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};