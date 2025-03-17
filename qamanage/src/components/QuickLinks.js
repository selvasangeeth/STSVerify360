import React, { useState } from 'react';
import './QuickLinks.css';

const QuickLinks = ({ quickLinks, setQuickLinks }) => {
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  const handleAddLink = (e) => {
    e.preventDefault();
    setQuickLinks([...quickLinks, newLink]);
    setShowAddLinkModal(false);
    setNewLink({ name: '', url: '' });
  };

  const handleQuickLinkClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="quick-links">
      <div className="quick-links-header">
        <span>Quick Links</span>
        <button 
          className="add-link"
          onClick={() => setShowAddLinkModal(true)}
        >
          +
        </button>
      </div>
      <ul className="quick-links-list">
        {quickLinks.map((link, index) => (
          <li 
            key={index} 
            className="quick-link-item"
            onClick={() => handleQuickLinkClick(link.url)}
          >
            <span>{link.name}</span>
            <button className="more-options">⋮</button>
          </li>
        ))}
      </ul>

      {showAddLinkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Link</h2>
            <form onSubmit={handleAddLink}>
              <div className="form-group">
                <label>Link Name</label>
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Link URL</label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddLinkModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickLinks;