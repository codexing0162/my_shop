const DashboardController = {
    async init() {
        const list = document.getElementById('recent-sales-list');
        if (list) UI.showSkeleton(list, 5, 'row');

        const res = await api.get('/dashboard/overview');
        if (res.success) {
            const data = res.data;
            window.state.dashboard = data;

            // Update UI
            document.getElementById('stat-sales').textContent = UI.formatMoney(data.today_sales);
            document.getElementById('stat-gross-profit').textContent = UI.formatMoney(data.today_gross_profit || 0);
            document.getElementById('stat-net-profit').textContent = UI.formatMoney(data.today_net_profit || 0);
            document.getElementById('stat-expenses').textContent = UI.formatMoney(data.today_expenses || 0);
            document.getElementById('stat-low-stock').textContent = data.low_stock_items;
            document.getElementById('stat-inventory-value').textContent = UI.formatMoney(data.inventory_value || 0);

            // Recent Sales
            const list = document.getElementById('recent-sales-list');
            if (list) {
                list.innerHTML = data.recent_sales.map(sale => `
                    <tr>
                        <td>${sale.invoice_number}</td>
                        <td>${sale.customer_name || 'Mteja wa Kupita (Guest)'}</td>
                        <td style="font-weight: 700;">${UI.formatMoney(sale.total_amount)}</td>
                        <td>${new Date(sale.sale_date).toLocaleDateString()}</td>
                    </tr>
                `).join('');
            }
        }

        // Load charts
        await this.loadCharts();
    },

    async loadCharts() {
        // Sales Trend Chart
        const trendsRes = await api.get('/reports/sales-trends?days=7');
        if (trendsRes.success && trendsRes.data.length > 0) {
            const ctx = document.getElementById('sales-trend-chart');
            if (ctx) {
                // Destroy existing chart if stored (we might need to store chart instances in state or a localized scope)
                // For simplicity, we'll assume Chart.js handles canvas reuse or we rely on re-rendering page
                // Ideally, track chart instance.
                if (window.salesTrendChartInstance) window.salesTrendChartInstance.destroy();

                window.salesTrendChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: trendsRes.data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                        datasets: [{
                            label: 'Daily Sales',
                            data: trendsRes.data.map(d => parseFloat(d.total_sales)),
                            borderColor: '#ff6a00',
                            backgroundColor: 'rgba(255, 106, 0, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { callback: function (value) { return 'TSH ' + value.toLocaleString(); } }
                            }
                        }
                    }
                });
            }
        }

        // Top Products Chart
        const topProductsRes = await api.get('/reports/top-products?limit=5');
        if (topProductsRes.success && topProductsRes.data.length > 0) {
            const ctx = document.getElementById('top-products-chart');
            if (ctx) {
                if (window.topProductsChartInstance) window.topProductsChartInstance.destroy();

                window.topProductsChartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: topProductsRes.data.map(p => `${p.brand} ${p.model}`),
                        datasets: [{
                            label: 'Units Sold',
                            data: topProductsRes.data.map(p => p.total_sold),
                            backgroundColor: [
                                'rgba(255, 106, 0, 0.8)', 'rgba(0, 123, 255, 0.8)',
                                'rgba(40, 167, 69, 0.8)', 'rgba(255, 193, 7, 0.8)', 'rgba(220, 53, 69, 0.8)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true, position: 'right' }
                        }
                    }
                });
            }
        }
    }
};

window.DashboardController = DashboardController;
