// Expenditure Logic
let expenditures = [];

async function initExpenditures() {

    // Quick date filter buttons
    const btnToday = document.getElementById('btn-exp-today');
    const btnWeek = document.getElementById('btn-exp-week');
    const btnMonth = document.getElementById('btn-exp-month');
    const btnYear = document.getElementById('btn-exp-year');

    function filterByDateRange(start, end) {
        const filtered = expenditures.filter(exp => {
            const expDate = new Date(exp.expense_date).toISOString().split('T')[0];
            return expDate >= start && expDate <= end;
        });
        renderExpenditures(filtered);
    }

    if (btnToday) {
        btnToday.addEventListener('click', () => {
            const today = new Date();
            const iso = today.toISOString().split('T')[0];
            filterByDateRange(iso, iso);
        });
    }
    if (btnWeek) {
        btnWeek.addEventListener('click', () => {
            const today = new Date();
            const first = new Date(today.setDate(today.getDate() - today.getDay() + 1));
            const last = new Date(today.setDate(first.getDate() + 6));
            filterByDateRange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
        });
    }
    if (btnMonth) {
        btnMonth.addEventListener('click', () => {
            const now = new Date();
            const first = new Date(now.getFullYear(), now.getMonth(), 1);
            const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            filterByDateRange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
        });
    }
    if (btnYear) {
        btnYear.addEventListener('click', () => {
            const now = new Date();
            const first = new Date(now.getFullYear(), 0, 1);
            const last = new Date(now.getFullYear(), 11, 31);
            filterByDateRange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
        });
    }
    await loadExpenditures();
    initExpenditureModals();

    // Set default date to today
    const dateInput = document.getElementById('expenditure-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Export button
    const btnExport = document.getElementById('btn-export-expenditures');
    if (btnExport) {
        btnExport.onclick = () => exportExpendituresToPDF();
    }
}

async function loadExpenditures() {
    const res = await api.get('/expenses');
    if (res.success) {
        expenditures = res.data;
        renderExpenditures(expenditures);
        renderDailyExpenditureSummary();
    }
}

function renderDailyExpenditureSummary() {
    const summaryContainer = document.getElementById('daily-expenditure-summary');
    if (!summaryContainer) return;

    // Group by date
    const dailyTotals = expenditures.reduce((acc, exp) => {
        const date = new Date(exp.expense_date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    const sortedDates = Object.keys(dailyTotals).sort((a, b) => new Date(b) - new Date(a));

    summaryContainer.innerHTML = `
        <div class="card" style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;"><i class="fas fa-calendar-day"></i> Daily Totals</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                ${sortedDates.slice(0, 7).map(date => `
                    <div class="info-item">
                        <div>
                            <small>${date}</small>
                            <strong>${formatMoney(dailyTotals[date])}</strong>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// PDF Export for Expenditures
function exportExpendituresToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Expenditure Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    const tableData = expenditures.map(exp => [
        new Date(exp.expense_date).toLocaleDateString(),
        exp.category,
        exp.description || '-',
        formatMoney(exp.amount),
        exp.paid_to || '-'
    ]);

    doc.autoTable({
        startY: 35,
        head: [['Date', 'Category', 'Description', 'Amount', 'Paid To']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [255, 106, 0] }
    });

    doc.save('expenditures.pdf');
}

// Category translations are now handled by render logic or i18n if keys are added
// For now, we use i18n.t or a smaller mapping if keys don't exist yet

function renderExpenditures(data) {
    const list = document.getElementById('expenditures-list');
    if (!list) return;

    list.innerHTML = data.map(exp => `
        <tr>
            <td>${new Date(exp.expense_date).toLocaleDateString()}</td>
            <td><span class="badge" style="background: #eee; color: #333; padding: 4px 8px; border-radius: 4px;">${i18n.t('cat-' + exp.category.toLowerCase().substring(0, 4)) || exp.category}</span></td>
            <td>${exp.description || '-'}</td>
            <td style="font-weight: 700; color: var(--danger);">${formatMoney(exp.amount)}</td>
            <td><small>${exp.payment || '-'}</small></td>
            <td>${exp.recipient || '-'}</td>
            <td>
                <button class="btn-icon-sm" onclick="editExpenditure(${exp.id})" title="${i18n.t('btn-edit')}">
                    <i class="fas fa-edit" style="color: var(--accent);"></i>
                </button>
                <button class="btn-icon-sm" onclick="deleteExpenditure(${exp.id})" title="${i18n.t('btn-delete')}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function initExpenditureModals() {
    const modal = document.getElementById('modal-expenditure');
    const btnAdd = document.getElementById('btn-add-expenditure');
    const btnClose = document.getElementById('btn-close-expenditure');
    const form = document.getElementById('form-expenditure');

    if (btnAdd) {
        btnAdd.onclick = () => {
            document.getElementById('modal-expenditure-title').textContent = 'Ongeza Matumizi Mapya (Add New Expenditure)';
            form.reset();
            document.getElementById('expenditure-id-field').value = '';
            document.getElementById('expenditure-date').value = new Date().toISOString().split('T')[0];
            modal.classList.add('active');
        };
    }

    if (btnClose) {
        btnClose.onclick = () => modal.classList.remove('active');
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log('Submitting expenditure data:', data); // Debug log
            const id = data.id;
            delete data.id;

            let res;
            if (id) {
                res = await api.put(`/expenses/${id}`, data);
            } else {
                res = await api.post('/expenses', data);
            }

            if (res.success) {
                modal.classList.remove('active');
                form.reset();
                loadExpenditures();
                // If on dashboard, this helps refresh stats if we switch back
            } else {
                showNotification('Error: ' + res.error, 'error');
            }
        };
    }
}

window.editExpenditure = (id) => {
    const exp = expenditures.find(e => e.id === id);
    if (!exp) return;

    const modal = document.getElementById('modal-expenditure');
    const form = document.getElementById('form-expenditure');

    document.getElementById('modal-expenditure-title').textContent = 'Edit Expenditure';
    document.getElementById('expenditure-id-field').value = exp.id;

    // Fill form
    for (let key in exp) {
        let mappedKey = key;
        if (key === 'payment') mappedKey = 'payment';
        if (key === 'recipient') mappedKey = 'recipient';
        if (key === 'expense_date') {
            const input = form.elements[mappedKey];
            if (input) input.value = new Date(exp[key]).toISOString().split('T')[0];
        } else {
            const input = form.elements[mappedKey];
            if (input) input.value = exp[key];
        }
    }

    modal.classList.add('active');
};

window.deleteExpenditure = async (id) => {
    if (confirm(i18n.t('msg-confirm-delete'))) {
        const res = await api.delete(`/expenses/${id}`);
        if (res.success) {
            loadExpenditures();
        } else {
            showNotification(i18n.t('msg-error-delete') + ': ' + res.error, 'error');
        }
    }
};

// Search functionality
document.getElementById('expenditure-search-input')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = expenditures.filter(exp =>
        exp.category?.toLowerCase().includes(term) ||
        exp.description?.toLowerCase().includes(term) ||
        exp.paid_to?.toLowerCase().includes(term)
    );
    renderExpenditures(filtered);
});
