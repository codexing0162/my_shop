const Toast = {
    init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
    },

    show(message, type = 'info') {
        this.init();
        const container = document.getElementById('toast-container');

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Colors based on type
        let bg = '#333';
        let icon = 'info-circle';

        if (type === 'success') { bg = '#28a745'; icon = 'check-circle'; }
        if (type === 'error') { bg = '#dc3545'; icon = 'exclamation-circle'; }
        if (type === 'warning') { bg = '#ffc107'; icon = 'exclamation-triangle'; }
        if (type === 'info') { bg = '#17a2b8'; icon = 'info-circle'; }

        toast.style.cssText = `
            background: ${bg};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 250px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
        `;

        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        // Remove after 3s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); },
    warning(msg) { this.show(msg, 'warning'); },
    info(msg) { this.show(msg, 'info'); }
};

window.Toast = Toast;
