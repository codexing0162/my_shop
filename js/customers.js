// Customers Logic
async function initCustomers() {
    const res = await api.get('/customers');
    if (res.success) {
        state.customers = res.data;
        renderCustomerList(res.data);
    }

    // Initialize modal
    const modal = document.getElementById('modal-customer');
    const btnAdd = document.getElementById('btn-add-customer');
    const btnClose = document.getElementById('btn-close-customer');
    const form = document.getElementById('form-customer');

    if (btnAdd) {
        btnAdd.onclick = () => modal.classList.add('active');
    }

    if (btnClose) {
        btnClose.onclick = () => modal.classList.remove('active');
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const res = await api.post('/customers', data);

            if (res.success) {
                modal.classList.remove('active');
                form.reset();
                initCustomers(); // Reload list
                showNotification(i18n.t('msg-customer-added'), 'success');
            } else {
                showNotification(i18n.t('msg-error') + ': ' + res.error, 'error');
            }
        };
    }
}

// Search Logic
const searchInput = document.getElementById('customer-search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = state.customers.filter(c =>
            c.name.toLowerCase().includes(term) ||
            (c.phone && c.phone.includes(term))
        );
        renderCustomerList(filtered);
    });
}

function renderCustomerList(customers) {
    const tbody = document.getElementById('customers-list');
    if (!tbody) return;

    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${i18n.t('msg-no-customers')}</td></tr>`;
        return;
    }

    tbody.innerHTML = customers.map(c => `
        <tr>
            <td>
                <div style="font-weight: 500;">${c.name}</div>
            </td>
            <td>${c.phone || '-'}</td>
            <td>${c.email || '-'}</td>
            <td>${c.address || '-'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="showNotification(i18n.t('msg-edit-soon'), 'info')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${c.id})" title="${i18n.t('btn-delete')}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

window.deleteCustomer = async (id) => {
    if (confirm(i18n.t('msg-confirm-delete'))) {
        const res = await api.delete(`/customers/${id}`);
        if (res.success) {
            initCustomers();
        } else {
            showNotification(i18n.t('msg-error-delete') + ': ' + res.error, 'error');
        }
    }
};
