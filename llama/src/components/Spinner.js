import React from 'react';
import '../styles/TestCaseGenerator.css'; // Import CSS

const Spinner = () => {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p className="loading-text">Generating test cases...</p>
        </div>
    );
};

export default Spinner;
