// Global App State
window.state = {
    currentPage: 'dashboard',
    products: [],
    cart: [],
    customers: [],
    dashboard: {},
    user: JSON.parse(localStorage.getItem('auth_user')) || null
};
