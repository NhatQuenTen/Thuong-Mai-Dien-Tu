// ========== DỮ LIỆU SẢN PHẨM (ĐỒNG BỘ VỚI CÁC TRANG KHÁC) ==========
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 29990000, oldPrice: 33990000, image: "https://picsum.photos/id/1/400/400", category: "phone", categoryName: "Điện thoại", desc: "iPhone 15 Pro Max với chip A17 Pro, màn hình Super Retina XDR 6.7 inch, camera 48MP, pin trâu, thiết kế titanium sang trọng.", specs: { "Chip": "A17 Pro", "RAM": "8GB", "ROM": "256GB", "Màn hình": "6.7 inch Super Retina XDR", "Camera sau": "48MP + 12MP + 12MP", "Pin": "4422 mAh" }, rating: 4.9, reviewCount: 1250 },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 27990000, oldPrice: 31990000, image: "https://picsum.photos/id/2/400/400", category: "phone", categoryName: "Điện thoại", desc: "Samsung Galaxy S24 Ultra với chip Snapdragon 8 Gen 3, màn hình 6.8 inch Dynamic AMOLED 2X, camera 200MP, S Pen tích hợp.", specs: { "Chip": "Snapdragon 8 Gen 3", "RAM": "12GB", "ROM": "256GB", "Màn hình": "6.8 inch Dynamic AMOLED 2X", "Camera sau": "200MP + 50MP + 12MP", "Pin": "5000 mAh" }, rating: 4.8, reviewCount: 980 },
    { id: 3, name: "iPad Pro 11\"", price: 19990000, oldPrice: 22990000, image: "https://picsum.photos/id/3/400/400", category: "tablet", categoryName: "Máy tính bảng", desc: "iPad Pro 11 inch với chip M2, màn hình Liquid Retina 120Hz, hỗ trợ Apple Pencil thế hệ 2.", specs: { "Chip": "M2", "RAM": "8GB", "ROM": "128GB", "Màn hình": "11 inch Liquid Retina", "Camera": "12MP", "Pin": "28.65 Wh" }, rating: 4.7, reviewCount: 560 },
    { id: 4, name: "MacBook Air M2", price: 28990000, oldPrice: 30990000, image: "https://picsum.photos/id/4/400/400", category: "laptop", categoryName: "Laptop", desc: "MacBook Air với chip M2, thiết kế mỏng nhẹ, màn hình 13.6 inch Liquid Retina, pin lên đến 18 giờ.", specs: { "Chip": "M2", "RAM": "8GB", "ROM": "256GB SSD", "Màn hình": "13.6 inch Liquid Retina", "Cân nặng": "1.24 kg", "Pin": "52.6 Wh" }, rating: 4.9, reviewCount: 820 },
    { id: 5, name: "AirPods Pro 2", price: 4990000, oldPrice: 5990000, image: "https://picsum.photos/id/5/400/400", category: "headphone", categoryName: "Tai nghe", desc: "AirPods Pro 2 với chip H2, chống ồn chủ động, thời lượng pin lên đến 30 giờ.", specs: { "Chip": "H2", "Chống ồn": "Có", "Thời lượng pin": "6 giờ (nghe)", "Sạc": "MagSafe" }, rating: 4.8, reviewCount: 2100 },
    { id: 6, name: "Apple Watch Series 9", price: 9990000, oldPrice: 10990000, image: "https://picsum.photos/id/8/400/400", category: "watch", categoryName: "Smartwatch", desc: "Apple Watch Series 9 với chip S9, màn hình luôn sáng, tính năng theo dõi sức khỏe toàn diện.", specs: { "Chip": "S9", "Màn hình": "Always-On Retina", "Tính năng": "ECG, SpO2, Nhịp tim", "Pin": "18 giờ" }, rating: 4.7, reviewCount: 680 },
    { id: 7, name: "Sony WH-1000XM5", price: 6990000, oldPrice: 7990000, image: "https://picsum.photos/id/6/400/400", category: "headphone", categoryName: "Tai nghe", desc: "Sony WH-1000XM5 với công nghệ chống ồn vượt trội, chất âm Hi-Res, pin 30 giờ.", specs: { "Chống ồn": "Cực đỉnh", "Thời lượng pin": "30 giờ", "Kết nối": "Bluetooth 5.2", "Sạc nhanh": "3 phút nghe 3 giờ" }, rating: 4.9, reviewCount: 1500 },
    { id: 8, name: "Xiaomi Pad 6", price: 8990000, oldPrice: 9990000, image: "https://picsum.photos/id/9/400/400", category: "tablet", categoryName: "Máy tính bảng", desc: "Xiaomi Pad 6 với màn hình 11 inch 144Hz, chip Snapdragon 870, pin 8840mAh.", specs: { "Chip": "Snapdragon 870", "RAM": "6GB", "ROM": "128GB", "Màn hình": "11 inch 144Hz", "Pin": "8840 mAh" }, rating: 4.6, reviewCount: 420 },
    { id: 9, name: "Tai nghe AirPods 4", price: 3990000, oldPrice: 4990000, image: "https://picsum.photos/id/11/400/400", category: "headphone", categoryName: "Tai nghe", desc: "AirPods 4 với chip H2, thiết kế mới, âm thanh không gian, pin 30 giờ.", specs: { "Chip": "H2", "Chống ồn": "Có", "Âm thanh": "Spatial Audio", "Pin": "30 giờ" }, rating: 4.8, reviewCount: 890 },
    { id: 10, name: "Loa JBL Charge 5", price: 2790000, oldPrice: 3290000, image: "https://picsum.photos/id/7/400/400", category: "speaker", categoryName: "Loa", desc: "JBL Charge 5 với âm thanh mạnh mẽ, chuẩn IP67 chống nước bụi, pin 20 giờ.", specs: { "Công suất": "40W", "Chống nước": "IP67", "Pin": "20 giờ", "Kết nối": "Bluetooth 5.1" }, rating: 4.7, reviewCount: 1230 }
];

