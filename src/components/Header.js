import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ isDarkMode, onDarkModeToggle }) => {
  const location = useLocation();

  return (
    <header role="banner" className="site-header">
      <div className="header-content">
        <h1 className="site-title">
          <Link to="/" aria-label="Accessible Blog - Home">
            Accessible Blog
          </Link>
        </h1>
        <div className="header-controls">
          <nav role="navigation" aria-label="Main navigation">
            <ul className="nav-list">
              <li>
                <Link 
                  to="/" 
                  className={`nav-link ${location.pathname === '/' ? 'nav-link-current' : ''}`}
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin" 
                  className={`nav-link ${location.pathname === '/admin' ? 'nav-link-current' : ''}`}
                  aria-current={location.pathname === '/admin' ? 'page' : undefined}
                >
                  Add Post
                </Link>
              </li>
            </ul>
          </nav>
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={onDarkModeToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;