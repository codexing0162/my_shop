// Utility functions for advisor system
const AdvisorUtils = {
    // Calculate days until capital runs out
    calculateCashRunway: (currentCapital, dailyBurnRate) => {
        if (dailyBurnRate <= 0) return Infinity;
        return Math.floor(currentCapital / dailyBurnRate);
    },

    // Calculate customer acquisition cost
    calculateCAC: (marketingSpend, newCustomers) => {
        if (newCustomers === 0) return 0;
        return marketingSpend / newCustomers;
    },

    // Calculate customer lifetime value
    calculateLTV: (averagePurchase, purchaseFrequency, customerLifespan) => {
        return averagePurchase * purchaseFrequency * customerLifespan;
    },

    // Generate emergency plan based on risk level
    generateEmergencyPlan: (riskLevel, data) => {
        const plans = {
            HIGH: [
                "1. PUNGUSA GHARAMA ZA HARAKA (Immediate):",
                "   • Futa huduma zote zisizo muhimu",
                "   • Punguza umeme na maji usiotumika",
                "   • Wasiliana na wauzaji kwa bei mpya",
                "",
                "2. TAFAUTA MAPATO YA HARAKA (Today-Tomorrow):",
                "   • Toa offer ya 30% kwa bidhaa zilizokaa sana",
                "   • Omba malipo mapema kwa wadeni wako",
                "   • Piga simu wateja 10 wakubwa wa mwaka jana",
                "",
                "3. MPANGO WA MWEZI (30 days):",
                "   • Anza biashara ndogo ya ziada",
                "   • Tafuta mfadhili au mkopo wa dharura",
                "   • Badilisha mfumo wa biashara kabisa"
            ],
            MEDIUM: [
                "1. BADILI MIKAKATI (This Week):",
                "   • Angalia bei za ushindani",
                "   • Badilisha mauzo kwenye bidhaa zinazofaa",
                "   • Ongeza huduma kwa wateja wa kawaida",
                "",
                "2: ONGEZA UTAFUTI (Next 2 Weeks):",
                "   • Chunguza bidhaa 2-3 mpya",
                "   • Pima soko la eneo jirani",
                "   • Anza matangazo ya chini ya gharama",
                "",
                "3. FUATA-UP (Month End):",
                "   • Angalia mabadiliko ya mauzo",
                "   • Rekebisha mikakati inayofaa",
                "   • Panga kwa mwezi ujao"
            ]
        };

        return plans[riskLevel] || ["Hakuna hatua za dharura zinazohitajika kwa sasa."];
    },

    // Format numbers with commas
    formatNumber: (num) => {
        return new Intl.NumberFormat('en-TZ').format(num);
    },

    // Get icon for recommendation type
    getIconForType: (type) => {
        const icons = {
            danger: 'exclamation-triangle',
            warning: 'exclamation-circle',
            success: 'check-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvisorUtils;
}