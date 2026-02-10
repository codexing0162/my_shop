const auth = {
    // Keys
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'auth_user',

    // Methods
    login: (token, user) => {
        localStorage.setItem(auth.TOKEN_KEY, token);
        localStorage.setItem(auth.USER_KEY, JSON.stringify(user));
    },

    logout: () => {
        localStorage.removeItem(auth.TOKEN_KEY);
        localStorage.removeItem(auth.USER_KEY);
        window.location.href = 'login.html';
    },

    getToken: () => {
        return localStorage.getItem(auth.TOKEN_KEY);
    },

    getUser: () => {
        const u = localStorage.getItem(auth.USER_KEY);
        return u ? JSON.parse(u) : null;
    },

    isAuthenticated: () => {
        const token = auth.getToken();
        // TODO: Check expiration (decode JWT)
        return !!token;
    },

    checkAuth: () => {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // API Wrapper to include token
    fetch: async (url, options = {}) => {
        const token = auth.getToken();
        const headers = options.headers || {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Ensure content-type for POST/PUT
        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 401 || response.status === 403) {
                // Token invalid or expired
                auth.logout();
                return null;
            }

            return response;
        } catch (error) {
            console.error("Auth fetch error:", error);
            throw error;
        }
    }
};

// Expose to window
window.auth = auth;
