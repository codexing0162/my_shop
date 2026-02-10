document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const btnLogin = document.getElementById('btn-login');

    // Check if already logged in
    if (localStorage.getItem('auth_token')) {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }

        // Loading state
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        errorMessage.style.display = 'none';

        try {
            // Using absolute URL for now, can be adjusted based on config
            const API_URL = 'http://localhost:3000/api/auth/login';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                // Login Success
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(data.user));

                window.location.href = 'index.html';
            } else {
                // Login Failed
                showError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            showError('check your connection');
        } finally {
            btnLogin.disabled = false;
            btnLogin.textContent = 'Sign In';
        }
    });

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.style.display = 'block';
        // Shake animation
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
    }
});
