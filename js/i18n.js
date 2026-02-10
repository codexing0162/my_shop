const translations = {
    en: {
        // Sidebar
        'nav-dashboard': 'Dashboard',
        'nav-products': 'Products',
        'nav-pos': 'New Sale',
        'nav-sales': 'Sales History',
        'nav-customers': 'Customers',
        'nav-expenditures': 'Expenditures',
        'nav-advisor': 'Smart Advisor',
        'nav-settings': 'Settings',

        // Dashboard
        'dash-title': 'Dashboard',
        'dash-today-sales': "Today's Sales",
        'dash-today-gross-profit': 'Gross Profit (Today)',
        'dash-today-net-profit': 'Net Profit (Today)',
        'dash-today-expenses': "Today's Expenses",
        'dash-low-stock': 'Low Stock',
        'dash-inventory-value': 'Inventory Value',
        // Advisor
        'adv-title': 'Smart Advisor',
        'adv-health': 'Business Health',
        'adv-predictions': 'Stock Predictions',
        'adv-insights': 'Actionable Insights',
        'adv-badger': 'Shop Milestones',
        'adv-days-left': 'days left',
        'adv-desc': 'Deep business assessment, future predictions, and expert advice.',
        'adv-tomorrow': "Tomorrow's Plan",
        'adv-simulation': 'Best Action Simulation',
        'adv-stats': 'Product & Inventory Analysis',
        'dash-sales-trend': 'Sales Trend (Last 7 Days)',
        'dash-top-products': 'Top Products',
        'dash-recent-transactions': 'Recent Transactions',

        // Common Table Headers
        'th-invoice': 'Invoice',
        'th-customer': 'Customer',
        'th-amount': 'Amount',
        'th-date': 'Date',
        'th-payment': 'Payment',
        'th-actions': 'Actions',
        'th-type': 'Type',
        'th-description': 'Description',
        'th-recipient': 'Recipient',
        'th-name': 'Name',
        'th-phone': 'Phone',
        'th-email': 'Email',
        'th-address': 'Address',
        'th-brand': 'Brand',
        'th-model': 'Model',
        'th-cost': 'Cost Price',
        'th-selling': 'Selling Price',
        'th-quantity': 'Quantity',
        'th-min-stock': 'Min Stock',
        'th-image': 'Image',
        'th-shop-name': 'Shop Name',
        'th-error': 'Error',
        'th-status': 'Status',

        // Buttons
        'btn-add-product': 'Add Product',
        'btn-add-customer': 'Add Customer',
        'btn-add-expenditure': 'Add Expenditure',
        'btn-save': 'Save',
        'btn-cancel': 'Cancel',
        'btn-apply': 'Apply',
        'btn-reset': 'Reset',
        'btn-checkout': 'Complete Sale',
        'btn-preview': 'Preview',
        'btn-edit': 'Edit Product',
        'btn-delete': 'Delete',
        'btn-sell': 'Sell',
        'btn-check-now': 'Check Now',
        'btn-upload': 'Upload from Device',
        'btn-url': 'Image URL',
        'btn-add-cart': 'Add to Cart',

        // Settings
        'settings-categories': 'Product Categories',
        'settings-connectivity': 'System Connectivity',
        'settings-shop-info': 'Shop Information',
        'settings-appearance': 'Appearance & Language',
        'settings-language': 'Language',
        'settings-theme': 'Theme',
        'settings-currency': 'Currency',
        'settings-tax': 'Tax Rate (%)',
        'theme-light': 'Light',
        'theme-dark': 'Dark',
        'lang-en': 'English',
        'lang-sw': 'Swahili',

        // Categories
        'cat-rent': 'Rent',
        'cat-elec': 'Electricity',
        'cat-wate': 'Water',
        'cat-sala': 'Salary',
        'cat-inte': 'Internet',
        'cat-tran': 'Transport',
        'cat-main': 'Maintenance',
        'cat-taxe': 'Taxes',
        'cat-othe': 'Other',

        // Payment Methods
        'pay-cash': 'Cash',
        'pay-card': 'Card',
        'pay-mobile': 'Mobile Money',
        'pay-credit': 'Credit',
        'pay-bank': 'Bank Transfer',
        'pay-cheque': 'Cheque',

        // Alerts & Messages
        'msg-sale-complete': 'Sale completed! Invoice: ',
        'msg-cart-empty': 'Cart is empty!',
        'msg-out-of-stock': 'Item out of stock!',
        'msg-stock-limit': 'Cannot add more. Stock limit reached!',
        'msg-confirm-delete': 'Are you sure you want to delete this item?',
        'msg-confirm-remove-cart': 'Remove this item from cart?',
        'msg-connected': 'Connected',
        'msg-disconnected': 'Disconnected',
        'msg-checking-conn': 'Checking connection...',
        'msg-no-sales': 'No sales found. Make your first sale from the POS!',
        'msg-sale-details-soon': 'Sale details view coming soon!',
        'msg-no-customers': 'No customers found',
        'msg-edit-soon': 'Edit feature coming soon!',
        'msg-customer-added': 'Customer added successfully',
        'msg-error-delete': 'Error deleting item',
        'msg-error': 'Error',
        'msg-file-limit': 'Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP',
        'msg-url-help': 'Enter a direct link to an image from the internet',

        // Placeholders
        'ph-search-products': 'Search smartphones...',
        'ph-search-sale': 'Search products for sale...',
        'ph-search-invoice': 'Search invoice number...',
        'ph-search-customers': 'Search customers...',
        'ph-search-expenditures': 'Search expenditures...',
        'ph-name-eg': 'e.g. John Doe',
        'ph-phone-eg': 'e.g. +255...',
        'ph-email-eg': 'e.g. john@example.com',
        'ph-addr-eg': 'Street address, City...',
        'ph-brand-eg': 'e.g. Apple',
        'ph-model-eg': 'e.g. iPhone 14',
        'ph-imei': 'Unique device identifier',
        'ph-url': 'Paste image link here',
        'ph-recipient-eg': 'Person or Company name',
        'ph-desc-eg': 'Details about the item...',
        'ph-all-brands': 'All Brands',

        // Units & Other
        'unit-stock': 'in stock',
        'unit-items': 'items',
        'cart-total': 'Total',
        'guest': 'Guest'
    },
    sw: {
        // Sidebar
        'nav-dashboard': 'Dashibodi',
        'nav-products': 'Bidhaa',
        'nav-pos': 'Mauzo Mapya',
        'nav-sales': 'Historia ya Mauzo',
        'nav-customers': 'Wateja',
        'nav-expenditures': 'Matumizi',
        'nav-advisor': 'Smart Mshauri',
        'nav-settings': 'Mipangilio',

        // Dashboard
        'dash-title': 'Dashibodi',
        'dash-today-sales': 'Mauzo ya Leo',
        'dash-today-gross-profit': 'Faida Ghafi ya Leo',
        'dash-today-net-profit': 'Faida Halisi ya Leo',
        'dash-today-expenses': 'Matumizi ya Leo',
        'dash-low-stock': 'Bidhaa Chache',
        'dash-inventory-value': 'Thamani ya Stoo',
        // Advisor
        'adv-title': 'Smart Mshauri (Dira ya Biashara)',
        'adv-health': 'Afya ya Biashara',
        'adv-predictions': 'Utabiri wa Stock',
        'adv-insights': 'Mapendekezo ya Kufanya',
        'adv-badger': 'Mafanikio na Badge',
        'adv-days-left': 'siku zimebaki',
        'adv-desc': 'Tathmini ya kina ya biashara yako, utabiri wa mbeleni, na ushauri wa kitaalamu.',
        'adv-tomorrow': 'Mpango wa Kesho',
        'adv-simulation': 'Simulation ya Hatua Bora',
        'adv-stats': 'Uchambuzi wa Bidhaa na Stoo',
        'dash-sales-trend': 'Mwenendo wa Mauzo (Siku 7)',
        'dash-top-products': 'Bidhaa Zinazoongozwa',
        'dash-recent-transactions': 'Miamala ya Hivi Karibuni',

        // Common Table Headers
        'th-invoice': 'Ankara',
        'th-customer': 'Mteja',
        'th-amount': 'Kiasi',
        'th-date': 'Tarehe',
        'th-payment': 'Malipo',
        'th-actions': 'Hatua',
        'th-type': 'Aina',
        'th-description': 'Maelezo',
        'th-recipient': 'Mpokeaji',
        'th-name': 'Jina',
        'th-phone': 'Simu',
        'th-email': 'Barua Pepe',
        'th-address': 'Anwani',
        'th-brand': 'Chapa',
        'th-model': 'Toleo',
        'th-cost': 'Bei ya Kununua',
        'th-selling': 'Bei ya Kuuzia',
        'th-quantity': 'Idadi',
        'th-min-stock': 'Kiwango cha Chini',
        'th-image': 'Picha',
        'th-shop-name': 'Jina la Duka',
        'th-error': 'Hitilafu',
        'th-status': 'Hali',

        // Buttons
        'btn-add-product': 'Ongeza Bidhaa',
        'btn-add-customer': 'Ongeza Mteja',
        'btn-add-expenditure': 'Ongeza Matumizi',
        'btn-save': 'Hifadhi',
        'btn-cancel': 'Ghairi',
        'btn-apply': 'Tumia',
        'btn-reset': 'Anza Upya',
        'btn-checkout': 'Kamilisha Mauzo',
        'btn-preview': 'Onyesho',
        'btn-edit': 'Hariri Bidhaa',
        'btn-delete': 'Futa',
        'btn-sell': 'Uza',
        'btn-check-now': 'Angalia Sasa',
        'btn-upload': 'Pakia kutoka Kifaa',
        'btn-url': 'Anuani ya Picha',
        'btn-add-cart': 'Weka Kikapuni',

        // Settings
        'settings-categories': 'Makundi ya Bidhaa',
        'settings-connectivity': 'Muunganisho wa Mfumo',
        'settings-shop-info': 'Maelezo ya Duka',
        'settings-appearance': 'Muonekano na Lugha',
        'settings-language': 'Lugha',
        'settings-theme': 'Muonekano',
        'settings-currency': 'Sarafu',
        'settings-tax': 'Kiwango cha Kodi (%)',
        'theme-light': 'Mwangaza',
        'theme-dark': 'Giza',
        'lang-en': 'Kingereza',
        'lang-sw': 'Kiswahili',

        // Categories
        'cat-rent': 'Kodi',
        'cat-elec': 'Umeme',
        'cat-wate': 'Maji',
        'cat-sala': 'Mshahara',
        'cat-inte': 'Mtandao',
        'cat-tran': 'Usafiri',
        'cat-main': 'Ukarabati',
        'cat-taxe': 'Kodi za Selikali',
        'cat-othe': 'Nyingine',

        // Payment Methods
        'pay-cash': 'Pesa Taslimu',
        'pay-card': 'Kadi',
        'pay-mobile': 'Pesa ya Mtandao',
        'pay-credit': 'Mkopo',
        'pay-bank': 'Benki',
        'pay-cheque': 'Hundi',

        // Alerts & Messages
        'msg-sale-complete': 'Mauzo yamekamilika! Ankara: ',
        'msg-cart-empty': 'Kikapu ni tupu!',
        'msg-out-of-stock': 'Bidhaa imeisha!',
        'msg-stock-limit': 'Huwezi kuongeza zaidi. Akiba imeisha!',
        'msg-confirm-delete': 'Una uhakika unataka kufuta bidhaa hii?',
        'msg-confirm-remove-cart': 'Ondoa bidhaa hii kwenye kikapu?',
        'msg-connected': 'Imeunganishwa',
        'msg-disconnected': 'Imekatika',
        'msg-checking-conn': 'Inakagua muunganisho...',
        'msg-no-sales': 'Hakuna mauzo yaliyopatikana.',
        'msg-sale-details-soon': 'Maelezo ya mauzo yanakuja hivi karibuni!',
        'msg-no-customers': 'Hakuna wateja waliopatikana',
        'msg-edit-soon': 'Sehemu ya kuhariri inakuja hivi karibuni!',
        'msg-customer-added': 'Mteja ameongezwa kwa mafanikio',
        'msg-error-delete': 'Hitilafu ya kufuta',
        'msg-error': 'Hitilafu',
        'msg-file-limit': 'Ukubwa wa juu: 5MB. Miundo inayotumika: JPG, PNG, GIF, WebP',
        'msg-url-help': 'Ingiza kiungo cha moja kwa moja cha picha kutoka mtandaoni',

        // Placeholders
        'ph-search-products': 'Tafuta simu...',
        'ph-search-sale': 'Tafuta bidhaa za kuuza...',
        'ph-search-invoice': 'Tafuta namba ya ankara...',
        'ph-search-customers': 'Tafuta wateja...',
        'ph-search-expenditures': 'Tafuta matumizi...',
        'ph-name-eg': 'mfano: John Doe',
        'ph-phone-eg': 'mfano: +255...',
        'ph-email-eg': 'mfano: john@example.com',
        'ph-addr-eg': 'Mtaa, Mji...',
        'ph-brand-eg': 'mfano: Apple',
        'ph-model-eg': 'mfano: iPhone 14',
        'ph-imei': 'Namba ya utambulisho wa kifaa',
        'ph-url': 'Bandika kiungo hapa',
        'ph-recipient-eg': 'Jina la mtu au kampuni',
        'ph-desc-eg': 'Maelezo ya bidhaa...',
        'ph-all-brands': 'Chapa Zote',

        // Units & Other
        'unit-stock': 'zipo',
        'unit-items': 'bidhaa',
        'cart-total': 'Jumla',
        'guest': 'Mgeni'
    }
};

const i18n = {
    currentLang: localStorage.getItem('app-lang') || 'en',

    t(key) {
        return translations[this.currentLang][key] || key;
    },

    setLanguage(lang) {
        if (!translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('app-lang', lang);
        this.updateUI();

        // Trigger a global event so other components can refresh
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    },

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = translation;
                } else {
                    el.value = translation;
                }
            } else {
                el.textContent = translation;
            }
        });
    }
};

// Auto-init on script load if needed, or wait for app.js
window.i18n = i18n;
