// ============================================
// MobiStore Products Page - JavaScript
// ============================================

// State
let products = [];
let editingProductId = null;
let deleteProductId = null;
let currentView = 'grid';
let currentImageData = null;

// Category labels — loaded dynamically from localStorage categories
function getCategoryLabels() {
    const stored = localStorage.getItem('mobistore_categories');
    if (stored) {
        try {
            const cats = JSON.parse(stored);
            const labels = {};
            cats.forEach(c => {
                labels[c.slug] = c.name;
            });
            return labels;
        } catch { /* fall through */ }
    }
    // Fallback if no categories exist yet
    const defaults = {
        'dien-thoai': 'Điện thoại',
        'may-tinh-bang': 'Máy tính bảng',
        'laptop': 'Laptop',
        'phu-kien': 'Phụ kiện',
        'smartwatch': 'Smartwatch',
        'tai-nghe-loa': 'Tai nghe / Loa',
        // Categories from main website (Firestore)
        'phone': 'Điện thoại',
        'headphone': 'Tai nghe',
        'charger': 'Sạc & Cáp'
    };
    return defaults;
}

let CATEGORY_LABELS = {};

// Status labels
const STATUS_LABELS = {
    active: 'Đang bán',
    inactive: 'Ngừng bán',
    outofstock: 'Hết hàng'
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    CATEGORY_LABELS = getCategoryLabels();
    initDateDisplay();
    populateCategoryDropdowns();
    loadProducts(); // Load from localStorage cache first for instant display
    renderProducts();
    updateStats();
    initEventListeners();
    // Subscribe to real-time Firestore updates
    subscribeProducts();
});

// ============================================
// POPULATE CATEGORY DROPDOWNS FROM STORAGE
// ============================================
function populateCategoryDropdowns() {
    const labels = CATEGORY_LABELS;

    // Populate filter dropdown
    const filterSelect = document.getElementById('categoryFilter');
    if (filterSelect) {
        // Keep "Tất cả" option, remove the rest
        filterSelect.innerHTML = '<option value="all">Tất cả</option>';
        Object.entries(labels).forEach(([slug, name]) => {
            const opt = document.createElement('option');
            opt.value = slug;
            opt.textContent = name;
            filterSelect.appendChild(opt);
        });
    }

    // Populate form dropdown
    const formSelect = document.getElementById('productCategory');
    if (formSelect) {
        formSelect.innerHTML = '<option value="">Chọn danh mục</option>';
        Object.entries(labels).forEach(([slug, name]) => {
            const opt = document.createElement('option');
            opt.value = slug;
            opt.textContent = name;
            formSelect.appendChild(opt);
        });
    }
}

// ============================================
// AUTH (shared with dashboard)
// ============================================
function checkAuth() {
    const auth = localStorage.getItem('mobistore_auth') || sessionStorage.getItem('mobistore_auth');
    if (!auth) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('mobistore_auth');
    sessionStorage.removeItem('mobistore_auth');
    window.location.href = 'login.html';
}

function initDateDisplay() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('vi-VN', options);
    }
}

// ============================================
// DATA MANAGEMENT (localStorage)
// ============================================
function loadProducts() {
    const stored = localStorage.getItem('mobistore_products');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            products = Array.isArray(parsed) ? parsed : [];
        } catch {
            products = [];
        }
    } else {
        products = [];
    }
}

function saveProducts() {
    localStorage.setItem('mobistore_products', JSON.stringify(products));
}

// ============================================
// FIREBASE FIRESTORE SYNC
// ============================================

