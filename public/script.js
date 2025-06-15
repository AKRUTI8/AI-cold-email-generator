// DOM Elements
const emailForm = document.getElementById('emailForm');
const recipientName = document.getElementById('recipientName');
const companyName = document.getElementById('companyName');
const industry = document.getElementById('industry');
const purpose = document.getElementById('purpose');
const tone = document.getElementById('tone');
const senderName = document.getElementById('senderName');
const senderTitle = document.getElementById('senderTitle');
const emailSubject = document.getElementById('emailSubject');
const generatedEmail = document.getElementById('generatedEmail');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const regenerateBtn = document.getElementById('regenerateBtn');

// Server configuration
const SERVER_URL = 'http://localhost:3000';

// Loading state
let isLoading = false;

// Show loading state
function showLoading() {
    isLoading = true;
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;
    generatedEmail.value = 'Generating your personalized cold email...';
    emailSubject.value = 'Generating subject...';
}

// Hide loading state
function hideLoading() {
    isLoading = false;
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Email';
    generateBtn.disabled = false;
}

// Show error state
function showError(message) {
    generatedEmail.value = `Error: ${message}`;
    emailSubject.value = 'Error';
    hideLoading();
}

// Generate email using AI
async function generateEmailWithAI(data) {
    try {
        console.log('Attempting to connect to:', `${SERVER_URL}/api/generate-email`);
        const response = await fetch(`${SERVER_URL}/api/generate-email`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (!response.ok) {
            throw new Error(result.error || `Server error: ${response.status}`);
        }

        return {
            subject: result.subject,
            email: result.email
        };
    } catch (err) {
        console.error('Detailed error:', err);
        if (err.message.includes('Failed to fetch')) {
            throw new Error('Server is not accessible. Please check if the server URL is correct and the server is running.');
        }
        throw err;
    }
}

// Handle form submission
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validateForm()) {
        return;
    }

    try {
        showLoading();

        const emailData = {
            senderName: senderName.value.trim(),
            senderTitle: senderTitle.value.trim(),
            recipientName: recipientName.value.trim(),
            companyName: companyName.value.trim(),
            industry: industry.value,
            purpose: purpose.value.trim(),
            tone: tone.value
        };

        const result = await generateEmailWithAI(emailData);

        // Update UI with the generated email
        emailSubject.value = result.subject;
        generatedEmail.value = result.email;

        // Scroll to output section
        document.querySelector('.output-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
});

// Copy email to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        const email = `Subject: ${emailSubject.value}\n\n${generatedEmail.value}`;
        await navigator.clipboard.writeText(email);
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.add('success');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('success');
        }, 2000);
    } catch (err) {
        alert('Failed to copy to clipboard. Please try again.');
    }
});

// Download email as text file
downloadBtn.addEventListener('click', () => {
    try {
        const email = `Subject: ${emailSubject.value}\n\n${generatedEmail.value}`;
        const blob = new Blob([email], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cold-email-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        alert('Failed to download the email. Please try again.');
    }
});

// Regenerate email
regenerateBtn.addEventListener('click', () => {
    if (!isLoading) {
        emailForm.dispatchEvent(new Event('submit'));
    }
});

// Form validation
function validateForm() {
    const requiredFields = [
        { field: recipientName, name: 'Recipient Name' },
        { field: companyName, name: 'Company Name' },
        { field: industry, name: 'Industry' },
        { field: purpose, name: 'Email Purpose' },
        { field: senderName, name: 'Your Name' },
        { field: senderTitle, name: 'Your Role' }
    ];

    let isValid = true;
    let errorMessage = 'Please fill in the following required fields:\n';

    requiredFields.forEach(({ field, name }) => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error-color)';
            isValid = false;
            errorMessage += `- ${name}\n`;
        } else {
            field.style.borderColor = 'var(--border-color)';
        }
    });

    if (!isValid) {
        alert(errorMessage);
    }

    return isValid;
}

// Add input validation
[recipientName, companyName, industry, purpose, senderName, senderTitle].forEach(field => {
    field.addEventListener('input', () => {
        if (field.value.trim()) {
            field.style.borderColor = 'var(--border-color)';
        }
    });
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 