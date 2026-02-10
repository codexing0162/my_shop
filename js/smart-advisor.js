// smart-advisor.js
// Hii script itachukua data kutoka backend na kuonyesha tathmini, takwimu na ushauri

document.addEventListener('DOMContentLoaded', async () => {
    const statusDiv = document.getElementById('business-status');
    const statsTable = document.getElementById('stats-table').querySelector('tbody');
    const adviceDiv = document.getElementById('advice-content');

    try {
        // Fetch data from backend
        const res = await fetch('/api/smart-advisor');
        const data = await res.json();

        // Onyesha hali ya biashara
        statusDiv.innerHTML = `<strong>${data.status}</strong> <br><span>${data.status_desc}</span>`;

        // Onyesha takwimu kwenye jedwali
        statsTable.innerHTML = data.stats.map(row => `
            <tr>
                <td>${row.period}</td>
                <td>${row.sales}</td>
                <td>${row.expenses}</td>
                <td>${row.profit}</td>
                <td>${row.business_status}</td>
            </tr>
        `).join('');

        // Onyesha ushauri
        adviceDiv.innerHTML = data.advice.map(a => `<li>${a}</li>`).join('');
    } catch (err) {
        statusDiv.innerHTML = '<span style="color:red">Imeshindikana kupata takwimu. Tafadhali jaribu tena.</span>';
    }
});
