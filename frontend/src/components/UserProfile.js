import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import axios from "./axios"

const UserProfile = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('user')) || {
        Name: 'User',
        Email: 'user@example.com',
        Role: 'User'
    };

    // Format role for display
    const formatRole = (role) => {
        if (!role) return 'User';
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            localStorage.removeItem('user');
            localStorage.removeItem('selectedProject');
            navigate('/login');
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="user-profile-container" ref={dropdownRef}>
            <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="avatar">
                    {userData.Name ? userData.Name[0].toUpperCase() : 'U'}
                </div>
            </div>

            {showDropdown && (
                <div className="profile-dropdown">
                    <div className="profile-info">
                        <div className="profile-header">
                            <div className="profile-avatar-small">
                                {userData.Name ? userData.Name[0].toUpperCase() : 'U'}
                            </div>
                            <div className="profile-text">
                                <p className="profile-name">{userData.Name}</p>
                                <p className="profile-email">{userData.Email}</p>
                                <p className="profile-role">{formatRole(userData.Role)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-actions">
                        <div className="dropdown-item" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile; 