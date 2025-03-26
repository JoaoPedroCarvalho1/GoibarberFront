import { ApiService } from '../mocks/data.js';
import { setCookie, getCookie, removeCookie } from './auth.js';

export const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const userData = await ApiService.login(email, senha);
        // Save user data in cookie
        setCookie('userData', JSON.stringify(userData), 7); // Save for 7 days
        // Redirect to home
        window.location.href = './home.html';
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
};

export const logout = () => {
    removeCookie('userData');
    window.location.href = '/index.html';
};

// Initialize login functionality
export const initLogin = () => {
    // Expose functions to global scope for HTML access
    globalThis.handleLogin = handleLogin;
    globalThis.logout = logout;
}; 