// API Base URL - thay đổi theo môi trường
const API_BASE_URL = 'https://travel-web-app-latest.onrender.com';

// DOM Elements
const registerForm = document.getElementById('register-form');
const registerSection = document.getElementById('register-section');
const userInfoSection = document.getElementById('user-info-section');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// User info elements
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userInitial = document.getElementById('user-initial');
const userCreated = document.getElementById('user-created');
const userId = document.getElementById('user-id');

// Register another button
const registerAnotherBtn = document.getElementById('register-another');

// Event Listeners
registerForm.addEventListener('submit', handleRegister);
registerAnotherBtn.addEventListener('click', showRegisterForm);

// Handle register form submission
async function handleRegister(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(registerForm);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Show loading
    showLoading();
    hideError();

    try {
        // Call API
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            // Success - show user info
            showUserInfo(result);
        } else {
            // Error
            showError(result.message || 'Có lỗi xảy ra khi đăng ký');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// Show user info after successful registration
function showUserInfo(user) {
    // Update user info
    userName.textContent = user.name;
    userEmail.textContent = user.email;
    userInitial.textContent = user.name.charAt(0).toUpperCase();
    userCreated.textContent = `Ngày tạo: ${formatDate(user.createdAt)}`;
    userId.textContent = `ID: ${user.id}`;

    // Show user info section, hide register section
    registerSection.style.display = 'none';
    userInfoSection.style.display = 'block';
    
    // Clear form
    registerForm.reset();
}

// Show register form (for "register another" button)
function showRegisterForm() {
    userInfoSection.style.display = 'none';
    registerSection.style.display = 'block';
}

// Show loading spinner
function showLoading() {
    loading.style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    loading.style.display = 'none';
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Check if API is available
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (response.ok) {
            console.log('✅ API is available');
        } else {
            console.warn('⚠️ API returned error:', response.status);
        }
    } catch (error) {
        console.error('❌ API is not available:', error);
    }
}

// Check API health on page load
document.addEventListener('DOMContentLoaded', checkAPIHealth);
