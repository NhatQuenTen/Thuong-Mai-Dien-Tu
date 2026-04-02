// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log(' Page loaded, products count:', products?.length);
    
    // Kiểm tra xem products có tồn tại không
    if (typeof products === 'undefined') {
        console.error(' Không tìm thấy data.js!');
        return;
    }
    
    // Render sản phẩm
    renderProducts('new-products', getNewProducts(), 8);
    renderProducts('sale-products', getSaleProducts(), 8);
    renderProducts('all-products', products, 8);
    
    // Setup category filters
    setupCategoryFilters();
    
    // Setup search
    setupSearch();
    
    // Update cart count
    updateCartCount();
});

// ========== RENDER FUNCTION ==========
function renderProducts(containerId, productList, limit = 8) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(` Không tìm thấy container: ${containerId}`);
        return;
    }
    
    const displayProducts = productList.slice(0, limit);
    
    if (displayProducts.length === 0) {
        container.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 40px;">Không có sản phẩm</div>';
        return;
    }
    
    container.innerHTML = displayProducts.map(product => createProductCard(product)).join('');
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
        <div class="product-card" data-id="${product.id}" onclick="goToProductDetail(${product.id})" style="cursor: pointer;">
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
                    <button class="btn-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Mua ngay
                    </button>
                    <button class="btn-wishlist" onclick="event.stopPropagation(); addToWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ========== CHUYỂN ĐẾN TRANG CHI TIẾT SẢN PHẨM ==========
function goToProductDetail(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// ========== CATEGORY FILTERS ==========
function setupCategoryFilters() {
    const btns = document.querySelectorAll('.category-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            btns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const filtered = category === 'all' 
                ? products 
                : getProductsByCategory(category);
            
            renderProducts('all-products', filtered, 12);
            document.getElementById('all-products').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ========== SEARCH ==========
function setupSearch() {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    
    const search = () => {
        const keyword = input.value.trim();
        if (!keyword) {
            renderProducts('all-products', products, 12);
            return;
        }
        
        const results = products.filter(p => 
            p.name.toLowerCase().includes(keyword.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(keyword.toLowerCase()))
        );
        
        renderProducts('all-products', results, 12);
        if (results.length === 0) {
            document.getElementById('all-products').innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:60px;">
                    <i class="fas fa-search" style="font-size:48px; color:#ccc;"></i>
                    <p>Không tìm thấy sản phẩm "${keyword}"</p>
                </div>
            `;
        }
    };
    
    btn.addEventListener('click', search);
    input.addEventListener('keypress', e => e.key === 'Enter' && search());
}

// ========== CART ==========
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
    
    // Feedback
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

function getNewProducts() {
    return products.filter(p => p.isNew === true);
}

function getSaleProducts() {
    return products.filter(p => p.isSale === true);
}

function getProductsByCategory(category) {
    return products.filter(p => p.category === category);
}

console.log(' main.js loaded');