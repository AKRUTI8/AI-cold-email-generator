const config = {
    development: {
        SERVER_URL: 'http://localhost:5000'
    },
    production: {
        SERVER_URL: 'https://your-actual-backend-url.com' // Replace with your deployed backend URL
    }
};

// Use production config if deployed, otherwise use development
const environment = window.location.hostname === 'localhost' ? 'development' : 'production';
const SERVER_URL = config[environment].SERVER_URL;

export { SERVER_URL }; 