const POSController = {
    async init() {
        UI.showSkeleton(document.getElementById('pos-product-list'), 8, 'card');
        const res = await api.get('/products');
        if (res.success) {
            window.state.products = res.data; // Refresh products to get latest stock
            this.renderGrid(window.state.products);
        }
        this.renderCart();

        document.getElementById('pos-search-input').oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = window.state.products.filter(p =>
                p.brand.toLowerCase().includes(term) || p.model.toLowerCase().includes(term)
            );
            this.renderGrid(filtered);
        };

        document.getElementById('btn-checkout').onclick = () => this.checkout();
    },

    renderGrid(products) {
        const container = document.getElementById('pos-product-list');
        if (!container) return;

        container.innerHTML = products.map(p => `
            <div class="product-card">
                <img src="${api.formatImageUrl(p.image_url)}" class="product-image">
                <div class="product-info">
                    <span class="product-brand">${p.brand}</span>
                    <h4 class="product-model">${p.model}</h4>
                    <div class="product-price">${UI.formatMoney(p.selling_price)}</div>
                    <div class="product-stock">${p.quantity} left</div>
                    <button class="btn btn-primary btn-block" style="margin-top:10px" onclick="POSController.addToCart(${p.id})">
                        ${i18n.t('btn-sell')}
                    </button>
                </div>
            </div>
        `).join('');
    },

    addToCart(id) {
        const p = window.state.products.find(x => x.id === id);
        if (!p || p.quantity <= 0) return Toast.error(i18n.t('msg-out-of-stock'));

        const item = window.state.cart.find(c => c.product_id === id);
        if (item) {
            if (item.quantity >= p.quantity) return Toast.error(i18n.t('msg-stock-limit'));
            item.quantity++;
        } else {
            window.state.cart.push({
                product_id: p.id,
                brand: p.brand,
                model: p.model,
                unit_price: p.selling_price,
                image_url: p.image_url,
                quantity: 1
            });
        }
        this.renderCart();
    },

    renderCart() {
        const list = document.getElementById('cart-list');
        const totalEl = document.getElementById('cart-total');
        let total = 0;

        list.innerHTML = window.state.cart.map((item, index) => {
            total += item.unit_price * item.quantity;
            return `
                <div class="cart-item">
                    <div style="flex:1">
                        <strong>${item.model}</strong><br>
                        <small>${UI.formatMoney(item.unit_price)} x ${item.quantity}</small>
                    </div>
                    <div class="cart-item-controls">
                        <button class="btn-qty" onclick="POSController.updateQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn-qty" onclick="POSController.updateQty(${index}, 1)">+</button>
                        <button class="btn-remove" onclick="POSController.remove(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        totalEl.textContent = UI.formatMoney(total);

        // Update Mobile Toggle
        const mobileCount = document.getElementById('mobile-cart-count');
        const mobileTotal = document.getElementById('mobile-cart-total');
        if (mobileCount) mobileCount.textContent = window.state.cart.reduce((acc, item) => acc + item.quantity, 0);
        if (mobileTotal) mobileTotal.textContent = UI.formatMoney(total);
    },

    updateQty(index, change) {
        const item = window.state.cart[index];
        const p = window.state.products.find(x => x.id === item.product_id);

        const newQty = item.quantity + change;
        if (newQty < 1) return this.remove(index);
        if (newQty > p.quantity) return Toast.error(i18n.t('msg-stock-limit'));

        item.quantity = newQty;
        this.renderCart();
    },

    remove(index) {
        if (confirm('Remove item?')) {
            window.state.cart.splice(index, 1);
            this.renderCart();
        }
    },

    toggleCart(show) {
        const cart = document.querySelector('.pos-cart');
        if (show) {
            cart.classList.add('open');
        } else {
            cart.classList.remove('open');
        }
    },

    async checkout() {
        if (window.state.cart.length === 0) return Toast.error('Cart is empty');

        const custName = document.getElementById('pos-cust-name').value;
        const custPhone = document.getElementById('pos-cust-phone').value;
        const custDistrict = document.getElementById('pos-cust-district').value;

        const res = await api.post('/sales', {
            items: window.state.cart,
            payment_method: 'cash',
            customer_details: (custName || custPhone) ? { name: custName, phone: custPhone, district: custDistrict } : null
        });

        if (res.success) {
            Toast.success('Sale completed! ' + res.data.invoiceNumber);
            window.state.cart = [];
            this.renderCart();
            this.toggleCart(false); // Close mobile cart
            document.getElementById('pos-cust-name').value = '';
            document.getElementById('pos-cust-phone').value = '';
            // Switch to dashboard or print receipt
            if (window.switchPage) window.switchPage('dashboard');
        } else {
            Toast.error(res.error);
        }
    }
};

window.POSController = POSController;
