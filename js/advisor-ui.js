// Initialize when page loads or is switched to
async function initAdvisor() {
    console.log("Initializing Advanced Smart Mshauri...");
    await loadAdvisorData();
    initAdvisorEvents();
    initSimulationUI();
    renderBadges();
}

// Global Refresh Function
async function refreshAdvisor() {
    const btn = document.querySelector('button[onclick="refreshAdvisor()"]');
    if (btn) btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Updating...';

    await loadAdvisorData();

    if (btn) btn.innerHTML = '<i class="fas fa-sync-alt"></i> Update';
}

// Emergency Plan Modal
function showEmergencyPlan() {
    if (!advisorData) return showNotification("Please wait for data to load first.", 'info');

    const content = document.getElementById('emergency-plan-content');
    if (!content) return;

    // Use AdvisorUtils from advisor-utils.js
    const plan = AdvisorUtils.generateEmergencyPlan(advisorData.warningLevel, advisorData.stats);

    content.innerHTML = `
        <div class="alert alert-danger mb-3">
            <strong>Kiwango cha Hatari: ${advisorData.warningLevel}</strong>
            <p class="mb-0">Fuata mpango huu kuzuia hasara zaidi.</p>
        </div>
        <div class="emergency-steps">
            ${plan.map(step => `<p class="mb-2">${step}</p>`).join('')}
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('emergency-modal'));
    modal.show();
}

async function loadAdvisorData() {
    try {
        const res = await api.get('/advisor/insights');
        if (res.success) {
            advisorData = res.data;

            // 1. Update Health Score with warning level
            updateHealthScore(advisorData.healthScore, advisorData.warningLevel);

            // 2. Render Advanced Insights
            renderRecommendations(advisorData.recommendations);

            // 3. Render Predictions
            renderPredictions(advisorData.predictedFuture);

            // 4. Render Tomorrow's Plan
            renderTomorrowPlan(advisorData.tomorrowPlan);

            // 5. Render Simulation
            renderSimulation(advisorData.simulation);

            // 6. Render Action Buttons
            renderActionButtons(advisorData.recommendedActions);

            // 7. Update Stats Dashboard
            updateStatsDashboard(advisorData.stats);

            // 8. Create Prediction Chart
            createPredictionChart(advisorData);
        }
    } catch (error) {
        console.error("Advanced Advisor Error:", error);
        showNotification("Unable to get current advice. Please try again later.", 'error');
    }
}

function updateHealthScore(score, warningLevel) {
    // Render circular progress chart
    const chartEl = document.getElementById('advisor-health-chart');
    const labelEl = document.getElementById('advisor-health-label');
    if (!chartEl || !labelEl) return;
    if (window.advisorHealthChart) advisorHealthChart.destroy();
    window.advisorHealthChart = new Chart(chartEl, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, 100-score],
                backgroundColor: [score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c', '#eee'],
                borderWidth: 0,
                cutout: '75%',
            }],
        },
        options: {
            plugins: { legend: { display: false } },
            animation: { animateRotate: true, animateScale: true },
            responsive: false,
            maintainAspectRatio: false,
        }
    });
    labelEl.textContent = `${score}%`;
    labelEl.style.color = score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c';
}


function renderRecommendations(recs) {
    const list = document.getElementById('advisor-insights-list');
    if (!list) return;

    if (!recs || recs.length === 0) {
        list.innerHTML = '<p class="text-muted">Biashara yako iko sawa! Hakuna ushauri maalum kwa sasa.</p>';
        return;
    }

    list.innerHTML = recs.map(item => `
        <div class="insight-item ${item.type}">
            <div class="insight-icon">
                <i class="fas ${item.icon || 'fa-info-circle'}"></i>
            </div>
            <div class="insight-content" style="flex: 1;">
                <div class="insight-header">
                    <strong>${item.category}</strong>
                    <span class="insight-priority ${item.type}">${item.type.toUpperCase()}</span>
                </div>
                <p class="mb-1">${item.message}</p>
                ${item.immediateAction ? `
                <div class="insight-action">
                    <small><i class="fas fa-bolt"></i> Hatua ya Haraka:</small>
                    <strong>${item.immediateAction}</strong>
                </div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderPredictions(prediction) {
    const container = document.getElementById('advisor-predictions-list');
    if (!container) return;

    if (!prediction || prediction.confidence < 0.5) {
        container.innerHTML = `
            <div class="prediction-item p-3 border rounded">
                <i class="fas fa-chart-line text-muted"></i>
                <span class="ms-2">Data haitoshi kwa utabiri sahihi. Endelea kurekodi mauzo.</span>
            </div>
        `;
        return;
    }

    const riskColor = prediction.riskLevel === 'HIGH' ? 'var(--danger)' :
        prediction.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)';

    container.innerHTML = `
        <div class="prediction-card text-white p-3 rounded mb-3" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="mb-0"><i class="fas fa-crystal-ball"></i> Utabiri wa Wiki ijayo</h4>
                <span class="badge" style="background: ${riskColor}">
                    ${(prediction.confidence * 100).toFixed(0)}% Confidence
                </span>
            </div>
            
            <div class="row text-center">
                <div class="col">
                    <small class="d-block opacity-75">Mauzo:</small>
                    <strong>${formatCurrency(prediction.nextWeekSales)}</strong>
                </div>
                <div class="col border-start">
                    <small class="d-block opacity-75">Wateja:</small>
                    <strong>${Math.round(prediction.nextWeekCustomers)}</strong>
                </div>
            </div>
        </div>
    `;
}

function renderTomorrowPlan(plan) {
    const container = document.getElementById('tomorrow-plan-list');
    if (!container) return;

    if (!plan || plan.length === 0) {
        container.innerHTML = '<p class="text-muted">Hakuna mpango maalum wa kesho. Endelea kwa kawaida yako.</p>';
        return;
    }

    container.innerHTML = `
        <div class="timeline mt-2">
            ${plan.map(item => `
            <div class="timeline-item priority-${item.priority} mb-3 p-2 border-start border-4">
                <div class="fw-bold text-primary small">${item.time}</div>
                <div class="timeline-task">${item.task}</div>
            </div>
            `).join('')}
        </div>
    `;
}

function renderSimulation(simulation) {
    const container = document.getElementById('simulation-results');
    if (!container) return;

    if (!simulation) {
        container.innerHTML = '<p class="text-muted">Simulation data is being prepared...</p>';
        return;
    }

    container.innerHTML = `
        <div class="simulation-card p-3 border rounded">
            <h5 class="mb-2"><i class="fas fa-magic"></i> Impact Prediction</h5>
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <small class="d-block text-muted">Timeline:</small>
                    <strong>${simulation.timeline}</strong>
                </div>
                <div class="text-end">
                    <small class="d-block text-muted">Expected Profit:</small>
                    <span class="badge bg-success">+${Math.round((simulation.longTerm.profit / (advisorData.stats.todayProfit || 1) - 1) * 100)}%</span>
                </div>
            </div>
        </div>
    `;
}

function renderActionButtons(actions) {
    const container = document.getElementById('action-buttons-container');
    if (!container) return;

    if (!actions || actions.length === 0) {
        container.innerHTML = '<h5 class="text-muted small">Hakuna hatua za haraka kwa sasa.</h5>';
        return;
    }

    container.innerHTML = `
        <h5 class="mb-3">Hatua Zinazopendekezwa:</h5>
        <div class="d-grid gap-2">
            ${actions.map(action => `
            <button class="btn btn-outline-primary text-start p-2" onclick="executeAction('${action.id}')">
                <i class="fas fa-${getActionIcon(action.id)} me-2"></i>
                <strong>${action.title}</strong>
                <small class="d-block opacity-75">Impact: ${action.impact}</small>
            </button>
            `).join('')}
        </div>
    `;
}

function updateStatsDashboard(stats) {
    const elements = {
        'cash-runway': (stats.cashRunway !== undefined && stats.cashRunway !== null) ? `${stats.cashRunway} siku` : '--',
        'burn-rate': (stats.burnRate !== undefined && stats.burnRate !== null) ? `${stats.burnRate}x` : '--',
        'customer-trend': stats.todayCustomers >= (stats.avgCustomers7d || 0) ? '📈 Inaongezeka' : '📉 Inapungua',
        'top-product': stats.topProducts && stats.topProducts[0] ? stats.topProducts[0].name : 'Hakuna'
    };

    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

function createPredictionChart(data) {
    const ctx = document.getElementById('prediction-chart');
    if (!ctx) return;

    if (predictionChart) predictionChart.destroy();

    const sales = data.stats.todaySales || 0;
    const trendMultiplier = data.predictedFuture?.trend === 'decreasing' ? 0.9 : 1.1;

    predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Leo', 'Kesho', 'Siku 3', 'Wiki 1'],
            datasets: [{
                label: 'Projected Sales',
                data: [sales, sales * 0.95, sales * trendMultiplier, sales * trendMultiplier * 1.05],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function initAdvisorEvents() {
    const btnKesho = document.getElementById('btn-nifanye-nini');
    if (btnKesho) {
        btnKesho.onclick = () => {
            const tip = advisorData ? advisorData.tomorrowTip : "Pata data kwanza!";
            showNotification(`💡 Tip for Tomorrow: ${tip}`, 'info');
        };
    }
}

function initSimulationUI() {
    const simButtons = document.querySelectorAll('.simulate-btn');
    simButtons.forEach(btn => {
        btn.onclick = async () => {
            const action = btn.dataset.action;
            btn.disabled = true;
            try {
                const res = await api.post('/advisor/simulate', { action, currentState: advisorData?.stats });
                if (res.success) showSimulationResult(res.simulation);
            } finally {
                btn.disabled = false;
            }
        };
    });
}

function showSimulationResult(simulation) {
    const modalEl = document.getElementById('simulation-modal');
    const body = document.getElementById('simulation-modal-body');
    if (!modalEl || !body) return;

    body.innerHTML = `
        <div class="simulation-detail">
            <h6>Mpango:</h6>
            <ul class="small mb-3">
                ${simulation.steps.map(s => `<li>${s}</li>`).join('')}
            </ul>
            <div class="alert alert-success d-flex justify-content-between align-items-center py-2 px-3">
                <div>Long-term Gain:</div>
                <h5 class="mb-0">+${Math.round((simulation.longTerm.profit / (advisorData.stats.todayProfit || 1) - 1) * 100)}%</h5>
            </div>
            <p class="small text-muted mt-2">Muda unaokadiriwa: ${simulation.timeline}</p>
        </div>
    `;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

function getActionIcon(actionId) {
    const icons = {
        'reduce_expenses': 'money-bill-wave',
        'increase_customers': 'user-plus',
        'add_products': 'box-open'
    };
    return icons[actionId] || 'bolt';
}

function formatCurrency(amount) {
    return 'TSH ' + parseFloat(amount).toLocaleString();
}

function renderBadges() {
    const container = document.getElementById('advisor-badges');
    if (!container) return;

    const badges = [
        { name: 'Mtitiri wa Akiba', icon: 'fa-piggy-bank', unlocked: true },
        { name: 'Simba wa Mauzo', icon: 'fa-rocket', unlocked: false },
        { name: 'Mfalme wa Stoo', icon: 'fa-medal', unlocked: false },
        { name: 'Rafiki wa Wateja', icon: 'fa-heart', unlocked: true }
    ];

    container.innerHTML = badges.map(b => `
        <div class="badge-achievement ${b.unlocked ? 'unlocked' : ''} text-center" style="width: 80px;">
            <div class="badge-icon rounded-circle bg-light d-flex align-items-center justify-content-center mb-1" style="height: 50px; width: 50px; margin: 0 auto; border: 2px solid ${b.unlocked ? 'var(--primary)' : '#ddd'}; color: ${b.unlocked ? 'var(--primary)' : '#999'}">
                <i class="fas ${b.icon}"></i>
            </div>
            <span class="small" style="font-size: 0.7rem;">${b.name}</span>
        </div>
    `).join('');
}

function executeAction(actionId) {
    const pages = {
        'reduce_expenses': 'expenditures',
        'increase_customers': 'customers',
        'add_products': 'products'
    };
    if (pages[actionId]) switchPage(pages[actionId]);
}