// ========== LẤY ID SẢN PHẨM TỪ URL ==========
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// ========== HIỂN THỊ MODAL ==========
function showModal(message, isSuccess = true) {
    const oldModal = document.querySelector('.custom-modal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="custom-modal-content ${isSuccess ? 'success' : 'error'}">
            <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
            <button class="modal-close-btn">Đóng</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    modal.querySelector('.modal-close-btn').onclick = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };
    
    setTimeout(() => {
        if (modal.parentNode) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }, 2500);
}

// ========== THÊM VÀO GIỎ HÀNG ==========
function addToCart(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === productId);
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showModal(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, true);
}

// ========== MUA NGAY ==========
function buyNow(productId, quantity) {
    addToCart(productId, quantity);
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

// ========== CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG ==========
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) cartCountElem.innerText = total;
}

// ========== LẤY SỐ LƯỢNG HIỆN TẠI ==========
function getQuantity() {
    const quantityElem = document.getElementById('quantityValue');
    return quantityElem ? parseInt(quantityElem.innerText) : 1;
}

function decreaseQuantity() {
    const quantityElem = document.getElementById('quantityValue');
    if (quantityElem) {
        let val = parseInt(quantityElem.innerText);
        if (val > 1) quantityElem.innerText = val - 1;
    }
}

function increaseQuantity() {
    const quantityElem = document.getElementById('quantityValue');
    if (quantityElem) {
        let val = parseInt(quantityElem.innerText);
        quantityElem.innerText = val + 1;
    }
}

// ========== RENDER SẢN PHẨM LIÊN QUAN ==========
function renderRelatedProducts(currentProduct) {
    const related = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    const container = document.getElementById('related-products');
    if (!container) return;
    
    if (related.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:40px;">Không có sản phẩm liên quan</p>';
        return;
    }
    
    container.innerHTML = related.map(product => `
        <div class="related-card" onclick="location.href='detail.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}">
            <div class="related-card-info">
                <h4>${product.name}</h4>
                <div class="price">${product.price.toLocaleString('vi-VN')}đ</div>
            </div>
        </div>
    `).join('');
}

// ========== RENDER CHI TIẾT SẢN PHẨM ==========
function renderProductDetail() {
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.getElementById('productDetail').innerHTML = `
            <div style="text-align:center; padding:80px 20px; background:white; border-radius:20px;">
                <i class="fas fa-exclamation-triangle" style="font-size:60px; color:#ff4757;"></i>
                <h2 style="margin:20px 0; color:#2c1810;">Không tìm thấy sản phẩm!</h2>
                <p style="margin-bottom:30px; color:#666;">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <a href="index.html" style="background:linear-gradient(45deg,#d4a373,#b7791f); color:white; padding:12px 30px; border-radius:40px; text-decoration:none;">Quay lại trang chủ</a>
            </div>
        `;
        return;
    }
    
    // Cập nhật breadcrumb
    document.getElementById('breadcrumb-category').innerHTML = product.categoryName;
    document.getElementById('breadcrumb-name').innerHTML = product.name;
    document.title = `${product.name} - PhoneStore`;
    
    const discountPercent = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    
    // Tạo HTML specs
    let specsHtml = '';
    for (const [key, value] of Object.entries(product.specs)) {
        specsHtml += `<li><span class="spec-label">${key}:</span><span class="spec-value">${value}</span></li>`;
    }
    
    // Tạo sao đánh giá
    const fullStars = Math.floor(product.rating);
    const emptyStars = 5 - fullStars;
    const starsHtml = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    
    const html = `
        <div class="detail-layout">
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            </div>
            <div class="product-info-detail">
                <h1>${product.name}</h1>
                <div class="product-rating">
                    <div class="stars">${starsHtml}</div>
                    <span class="review-count">(${product.reviewCount} đánh giá)</span>
                </div>
                <div class="price-box">
                    <span class="current-price">${product.price.toLocaleString('vi-VN')}đ</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString('vi-VN')}đ</span>` : ''}
                    ${discountPercent > 0 ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
                </div>
                <div class="product-description">
                    <h3>Mô tả sản phẩm</h3>
                    <p>${product.desc}</p>
                </div>
                <div class="product-description">
                    <h3>Thông số kỹ thuật</h3>
                    <ul class="specs-list">
                        ${specsHtml}
                    </ul>
                </div>
                <div class="quantity-selector">
                    <label>Số lượng:</label>
                    <div class="quantity-control">
                        <button onclick="decreaseQuantity()">-</button>
                        <span id="quantityValue">1</span>
                        <button onclick="increaseQuantity()">+</button>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-add-cart" onclick="addToCart(${product.id}, getQuantity())">
                        <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                    </button>
                    <button class="btn-buy-now" onclick="buyNow(${product.id}, getQuantity())">
                        <i class="fas fa-bolt"></i> Mua ngay
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('productDetail').innerHTML = html;
    renderRelatedProducts(product);
}

// ========== TÌM KIẾM ==========
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                localStorage.setItem('searchKeyword', keyword);
                window.location.href = 'index.html';
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const keyword = e.target.value.trim();
                if (keyword) {
                    localStorage.setItem('searchKeyword', keyword);
                    window.location.href = 'index.html';
                }
            }
        });
    }
}

// ========== KHỞI TẠO ==========
document.addEventListener('DOMContentLoaded', () => {
    renderProductDetail();
    updateCartCount();
    setupSearch();
});