// Wait for Firebase DB to be initialized
function waitForFirebase() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            if (window.firebaseDb) {
                resolve(window.firebaseDb);
            } else if (attempts++ > 50) {
                reject(new Error('Firebase DB not available after timeout'));
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

// Map Firestore document to Dashboard product format
function mapFirestoreToProduct(docId, data) {
    const price = Number(data.price) || 0;
    const discount = Number(data.discount) || 0;
    const discountedPrice = discount > 0 ? Math.round(price * (100 - discount) / 100) : price;

    return {
        id: docId,
        name: data.name || 'Sản phẩm chưa có tên',
        category: data.category || '',
        brand: data.brand || '',
        price: discountedPrice,
        originalPrice: discount > 0 ? price : (Number(data.originalPrice) || 0),
        stock: Number(data.stock) || 100,
        sku: data.sku || '',
        status: data.status || 'active',
        description: data.description || '',
        image: resolveProductImage(data.image),
        createdAt: data.createdAt
            ? (typeof data.createdAt.toDate === 'function'
                ? data.createdAt.toDate().toISOString()
                : data.createdAt)
            : new Date().toISOString(),
        // Keep original fields from main website
        isNew: Boolean(data.isNew),
        isSale: Boolean(data.isSale),
        discount: discount,
        rating: Number(data.rating) || 4.5
    };
}

// Resolve image URL (handle relative paths from main website)
function resolveProductImage(imagePath) {
    if (!imagePath) return '';
    const normalized = String(imagePath).replace(/\\/g, '/').trim();
    if (normalized.startsWith('http') || normalized.startsWith('data:')) return normalized;
    // Relative paths from main website need prefix
    if (normalized.startsWith('assets/')) return '../project/' + normalized;
    return normalized;
}

// Map Dashboard product to Firestore document format
function mapProductToFirestore(product) {
    const fullPrice = product.originalPrice && product.originalPrice > product.price
        ? product.originalPrice : product.price;
    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

    return {
        name: product.name || '',
        price: fullPrice,
        brand: product.brand || '',
        category: product.category || '',
        image: product.image || '',
        isNew: product.isNew || false,
        isSale: discount > 0,
        discount: discount,
        rating: product.rating || 4.5,
        stock: product.stock || 0,
        sku: product.sku || '',
        status: product.status || 'active',
        description: product.description || '',
        originalPrice: product.originalPrice || 0,
        createdAtMs: Date.now(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
}

// Subscribe to real-time Firestore product updates
function subscribeProducts() {
    waitForFirebase().then(db => {
        console.log('🔄 Subscribing to Firestore products collection...');
        db.collection('products').onSnapshot(snapshot => {
            products = snapshot.docs.map(doc => {
                return mapFirestoreToProduct(doc.id, doc.data());
            });
            // Cache to localStorage
            localStorage.setItem('mobistore_products', JSON.stringify(products));
            console.log(`✅ Loaded ${products.length} products from Firestore`);
            renderProducts();
            updateStats();
        }, error => {
            console.error('❌ Firestore subscription error:', error);
            // Keep using localStorage cache
        });
    }).catch(err => {
        console.warn('⚠️ Firebase not available, using localStorage:', err.message);
    });
}

// Sync a single product to Firestore (add or update)
async function syncProductToFirestore(product) {
    const db = await waitForFirebase();
    const firestoreData = mapProductToFirestore(product);

    if (product.id && !product.id.startsWith('SP')) {
        // Existing Firestore document — update
        await db.collection('products').doc(product.id).set(firestoreData, { merge: true });
    } else {
        // New product — let Firestore generate ID
        const docRef = await db.collection('products').add(firestoreData);
        product.id = docRef.id;
    }
    console.log('✅ Product synced to Firestore:', product.id);
    return product;
}

// Delete a product from Firestore
async function deleteProductFromFirestore(id) {
    const db = await waitForFirebase();
    await db.collection('products').doc(id).delete();
    console.log('🗑️ Product deleted from Firestore:', id);
}

function generateId() {
    return 'SP' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

function getSeedProducts() {
    return [];
}

// ============================================
// RENDERING
// ============================================
function renderProducts() {
    const filtered = getFilteredProducts();
    const grid = document.getElementById('productsGrid');
    const tableBody = document.getElementById('productsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (filtered.length === 0) {
        grid.classList.add('hidden');
        document.getElementById('productsTable').classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    // Render Grid
    grid.innerHTML = '';
    filtered.forEach((product, index) => {
        grid.appendChild(createProductCard(product, index));
    });

    // Render Table
    tableBody.innerHTML = '';
    filtered.forEach(product => {
        tableBody.appendChild(createProductRow(product));
    });

    // Show correct view
    if (currentView === 'grid') {
        grid.classList.remove('hidden');
        document.getElementById('productsTable').classList.add('hidden');
    } else {
        grid.classList.add('hidden');
        document.getElementById('productsTable').classList.remove('hidden');
    }
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const statusBadge = getStatusBadgeHTML(product.status);
    const discountBadge = getDiscountBadgeHTML(product.price, product.originalPrice);
    const stockInfo = getStockInfoHTML(product.stock);
    const imgSrc = product.image || '';
    const hasImage = !!product.image;

    card.innerHTML = `
        <div class="product-card-image">
            ${hasImage
            ? `<img src="${imgSrc}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <i class="fas fa-image no-image" style="display:none"></i>`
            : `<i class="fas fa-image no-image"></i>`}
            ${statusBadge}
            ${discountBadge}
            <div class="card-hover-actions">
                <button class="card-action-btn edit" onclick="openEditModal('${product.id}')" title="Chỉnh sửa">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="card-action-btn delete" onclick="openDeleteModal('${product.id}')" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="product-card-body">
            <div class="product-card-category">${CATEGORY_LABELS[product.category] || product.category}</div>
            <div class="product-card-name">${product.name}</div>
            <div class="product-card-pricing">
                <span class="product-card-price">${formatPrice(product.price)}</span>
                ${product.originalPrice && product.originalPrice > product.price
            ? `<span class="product-card-original-price">${formatPrice(product.originalPrice)}</span>`
            : ''}
            </div>
            <div class="product-card-footer">
                ${stockInfo}
                <span class="product-card-sku">${product.sku || ''}</span>
            </div>
        </div>
    `;

    return card;
}

function createProductRow(product) {
    const tr = document.createElement('tr');
    const imgSrc = product.image || '';
    const statusClass = product.status === 'active' ? 'badge-active'
        : product.status === 'inactive' ? 'badge-inactive' : 'badge-outofstock';
    const stockClass = product.stock === 0 ? 'stock-out' : product.stock <= 10 ? 'stock-low' : '';

    tr.innerHTML = `
        <td>
            ${imgSrc
            ? `<img class="table-product-img" src="${imgSrc}" alt="${product.name}" onerror="this.src=''">`
            : `<div class="table-product-img" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted)"><i class="fas fa-image"></i></div>`}
        </td>
        <td>
            <div class="table-product-name">${product.name}</div>
            <div class="table-product-brand">${product.brand || ''}</div>
        </td>
        <td>${CATEGORY_LABELS[product.category] || product.category}</td>
        <td>
            <span class="table-price">${formatPrice(product.price)}</span>
            ${product.originalPrice && product.originalPrice > product.price
            ? `<span class="table-original-price">${formatPrice(product.originalPrice)}</span>` : ''}
        </td>
        <td><span class="${stockClass}">${product.stock}</span></td>
        <td><span class="table-status ${statusClass}">${STATUS_LABELS[product.status]}</span></td>
        <td>
            <div class="table-actions">
                <button class="table-action-btn edit" onclick="openEditModal('${product.id}')" title="Chỉnh sửa">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="table-action-btn delete" onclick="openDeleteModal('${product.id}')" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return tr;
}

// ============================================
// HELPERS
// ============================================
function formatPrice(price) {
    if (!price) return '0đ';
    return price.toLocaleString('vi-VN') + 'đ';
}

function getStatusBadgeHTML(status) {
    const cls = status === 'active' ? 'badge-active'
        : status === 'inactive' ? 'badge-inactive' : 'badge-outofstock';
    return `<span class="product-status-badge ${cls}">${STATUS_LABELS[status]}</span>`;
}

function getDiscountBadgeHTML(price, originalPrice) {
    if (!originalPrice || originalPrice <= price) return '';
    const discount = Math.round((1 - price / originalPrice) * 100);
    return `<span class="discount-badge">-${discount}%</span>`;
}

function getStockInfoHTML(stock) {
    if (stock === 0) {
        return `<span class="product-card-stock stock-out"><i class="fas fa-times-circle"></i> Hết hàng</span>`;
    } else if (stock <= 10) {
        return `<span class="product-card-stock stock-low"><i class="fas fa-exclamation-circle"></i> Còn ${stock}</span>`;
    }
    return `<span class="product-card-stock"><i class="fas fa-box"></i> Kho: ${stock}</span>`;
}

// ============================================
// FILTERS & SEARCH
// ============================================
function getFilteredProducts() {
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    let filtered = [...products];

    // Category filter
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Status filter
    if (status !== 'all') {
        filtered = filtered.filter(p => p.status === status);
    }

    // Search
    if (search) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search) ||
            (p.brand && p.brand.toLowerCase().includes(search)) ||
            (p.sku && p.sku.toLowerCase().includes(search))
        );
    }

    // Sort
    switch (sort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            break;
        case 'stock':
            filtered.sort((a, b) => b.stock - a.stock);
            break;
        case 'newest':
        default:
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
}

function updateStats() {
    document.getElementById('statTotal').textContent = products.length;
    document.getElementById('statActive').textContent = products.filter(p => p.status === 'active').length;
    document.getElementById('statOutOfStock').textContent = products.filter(p => p.status === 'outofstock').length;
    document.getElementById('statInactive').textContent = products.filter(p => p.status === 'inactive').length;
}

// ============================================
// MODAL: ADD / EDIT
// ============================================
function openAddModal() {
    editingProductId = null;
    currentImageData = null;

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i><span>Thêm Sản Phẩm Mới</span>';
    document.getElementById('productForm').reset();

    // Reset image preview
    const preview = document.getElementById('imagePreview');
    preview.classList.remove('has-image');
    document.getElementById('previewImg').src = '';

    document.getElementById('productModal').classList.add('open');
}

function openEditModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    currentImageData = product.image || null;

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i><span>Chỉnh Sửa Sản Phẩm</span>';

    // Fill form
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productBrand').value = product.brand || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productSKU').value = product.sku || '';
    document.getElementById('productStatus').value = product.status;
    document.getElementById('productDescription').value = product.description || '';

    // Set image preview
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    if (product.image) {
        previewImg.src = product.image;
        preview.classList.add('has-image');
    } else {
        previewImg.src = '';
        preview.classList.remove('has-image');
    }

    document.getElementById('productModal').classList.add('open');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('open');
    editingProductId = null;
    currentImageData = null;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const brand = document.getElementById('productBrand').value.trim();
    const price = parseInt(document.getElementById('productPrice').value) || 0;
    const originalPrice = parseInt(document.getElementById('productOriginalPrice').value) || 0;
    const stock = parseInt(document.getElementById('productStock').value) || 0;
    const sku = document.getElementById('productSKU').value.trim();
    const status = document.getElementById('productStatus').value;
    const description = document.getElementById('productDescription').value.trim();

    if (!name || !category || !price) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    if (editingProductId) {
        // UPDATE
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            const updatedProduct = {
                ...products[index],
                name, category, brand, price, originalPrice,
                stock, sku, status, description,
                image: currentImageData || products[index].image
            };
            try {
                await syncProductToFirestore(updatedProduct);
                showToast(`Đã cập nhật "${name}" thành công!`, 'success');
            } catch (error) {
                console.error('Firestore update failed:', error);
                products[index] = updatedProduct;
                saveProducts();
                renderProducts();
                updateStats();
                showToast(`Đã cập nhật "${name}" (offline)`, 'warning');
            }
        }
    } else {
        // CREATE
        const newProduct = {
            id: generateId(),
            name, category, brand, price, originalPrice,
            stock, sku, status, description,
            image: currentImageData || '',
            createdAt: new Date().toISOString()
        };
        try {
            await syncProductToFirestore(newProduct);
            showToast(`Đã thêm "${name}" thành công!`, 'success');
        } catch (error) {
            console.error('Firestore create failed:', error);
            products.unshift(newProduct);
            saveProducts();
            renderProducts();
            updateStats();
            showToast(`Đã thêm "${name}" (offline)`, 'warning');
        }
    }

    closeProductModal();
}

