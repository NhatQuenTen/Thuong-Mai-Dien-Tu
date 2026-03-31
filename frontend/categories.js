// ============================================
// MobiStore Categories Page - JavaScript
// ============================================

// State
let categories = [];
let editingCategoryId = null;
let deleteCategoryId = null;
let currentView = 'grid';
let selectedIcon = 'fas fa-folder';

// Available icons for picker
const AVAILABLE_ICONS = [
    'fas fa-mobile-alt', 'fas fa-tablet-alt', 'fas fa-laptop', 'fas fa-desktop',
    'fas fa-tv', 'fas fa-headphones', 'fas fa-headphones-alt', 'fas fa-volume-up',
    'fas fa-keyboard', 'fas fa-mouse', 'fas fa-gamepad', 'fas fa-camera',
    'fas fa-video', 'fas fa-microchip', 'fas fa-memory', 'fas fa-hdd',
    'fas fa-sim-card', 'fas fa-sd-card', 'fas fa-usb', 'fas fa-plug',
    'fas fa-battery-full', 'fas fa-charging-station', 'fas fa-bolt',
    'fas fa-wifi', 'fas fa-bluetooth-b', 'fas fa-satellite-dish',
    'fas fa-watch', 'fas fa-glasses', 'fas fa-vr-cardboard',
    'fas fa-print', 'fas fa-fax', 'fas fa-server',
    'fas fa-shield-alt', 'fas fa-lock', 'fas fa-fingerprint',
    'fas fa-box', 'fas fa-box-open', 'fas fa-boxes',
    'fas fa-tag', 'fas fa-tags', 'fas fa-star',
    'fas fa-heart', 'fas fa-gem', 'fas fa-crown',
    'fas fa-gift', 'fas fa-shopping-bag', 'fas fa-shopping-cart',
    'fas fa-store', 'fas fa-tshirt', 'fas fa-shoe-prints',
    'fas fa-couch', 'fas fa-blender', 'fas fa-fan',
    'fas fa-lightbulb', 'fas fa-tools', 'fas fa-wrench',
    'fas fa-cog', 'fas fa-cogs', 'fas fa-sliders-h',
    'fas fa-palette', 'fas fa-paint-brush', 'fas fa-pen',
    'fas fa-music', 'fas fa-film', 'fas fa-compact-disc',
    'fas fa-robot', 'fas fa-rocket', 'fas fa-atom',
    'fas fa-layer-group', 'fas fa-folder', 'fas fa-folder-open',
    'fas fa-th-large', 'fas fa-th', 'fas fa-grip-horizontal'
];

// Status labels
const STATUS_LABELS = {
    active: 'Hoạt động',
    inactive: 'Tạm ẩn'
};

// Predefined colors
const PREDEFINED_COLORS = [
    '#7c3aed', '#06b6d4', '#10b981', '#f59e0b',
    '#ec4899', '#3b82f6', '#ef4444', '#8b5cf6',
    '#14b8a6', '#f97316', '#6366f1', '#84cc16'
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    initDateDisplay();
    loadCategories();
    renderCategories();
    updateStats();
    populateIconGrid();
    initEventListeners();
});

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
function loadCategories() {
    const stored = localStorage.getItem('mobistore_categories');
    if (stored) {
        categories = JSON.parse(stored);
    } else {
        categories = getSeedCategories();
        saveCategories();
    }
}

function saveCategories() {
    localStorage.setItem('mobistore_categories', JSON.stringify(categories));
}

