import React, { useState } from 'react';
import { Search, Plus, Trash2, User, Eye, Edit } from 'lucide-react';
import './Users.css';

const Users = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('Testers');

  // Users/Testers data
  const [users, setUsers] = useState([
    {
      id: 1,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 2,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 3,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 4,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 5,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 6,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 7,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 8,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 9,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'JUNIOR QA TRAINEE'
    }
  ]);

  // Admins data
  const [admins, setAdmins] = useState([
    {
      id: 1,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA MANAGER',
      password: '••••••••••••••••'
    },
    {
      id: 2,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA LEAD',
      password: '••••••••••••••••'
    },
    {
      id: 3,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'ASSISTANT QA MANAGER',
      password: '••••••••••••••••'
    },
    {
      id: 4,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA MANAGER',
      password: '••••••••••••••••'
    },
    {
      id: 5,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA MANAGER',
      password: '••••••••••••••••'
    },
    {
      id: 6,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA MANAGER',
      password: '••••••••••••••••'
    },
    {
      id: 7,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA MANAGER',
      password: '••••••••••••••••'
    },
    {
      id: 8,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA MANAGER',
      password: '••••••••••••••••'
    },
    {
      id: 9,
      userName: 'Dhyaneshwaran K',
      email: 'dhyaneshwaran.k@spantechnologyservices.com',
      createdDate: '06/03/2025',
      time: '10:54:51',
      position: 'QA MANAGER',
      password: '••••••••••••••••'
    }
  ]);

  // State for both tabs
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Available users/admins to add
  const [availableUsers] = useState([
    {
      id: 10,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 11,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    },
    {
      id: 12,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'JUNIOR QA TRAINEE'
    }
  ]);

  const [availableAdmins] = useState([
    {
      id: 10,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'QA MANAGER'
    },
    {
      id: 11,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'QA LEAD'
    },
    {
      id: 12,
      userName: 'SURYA PRABHU',
      email: 'suryaprabhu.t@spantechnologyservices.com',
      position: 'ASSISTANT QA MANAGER'
    }
  ]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  // User/Tester handlers
  const handleDeleteUser = (user) => {
    setShowConfirmDelete({ type: 'user', data: user });
  };

  const handleAddUsers = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    const newUsers = selectedUsers.map(user => ({
      id: user.id,
      userName: user.userName,
      email: user.email,
      createdDate: formattedDate,
      time: formattedTime,
      position: user.position
    }));

    setUsers([...users, ...newUsers]);
    setSelectedUsers([]);
    setShowAddUser(false);
  };

  const toggleUserSelection = (user) => {
    if (selectedUsers.find(t => t.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(t => t.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Admin handlers
  const handleDeleteAdmin = (admin) => {
    setShowConfirmDelete({ type: 'admin', data: admin });
  };

  const handleAddAdmins = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    const newAdmins = selectedAdmins.map(admin => ({
      id: admin.id,
      userName: admin.userName,
      email: admin.email,
      createdDate: formattedDate,
      time: formattedTime,
      position: admin.position,
      password: '••••••••••••••••'
    }));

    setAdmins([...admins, ...newAdmins]);
    setSelectedAdmins([]);
    setShowAddAdmin(false);
  };

  const toggleAdminSelection = (admin) => {
    if (selectedAdmins.find(t => t.id === admin.id)) {
      setSelectedAdmins(selectedAdmins.filter(t => t.id !== admin.id));
    } else {
      setSelectedAdmins([...selectedAdmins, admin]);
    }
  };

  // Confirm delete for both
  const confirmDelete = () => {
    if (showConfirmDelete) {
      if (showConfirmDelete.type === 'user') {
        setUsers(users.filter(user => user.id !== showConfirmDelete.data.id));
      } else if (showConfirmDelete.type === 'admin') {
        setAdmins(admins.filter(admin => admin.id !== showConfirmDelete.data.id));
      }
      setShowConfirmDelete(null);
    }
  };

  // Filtering and pagination for Users/Testers
  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUsersPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Filtering and pagination for Admins
  const filteredAdmins = admins.filter(admin =>
    admin.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAdmin = currentPage * rowsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - rowsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalAdminsPages = Math.ceil(filteredAdmins.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="users-container">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'Testers' ? 'active' : ''}`}
          onClick={() => setActiveTab('Testers')}
        >
          Testers
        </button>
        <button 
          className={`tab-button ${activeTab === 'Admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('Admins')}
        >
          Admins
        </button>
      </div>

      {/* Testers Tab Content */}
      {activeTab === 'Testers' && (
        <div className="users-view">
          <div className="users-header">
            <div className="title-search">
              <span>Testers</span>
              <div className="search-box">
                <Search size={16} color="#666" />
                <input 
                  type="text" 
                  placeholder="Search By Tester ID / Tester Name / Tester Email" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button className="add-user-btn" onClick={() => setShowAddUser(true)}>
              <Plus size={16} />
              Add Tester
            </button>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Created Date & Time</th>
                  <th>Position</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="blank-avatar">
                          <User size={20} color="#666" />
                        </div>
                        <div>
                          <div className="user-name">{user.userName}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <div>{user.createdDate}</div>
                        <div className="time">{user.time}</div>
                      </div>
                    </td>
                    <td>{user.position}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteUser(user)}>
                        <Trash2 size={16} color="#DC3545" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Rows per page: </span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            
            <div className="pagination-controls">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <span>{currentPage}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalUsersPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admins Tab Content */}
      {activeTab === 'Admins' && (
        <div className="admins-view">
          <div className="admins-header">
            <div className="title-search">
              <span>Admins</span>
              <div className="search-box">
                <Search size={16} color="#666" />
                <input 
                  type="text" 
                  placeholder="Search By Admin ID / Admin Name / Admin Email" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button className="add-admin-btn" onClick={() => setShowAddAdmin(true)}>
              <Plus size={16} />
              Add Admin
            </button>
          </div>

          <div className="admins-table-container">
            <table className="admins-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Created Date & Time</th>
                  <th>Position</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <div className="admin-info">
                        <div>
                          <div className="admin-name">{admin.userName}</div>
                          <div className="admin-email">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <div>{admin.createdDate}</div>
                        <div className="time">{admin.time}</div>
                      </div>
                    </td>
                    <td>{admin.position}</td>
                    <td>
                      <div className="password-field">
                        <span>{admin.password}</span>
                        <button className="view-password-btn">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">
                          <Edit size={16} />
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteAdmin(admin)}>
                          <Trash2 size={16} color="#DC3545" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Rows per page: </span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            
            <div className="pagination-controls">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <span>{currentPage}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalAdminsPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Users Modal */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="add-users-modal">
            <h2>Add testers</h2>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search by Name / ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="available-users">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className={`user-item ${selectedUsers.find(t => t.id === user.id) ? 'selected' : ''}`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="blank-avatar">
                    <User size={20} color="#666" />
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.userName}</div>
                    <div className="user-position">{user.position}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="add-users-btn"
              onClick={handleAddUsers}
              disabled={selectedUsers.length === 0}
            >
              Add Testers
            </button>
          </div>
        </div>
      )}

      {/* Add Admins Modal */}
      {showAddAdmin && (
        <div className="modal-overlay">
          <div className="add-admins-modal">
            <h2>Add admins</h2>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search by Name / ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="available-admins">
              {availableAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className={`admin-item ${selectedAdmins.find(t => t.id === admin.id) ? 'selected' : ''}`}
                  onClick={() => toggleAdminSelection(admin)}
                >
                  <div className="blank-avatar">
                    <User size={20} color="#666" />
                  </div>
                  <div className="admin-details">
                    <div className="admin-name">{admin.userName}</div>
                    <div className="admin-position">{admin.position}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="add-admins-btn"
              onClick={handleAddAdmins}
              disabled={selectedAdmins.length === 0}
            >
              Add Admins
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
              <h2>Confirm Remove {showConfirmDelete.type === 'user' ? 'Tester' : 'Admin'}</h2>
            </div>
            <div className="confirm-modal-content">
              <p>Are you sure you want to remove this {showConfirmDelete.type === 'user' ? 'tester' : 'admin'} named</p>
              <p className="user-name">{showConfirmDelete.data.userName}</p>
              <p className="user-email">{showConfirmDelete.data.email}</p>
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

export default Users;