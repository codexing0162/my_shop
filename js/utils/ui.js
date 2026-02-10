const UI = {
    showSkeleton(container, count = 3, type = 'card') {
        if (!container) return;
        let html = '';
        for (let i = 0; i < count; i++) {
            if (type === 'card') {
                html += `
                    <div class="product-card skeleton-loader">
                        <div class="skeleton skeleton-img"></div>
                        <div class="skeleton skeleton-text" style="width: 60%;"></div>
                        <div class="skeleton skeleton-text" style="width: 40%;"></div>
                    </div>
                `;
            } else if (type === 'row') {
                html += `
                    <tr class="skeleton-loader">
                        <td colspan="5"><div class="skeleton skeleton-text"></div></td>
                    </tr>
                `;
            }
        }
        container.innerHTML = html;
    },

    formatMoney(amount) {
        return 'TSH ' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    },

    showSpinner(element) {
        if (!element) return;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    },

    hideSpinner(element, originalContent) {
        if (!element) return;
        element.innerHTML = originalContent;
    },

    // Toggle sidebar
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }
    }
};

window.UI = UI;
