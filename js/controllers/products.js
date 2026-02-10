const ProductController = {
    async init() {
        UI.showSkeleton(document.getElementById('product-list'), 8, 'card');
        const res = await api.get('/products');
        if (res.success) {
            window.state.products = res.data;
            this.renderGrid(window.state.products);
            this.initFilters();
            this.initModals();
        }
    },

    renderGrid(products) {
        const container = document.getElementById('product-list');
        if (!container) return;

        container.innerHTML = products.map(p => `
            <div class="product-card animate-fade-in">
                <img src="${api.formatImageUrl(p.image_url)}" class="product-image" alt="${p.model}">
                <div class="product-info">
                    <span class="product-brand">${p.brand}</span>
                    <h4 class="product-model">${p.model}</h4>
                    <div class="product-price">${UI.formatMoney(p.selling_price)}</div>
                    <div class="product-stock">
                        <i class="fas fa-warehouse"></i>
                        ${p.quantity} ${i18n.t('unit-stock')}
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="ProductController.preview(${p.id})">
                        <i class="fas fa-eye"></i> ${i18n.t('btn-preview')}
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="ProductController.edit(${p.id})">
                        <i class="fas fa-edit"></i> ${i18n.t('btn-edit')}
                    </button>
                </div>
            </div>
        `).join('');
    },

    initFilters() {
        // Populate Brand Filter
        const brandSelect = document.getElementById('filter-brand');
        if (brandSelect) {
            const brands = [...new Set(window.state.products.map(p => p.brand))].sort();
            brandSelect.innerHTML = `<option value="" data-i18n="ph-all-brands">${i18n.t('ph-all-brands')}</option>` +
                brands.map(b => `<option value="${b}">${b}</option>`).join('');
        }

        const inputs = {
            search: document.getElementById('product-search-input'),
            lowStock: document.getElementById('filter-low-stock'),
            sort: document.getElementById('filter-sort'),
            brand: document.getElementById('filter-brand')
        };

        const filters = { search: '', brand: '', lowStock: false, sort: 'name' };

        const apply = () => {
            let filtered = window.state.products.filter(p => {
                const matchesSearch = p.brand.toLowerCase().includes(filters.search) ||
                    p.model.toLowerCase().includes(filters.search);
                const matchesBrand = filters.brand ? p.brand === filters.brand : true;
                const matchesLowStock = filters.lowStock ? p.quantity <= p.min_stock_alert : true;
                return matchesSearch && matchesBrand && matchesLowStock;
            });

            filtered.sort((a, b) => {
                if (filters.sort === 'name') return (a.brand + a.model).localeCompare(b.brand + b.model);
                if (filters.sort === 'price-high') return b.selling_price - a.selling_price;
                if (filters.sort === 'price-low') return a.selling_price - b.selling_price;
                if (filters.sort === 'stock-high') return b.quantity - a.quantity;
                return 0;
            });

            this.renderGrid(filtered);
        };

        if (inputs.search) inputs.search.oninput = (e) => { filters.search = e.target.value.toLowerCase(); apply(); };
        if (inputs.brand) inputs.brand.onchange = (e) => { filters.brand = e.target.value; apply(); };
        if (inputs.sort) inputs.sort.onchange = (e) => { filters.sort = e.target.value; apply(); };
        if (inputs.lowStock) inputs.lowStock.onclick = () => {
            filters.lowStock = !filters.lowStock;
            inputs.lowStock.classList.toggle('active');
            apply();
        };

        document.getElementById('btn-export-products').onclick = () => this.exportPDF();
    },

    initModals() {
        const modal = document.getElementById('modal-product');
        const btnAdd = document.getElementById('btn-add-product');
        const btnClose = document.getElementById('btn-close-modal');
        const form = document.getElementById('form-product');

        // Tab logic
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        btnAdd.onclick = async () => {
            document.getElementById('modal-product-title').textContent = 'Add New Smartphone';
            document.getElementById('product-id-field').value = '';
            form.reset();
            await this.populateCategories();
            modal.classList.add('active');
        };

        btnClose.onclick = () => modal.classList.remove('active');

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const id = document.getElementById('product-id-field').value;

            // Clean up unused tab data
            const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
            if (activeTab === 'upload') formData.delete('image_url');
            else formData.delete('image');

            const res = id
                ? await api.putFormData(`/products/${id}`, formData)
                : await api.postFormData('/products', formData);

            if (res.success) {
                modal.classList.remove('active');
                Toast.success(id ? 'Product updated' : 'Product created');
                this.init(); // Reload
            } else {
                Toast.error(res.error || 'Operation failed');
            }
        };
    },

    async populateCategories(selected = null) {
        const select = document.querySelector('select[name="category"]');
        if (!select) return;
        const res = await api.get('/categories');
        if (res.success) {
            select.innerHTML = res.data.map(c =>
                `<option value="${c.name}" ${c.name === selected ? 'selected' : ''}>${c.name}</option>`
            ).join('') + '<option value="other">Other</option>';
        }
    },

    preview(id) {
        const p = window.state.products.find(x => x.id === id);
        if (!p) return;

        document.getElementById('preview-img').src = api.formatImageUrl(p.image_url);
        document.getElementById('preview-brand').textContent = p.brand;
        document.getElementById('preview-model').textContent = p.model;
        document.getElementById('preview-price').textContent = UI.formatMoney(p.selling_price);
        document.getElementById('preview-stock').textContent = p.quantity;
        document.getElementById('preview-cost').textContent = UI.formatMoney(p.cost_price);

        const margin = p.selling_price - p.cost_price;
        const marginPercent = ((margin / p.cost_price) * 100).toFixed(1);
        document.getElementById('preview-margin').textContent = `${UI.formatMoney(margin)} (${marginPercent}%)`;

        document.getElementById('modal-preview').classList.add('active');

        // Bind actions
        window.editProductFromPreview = () => {
            document.getElementById('modal-preview').classList.remove('active');
            this.edit(id);
        };
        window.addToCartFromPreview = () => {
            document.getElementById('modal-preview').classList.remove('active');
            POSController.addToCart(id);
            Toast.success('Added to cart');
        };
        document.getElementById('btn-close-preview').onclick = () => document.getElementById('modal-preview').classList.remove('active');
    },

    edit(id) {
        const p = window.state.products.find(x => x.id === id);
        if (!p) return;

        document.getElementById('modal-product-title').textContent = 'Edit Product';
        document.getElementById('product-id-field').value = p.id;

        const form = document.getElementById('form-product');
        form.brand.value = p.brand;
        form.model.value = p.model;
        form.imei.value = p.imei || '';
        form.cost_price.value = p.cost_price;
        form.selling_price.value = p.selling_price;
        form.quantity.value = p.quantity;
        form.min_stock_alert.value = p.min_stock_alert;
        form.description.value = p.description || '';

        if (p.image_url && p.image_url.startsWith('http')) {
            document.querySelector('[data-tab="url"]').click();
            form.image_url.value = p.image_url;
        } else {
            document.querySelector('[data-tab="upload"]').click();
        }

        this.populateCategories(p.category);
        document.getElementById('modal-product').classList.add('active');
    },

    exportPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Product Inventory', 14, 20);

        const data = window.state.products.map(p => [
            p.brand, p.model, p.category, UI.formatMoney(p.selling_price), p.quantity
        ]);

        doc.autoTable({
            startY: 30,
            head: [['Brand', 'Model', 'Category', 'Price', 'Stock']],
            body: data
        });
        doc.save('inventory.pdf');
    }
};

window.ProductController = ProductController;
