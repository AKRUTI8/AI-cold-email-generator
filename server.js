const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('AI Cold Email Generator API is running');
});

// Email generation endpoint
app.post('/api/generate-email', async (req, res) => {
    try {
        const {
            senderName,
            senderTitle,
            recipientName,
            companyName,
            industry,
            purpose,
            tone
        } = req.body;

        // Validate required fields
        if (!senderName || !senderTitle || !recipientName || !companyName || !industry || !purpose) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        const prompt = `Generate a professional cold email with the following details:
Sender: ${senderName} (${senderTitle})
Recipient: ${recipientName} at ${companyName}
Industry: ${industry}
Purpose: ${purpose}
Tone: ${tone}

IMPORTANT: You must respond with a valid JSON object in the following format:
{
    "subject": "Email subject line",
    "email": "Full email body content"
}`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional email writer. You must respond with a valid JSON object containing 'subject' and 'email' fields."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0]?.message?.content;
        
        if (!responseContent) {
            throw new Error('No content received from AI model');
        }

        const parsedResponse = JSON.parse(responseContent.trim());

        if (!parsedResponse.subject || !parsedResponse.email) {
            throw new Error('AI response missing required fields');
        }

        res.json({
            subject: parsedResponse.subject,
            email: parsedResponse.email
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to generate email'
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 