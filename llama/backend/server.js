const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Route to handle test case generation
app.post('/api/generate-test-cases', async (req, res) => {
    try {
        const { requirement_text } = req.body;

        if (!requirement_text) {
            return res.status(400).json({ error: 'Requirement text is required' });
        }

        // Call the Python API
        const response = await axios.post('http://localhost:5001/generate-test-cases', { requirement_text });

        res.json(response.data);
    } catch (error) {
        console.error('Error generating test cases:', error);
        res.status(500).json({ error: 'Failed to generate test cases' });
    }
});
app.get('/', (req, res) => {
    res.send('Backend API is running!');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
