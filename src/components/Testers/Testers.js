import React, { useState } from 'react';
import { Search, Plus, Trash2, User } from 'lucide-react';
import './Testers.css';

const Testers = () => {
  // Profile image URL
  const profileImage = '/surya-profile.jpg'; // Make sure to add this image to your public folder

  const [testers, setTesters] = useState([
    {
      id: 1,
      userName: 'Surya Prabhu T',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      addedDate: '06/03/2025',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 2,
      userName: 'Surya Prabhu T',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      addedDate: '06/03/2025',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 3,
      userName: 'Surya Prabhu T',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      addedDate: '06/03/2025',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 4,
      userName: 'Surya Prabhu T',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      addedDate: '06/03/2025',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 5,
      userName: 'Surya Prabhu T',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      addedDate: '06/03/2025',
      position: 'JUNIOR QA TRAINEE'
    }
  ]);

  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [showAddTester, setShowAddTester] = useState(false);
  
  // Available testers to add
  const [availableTesters] = useState([
    {
      id: 6,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 7,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 8,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 9,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 10,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTesters, setSelectedTesters] = useState([]);

  const handleDeleteTester = (tester) => {
    setShowConfirmDelete(tester);
  };

  const confirmDelete = () => {
    if (showConfirmDelete) {
      setTesters(testers.filter(tester => tester.id !== showConfirmDelete.id));
      setShowConfirmDelete(null);
    }
  };

  const handleAddTesters = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    const newTesters = selectedTesters.map(tester => ({
      id: tester.id,
      userName: tester.userName,
      email: tester.email,
      addedDate: formattedDate,
      time: formattedTime,
      position: tester.position
    }));

    setTesters([...testers, ...newTesters]);
    setSelectedTesters([]);
    setShowAddTester(false);
  };

  const toggleTesterSelection = (tester) => {
    if (selectedTesters.find(t => t.id === tester.id)) {
      setSelectedTesters(selectedTesters.filter(t => t.id !== tester.id));
    } else {
      setSelectedTesters([...selectedTesters, tester]);
    }
  };

  const filteredTesters = availableTesters.filter(tester =>
    tester.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tester.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="testers-view">
      <div className="testers-header">
        <div className="title-search">
          <span>Testers</span>
          <div className="search-box">
            <Search size={16} color="#666" />
            <input type="text" placeholder="Search by Tester ID / Tester Name / Tester Email" />
          </div>
        </div>
        <button className="add-tester-btn" onClick={() => setShowAddTester(true)}>
          <Plus size={16} />
          Add Tester
        </button>
      </div>

      <div className="testers-table-container">
        <table className="testers-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Added Date & Time</th>
              <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {testers.map((tester) => (
              <tr key={tester.id}>
                <td>
                  <div className="tester-info">
                    <div className="blank-avatar">
                      <User size={20} color="#666" />
                    </div>
                    <div>
                      <div className="tester-name">{tester.userName}</div>
                      <div className="tester-email">{tester.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <div>{tester.addedDate}</div>
                    <div className="time">{tester.time || "10:54:51"}</div>
                  </div>
                </td>
                <td>{tester.position}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteTester(tester)}>
                    <Trash2 size={16} color="#DC3545" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Testers Modal */}
      {showAddTester && (
        <div className="modal-overlay">
          <div className="add-testers-modal">
            <h2>Add testers</h2>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search by Name / ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="available-testers">
              {filteredTesters.map((tester) => (
                <div
                  key={tester.id}
                  className={`tester-item ${selectedTesters.find(t => t.id === tester.id) ? 'selected' : ''}`}
                  onClick={() => toggleTesterSelection(tester)}
                >
                  <div className="blank-avatar">
                    <User size={20} color="#666" />
                  </div>
                  <div className="tester-details">
                    <div className="tester-name">{tester.userName}</div>
                    <div className="tester-position">{tester.position}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="add-testers-btn"
              onClick={handleAddTesters}
              disabled={selectedTesters.length === 0}
            >
              Add Testers
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-modal-header">
              <div className="warning-icon">!</div>
              <h2>Confirm Remove Tester</h2>
            </div>
            <div className="confirm-modal-content">
              <p>Are you sure you want to remove this user named</p>
              <p className="tester-name">{showConfirmDelete.userName}</p>
              <p className="tester-email">{showConfirmDelete.email}</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmDelete(null)}>
                Cancel
              </button>
              <button className="btn-remove" onClick={confirmDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testers; 