import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import axios from './axios';

const UserProfile = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage with proper error handling
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const parsedUser = JSON.parse(userStr);
                // Validate that we have the required fields
                if (parsedUser && typeof parsedUser === 'object') {
                    setUserData({
                        Name: parsedUser.Name || 'User',
                        Email: parsedUser.Email || '',
                        Role: parsedUser.Role || 'User'
                    });
                } else {
                    console.error('Invalid user data format');
                    handleLogout(); // Logout if data is invalid
                }
            } else {
                // Redirect to login if no user data
                navigate('/login');
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            handleLogout(); // Logout if there's an error
        }
    }, [navigate]);

    useEffect(() => {
        // Handle clicking outside of dropdown to close it
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
            // Clear the JWT cookie by setting it to expire immediately
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            
            // Clear all other cookies just to be safe
            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
            });
            
            // Clear localStorage
            localStorage.clear();
            
            // Optional: Make a logout request to backend to invalidate the token
            await axios.post('/logout');
            
            // Navigate to login page
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if the backend logout fails, clear local storage and redirect
            localStorage.clear();
            navigate('/login');
        }
    };

    // Don't render anything if we don't have user data
    if (!userData) return null;

    return (
        <div className="user-profile" ref={dropdownRef}>
            <div 
                className="profile-trigger" 
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <div className="avatar">
                    {userData.Name ? userData.Name[0].toUpperCase() : 'U'}
                </div>
                <span className="username">{userData.Role}</span>
            </div>
            
            {showDropdown && (
                <div className="profile-dropdown">
                    <div className="profile-info">
                        <p className="name">{userData.Name}</p>
                        <p className="role">{userData.Role}</p>
                        <p className="email">{userData.Email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile; 