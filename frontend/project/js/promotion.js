// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log(' Promotion page loaded');
    
    if (typeof products === 'undefined') {
        console.error(' Không tìm thấy data.js!');
        return;
    }
    
    // Render sản phẩm flash sale và giảm giá
    renderFlashSaleProducts();
    renderSaleProducts();
    
    // Setup countdown timer
    startCountdown();
    
    // Setup search
    setupSearch();
    
    // Update cart count
    updateCartCount();
});

// ========== RENDER FLASH SALE ==========
function renderFlashSaleProducts() {
    const container = document.getElementById('flash-sale-products');
    if (!container) return;
    
    // Lấy sản phẩm có discount >= 20%
    const flashSaleProducts = products
        .filter(p => p.discount >= 20 || p.isSale === true)
        .slice(0, 8);
    
    if (flashSaleProducts.length === 0) {
        container.innerHTML = '<p>Đang cập nhật...</p>';
        return;
    }
    
    container.innerHTML = flashSaleProducts.map(product => createFlashSaleCard(product)).join('');
}

// ========== RENDER SALE PRODUCTS ==========
function renderSaleProducts() {
    const container = document.getElementById('sale-products');
    if (!container) return;
    
    const saleProducts = products
        .filter(p => p.isSale === true || p.discount > 0)
        .slice(0, 8);
    
    container.innerHTML = saleProducts.map(product => createProductCard(product)).join('');
}

// ========== CREATE FLASH SALE CARD ==========
function createFlashSaleCard(product) {
    const discountedPrice = product.discount > 0 
        ? product.price * (100 - product.discount) / 100 
        : product.price;
    
    // Random progress bar percentage
    const soldPercent = Math.floor(Math.random() * 60) + 30;
    
    return `
        <div class="product-card flash-sale-card" data-id="${product.id}">
            <div class="product-badge">
                <span class="badge-flash"> FLASH SALE</span>
                ${product.discount > 0 ? `<span class="badge-sale">-${product.discount}%</span>` : ''}
            </div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://placehold.co/300x200?text=No+Image'">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand || ''}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(discountedPrice)}</span>
                    <span class="old-price">${formatPrice(product.price)}</span>
                </div>
                <div class="sold-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${soldPercent}%"></div>
                    </div>
                    <span class="sold-text">Đã bán ${soldPercent}%</span>
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Mua ngay
                    </button>
                </div>
            </div>
        </div>
    `;
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
                </div>
            </div>
        </div>
    `;
}

// ========== COUNTDOWN TIMER ==========
function startCountdown() {
    // Set end time to 3 days from now
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 3);
    endTime.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========== SETUP SEARCH ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `products.html?search=${encodeURIComponent(keyword)}`;
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    window.location.href = `products.html?search=${encodeURIComponent(keyword)}`;
                }
            }
        });
    }
}

// ========== VOUCHER FUNCTIONS ==========
function copyVoucher(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert(` Đã copy mã: ${code}\nSử dụng khi thanh toán để nhận ưu đãi!`);
    }).catch(() => {
        alert(` Mã giảm giá: ${code}`);
    });
}

// ========== COMBO FUNCTIONS ==========
function addComboToCart(comboId) {
    alert(` Đã thêm combo ${comboId} vào giỏ hàng!`);
    // Thêm logic xử lý combo ở đây
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
    
    // Feedback
    const btn = event?.target?.closest('.btn-cart');
    if (btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        setTimeout(() => btn.innerHTML = originalHtml, 1500);
    }
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

console.log('promotion.js loaded');