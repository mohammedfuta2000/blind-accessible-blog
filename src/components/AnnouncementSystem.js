import React, { useState } from 'react';

const AnnouncementSystem = () => {
  const [politeRegion, setPoliteRegion] = useState('');
  const [assertiveRegion, setAssertiveRegion] = useState('');

  // Global announcement function
  React.useEffect(() => {
    window.announceToScreenReader = (message, priority = 'polite') => {
      if (priority === 'assertive') {
        setAssertiveRegion(message);
        setTimeout(() => setAssertiveRegion(''), 1000);
      } else {
        setPoliteRegion(message);
        setTimeout(() => setPoliteRegion(''), 1000);
      }
    };
  }, []);

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

export default AnnouncementSystem;