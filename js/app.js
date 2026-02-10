// Main App Entry Point

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    // 0. Check Auth
    if (!auth.checkAuth()) return;

    // 1. Initial i18n and Theme
    if (window.i18n) i18n.updateUI();
    if (window.themeManager) themeManager.init();

    // 2. Initialize Navigation and Core UI
    initNavigation();
    UI.initEnhancements(); // Moved UI listeners here if possible, or keep local

    // 3. Load initial data
    try {
        await DashboardController.init();
        await ProductController.init();
        await POSController.init();

        // Initialize other modules if they exist
        if (window.initSalesHistory) window.initSalesHistory();
        if (window.initCustomers) window.initCustomers();
        if (window.initExpenditures) window.initExpenditures();
        if (window.initSettings) window.initSettings();

    } catch (err) {
        console.error("Critical error during initialization:", err);
        Toast.error("Failed to load application data");
    }
});

// UI Enhancements (Moved from old app.js, tailored for new structure)
UI.initEnhancements = function () {
    // Refresh Dashboard
    const btnRefresh = document.getElementById('btn-refresh-dashboard');
    if (btnRefresh) {
        btnRefresh.onclick = async () => {
            btnRefresh.querySelector('i').classList.add('fa-spin');
            await DashboardController.init();
            setTimeout(() => btnRefresh.querySelector('i').classList.remove('fa-spin'), 1000);
        };
    }

    // FAB Sale
    const fabSale = document.getElementById('fab-sale');
    if (fabSale) fabSale.onclick = () => switchPage('pos');

    // Sidebar Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (menuToggle && sidebar && overlay) {
        const toggle = () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        };
        menuToggle.onclick = toggle;
        overlay.onclick = toggle;
    }
};

// Navigation Logic
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('page-title');

function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            switchPage(page);
        });
    });
}

window.switchPage = function (pageId) {
    window.state.currentPage = pageId;

    // Update UI
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const activePage = document.getElementById(`${pageId}-page`);
    const activeLink = document.querySelector(`[data-page="${pageId}"]`); // Selects desktop link

    if (activePage) activePage.classList.add('active');
    if (activeLink) activeLink.classList.add('active');

    // MOBILE NAV UPDATE
    const mobileNavLinks = document.querySelectorAll('.nav-item-mobile');
    mobileNavLinks.forEach(l => l.classList.remove('active'));
    const activeMobileLink = document.querySelector(`.nav-item-mobile[data-page="${pageId}"]`);
    if (activeMobileLink) activeMobileLink.classList.add('active');

    // Close sidebar on mobile
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    // Update Title
    const pageKeys = {
        'dashboard': 'nav-dashboard',
        'products': 'nav-products',
        'pos': 'nav-pos',
        'sales': 'nav-sales',
        'customers': 'nav-customers',
        'advisor': 'nav-advisor',
        'expenditures': 'nav-expenditures',
        'settings': 'nav-settings'
    };
    if (pageTitle) pageTitle.textContent = i18n.t(pageKeys[pageId] || pageId);

    // Context specific refreshes
    if (pageId === 'dashboard') DashboardController.init();
    if (pageId === 'products') ProductController.init();
    if (pageId === 'pos') POSController.init();

    // FAB Logic: Hide on POS, show on others
    const fabSale = document.getElementById('fab-sale');
    if (fabSale) {
        fabSale.style.display = (pageId === 'pos') ? 'none' : 'flex';
    }

    // Legacy modules
    if (pageId === 'sales' && window.loadSalesHistory) window.loadSalesHistory();
    if (pageId === 'customers' && window.initCustomers) window.initCustomers();
    if (pageId === 'advisor' && window.initAdvisor) window.initAdvisor();
    if (pageId === 'expenditures' && window.initExpenditures) window.initExpenditures();
    if (pageId === 'settings' && window.initSettings) window.initSettings();
};

// Global exports for legacy compatibility if needed
window.formatMoney = UI.formatMoney;
