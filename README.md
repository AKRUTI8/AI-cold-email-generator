# AI Cold Email Generator

An AI-powered cold email generator that uses the Groq API to create personalized, professional cold emails.

## Features

- AI-powered email generation
- Multiple tone options (Professional, Friendly, Formal, Casual)
- Industry-specific customization
- Copy to clipboard functionality
- Download emails as text files
- Responsive design
- Real-time form validation

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `index.html` in your browser

## Usage

1. Fill in the required fields:
   - Your Name
   - Your Role
   - Recipient Name
   - Company Name
   - Industry
   - Email Purpose
   - Email Tone

2. Click "Generate Email" to create a personalized cold email
3. Use the action buttons to:
   - Copy the email to clipboard
   - Download the email as a text file
   - Regenerate the email with the same parameters

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- AI: Groq API
- Dependencies:
  - express
  - cors
  - dotenv
  - groq-sdk

## License

MIT License 