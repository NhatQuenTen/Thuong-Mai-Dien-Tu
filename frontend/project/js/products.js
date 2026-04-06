// ========== VARIABLES ==========
let currentCategory = 'all';
let currentSort = 'default';
let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [];

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log(' Products page loaded');
    
    if (typeof products === 'undefined') {
        console.error(' Không tìm thấy data.js!');
        return;
    }
    
    console.log(` Đã load ${products.length} sản phẩm`);
    
    filteredProducts = [...products];
    renderProducts();
    setupCategoryFilters();
    setupSortFilter();
    setupLoadMore();
    setupSearch();
    setupProductClick();  
    updateCartCount();
    setupBackToTop();
});

// ========== BACK TO TOP BUTTON ==========
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    // Hiển thị nút khi cuộn xuống 300px
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Cuộn lên đầu trang khi click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== RENDER PRODUCTS ==========
function renderProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    let displayProducts = [...filteredProducts];
    if (currentCategory !== 'all') {
        displayProducts = displayProducts.filter(p => p.category === currentCategory);
        console.log(` Lọc theo: ${currentCategory}, tìm thấy ${displayProducts.length} sản phẩm`);
    }
    
    displayProducts = sortProducts(displayProducts, currentSort);
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = displayProducts.slice(startIndex, endIndex);
    
    if (paginatedProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:80px 20px;">
                <i class="fas fa-box-open" style="font-size:64px; color:#ccc;"></i>
                <h3 style="margin-top:20px;">Không tìm thấy sản phẩm</h3>
            </div>
        `;
    } else {
        container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    }
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        const hasMore = endIndex < displayProducts.length;
        loadMoreBtn.style.display = hasMore ? 'flex' : 'none';
    }
    
    updateProductCount(displayProducts.length);
}

// ========== TẠO CARD SẢN PHẨM ==========
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

// ========== CLICK VÀO SẢN PHẨM - CHUYỂN SANG TRANG CHI TIẾT ==========
function setupProductClick() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    container.addEventListener('click', function(e) {
        // Không xử lý nếu click vào button
        if (e.target.closest('.btn-cart') || e.target.closest('.btn-wishlist')) {
            return;
        }
        
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;
        
        const productId = productCard.getAttribute('data-id');
        if (productId) {
            console.log(` Chuyển sang chi tiết sản phẩm ID: ${productId}`);
            window.location.href = `detail.html?id=${productId}`;
        }
    });
}

// ========== CÁC HÀM KHÁC GIỮ NGUYÊN ==========
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('#category-tabs .category-btn');
    categoryBtns.forEach(btn => {
        btn.removeEventListener('click', handleCategoryClick);
        btn.addEventListener('click', handleCategoryClick);
    });
}

function handleCategoryClick(event) {
    const btn = event.currentTarget;
    const category = btn.getAttribute('data-category');
    
    document.querySelectorAll('#category-tabs .category-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    currentCategory = category;
    currentPage = 1;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderProducts();
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    const performSearch = () => {
        const keyword = searchInput.value.trim();
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

function sortProducts(productList, sortBy) {
    const sorted = [...productList];
    switch(sortBy) {
        case 'price_asc': return sorted.sort((a, b) => a.price - b.price);
        case 'price_desc': return sorted.sort((a, b) => b.price - a.price);
        case 'name_asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default: return sorted;
    }
}

function updateProductCount(count) {
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
    if (countElement) countElement.innerHTML = ` ${count} sản phẩm`;
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    
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

function formatPrice(price) {
    return price?.toLocaleString('vi-VN') + '₫' || '0₫';
}

console.log('products.js loaded');