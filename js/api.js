// API Configuration
const BASE_URL = 'http://localhost:3000/api';

const api = {
    // Legacy support for init, no-op for network API
    async init() {
        return true;
    },

    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${BASE_URL}${endpoint}`);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            // Use auth.fetch if available, else standard fetch
            const fetchFunc = window.auth ? window.auth.fetch : fetch;

            const response = await fetchFunc(url);
            if (!response) return { success: false, error: 'Unauthorized' };

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API GET error (${endpoint}):`, error);
            return { success: false, error: error.message };
        }
    },

    async post(endpoint, data) {
        try {
            const fetchFunc = window.auth ? window.auth.fetch : fetch;

            const response = await fetchFunc(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response) return { success: false, error: 'Unauthorized' };
            return await response.json();
        } catch (error) {
            console.error(`API POST error (${endpoint}):`, error);
            return { success: false, error: error.message };
        }
    },

    async put(endpoint, data) {
        try {
            const fetchFunc = window.auth ? window.auth.fetch : fetch;

            const response = await fetchFunc(`${BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response) return { success: false, error: 'Unauthorized' };
            return await response.json();
        } catch (error) {
            console.error(`API PUT error (${endpoint}):`, error);
            return { success: false, error: error.message };
        }
    },

    async delete(endpoint) {
        try {
            const fetchFunc = window.auth ? window.auth.fetch : fetch;

            const response = await fetchFunc(`${BASE_URL}${endpoint}`, {
                method: 'DELETE'
            });

            if (!response) return { success: false, error: 'Unauthorized' };
            return await response.json();
        } catch (error) {
            console.error(`API DELETE error (${endpoint}):`, error);
            return { success: false, error: error.message };
        }
    },

    async postFormData(endpoint, formData) {
        try {
            const fetchFunc = window.auth ? window.auth.fetch : fetch;

            const response = await fetchFunc(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData // Fetch handles multipart boundary automatically
            });

            if (!response) return { success: false, error: 'Unauthorized' };
            return await response.json();
        } catch (error) {
            console.error(`API POST FormData error (${endpoint}):`, error);
            return { success: false, error: error.message };
        }
    },

    async putFormData(endpoint, formData) {
        try {
            const fetchFunc = window.auth ? window.auth.fetch : fetch;

            const response = await fetchFunc(`${BASE_URL}${endpoint}`, {
                method: 'PUT',
                body: formData
            });

            if (!response) return { success: false, error: 'Unauthorized' };
            return await response.json();
        } catch (error) {
            console.error(`API PUT FormData error (${endpoint}):`, error);
            return { success: false, error: error.message };
        }
    },

    formatImageUrl(url) {
        if (!url) return 'https://via.placeholder.com/200x200?text=No+Image';
        if (url.startsWith('http')) return url;
        // Backend returns paths like /uploads/filename.jpg
        return `http://localhost:3000${url}`;
    }
};
