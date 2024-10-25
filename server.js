// server.js

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;

app.post('/api/google', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching response from Gemini API');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});