// ========== VARIABLES ==========
let currentCategory = 'all';
let currentSort = 'default';
let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [];

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page loaded');
    
    // Kiểm tra data
    if (typeof products === 'undefined') {
        console.error(' Không tìm thấy data.js!');
        document.getElementById('all-products').innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px;">
                <i class="fas fa-exclamation-triangle" style="font-size:48px; color:#ff4757;"></i>
                <p>Lỗi: Không thể tải dữ liệu sản phẩm</p>
            </div>
        `;
        return;
    }
    
    console.log(` Đã load ${products.length} sản phẩm`);
    
    // Khởi tạo filteredProducts
    filteredProducts = [...products];
    
    // Render sản phẩm
    renderProducts();
    
    // Setup các sự kiện
    setupCategoryFilters();
    setupSortFilter();
    setupLoadMore();
    setupSearch();
    updateCartCount();
});

// ========== RENDER PRODUCTS ==========
function renderProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    // Lọc theo danh mục
    let displayProducts = [...filteredProducts];
    if (currentCategory !== 'all') {
        displayProducts = displayProducts.filter(p => p.category === currentCategory);
        console.log(` Đang lọc theo danh mục: ${currentCategory}, tìm thấy ${displayProducts.length} sản phẩm`);
    }
    
    // Sắp xếp
    displayProducts = sortProducts(displayProducts, currentSort);
    
    // Phân trang
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = displayProducts.slice(startIndex, endIndex);
    
    // Hiển thị
    if (paginatedProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:80px 20px;">
                <i class="fas fa-box-open" style="font-size:64px; color:#ccc;"></i>
                <h3 style="margin-top:20px;">Không tìm thấy sản phẩm</h3>
                <p style="color:#888;">Vui lòng thử lại với danh mục khác</p>
            </div>
        `;
    } else {
        container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    }
    
    // Cập nhật load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        const hasMore = endIndex < displayProducts.length;
        loadMoreBtn.style.display = hasMore ? 'flex' : 'none';
    }
    
    // Cập nhật số lượng sản phẩm
    updateProductCount(displayProducts.length);
}

// ========== SETUP CATEGORY FILTERS ==========
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('#category-tabs .category-btn');
    console.log(` Tìm thấy ${categoryBtns.length} nút danh mục`);
    
    categoryBtns.forEach(btn => {
        // Xóa event cũ để tránh trùng
        btn.removeEventListener('click', handleCategoryClick);
        btn.addEventListener('click', handleCategoryClick);
    });
}

function handleCategoryClick(event) {
    const btn = event.currentTarget;
    const category = btn.getAttribute('data-category');
    
    console.log(` Click vào danh mục: ${category}`);
    
    // Cập nhật active class
    document.querySelectorAll('#category-tabs .category-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Cập nhật current category
    currentCategory = category;
    currentPage = 1;
    
    // Render lại sản phẩm
    renderProducts();
    
    // Cuộn lên đầu
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== SETUP SORT FILTER ==========
function setupSortFilter() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            currentPage = 1;
            renderProducts();
        });
    }
}

// ========== SETUP LOAD MORE ==========
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderProducts();
        });
    }
}

// ========== SETUP SEARCH ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    const performSearch = () => {
        const keyword = searchInput.value.trim();
        console.log(`🔍 Tìm kiếm: "${keyword}"`);
        
        if (!keyword) {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(p => 
                p.name.toLowerCase().includes(keyword.toLowerCase()) ||
                (p.brand && p.brand.toLowerCase().includes(keyword.toLowerCase()))
            );
        }
        
        currentCategory = 'all';
        currentPage = 1;
        
        // Reset active category button
        document.querySelectorAll('#category-tabs .category-btn').forEach(btn => {
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        renderProducts();
    };
    
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

// ========== SORT FUNCTION ==========
function sortProducts(productsList, sortBy) {
    const sorted = [...productsList];
    switch(sortBy) {
        case 'price_asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name_asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// ========== CREATE PRODUCT CARD ==========
function createProductCard(product) {
    const discountedPrice = product.discount > 0 
        ? product.price * (100 - product.discount) / 100 
        : product.price;
    
    let badgeHtml = '';
    if (product.isNew) badgeHtml += '<span class="badge-new">Mới</span>';
    if (product.isSale || product.discount > 0) {
        badgeHtml += `<span class="badge-sale">-${product.discount || 10}%</span>`;
    }
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-badge">${badgeHtml}</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://placehold.co/300x200?text=No+Image'">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand || ''}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(discountedPrice)}</span>
                    ${product.discount > 0 ? `<span class="old-price">${formatPrice(product.price)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Mua ngay
                    </button>
                    <button class="btn-wishlist" onclick="addToWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ========== UPDATE PRODUCT COUNT ==========
function updateProductCount(total) {
    let countElement = document.querySelector('.product-count');
    if (!countElement) {
        const filterLeft = document.querySelector('.filter-left');
        if (filterLeft) {
            const span = document.createElement('span');
            span.className = 'product-count';
            span.style.marginLeft = '15px';
            span.style.color = '#b7791f';
            span.style.fontWeight = '600';
            filterLeft.appendChild(span);
            countElement = span;
        }
    }
    if (countElement) {
        countElement.innerHTML = `${total} sản phẩm`;
    }
}

// ========== CART FUNCTIONS ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    const btn = event?.target?.closest('.btn-cart');
    if (btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        setTimeout(() => btn.innerHTML = originalHtml, 1500);
    }
}

function addToWishlist(productId) {
    alert('❤️ Đã thêm vào danh sách yêu thích!');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSpan = document.querySelector('.cart-count');
    if (cartSpan) cartSpan.textContent = count;
}

// ========== UTILITY ==========
function formatPrice(price) {
    return price?.toLocaleString('vi-VN') + '₫' || '0₫';
}

console.log('products.js loaded');