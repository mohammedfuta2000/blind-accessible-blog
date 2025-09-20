import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostProvider } from './hooks/usePosts';
import Header from './components/Header';
import Footer from './components/Footer';
import SkipLinks from './components/SkipLinks';
import AnnouncementSystem from './components/AnnouncementSystem';
import BlogList from './pages/BlogList';
import PostDetail from './pages/PostDetail';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.title = `Accessible Blog - ${isDarkMode ? 'Dark' : 'Light'} Mode`;
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    window.announceToScreenReader(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
  };

  return (
    <PostProvider>
      <Router>
        <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
          <AnnouncementSystem />
          <SkipLinks />
          <Header isDarkMode={isDarkMode} onDarkModeToggle={toggleDarkMode} />
          
          <main id="main-content" tabIndex="-1" role="main" className="main-content">
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </PostProvider>
  );
}

export default App;