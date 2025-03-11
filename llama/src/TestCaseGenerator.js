import React, { useState } from 'react';
import axios from 'axios';

const TestCaseGenerator = () => {
    const [requirement, setRequirement] = useState('');
    const [testCases, setTestCases] = useState('');

    const generateTestCases = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/generate-test-cases', {
                requirement_text: requirement
            });
            setTestCases(response.data.test_cases);
        } catch (error) {
            console.error('Error generating test cases:', error);
            setTestCases('Failed to generate test cases.');
        }
    };

    return (
        <div>
            <h2>Test Case Generator</h2>
            <textarea
                rows="6"
                cols="50"
                placeholder="Enter requirement document here..."
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
            />
            <br />
            <button onClick={generateTestCases}>Generate Test Cases</button>
            <h3>Generated Test Cases:</h3>
            <pre>{testCases}</pre>
        </div>
    );
};

export default TestCaseGenerator;
