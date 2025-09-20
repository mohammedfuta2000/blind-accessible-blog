import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { addPost } = usePosts();
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

  React.useEffect(() => {
    document.title = 'Add New Post - Accessible Blog';
  }, []);

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
      
      const newPost = addPost(formData);
      setFormData({ title: '', content: '', category: '', image: null, imageAlt: '' });
      setSubmitMessage('Post added successfully!');
      window.announceToScreenReader('Post added successfully!');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to the new post after a short delay
      setTimeout(() => {
        navigate(`/post/${newPost.id}`);
      }, 2000);
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
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="page-title">Create New Post</h1>
        <p className="admin-description">
          Share your thoughts and insights with the world. All fields marked with * are required.
        </p>
      </div>

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
            aria-describedby={errors.title ? 'title-error' : 'title-help'}
            className={`form-input ${errors.title ? 'form-input-error' : ''}`}
            disabled={isSubmitting}
            placeholder="Enter a compelling title for your post"
          />
          <div id="title-help" className="form-help">
            Choose a clear, descriptive title that summarizes your post
          </div>
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
            aria-describedby={errors.category ? 'category-error' : 'category-help'}
            className={`form-input ${errors.category ? 'form-input-error' : ''}`}
            disabled={isSubmitting}
            placeholder="e.g., Development, Design, Accessibility"
          />
          <div id="category-help" className="form-help">
            Choose a category that best describes your post topic
          </div>
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
            Choose an image to display with your post. Recommended size: 1200x600px
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
              Provide a clear description of the image for screen reader users
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
            aria-describedby={errors.content ? 'content-error' : 'content-help'}
            className={`form-textarea ${errors.content ? 'form-input-error' : ''}`}
            rows="12"
            disabled={isSubmitting}
            placeholder="Write your blog post content here. Use double line breaks to separate paragraphs."
          />
          <div id="content-help" className="form-help">
            Write your full post content. Use clear paragraphs and simple language.
          </div>
          {errors.content && (
            <div id="content-error" className="form-error" role="alert">
              {errors.content}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-describedby="submit-help"
          >
            {isSubmitting ? 'Publishing Post...' : 'Publish Post'}
          </button>
          
          <div id="submit-help" className="form-help">
            Review your post before publishing. You'll be redirected to view it after publishing.
          </div>
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
    </div>
  );
};

export default AdminPanel;