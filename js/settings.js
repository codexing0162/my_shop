const { invoke } = window.__TAURI__.core;
const { Command } = window.__TAURI__.shell;

async function initSettings() {
    loadCategories();
    checkConnection();

    // Connection Check Button
    const btnCheck = document.getElementById('btn-check-connection');
    if (btnCheck) {
        btnCheck.onclick = () => checkConnection();
    }

    // Language Selection
    const selectLang = document.getElementById('select-language');
    if (selectLang) {
        selectLang.value = i18n.currentLang;
        selectLang.onchange = (e) => {
            i18n.setLanguage(e.target.value);
        };
    }

    // Theme Selection
    const selectTheme = document.getElementById('select-theme');
    if (selectTheme) {
        selectTheme.value = themeManager.currentTheme;
        selectTheme.onchange = (e) => {
            themeManager.setTheme(e.target.value);
        };
    }
}

async function checkConnection() {
    const dot = document.getElementById('connection-dot');
    const text = document.getElementById('connection-text');
    const btnCheck = document.getElementById('btn-check-connection');

    if (!dot || !text) return;

    // Set to checking state
    dot.className = 'status-dot';
    text.textContent = i18n.t('msg-checking-conn');
    if (btnCheck) {
        btnCheck.innerHTML = '<i class="fas fa-network-wired"></i> Angalia Sasa (Check Now)';
        btnCheck.onclick = () => checkConnection();
        btnCheck.classList.remove('btn-danger');
        btnCheck.classList.add('btn-primary');
    }

    try {
        const response = await fetch('http://localhost:3000/health');
        if (response.ok) {
            dot.className = 'status-dot online';
            text.textContent = i18n.t('msg-connected');
        } else {
            throw new Error('Server returned an error');
        }
    } catch (error) {
        dot.className = 'status-dot offline';
        text.textContent = i18n.t('msg-disconnected');

        // Change button to Start Server
        if (btnCheck) {
            btnCheck.innerHTML = '<i class="fas fa-power-off"></i> Washa Server (Start Server)';
            btnCheck.classList.remove('btn-primary');
            btnCheck.classList.add('btn-danger');
            btnCheck.onclick = () => startServer();
        }
    }
}

async function startServer() {
    const btnCheck = document.getElementById('btn-check-connection');
    if (btnCheck) {
        btnCheck.disabled = true;
        btnCheck.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inawaka... (Starting...)';
    }

    try {
        // Command to run: node backend/server.js
        // Note: This relies on 'node' being in the system PATH
        const command = Command.create('node', ['backend/server.js']);
        const child = await command.spawn();

        console.log('Server process started with PID:', child.pid);

        // Wait a bit for server to startup then check connection
        setTimeout(() => {
            if (btnCheck) btnCheck.disabled = false;
            checkConnection();
        }, 3000);

    } catch (error) {
        console.error('Failed to start server:', error);
        showNotification('Failed to start server: ' + error, 'error');
        if (btnCheck) {
            btnCheck.disabled = false;
            btnCheck.innerHTML = '<i class="fas fa-power-off"></i> Jaribu Tena (Retry Start)';
        }
    }
}

async function loadCategories() {
    const container = document.querySelector('.category-list');
    if (!container) return;

    const res = await api.get('/categories');
    if (res.success) {
        container.innerHTML = res.data.map(cat => `
            <div class="category-item">
                <i class="fas fa-tag"></i>
                <span>${cat.name}</span>
                <button class="btn-icon-sm" onclick="deleteCategory(${cat.id})" title="Futa (Delete)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('') + `
            <div class="category-add">
                <input type="text" id="new-category-input" placeholder="Kundi Jipya... (New Category...)">
                <button class="btn btn-sm btn-primary" onclick="addCategory()">Ongeza (Add)</button>
            </div>
        `;
    }
}

window.addCategory = async () => {
    const input = document.getElementById('new-category-input');
    const name = input.value.trim();
    if (!name) return;

    const res = await api.post('/categories', { name });
    if (res.success) {
        loadCategories();
    } else {
        showNotification('Error: ' + res.error, 'error');
    }
}

window.deleteCategory = async (id) => {
    if (confirm(i18n.t('msg-confirm-delete'))) {
        const res = await api.delete(`/categories/${id}`);
        if (res.success) {
            loadCategories();
        } else {
            showNotification(i18n.t('th-error') + ': ' + res.error, 'error');
        }
    }
}