function generateId() {
    return 'CAT' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

function getSeedCategories() {
    return [
        {
            id: generateId(),
            name: 'Điện thoại',
            slug: 'dien-thoai',
            description: 'Điện thoại thông minh các thương hiệu Apple, Samsung, Xiaomi, Google và nhiều hãng khác.',
            icon: 'fas fa-mobile-alt',
            color: '#7c3aed',
            status: 'active',
            order: 1,
            productCount: 4,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Máy tính bảng',
            slug: 'may-tinh-bang',
            description: 'iPad, Samsung Galaxy Tab và các dòng máy tính bảng cao cấp.',
            icon: 'fas fa-tablet-alt',
            color: '#06b6d4',
            status: 'active',
            order: 2,
            productCount: 2,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: generateId(),
            name: 'Laptop',
            slug: 'laptop',
            description: 'MacBook, laptop gaming và laptop văn phòng từ các thương hiệu hàng đầu.',
            icon: 'fas fa-laptop',
            color: '#10b981',
            status: 'active',
            order: 3,
            productCount: 1,
            createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: generateId(),
            name: 'Phụ kiện',
            slug: 'phu-kien',
            description: 'Ốp lưng, cáp sạc, cường lực và các phụ kiện chính hãng.',
            icon: 'fas fa-plug',
            color: '#f59e0b',
            status: 'active',
            order: 4,
            productCount: 1,
            createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
            id: generateId(),
            name: 'Smartwatch',
            slug: 'smartwatch',
            description: 'Đồng hồ thông minh Apple Watch, Samsung Galaxy Watch, Garmin.',
            icon: 'fas fa-watch',
            color: '#ec4899',
            status: 'active',
            order: 5,
            productCount: 1,
            createdAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
            id: generateId(),
            name: 'Tai nghe / Loa',
            slug: 'tai-nghe-loa',
            description: 'AirPods, tai nghe Bluetooth, loa di động và thiết bị âm thanh.',
            icon: 'fas fa-headphones',
            color: '#3b82f6',
            status: 'active',
            order: 6,
            productCount: 1,
            createdAt: new Date(Date.now() - 432000000).toISOString()
        },
        {
            id: generateId(),
            name: 'Gaming',
            slug: 'gaming',
            description: 'Tay cầm chơi game, bàn phím cơ, chuột gaming và phụ kiện gaming.',
            icon: 'fas fa-gamepad',
            color: '#ef4444',
            status: 'inactive',
            order: 7,
            productCount: 0,
            createdAt: new Date(Date.now() - 518400000).toISOString()
        },
        {
            id: generateId(),
            name: 'Camera & Máy quay',
            slug: 'camera-may-quay',
            description: 'Camera hành trình, webcam, máy quay phim và phụ kiện quay chụp.',
            icon: 'fas fa-camera',
            color: '#8b5cf6',
            status: 'inactive',
            order: 8,
            productCount: 0,
            createdAt: new Date(Date.now() - 604800000).toISOString()
        }
    ];
}

// ============================================
// RENDERING
// ============================================
function renderCategories() {
    const filtered = getFilteredCategories();
    const grid = document.getElementById('categoriesGrid');
    const tableBody = document.getElementById('categoriesTableBody');
    const emptyState = document.getElementById('emptyState');

    if (filtered.length === 0) {
        grid.classList.add('hidden');
        document.getElementById('categoriesTable').classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    // Render Grid
    grid.innerHTML = '';
    filtered.forEach((category, index) => {
        grid.appendChild(createCategoryCard(category, index));
    });

    // Render Table
    tableBody.innerHTML = '';
    filtered.forEach(category => {
        tableBody.appendChild(createCategoryRow(category));
    });

    // Show correct view
    if (currentView === 'grid') {
        grid.classList.remove('hidden');
        document.getElementById('categoriesTable').classList.add('hidden');
    } else {
        grid.classList.add('hidden');
        document.getElementById('categoriesTable').classList.remove('hidden');
    }
}

function createCategoryCard(category, index) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const statusBadge = getStatusBadgeHTML(category.status);
    const dateStr = formatDate(category.createdAt);

    card.innerHTML = `
        <div class="category-card-header">
            <div class="category-card-banner" style="background: ${category.color}"></div>
            <div class="category-card-icon" style="background: ${category.color}">
                <i class="${category.icon}"></i>
            </div>
            ${statusBadge}
            <div class="card-hover-actions">
                <button class="card-action-btn edit" onclick="openEditModal('${category.id}')" title="Chỉnh sửa">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="card-action-btn delete" onclick="openDeleteModal('${category.id}')" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="category-card-body">
            <div class="category-card-name">${category.name}</div>
            <div class="category-card-slug"><i class="fas fa-link"></i> ${category.slug}</div>
            <div class="category-card-description">${category.description || 'Chưa có mô tả'}</div>
            <div class="category-card-footer">
                <div class="category-card-products">
                    <i class="fas fa-box"></i>
                    ${category.productCount} sản phẩm
                </div>
                <span class="category-card-date">${dateStr}</span>
            </div>
        </div>
    `;

    return card;
}

function createCategoryRow(category) {
    const tr = document.createElement('tr');
    const statusClass = category.status === 'active' ? 'badge-active' : 'badge-inactive';
    const dateStr = formatDate(category.createdAt);

    tr.innerHTML = `
        <td>
            <div class="table-category-icon" style="background: ${category.color}">
                <i class="${category.icon}"></i>
            </div>
        </td>
        <td>
            <div class="table-category-name">${category.name}</div>
            <div class="table-category-desc">${category.description || ''}</div>
        </td>
        <td><span class="table-slug">${category.slug}</span></td>
        <td><span class="table-product-count">${category.productCount}</span></td>
        <td><span class="table-status ${statusClass}">${STATUS_LABELS[category.status]}</span></td>
        <td>${dateStr}</td>
        <td>
            <div class="table-actions">
                <button class="table-action-btn edit" onclick="openEditModal('${category.id}')" title="Chỉnh sửa">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="table-action-btn delete" onclick="openDeleteModal('${category.id}')" title="Xóa">
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
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getStatusBadgeHTML(status) {
    const cls = status === 'active' ? 'badge-active' : 'badge-inactive';
    return `<span class="category-status-badge ${cls}">${STATUS_LABELS[status]}</span>`;
}

function slugify(str) {
    const map = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'Đ': 'D'
    };

    return str
        .split('')
        .map(ch => map[ch] || ch)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// ============================================
// ICON PICKER
// ============================================
function populateIconGrid() {
    const grid = document.getElementById('iconGrid');
    grid.innerHTML = '';

    AVAILABLE_ICONS.forEach(icon => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'icon-grid-item' + (icon === selectedIcon ? ' selected' : '');
        btn.innerHTML = `<i class="${icon}"></i>`;
        btn.title = icon.replace('fas fa-', '').replace(/-/g, ' ');
        btn.addEventListener('click', () => selectIcon(icon));
        grid.appendChild(btn);
    });
}

function selectIcon(icon) {
    selectedIcon = icon;

    // Update preview
    document.getElementById('iconPreview').className = icon;

    // Update grid selection
    document.querySelectorAll('.icon-grid-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function updateIconPreviewColor(color) {
    document.getElementById('iconPreviewCircle').style.background = color;
}

// ============================================
// FILTERS & SEARCH
// ============================================
function getFilteredCategories() {
    const status = document.getElementById('statusFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    let filtered = [...categories];

    // Status filter
    if (status !== 'all') {
        filtered = filtered.filter(c => c.status === status);
    }

    // Search
    if (search) {
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.slug.toLowerCase().includes(search) ||
            (c.description && c.description.toLowerCase().includes(search))
        );
    }

    // Sort
    switch (sort) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            break;
        case 'products':
            filtered.sort((a, b) => b.productCount - a.productCount);
            break;
        case 'newest':
        default:
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
}

function updateStats() {
    document.getElementById('statTotal').textContent = categories.length;
    document.getElementById('statActive').textContent = categories.filter(c => c.status === 'active').length;
    document.getElementById('statInactive').textContent = categories.filter(c => c.status === 'inactive').length;
    document.getElementById('statProducts').textContent = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
}

// ============================================
// MODAL: ADD / EDIT
// ============================================
function openAddModal() {
    editingCategoryId = null;
    selectedIcon = 'fas fa-folder';

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i><span>Thêm Danh Mục Mới</span>';
    document.getElementById('categoryForm').reset();

    // Reset icon preview
    document.getElementById('iconPreview').className = 'fas fa-folder';
    document.getElementById('iconPreviewCircle').style.background = '#7c3aed';
    document.getElementById('categoryColor').value = '#7c3aed';
    document.getElementById('categoryOrder').value = '0';

    // Update icon grid selection
    populateIconGrid();

    document.getElementById('categoryModal').classList.add('open');
}

function openEditModal(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    editingCategoryId = id;
    selectedIcon = category.icon || 'fas fa-folder';

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i><span>Chỉnh Sửa Danh Mục</span>';

    // Fill form
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categorySlug').value = category.slug;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryStatus').value = category.status;
    document.getElementById('categoryOrder').value = category.order || 0;
    document.getElementById('categoryColor').value = category.color || '#7c3aed';

    // Set icon preview
    document.getElementById('iconPreview').className = category.icon;
    document.getElementById('iconPreviewCircle').style.background = category.color || '#7c3aed';

    // Update icon grid
    populateIconGrid();

    document.getElementById('categoryModal').classList.add('open');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('open');
    editingCategoryId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('categoryName').value.trim();
    let slug = document.getElementById('categorySlug').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    const status = document.getElementById('categoryStatus').value;
    const order = parseInt(document.getElementById('categoryOrder').value) || 0;
    const color = document.getElementById('categoryColor').value;

    if (!name) {
        showToast('Vui lòng nhập tên danh mục', 'error');
        return;
    }

    // Auto-generate slug if empty
    if (!slug) {
        slug = slugify(name);
    }

    // Check duplicate slug
    const existingSlug = categories.find(c =>
        c.slug === slug && c.id !== editingCategoryId
    );
    if (existingSlug) {
        showToast('Slug đã tồn tại. Vui lòng chọn slug khác.', 'error');
        return;
    }

    if (editingCategoryId) {
        // UPDATE
        const index = categories.findIndex(c => c.id === editingCategoryId);
        if (index !== -1) {
            categories[index] = {
                ...categories[index],
                name, slug, description, status, order,
                icon: selectedIcon,
                color: color
            };
            showToast(`Đã cập nhật "${name}" thành công!`, 'success');
        }
    } else {
        // CREATE
        const newCategory = {
            id: generateId(),
            name, slug, description, status, order,
            icon: selectedIcon,
            color: color,
            productCount: 0,
            createdAt: new Date().toISOString()
        };
        categories.unshift(newCategory);
        showToast(`Đã thêm "${name}" thành công!`, 'success');
    }

    saveCategories();
    renderCategories();
    updateStats();
    closeCategoryModal();
}

// ============================================
// MODAL: DELETE
// ============================================
function openDeleteModal(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    deleteCategoryId = id;

    document.getElementById('deleteCategoryName').textContent = category.name;
    document.getElementById('deleteCategoryProducts').textContent = `${category.productCount} sản phẩm`;

    const iconPreview = document.getElementById('deleteIconPreview');
    iconPreview.style.background = category.color || '#7c3aed';
    iconPreview.innerHTML = `<i class="${category.icon}"></i>`;

    document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
    deleteCategoryId = null;
}

function confirmDelete() {
    if (!deleteCategoryId) return;

    const category = categories.find(c => c.id === deleteCategoryId);
    const name = category ? category.name : '';

    categories = categories.filter(c => c.id !== deleteCategoryId);
    saveCategories();
    renderCategories();
    updateStats();
    closeDeleteModal();

    showToast(`Đã xóa "${name}" thành công!`, 'success');
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
    // Add category button
    document.getElementById('addCategoryBtn').addEventListener('click', openAddModal);

    // Modal close buttons
    document.getElementById('modalClose').addEventListener('click', closeCategoryModal);
    document.getElementById('cancelBtn').addEventListener('click', closeCategoryModal);

    // Form submit
    document.getElementById('categoryForm').addEventListener('submit', handleFormSubmit);

    // Delete modal
    document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);

    // Close modals on overlay click
    document.getElementById('categoryModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('categoryModal')) closeCategoryModal();
    });
    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
    });

    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCategoryModal();
            closeDeleteModal();
        }
    });

    // Color picker
    document.getElementById('categoryColor').addEventListener('input', (e) => {
        updateIconPreviewColor(e.target.value);
    });

    // Auto-generate slug from name
    document.getElementById('categoryName').addEventListener('input', (e) => {
        const slugInput = document.getElementById('categorySlug');
        // Only auto-generate if slug field is empty or matches previous auto-slug
        if (!editingCategoryId || !slugInput.dataset.manual) {
            slugInput.value = slugify(e.target.value);
        }
    });

    // Mark slug as manually edited
    document.getElementById('categorySlug').addEventListener('input', () => {
        document.getElementById('categorySlug').dataset.manual = 'true';
    });

    // Filters
    document.getElementById('statusFilter').addEventListener('change', renderCategories);
    document.getElementById('sortFilter').addEventListener('change', renderCategories);

    // Search (debounced)
    let searchTimer;
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(renderCategories, 300);
    });

    // View toggle
    document.getElementById('gridViewBtn').addEventListener('click', () => switchView('grid'));
    document.getElementById('tableViewBtn').addEventListener('click', () => switchView('table'));
}

function switchView(view) {
    currentView = view;

    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(view === 'grid' ? 'gridViewBtn' : 'tableViewBtn').classList.add('active');

    renderCategories();
}
