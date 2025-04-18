import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Users.css';
import { FaTrash, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Pagination from './Pagination/Pagination';

const styles = {
  projectSelect: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  projectOption: {
    padding: '8px',
    cursor: 'pointer'
  }
};

const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

const Users = ({ selectedProject }) => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('testers');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    position: '',
    password: '',
    projectIds: []
  });

  const [availableProjects, setAvailableProjects] = useState([]);

  useEffect(() => {
    if (selectedProject) {
      const cachedUsers = getFromLocalStorage(`users_${selectedProject.projectId}`);
      const cachedAdmins = getFromLocalStorage(`admins_${selectedProject.projectId}`);
      const cachedSuperAdmins = getFromLocalStorage(`superadmins`);
      
      // Set default roles if they're missing
      if (cachedUsers) {
        const usersWithRoles = cachedUsers.map(user => ({
          ...user,
          role: user.role || 'tester'
        }));
        setUsers(usersWithRoles);
      }
      
      if (cachedAdmins) {
        const adminsWithRoles = cachedAdmins.map(admin => ({
          ...admin,
          role: admin.role || 'admin'
        }));
        setAdmins(adminsWithRoles);
      }
      
      if (cachedSuperAdmins) {
        const superAdminsWithRoles = cachedSuperAdmins.map(admin => ({
          ...admin,
          role: admin.role || 'superadmin'
        }));
        setSuperAdmins(superAdminsWithRoles);
      }
      
      fetchUsers();
      fetchAdmins();
      fetchSuperAdmins();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (showAddModal && (activeTab === 'admins' || activeTab === 'superadmin')) {
      // Try to get from localStorage first
      const cachedProjects = getFromLocalStorage('available_projects');
      if (cachedProjects) {
        setAvailableProjects(cachedProjects);
      }
      // Then fetch fresh data
      fetchProjects();
    }
  }, [showAddModal, activeTab]);

  useEffect(() => {
    if (activeTab === 'admins' || activeTab === 'superadmin') {
      // Try to get from localStorage first
      const cachedProjects = getFromLocalStorage('available_projects');
      if (cachedProjects) {
        setAvailableProjects(cachedProjects);
      }
      // Then fetch fresh data
      fetchProjects();
    }
  }, [activeTab, selectedProject]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/getUsers/${selectedProject.projectId}`);
      if (response.data.msg === "Users Fetched Success") {
        // Filter for testers and ensure they have a role
        const testersWithRoles = response.data.data
          .filter(user => user.role === 'tester' || !user.role)
          .map(user => ({
            ...user,
            role: 'tester' // Ensure all users have the tester role
          }));
        setUsers(testersWithRoles);
        saveToLocalStorage(`users_${selectedProject.projectId}`, testersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/getAdmins/${selectedProject.projectId}`);
      if (response.data.msg === "Admins Fetched Success") {
        // Ensure each admin has a role property
        const adminsWithRoles = response.data.data.map(admin => ({
          ...admin,
          role: admin.role || 'admin' // Default to 'admin' if role is missing
        }));
        setAdmins(adminsWithRoles);
        saveToLocalStorage(`admins_${selectedProject.projectId}`, adminsWithRoles);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuperAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/getSuperAdmins');
      if (response.data.msg === "Super Admins Fetched Success") {
        // Ensure each super admin has a role property
        const superAdminsWithRoles = response.data.data.map(admin => ({
          ...admin,
          role: admin.role || 'superadmin' // Default to 'superadmin' if role is missing
        }));
        setSuperAdmins(superAdminsWithRoles);
        saveToLocalStorage('superadmins', superAdminsWithRoles);
      }
    } catch (error) {
      console.error('Error fetching super admins:', error);
      setError('Failed to fetch super admins');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/getProjectforRole', {
        params: {
          role: activeTab === 'admins' ? 'admin' : 'superadmin'
        }
      });
      if (response.data.projects) {
        setAvailableProjects(response.data.projects);
        saveToLocalStorage('available_projects', response.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  };

  const handleSearch = async (searchValue) => {
    setSearchTerm(searchValue);
    if (searchValue.trim()) {
      try {
        let endpoint;
        switch (activeTab) {
          case 'testers':
            endpoint = '/searchUsers';
            break;
          case 'admins':
            endpoint = '/searchAdmins';
            break;
          case 'superadmin':
            endpoint = '/searchSuperAdmins';
            break;
          default:
            endpoint = '/searchUsers';
        }
        
        const response = await axios.get(`${endpoint}?query=${searchValue}`);
        if (response.data && response.data.data) {
          let filteredResults;
          if (activeTab === 'testers') {
            filteredResults = response.data.data.filter(user => user.role === 'tester');
          } else {
            filteredResults = response.data.data;
          }
          setSearchResults(filteredResults);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error(`Error searching ${activeTab}:`, error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleApiError = (error, message) => {
    console.error(message, error);
    
    // If there's a response error message, use it
    const errorMessage = error.response?.data?.msg || message;
    toast.error(errorMessage);
    
    // Return false to indicate error
    return false;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!newUser.name || !newUser.email || !newUser.password || !newUser.position) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if ((activeTab === 'admins' || activeTab === 'superadmin') && (!newUser.projectIds || newUser.projectIds.length === 0)) {
        toast.error('Please select at least one project');
        return;
      }

      // Current timestamp
      const timestamp = new Date().toISOString();

      // For admin registration
      if (activeTab === 'admins' || activeTab === 'superadmin') {
        const userData = {
          Name: newUser.name,
          Email: newUser.email,
          Password: newUser.password,
          Role: activeTab === 'admins' ? 'admin' : 'superadmin',
          position: newUser.position,
          projectIds: newUser.projectIds,
          status: 'active',
          timestamp: timestamp
        };

        try {
          const response = await axios.post('/register', userData);
          
          if (response.data.msg === "User created successfully") {
            // Create admin object for the list
            const newAdminData = {
              _id: response.data.data._id || Date.now().toString(), // Fallback ID if none provided
              name: newUser.name,
              email: newUser.email,
              position: newUser.position,
              role: activeTab === 'admins' ? 'admin' : 'superadmin',
              projectIds: newUser.projectIds,
              createdAt: timestamp,
              password: newUser.password
            };

            // Update the appropriate list based on role
            if (activeTab === 'admins') {
              const updatedAdmins = [...admins, newAdminData];
              setAdmins(updatedAdmins);
              saveToLocalStorage(`admins_${selectedProject?.projectId || 'all'}`, updatedAdmins);
            } else {
              const updatedSuperAdmins = [...superAdmins, newAdminData];
              setSuperAdmins(updatedSuperAdmins);
              saveToLocalStorage('superadmins', updatedSuperAdmins);
            }

            toast.success(`${activeTab === 'admins' ? 'Admin' : 'Super Admin'} registered successfully`);
            
            // Clear form and close modal
            setShowAddModal(false);
            setNewUser({
              name: '',
              email: '',
              position: '',
              password: '',
              projectIds: []
            });
          } else {
            toast.error(response.data.msg || 'Registration failed');
          }
        } catch (error) {
          // Even if API fails, add to local storage so it persists across refreshes
          const newAdminData = {
            _id: Date.now().toString(), // Generate a temporary ID
            name: newUser.name,
            email: newUser.email,
            position: newUser.position,
            role: activeTab === 'admins' ? 'admin' : 'superadmin',
            projectIds: newUser.projectIds,
            createdAt: timestamp,
            password: newUser.password,
            isPending: true // Mark as pending to resync later
          };

          if (activeTab === 'admins') {
            const updatedAdmins = [...admins, newAdminData];
            setAdmins(updatedAdmins);
            saveToLocalStorage(`admins_${selectedProject?.projectId || 'all'}`, updatedAdmins);
          } else {
            const updatedSuperAdmins = [...superAdmins, newAdminData];
            setSuperAdmins(updatedSuperAdmins);
            saveToLocalStorage('superadmins', updatedSuperAdmins);
          }

          toast.warning('Admin saved locally. Will sync when connection is restored.');
          setShowAddModal(false);
          setNewUser({
            name: '',
            email: '',
            position: '',
            password: '',
            projectIds: []
          });
        }
        return;
      }

      // For regular tester creation
      const userData = {
        ...newUser,
        role: 'tester',
        status: 'active',
        timestamp: timestamp
      };

      try {
        const response = await axios.post('/createUser', userData);
        
        if (response.data.msg === "User Created Successfully") {
          const updatedUsers = [...users, response.data.data];
          setUsers(updatedUsers);
          saveToLocalStorage(`users_${selectedProject?.projectId || 'all'}`, updatedUsers);
          
          setShowAddModal(false);
          setNewUser({
            name: '',
            email: '',
            position: '',
            password: '',
            projectIds: []
          });
          toast.success('Tester added successfully');
        } else {
          toast.error(response.data.msg || 'Failed to add tester');
        }
      } catch (error) {
        // Store locally even if API fails
        const newTesterData = {
          _id: Date.now().toString(),
          name: newUser.name,
          email: newUser.email,
          position: newUser.position,
          role: 'tester',
          createdAt: timestamp,
          isPending: true
        };
        
        const updatedUsers = [...users, newTesterData];
        setUsers(updatedUsers);
        saveToLocalStorage(`users_${selectedProject?.projectId || 'all'}`, updatedUsers);
        
        toast.warning('Tester saved locally. Will sync when connection is restored.');
        setShowAddModal(false);
        setNewUser({
          name: '',
          email: '',
          position: '',
          password: '',
          projectIds: []
        });
      }
    } catch (error) {
      console.error(`Error adding ${activeTab}:`, error);
      toast.error(error.response?.data?.msg || `Error adding ${activeTab}`);
    }
  };

  const handleRemoveClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.delete('/deleteUser/:id', {
        data: {
          userId: userToDelete._id,
          projectId: selectedProject?.projectId
        }
      });
      
      if (response.data.msg.includes('deleted successfully')) {
        if (activeTab === 'testers') {
          const updatedUsers = users.filter(user => user._id !== userToDelete._id);
          setUsers(updatedUsers);
          saveToLocalStorage(`users_${selectedProject.projectId}`, updatedUsers);
        } else if (activeTab === 'admins') {
          const updatedAdmins = admins.filter(admin => admin._id !== userToDelete._id);
          setAdmins(updatedAdmins);
          saveToLocalStorage(`admins_${selectedProject.projectId}`, updatedAdmins);
        } else {
          const updatedSuperAdmins = superAdmins.filter(admin => admin._id !== userToDelete._id);
          setSuperAdmins(updatedSuperAdmins);
          saveToLocalStorage('superadmins', updatedSuperAdmins);
        }
        toast.success(`${activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} removed successfully`);
      } else {
        toast.error('Failed to remove user');
      }
    } catch (error) {
      console.error(`Error removing ${activeTab}:`, error);
      toast.error(`Failed to remove ${activeTab}`);
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setShowSearchResults(false);
    
    // Reset form when changing tabs
    setNewUser({
      name: '',
      email: '',
      position: '',
      password: '',
      projectIds: []
    });
    
    // Close any open modals
    setShowAddModal(false);
    setShowEditModal(false);
    setShowConfirmModal(false);
    
    // Clear any selected users
    setUserToEdit(null);
    setUserToDelete(null);
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'testers':
        return users;
      case 'admins':
        return admins;
      case 'superadmin':
        return superAdmins;
      default:
        return users;
    }
  };

  const currentItems = getCurrentItems();
  const filteredItems = showSearchResults ? searchResults : currentItems;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleEditClick = (user) => {
    setUserToEdit({
      _id: user._id,
      name: user.name,
      email: user.email,
      position: user.position,
      password: user.password || '',
      projectIds: user.projectIds || [],
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { _id, name, email, password, position, projectIds } = userToEdit;
      
      const userData = {
        userId: _id,
        name,
        email,
        position,
        password: password || undefined, // Only send password if it's changed
        projectIds,
        role: activeTab === 'testers' ? 'tester' : activeTab === 'admins' ? 'admin' : 'superadmin'
      };

      const response = await axios.put('/updateRole', userData);

      if (response.data.msg === 'User updated successfully') {
        if (activeTab === 'testers') {
          const updatedUsers = users.map(user => user._id === _id ? response.data.data : user);
          setUsers(updatedUsers);
          saveToLocalStorage(`users_${selectedProject.projectId}`, updatedUsers);
        } else if (activeTab === 'admins') {
          const updatedAdmins = admins.map(admin => admin._id === _id ? { 
            ...response.data.data,
            name: name,
            email: email,
            position: position,
            password: password || admin.password
          } : admin);
          setAdmins(updatedAdmins);
          saveToLocalStorage(`admins_${selectedProject.projectId}`, updatedAdmins);
        } else {
          const updatedSuperAdmins = superAdmins.map(admin => admin._id === _id ? {
            ...response.data.data,
            name: name,
            email: email,
            position: position,
            password: password || admin.password
          } : admin);
          setSuperAdmins(updatedSuperAdmins);
          saveToLocalStorage('superadmins', updatedSuperAdmins);
        }
        
        setShowEditModal(false);
        toast.success(`${activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} updated successfully`);
      } else {
        toast.error(response.data.msg || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.msg || 'Failed to update user');
    }
  };

  const getProjectName = (projectId) => {
    const project = availableProjects.find(p => p.projectId === projectId);
    return project ? project.projectName : 'Unknown Project';
  };

  // Add a helper function to format date and time
  const formatDate = (dateString) => {
    if (!dateString) return { date: 'Invalid Date', time: 'Invalid Time' };
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return { date: 'Invalid Date', time: 'Invalid Time' };
      }
      
      // Format date as DD/MM/YYYY
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      // Format time as HH:MM:SS
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      
      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  if (loading) return <div className="loading">Loading {activeTab}...</div>;

  return (
    <div className="users-container">
      <div className="users-tabs">
        <button
          className={`tab-button ${activeTab === 'testers' ? 'active' : ''}`}
          onClick={() => handleTabChange('testers')}
        >
          Testers
        </button>
        <button
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => handleTabChange('admins')}
        >
          Admins
        </button>
        <button
          className={`tab-button ${activeTab === 'superadmin' ? 'active' : ''}`}
          onClick={() => handleTabChange('superadmin')}
        >
          Super Admin
        </button>
      </div>
      
      <div style={{ marginBottom: '30px' }}></div>

      <div className="actions-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder={`Search By ${activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} ID / Name / Email`}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add {activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}
          </button>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Added Date & Time</th>
              <th>Position</th>
              {(activeTab === 'admins' || activeTab === 'superadmin') && <th>Password</th>}
              <th>Assigned Projects</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.map((item) => (
              <tr key={item._id} className={item.status === 'inactive' ? 'inactive-row' : ''}>
                <td>
                  <div className="user-info">
                    <div className="user-name">{item.name}</div>
                    <div className="user-email">{item.email}</div>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    {item.createdAt ? (
                      <>
                        <div className="date">{formatDate(item.createdAt).date}</div>
                        <div className="time">{formatDate(item.createdAt).time}</div>
                      </>
                    ) : (
                      <span>Invalid Date</span>
                    )}
                  </div>
                </td>
                <td>{item.position}</td>
                {(activeTab === 'admins' || activeTab === 'superadmin') && (
                  <td>
                    <div className="password-field">
                      <span>{showPasswords[item._id] ? item.password : '••••••••••••'}</span>
                      <button 
                        className="toggle-password"
                        onClick={() => togglePasswordVisibility(item._id)}
                        type="button"
                      >
                        {showPasswords[item._id] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </td>
                )}
                <td>
                  <div className="assigned-projects">
                    {item.projectIds && item.projectIds.length > 0 ? (
                      <div className="project-list">
                        {item.projectIds.map((projectId, index) => {
                          const projectName = getProjectName(projectId);
                          return (
                            <div key={index} className="project-badge">
                              {projectName}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="no-projects">No projects assigned</span>
                    )}
                  </div>
                </td>
                <td className="action-column">
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditClick(item)}
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleRemoveClick(item)}
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New {activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}</h2>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>{activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Name</label>
                <input
                  type="text"
                  placeholder={`Enter the ${activeTab === 'testers' ? 'tester' : activeTab === 'admins' ? 'admin' : 'super admin'} name`}
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Email</label>
                <input
                  type="email"
                  placeholder={`Enter the ${activeTab === 'testers' ? 'tester' : activeTab === 'admins' ? 'admin' : 'super admin'} email`}
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <select
                  value={newUser.position}
                  onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                  required
                  className="form-select"
                >
                  <option value="">Select Position</option>
                  <option value="QA MANAGER">QA Manager</option>
                  <option value="QA LEAD">QA Lead</option>
                  <option value="QA ASSISTANT MANAGER">QA Assistant Manager</option>
                </select>
              </div>

              {(activeTab === 'admins' || activeTab === 'superadmin') && (
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-field">
                    <input
                      type={showPasswords['new'] ? "text" : "password"}
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords['new'] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}

              {(activeTab === 'admins' || activeTab === 'superadmin') && (
                <div className="form-group">
                  <label>Assign Projects</label>
                  <div className="project-select-container">
                    <select
                      multiple
                      value={newUser.projectIds}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                        setNewUser({ ...newUser, projectIds: selectedOptions });
                      }}
                      required
                      style={styles.projectSelect}
                    >
                      {availableProjects.map(project => (
                        <option 
                          key={project.projectId} 
                          value={project.projectId}
                          style={styles.projectOption}
                        >
                          {project.projectName} {project.role ? `(${project.role})` : ''}
                        </option>
                      ))}
                    </select>
                    <small className="select-hint">Hold Ctrl/Cmd to select multiple projects</small>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add {activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Remove Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Remove {activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}</h3>
            <p>Are you sure you want to remove this {activeTab === 'testers' ? 'tester' : activeTab === 'admins' ? 'admin' : 'super admin'}?</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={handleConfirmRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit {activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>{activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Name</label>
                <input
                  type="text"
                  placeholder={`Enter the ${activeTab === 'testers' ? 'tester' : activeTab === 'admins' ? 'admin' : 'super admin'} name`}
                  value={userToEdit?.name || ''}
                  onChange={(e) => setUserToEdit({...userToEdit, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>{activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Email</label>
                <input
                  type="email"
                  placeholder={`Enter the ${activeTab === 'testers' ? 'tester' : activeTab === 'admins' ? 'admin' : 'super admin'} email`}
                  value={userToEdit?.email || ''}
                  onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <select
                  value={userToEdit?.position || ''}
                  onChange={(e) => setUserToEdit({...userToEdit, position: e.target.value})}
                  required
                  className="form-select"
                >
                  <option value="">Select Position</option>
                  <option value="QA MANAGER">QA Manager</option>
                  <option value="QA LEAD">QA Lead</option>
                  <option value="QA ASSISTANT MANAGER">QA Assistant Manager</option>
                </select>
              </div>

              {(activeTab === 'admins' || activeTab === 'superadmin') && (
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-field">
                    <input
                      type={showPasswords['edit'] ? "text" : "password"}
                      placeholder="Enter new password (leave empty to keep current)"
                      value={userToEdit?.password || ''}
                      onChange={(e) => setUserToEdit({...userToEdit, password: e.target.value})}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('edit')}
                    >
                      {showPasswords['edit'] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowEditModal(false);
                  setUserToEdit(null);
                  setNewUser({
                    name: '',
                    email: '',
                    position: '',
                    password: '',
                    projectIds: []
                  });
                }}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update {activeTab === 'testers' ? 'Tester' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pagination-container">
        <div className="rows-per-page">
          Rows per page: {itemsPerPage}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={itemsPerPage}
          onRowsPerPageChange={setItemsPerPage}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Users;