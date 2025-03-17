import React, { useState } from 'react';
import './QuickLinks.css';

const QuickLinks = ({ quickLinks, setQuickLinks }) => {
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '' });
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is open

  const handleAddLink = (e) => {
    e.preventDefault();
    setQuickLinks([...quickLinks, newLink]);
    setShowAddLinkModal(false);
    setNewLink({ name: '', url: '' });
  };

  const handleQuickLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const handleMenuClick = (e, index) => {
    e.stopPropagation(); // Prevent link click when clicking menu
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleEditLink = (index) => {
    setNewLink(quickLinks[index]);
    setShowAddLinkModal(true);
    setActiveMenu(null);
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = quickLinks.filter((_, i) => i !== index);
    setQuickLinks(updatedLinks);
    setActiveMenu(null);
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
          >
            <span onClick={() => handleQuickLinkClick(link.url)}>
              {link.name}
            </span>
            <div className="menu-container">
              <button 
                className="more-options"
                onClick={(e) => handleMenuClick(e, index)}
              >
                ⋮
              </button>
              {activeMenu === index && (
                <div className="dropdown-menu">
                  <button onClick={() => handleEditLink(index)}>
                    <span>✏️</span> Edit
                  </button>
                  <button onClick={() => handleRemoveLink(index)}>
                    <span>🗑️</span> Remove
                  </button>
                </div>
              )}
            </div>
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