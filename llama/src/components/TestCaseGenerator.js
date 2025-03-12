import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner'; // Import Spinner component
import '../styles/TestCaseGenerator.css'; // Import CSS

const TestCaseGenerator = () => {
    const [requirement, setRequirement] = useState('');
    const [testCases, setTestCases] = useState('');
    const [loading, setLoading] = useState(false);

    const generateTestCases = async () => {
        setLoading(true);
        setTestCases('');

        try {
            const response = await axios.post('http://localhost:5000/api/generate-test-cases', {
                requirement_text: requirement
            });
            setTestCases(response.data.test_cases);
        } catch (error) {
            console.error('Error generating test cases:', error);
            setTestCases('⚠️ Failed to generate test cases. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="container">
            <h2 className="heading">🛠️ AI Test Case Generator</h2>
            
            <textarea
                rows="6"
                cols="50"
                placeholder="Enter requirement document here..."
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                disabled={loading}
                className="textarea"
            />
            <br />

            <button 
                onClick={generateTestCases} 
                disabled={loading} 
                className={loading ? 'button-disabled' : 'button'}
            >
                {loading ? 'Generating...' : 'Generate Test Cases'}
            </button>

            <h3 className="subheading">Generated Test Cases:</h3>

            {loading ? (
                <Spinner /> // Show Spinner
            ) : (
                <pre className="output">{testCases || 'No test cases generated yet.'}</pre>
            )}
        </div>
    );
};

export default TestCaseGenerator;
