// Print/Save as PDF for Invoice Preview
const salePreviewPrint = document.getElementById('sale-preview-print');
if (salePreviewPrint) {
    salePreviewPrint.addEventListener('click', () => {
        const modalContent = document.querySelector('#sale-preview-modal .modal-content');
        if (!modalContent) return;
        // Clone content for print
        const printWindow = window.open('', '', 'width=900,height=700');
        printWindow.document.write(`
          <html><head><title>Invoice Preview</title>
          <link rel="stylesheet" href="css/style.css">
          <style>body{background:#fff!important;color:#222!important;} .modal-content{box-shadow:none!important;} .btn,.btn-close{display:none!important;}</style>
          </head><body>${modalContent.innerHTML}</body></html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 400);
    });
}
// Sales History State
let allSales = [];

// Initialize Sales History
function initSalesHistory() {
        // Quick date filter buttons
        const btnToday = document.getElementById('btn-filter-today');
        const btnWeek = document.getElementById('btn-filter-week');
        const btnMonth = document.getElementById('btn-filter-month');
        const btnYear = document.getElementById('btn-filter-year');

        function setDateRange(start, end) {
            document.getElementById('filter-start-date').value = start;
            document.getElementById('filter-end-date').value = end;
            loadSalesHistory(true);
        }

        if (btnToday) {
            btnToday.addEventListener('click', () => {
                const today = new Date();
                const iso = today.toISOString().split('T')[0];
                setDateRange(iso, iso);
            });
        }
        if (btnWeek) {
            btnWeek.addEventListener('click', () => {
                const today = new Date();
                const first = new Date(today.setDate(today.getDate() - today.getDay() + 1));
                const last = new Date(today.setDate(first.getDate() + 6));
                setDateRange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
            });
        }
        if (btnMonth) {
            btnMonth.addEventListener('click', () => {
                const now = new Date();
                const first = new Date(now.getFullYear(), now.getMonth(), 1);
                const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                setDateRange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
            });
        }
        if (btnYear) {
            btnYear.addEventListener('click', () => {
                const now = new Date();
                const first = new Date(now.getFullYear(), 0, 1);
                const last = new Date(now.getFullYear(), 11, 31);
                setDateRange(first.toISOString().split('T')[0], last.toISOString().split('T')[0]);
            });
        }
    const btnFilter = document.getElementById('btn-filter-sales');
    const btnReset = document.getElementById('btn-reset-filters');
    const btnExport = document.getElementById('btn-export-sales');

    if (btnFilter) {
        btnFilter.addEventListener('click', () => {
            loadSalesHistory(true);
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            document.getElementById('filter-start-date').value = '';
            document.getElementById('filter-end-date').value = '';
            document.getElementById('filter-payment-method').value = '';
            loadSalesHistory();
        });
    }

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            exportSalesToPDF();
        });
    }
}

// ... existing loadSalesHistory and renderSalesHistory functions ...

// PDF Export for Sales
function exportSalesToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Sales History Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    const tableData = allSales.map(sale => [
        sale.invoice_number,
        sale.customer_name || 'Guest',
        formatMoney(sale.total_amount),
        formatPaymentMethod(sale.payment_method),
        formatDate(sale.sale_date)
    ]);

    doc.autoTable({
        startY: 35,
        head: [['Invoice', 'Customer', 'Amount', 'Payment', 'Date']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [255, 106, 0] }
    });

    doc.save('sales_history.pdf');
}

// Load Sales History
async function loadSalesHistory(applyFilters = false) {
    try {
        const res = await api.get('/sales');
        if (res.success) {
            allSales = res.data;

            // Apply filters if requested
            let filteredSales = allSales;

            if (applyFilters) {
                const startDate = document.getElementById('filter-start-date').value;
                const endDate = document.getElementById('filter-end-date').value;
                const paymentMethod = document.getElementById('filter-payment-method').value;

                filteredSales = allSales.filter(sale => {
                    let match = true;

                    if (startDate) {
                        const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];
                        match = match && saleDate >= startDate;
                    }

                    if (endDate) {
                        const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];
                        match = match && saleDate <= endDate;
                    }

                    if (paymentMethod) {
                        match = match && sale.payment_method === paymentMethod;
                    }

                    return match;
                });
            }

            renderSalesHistory(filteredSales);
        }
    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

// Render Sales History
function renderSalesHistory(sales) {
    const tbody = document.getElementById('sales-history-list');

    if (!tbody) return;

    // Calculate summary
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    const transactionCount = sales.length;
    const avgSale = transactionCount > 0 ? totalSales / transactionCount : 0;

    // Update summary cards
    document.getElementById('summary-total-sales').textContent = formatMoney(totalSales);
    document.getElementById('summary-transaction-count').textContent = transactionCount;
    document.getElementById('summary-avg-sale').textContent = formatMoney(avgSale);

    // Render table
    if (sales.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    ${i18n.t('msg-no-sales')}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td><strong>${sale.invoice_number}</strong></td>
            <td>${sale.customer_name || i18n.t('guest')}</td>
            <td style="font-weight: 700; color: var(--success);">${formatMoney(sale.total_amount)}</td>
            <td>
                <span class="payment-badge payment-${sale.payment_method}">
                    ${formatPaymentMethod(sale.payment_method)}
                </span>
            </td>
            <td>${formatDate(sale.sale_date)}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewSaleDetails(${sale.id})" title="${i18n.t('btn-preview')}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Helper: Format Payment Method
function formatPaymentMethod(method) {
    const methods = {
        'cash': i18n.t('pay-cash'),
        'card': i18n.t('pay-card'),
        'mobile_money': i18n.t('pay-mobile'),
        'credit': i18n.t('pay-credit')
    };
    return methods[method] || method;
}

// Helper: Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// View Sale Details
window.viewSaleDetails = async (saleId) => {
    try {
        const sale = allSales.find(s => s.id === saleId || s.invoice_number == saleId);
        if (!sale) {
            console.warn('Sale not found', saleId);
            return;
        }

        // Populate preview fields
        document.getElementById('preview-invoice-number').textContent = sale.invoice_number || '';
        document.getElementById('preview-invoice-no').textContent = sale.invoice_number || '';
        document.getElementById('preview-date').textContent = formatDate(sale.sale_date);

        // Customer Name (always shown)
        document.getElementById('preview-customer-name').textContent = sale.customer_name || i18n.t('guest');

        // Phone (hide if missing)
        const phone = sale.customer_phone || sale.phone || '';
        const phoneRow = document.getElementById('preview-phone').parentElement;
        if (phone && phone.trim() !== '') {
            document.getElementById('preview-phone').textContent = phone;
            phoneRow.style.display = '';
        } else {
            phoneRow.style.display = 'none';
        }

        // Notes (hide if missing)
        const notes = sale.notes || '';
        const notesRow = document.querySelector('.invoice-notes');
        if (notes && notes.trim() !== '') {
            document.getElementById('preview-notes').textContent = notes;
            if (notesRow) notesRow.style.display = '';
        } else {
            if (notesRow) notesRow.style.display = 'none';
        }

        // Amount Paid (always shown)
        document.getElementById('preview-amount-paid').textContent = formatMoney(sale.amount_paid || sale.paid_amount || sale.total_amount || 0);

        // Payment Method (always shown)
        document.getElementById('preview-payment-method').textContent = formatPaymentMethod(sale.payment_method);

        // Items
        const itemsTbody = document.getElementById('preview-items-list');
        itemsTbody.innerHTML = '';
        if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
            sale.items.forEach(item => {
                const qty = item.quantity || item.qty || 1;
                const price = item.price || item.unit_price || item.rate || 0;
                const total = (parseFloat(qty) * parseFloat(price)) || 0;
                const tr = `
                    <tr>
                        <td>${item.name || item.product_name || ''}</td>
                        <td>${qty}</td>
                        <td>${formatMoney(price)}</td>
                        <td>${formatMoney(total)}</td>
                    </tr>
                `;
                itemsTbody.insertAdjacentHTML('beforeend', tr);
            });
        } else {
            itemsTbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;color:var(--text-muted);font-style:italic;">No items data available</td>
                </tr>
            `;
        }

        // Totals

        // Subtotal (always shown)
        document.getElementById('preview-subtotal').textContent = formatMoney(sale.subtotal || sale.total_amount || 0);

        // Tax (hide if zero or missing)
        const tax = sale.tax || 0;
        const taxRow = document.getElementById('preview-tax').parentElement;
        if (tax && parseFloat(tax) !== 0) {
            document.getElementById('preview-tax').textContent = formatMoney(tax);
            taxRow.style.display = '';
        } else {
            taxRow.style.display = 'none';
        }

        // Total (always shown)
        document.getElementById('preview-total-amount').textContent = formatMoney(sale.total_amount || sale.subtotal || 0);

        // Show modal
        const modal = document.getElementById('sale-preview-modal');
        if (modal) {
            modal.classList.add('active');
        }
    } catch (err) {
        console.error('Error showing sale preview', err);
    }
};

// Close handlers
document.addEventListener('click', (e) => {
    const modal = document.getElementById('sale-preview-modal');
    if (!modal) return;

    // Close when clicking overlay
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

const salePreviewClose = document.getElementById('sale-preview-close');
if (salePreviewClose) {
    salePreviewClose.addEventListener('click', () => {
        const modal = document.getElementById('sale-preview-modal');
        if (modal) modal.classList.remove('active');
    });
}
