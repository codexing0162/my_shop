const themeManager = {
    currentTheme: localStorage.getItem('app-theme') || 'light',

    init() {
        this.applyTheme(this.currentTheme);
    },

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('app-theme', theme);
        this.applyTheme(theme);
    },

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
};

window.themeManager = themeManager;
themeManager.init();
