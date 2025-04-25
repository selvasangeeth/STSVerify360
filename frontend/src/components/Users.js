import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Users.css';
import { FaTrash, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Pagination from './Pagination/Pagination';
import { Navigate } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState('user');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [details, setDetails] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    position: '',
    password: '',
    projectIds: []
  });
  const [availableProjects, setAvailableProjects] = useState([]);

  // Get user role from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = userData.Role?.toLowerCase() || '';

  // All useEffect hooks must be declared at the top level
  useEffect(() => {
    if (selectedProject && (userRole === 'admin' || userRole === 'superadmin')) {
      const cachedUsers = getFromLocalStorage(`users_${selectedProject.projectId}`);
      const cachedAdmins = getFromLocalStorage(`admins_${selectedProject.projectId}`);
      const cachedSuperAdmins = getFromLocalStorage(`superadmins`);

      // Set default roles if they're missing
      if (cachedUsers) {
        const usersWithRoles = cachedUsers.map(user => ({
          ...user,
          role: user.role || 'user'
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
          role: admin.role || 'superAdmin'
        }));
        setSuperAdmins(superAdminsWithRoles);
      }

      // Fetch data based on user role
      if (userRole === 'admin') {
        fetchUsers();
      } else if (userRole === 'superadmin') {
        fetchUsers();
        fetchAdmins();
        fetchSuperAdmins();
      }
    }
  }, [selectedProject, userRole]);

  // Fetch role details when component mounts or activeTab changes
  useEffect(() => {
    if (userRole === 'admin') {
      fetchRoleDetails('user');
    } else if (userRole === 'superadmin' || userRole === 'superAdmin') {
      fetchRoleDetails(activeTab);
    }
  }, [activeTab, userRole]);

  useEffect(() => {
    if (showAddModal && (activeTab === 'admins' || activeTab === 'superAdmin' || activeTab === 'user') && (userRole === 'admin' || userRole === 'superadmin')) {
      fetchProjects();
    }
  }, [showAddModal, activeTab, userRole]);

  useEffect(() => {
    if ((activeTab === 'admins' || activeTab === 'superAdmin') && (userRole === 'admin' || userRole === 'superadmin')) {
      fetchProjects();
    }
  }, [activeTab, selectedProject, userRole]);

  // If user is not admin or superadmin, redirect to dashboard
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return <Navigate to="/dashboard" />;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/getUsers/${selectedProject.projectId}`);
      if (response.data.msg === "Users Fetched Success") {
        // Filter for users and ensure they have a role
        const usersWithRoles = response.data.data
          .filter(user => user.role === 'user' || !user.role)
          .map(user => ({
            ...user,
            role: 'user' // Ensure all users have the user role
          }));
        setUsers(usersWithRoles);
        // saveToLocalStorage(`users_${selectedProject.projectId}`, usersWithRoles);
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
        // saveToLocalStorage(`admins_${selectedProject.projectId}`, adminsWithRoles);
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
          role: admin.role || 'superAdmin' // Default to 'superAdmin' if role is missing
        }));
        setSuperAdmins(superAdminsWithRoles);
        // saveToLocalStorage('superadmins', superAdminsWithRoles);
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
      const roleParam = activeTab === 'admins' ? 'admin' : 'superAdmin';
      const response = await axios.get('/getProjectforRole', {
        params: {
          role: roleParam,
          userId: userToEdit?._id // Add userId parameter
        }
      });
      
      console.log("Projects response:", response.data);
      
      if (response.data.projects) {
        setAvailableProjects(response.data.projects);
        
        // If we have assignedProjects in the response, update userToEdit
        if (response.data.assignedProjects) {
          setUserToEdit(prev => ({
            ...prev,
            projectIds: response.data.assignedProjects.map(project => project.projectId),
            assignedProjects: response.data.assignedProjects
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  };

  const handleSearch = async (searchValue) => {
    setSearchTerm(searchValue);
    
    try {
      // Convert activeTab to the correct role parameter
      let roleParam;
      if (activeTab === 'superAdmin') {
        roleParam = 'superadmin';
      } else if (activeTab === 'admins') {
        roleParam = 'admin';
      } else {
        roleParam = activeTab;
      }

      // If search is empty, fetch all users for current role
      if (!searchValue.trim()) {
        fetchRoleDetails(roleParam);
        return;
      }

      console.log("Searching with role:", roleParam, "and search term:", searchValue);
      const response = await axios.get(`/getUserRoleDetails?role=${roleParam}&search=${searchValue}`);
      
      if (response.data) {
        // Filter the results based on search term
        const filteredResults = response.data.filter(item => {
          const userName = item.user?.Name?.toLowerCase() || '';
          const userEmail = item.user?.Email?.toLowerCase() || '';
          const searchLower = searchValue.toLowerCase();
          
          return userName.includes(searchLower) || userEmail.includes(searchLower);
        });
        
        console.log('Search results:', filteredResults);
        setDetails(filteredResults);
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error while searching');
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

      if (!newUser.projectIds || newUser.projectIds.length === 0) {
        toast.error('Please select at least one project');
        return;
      }

      // Current timestamp
      const timestamp = new Date().toISOString();

      // Prepare user data
      const userData = {
        Name: newUser.name,
        Email: newUser.email,
        Password: newUser.password,
        Role: activeTab === 'admins' ? 'admin' : activeTab === 'superAdmin' ? 'superAdmin' : 'user',
        position: newUser.position,
        projectIds: newUser.projectIds,
        status: 'active',
        timestamp: timestamp,
      };

      try {

        const response = await axios.post('/register', userData);

        if (response.data.msg === "User created successfully") {
          const newUserData = {
            _id: response.data.data._id || Date.now().toString(),
            name: newUser.name,
            email: newUser.email,
            position: newUser.position,
            role: userData.Role,
            projectIds: newUser.projectIds,
            createdAt: timestamp,
            password: newUser.password,
          };

          // Update the appropriate list based on role
          if (activeTab === 'admins') {
            const updatedAdmins = [...admins, newUserData];
            setAdmins(updatedAdmins);
           
          } else if (activeTab === 'superAdmin') {
            const updatedSuperAdmins = [...superAdmins, newUserData];
            setSuperAdmins(updatedSuperAdmins);
            
          } else {
            const updatedUsers = [...users, newUserData];
            setUsers(updatedUsers);
            
          }

          toast.success(`${activeTab === 'admins' ? 'Admin' : activeTab === 'superAdmin' ? 'Super Admin' : 'User'} registered successfully`);

          // Clear form and close modal
          setShowAddModal(false);
          setNewUser({
            name: '',
            email: '',
            position: '',
            password: '',
            projectIds: [],
          });
        } else {
          toast.error(response.data.msg || 'Registration failed');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleRemoveClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!userToDelete) return;

    try {
      const userId = userToDelete._id || userToDelete.user?._id;
      if (!userId) {
        toast.error('User ID not found');
        return;
      }
      console.log(userId);
      const response = await axios.delete(`/deleteUser/${userId}`, {
        data: {
          projectId: selectedProject?.projectId
        }
      });

      if (response.data.msg.includes('deleted successfully')) {
        if (activeTab === 'user') {
          const updatedUsers = users.filter(user => user._id !== userId);
          setUsers(updatedUsers);
        } else if (activeTab === 'admins') {
          const updatedAdmins = admins.filter(admin => admin._id !== userId);
          setAdmins(updatedAdmins);
        } else {
          const updatedSuperAdmins = superAdmins.filter(admin => admin._id !== userId);
          setSuperAdmins(updatedSuperAdmins);
        }
        toast.success(`${activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} removed successfully`);
        setTimeout(() => {
          fetchRoleDetails(activeTab);
        }, 1000);
       
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

  const fetchRoleDetails = async (role) => {
    try {
      setLoading(true);
      // Convert role parameter for different cases
      let roleParam;
      if (role === 'superAdmin') {
        roleParam = 'superadmin';
      } else if (role === 'admins') {
        roleParam = 'admin';
      } else {
        roleParam = role;
      }

      console.log("Fetching role details for:", roleParam);
      
      const response = await axios.get(`/getUserRoleDetails?role=${roleParam}`);
      console.log("Role details response:", response.data);

      if (response.data) {
        setDetails(response.data);
      } else {
        setDetails([]);
      }
    } catch (error) {
      console.error(`Error fetching ${role} details:`, error);
      setError(`Failed to fetch ${role} details`);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setShowSearchResults(false);

    // Convert tab to correct role parameter for fetching
    let roleParam;
    if (tab === 'admins') {
      roleParam = 'admin';
    } else if (tab === 'superAdmin') {
      roleParam = 'superadmin';
    } else {
      roleParam = tab;
    }

    fetchRoleDetails(roleParam);

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
      case 'user':
        return users;
      case 'admins':
        return admins;
      case 'superAdmin':
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
    console.log("User data for edit:", user);
    
    // Get the user's role with proper casing
    const userRole = user.role || user.user?.Role || '';

    setUserToEdit({
      _id: user._id || user.user?._id || '',
      name: user.user?.Name || '',
      email: user.user?.Email || '',
      position: user.user?.position || '',
      password: user.password || '',
      projectIds: [], // Initialize empty, will be populated by fetchProjects
      assignedProjects: [], // Initialize empty, will be populated by fetchProjects
      role: userRole,
    });
    
    setShowEditModal(true);
    
    // Fetch projects after setting initial userToEdit state
    fetchProjects();
  };

  // Update the project removal in edit modal
  const removeProjectFromEdit = (projectId) => {
    console.log("Removing project:", projectId);
    setUserToEdit(prev => ({
      ...prev,
      projectIds: prev.projectIds.filter(id => id !== projectId),
      assignedProjects: prev.assignedProjects.filter(project => project.projectId !== projectId)
    }));
  };

  // Function to format role for backend
  const formatRoleForBackend = (role) => {
    switch(role.toLowerCase()) {
      case 'superadmin':
        return 'superAdmin';
      case 'admin':
        return 'admin';
      case 'user':
        return 'user';
      default:
        return role;
    }
  };

  // Update handleEditSubmit to use the formatted role
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { _id, name, email, password, position, projectIds, role, assignedProjects } = userToEdit;

      if (!_id) {
        toast.error('User ID is missing. Unable to update user.');
        return;
      }

      // Ensure we have all project IDs, including previously assigned ones
      const allProjectIds = [...new Set([
        ...projectIds,
        ...(assignedProjects || []).map(project => project.projectId)
      ])];

      const userData = {
        userId: _id,
        name,
        email,
        position,
        password: password || undefined,
        projectIds: allProjectIds, // Send all project IDs to backend
        role: formatRoleForBackend(role),
      };

      console.log("Sending update data:", userData);

      const response = await axios.put('/updateRole', userData);

      if (response.data.msg === 'User updated successfully') {
        // Update the appropriate list based on role
        const updatedUser = {
          ...userToEdit,
          ...response.data.data,
          assignedProjects: userToEdit.assignedProjects // Preserve project information
        };

        if (activeTab === 'user') {
          const updatedUsers = users.map(user => user._id === _id ? updatedUser : user);
          setUsers(updatedUsers);
        } else if (activeTab === 'admins') {
          const updatedAdmins = admins.map(admin => admin._id === _id ? updatedUser : admin);
          setAdmins(updatedAdmins);
        } else {
          const updatedSuperAdmins = superAdmins.map(admin => admin._id === _id ? updatedUser : admin);
          setSuperAdmins(updatedSuperAdmins);
        }

        setShowEditModal(false);
        toast.success(`${activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} updated successfully`);
        
        // Refresh the role details
        fetchRoleDetails(activeTab);
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

  const removeProject = (projectId, isEdit = false) => {
    if (isEdit) {
      setUserToEdit({
        ...userToEdit,
        projectIds: userToEdit.projectIds.filter(id => id !== projectId),
      });
    } else {
      setNewUser({
        ...newUser,
        projectIds: newUser.projectIds.filter(id => id !== projectId),
      });
    }
  };

  if (loading) return <div className="loading">Loading {activeTab}...</div>;

  return (
    <div className="users-container">
      <div className="users-tabs">
        <button
          className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => handleTabChange('user')}
        >
          Users
        </button>
        {userRole === 'superadmin' && (
          <>
            <button
              className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => handleTabChange('admins')}
            >
              Admins
            </button>
            <button
              className={`tab-button ${activeTab === 'superAdmin' ? 'active' : ''}`}
              onClick={() => handleTabChange('superAdmin')}
            >
              Super Admins
            </button>
          </>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}></div>

      <div className="actions-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder={`Search ${activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} by name or email`}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add {activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}
          </button>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Assigned Projects</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item) => (
              <tr key={item._id} className={item.status === 'inactive' ? 'inactive-row' : ''}>
                <td>
                  <div className="user-infoi">
                    <div className="user-name">{item.user?.Name || 'N/A'}</div>
                    <div className="user-email">{item.user?.Email || 'N/A'}</div>
                  </div>
                </td>
                <td>{item.user?.position || 'N/A'}</td>
                <td>
                  <div className="assigned-projects">
                    {item.assignedProjects && item.assignedProjects.length > 0 ? (
                      <div className="project-list">
                        {item.assignedProjects.map((project, index) => (
                          <div key={index} className="project-badge">
                            {project.projectName || 'Unknown Project'}
                          </div>
                        ))}
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
            <h2>Add New {activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}</h2>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>{activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Name</label>
                <input
                  type="text"
                  placeholder={`Enter the ${activeTab === 'user' ? 'user' : activeTab === 'admins' ? 'admin' : 'super admin'} name`}
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Email</label>
                <input
                  type="email"
                  placeholder={`Enter the ${activeTab === 'user' ? 'user' : activeTab === 'admins' ? 'admin' : 'super admin'} email`}
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
                  <option value="QA MANAGER">QA MANAGER</option>
                  <option value="QA LEAD">QA LEAD</option>
                  <option value="QA ASSISTANT MANAGER">QA ASSISTANT MANAGER</option>
                  <option value="Junior QA">Junior QA</option>
                </select>
              </div>

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

              <div className="form-group">
                <label>Assign Projects</label>
                {/* Selected Projects Box */}
                <div className="selected-projects-box">
                  {newUser.projectIds.map((projectId) => {
                    const project = availableProjects.find(p => p.projectId === projectId);
                    return (
                      <div key={projectId} className="selected-project-tag">
                        <span>{project?.projectName || 'Unknown Project'}</span>
                        <button
                          type="button"
                          className="remove-project"
                          onClick={() => {
                            setNewUser({
                              ...newUser,
                              projectIds: newUser.projectIds.filter(id => id !== projectId)
                            });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
                {/* Project Selection Dropdown */}
                <select
                  multiple
                  value={[]} // Always empty since we're handling selection manually
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    const newProjectIds = [...new Set([...newUser.projectIds, ...selectedOptions])];
                    setNewUser({ ...newUser, projectIds: newProjectIds });
                  }}
                  className="project-select"
                >
                  {availableProjects
                    .filter(project => !newUser.projectIds.includes(project.projectId))
                    .map(project => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </option>
                    ))}
                </select>
                <small className="select-hint">Hold Ctrl/Cmd to select multiple projects</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add {activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}
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
            <h3>Remove {activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}</h3>
            <p>Are you sure you want to remove this {activeTab === 'user' ? 'user' : activeTab === 'admins' ? 'admin' : 'super admin'}?</p>
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
            <h2>Edit {activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>{activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Name</label>
                <input
                  type="text"
                  placeholder={`Enter the ${activeTab === 'user' ? 'user' : activeTab === 'admins' ? 'admin' : 'super admin'} name`}
                  value={userToEdit?.name || ''} // Pre-fill the name
                  onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'} Email</label>
                <input
                  type="email"
                  placeholder={`Enter the ${activeTab === 'user' ? 'user' : activeTab === 'admins' ? 'admin' : 'super admin'} email`}
                  value={userToEdit?.email || ''} // Pre-fill the email
                  onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <select
                  value={userToEdit?.position || ''} // Pre-fill the position
                  onChange={(e) => setUserToEdit({ ...userToEdit, position: e.target.value })}
                  required
                  className="form-select"
                >
                  <option value="">Select Position</option>
                  <option value="QA MANAGER">QA MANAGER</option>
                  <option value="QA LEAD">QA LEAD</option>
                  <option value="QA ASSISTANT MANAGER">QA ASSISTANT MANAGER</option>
                  <option value="Junior QA">Junior QA</option>
                </select>
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={userToEdit?.role || ''}
                  onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
                  required
                  className="form-select"
                >
                  {userRole === 'superAdmin' || userRole === 'superadmin' ? (
                    // If current user is superadmin, show all role options
                    <>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                    </>
                  ) : userRole === 'admin' ? (
                    // If current user is admin, only show user role option
                    <option value="user">User</option>
                  ) : null}
                </select>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPasswords['edit'] ? "text" : "password"}
                    placeholder="Enter new password (leave empty to keep current)"
                    value={userToEdit?.password || ''} // Pre-fill the password
                    onChange={(e) => setUserToEdit({ ...userToEdit, password: e.target.value })}
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

              <div className="form-group">
                <label>Assigned Projects</label>
                <div className="selected-projects-box">
                  {userToEdit?.assignedProjects?.map((project) => (
                    <div key={project.projectId} className="selected-project-tag">
                      <span>{project.projectName}</span>
                      <button
                        type="button"
                        className="remove-project"
                        onClick={() => removeProjectFromEdit(project.projectId)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {(!userToEdit?.assignedProjects || userToEdit.assignedProjects.length === 0) && (
                    <div className="no-projects">No projects assigned</div>
                  )}
                </div>
                
                <select
                  multiple
                  value={[]}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    const newProjects = selectedOptions.map(projectId => {
                      const project = availableProjects.find(p => p.projectId === projectId);
                      return {
                        projectId: project.projectId,
                        projectName: project.projectName
                      };
                    });
                    
                    setUserToEdit(prev => ({
                      ...prev,
                      projectIds: [...prev.projectIds, ...selectedOptions],
                      assignedProjects: [...prev.assignedProjects, ...newProjects]
                    }));
                  }}
                  className="project-select"
                >
                  {availableProjects
                    .filter(project => !userToEdit?.projectIds?.includes(project.projectId))
                    .map(project => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </option>
                    ))}
                </select>
                <small className="select-hint">Hold Ctrl/Cmd to select multiple projects</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowEditModal(false);
                  setUserToEdit(null);
                }}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update {activeTab === 'user' ? 'User' : activeTab === 'admins' ? 'Admin' : 'Super Admin'}
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

      {/* Add this CSS to your Users.css file */}
      <style>
        {`
          .selected-projects-box {
            border: 1px solid #ccc;
            border-radius: 4px;
            min-height: 80px; /* Increased height */
            padding: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            background-color: #fff;
          }

          .selected-project-tag {
            background-color: #e8f0fe;
            border: 1px solid #4285f4;
            border-radius: 16px;
            padding: 4px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .remove-project {
            background: none;
            border: none;
            color: #5f6368;
            cursor: pointer;
            font-size: 18px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }

          .remove-project:hover {
            background-color: rgba(0, 0, 0, 0.1);
            color: #d93025;
          }

          .project-select {
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-top: 8px;
            min-height: 150px; /* Increased height */
            max-height: 200px; /* Added max height */
            overflow-y: auto; /* Added scroll for overflow */
          }

          .project-select option {
            padding: 8px;
            font-size: 14px;
          }

          .project-select option:hover {
            background-color: #e8f0fe;
          }

          .form-select {
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-top: 4px;
            font-size: 14px;
            background-color: #fff;
          }

          .form-select:focus {
            outline: none;
            border-color: #4285f4;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
          }

          .form-select option {
            padding: 8px;
          }

          .search-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          .search-input:focus {
            outline: none;
            border-color: #4285f4;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
          }

          .search-container {
            position: relative;
            width: 300px;
          }

          .search-container::before {
            content: '🔍';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default Users;