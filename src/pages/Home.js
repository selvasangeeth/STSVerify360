import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // Import CSS for styling

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Welcome to the Test Generator</h1>
            <p>Click the button below to generate test cases.</p>

            {/* Floating Button */}
            <button className="floating-button" onClick={() => navigate('/test-generator')}>
                ➕
            </button>
        </div>
    );
};

export default Home;