// ============================================
// MODAL: DELETE
// ============================================
function openDeleteModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    deleteProductId = id;

    document.getElementById('deleteProductName').textContent = product.name;
    document.getElementById('deleteProductSKU').textContent = product.sku || '';
    document.getElementById('deleteProductImg').src = product.image || '';

    document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
    deleteProductId = null;
}

async function confirmDelete() {
    if (!deleteProductId) return;

    const product = products.find(p => p.id === deleteProductId);
    const name = product ? product.name : '';

    try {
        await deleteProductFromFirestore(deleteProductId);
        showToast(`Đã xóa "${name}" thành công!`, 'success');
    } catch (error) {
        console.error('Firestore delete failed:', error);
        // Fallback to local delete
        products = products.filter(p => p.id !== deleteProductId);
        saveProducts();
        renderProducts();
        updateStats();
        showToast(`Đã xóa "${name}" (offline)`, 'warning');
    }

    closeDeleteModal();
}

// ============================================
// IMAGE UPLOAD
// ============================================
function handleImageUpload(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file ảnh (PNG, JPG, WEBP)', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Kích thước ảnh tối đa 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageData = e.target.result;
        const previewImg = document.getElementById('previewImg');
        previewImg.src = currentImageData;
        document.getElementById('imagePreview').classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImageData = null;
    document.getElementById('previewImg').src = '';
    document.getElementById('imagePreview').classList.remove('has-image');
    document.getElementById('imageInput').value = '';
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="${icons[type]}"></i></div>
        <div class="toast-body">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s ease-in forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', openAddModal);

    // Modal close buttons
    document.getElementById('modalClose').addEventListener('click', closeProductModal);
    document.getElementById('cancelBtn').addEventListener('click', closeProductModal);

    // Form submit
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);

    // Delete modal
    document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);

    // Close modals on overlay click
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('productModal')) closeProductModal();
    });
    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
    });

    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeDeleteModal();
        }
    });

    // Image upload
    const imageInput = document.getElementById('imageInput');
    document.getElementById('uploadImgBtn').addEventListener('click', () => imageInput.click());
    document.getElementById('imagePreview').addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleImageUpload(e.target.files[0]);
    });

    // Remove image
    document.getElementById('removeImgBtn').addEventListener('click', removeImage);

    // Drag & Drop
    const dropZone = document.getElementById('imagePreview');
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
    });

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', renderProducts);
    document.getElementById('statusFilter').addEventListener('change', renderProducts);
    document.getElementById('sortFilter').addEventListener('change', renderProducts);

    // Search (debounced)
    let searchTimer;
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(renderProducts, 300);
    });

    // View toggle
    document.getElementById('gridViewBtn').addEventListener('click', () => switchView('grid'));
    document.getElementById('tableViewBtn').addEventListener('click', () => switchView('table'));
}

function switchView(view) {
    currentView = view;

    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(view === 'grid' ? 'gridViewBtn' : 'tableViewBtn').classList.add('active');

    renderProducts();
}

