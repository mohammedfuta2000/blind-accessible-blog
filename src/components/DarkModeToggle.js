import React from 'react';

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

export default DarkModeToggle;