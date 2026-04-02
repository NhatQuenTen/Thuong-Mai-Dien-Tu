// ========== LẤY DỮ LIỆU TỪ LOCALSTORAGE ==========
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
}

// Danh sách sản phẩm mẫu
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 29990000, image: "https://picsum.photos/id/1/200/200", category: "phone" },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 27990000, image: "https://picsum.photos/id/2/200/200", category: "phone" },
    { id: 3, name: "iPad Pro 11\"", price: 19990000, image: "https://picsum.photos/id/3/200/200", category: "tablet" },
    { id: 4, name: "MacBook Air M2", price: 28990000, image: "https://picsum.photos/id/4/200/200", category: "laptop" },
    { id: 5, name: "AirPods Pro 2", price: 4990000, image: "https://picsum.photos/id/5/200/200", category: "headphone" },
    { id: 6, name: "Apple Watch Series 9", price: 9990000, image: "https://picsum.photos/id/8/200/200", category: "watch" }
];

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) cartCountElem.innerText = total;
}

function updateQuantity(productId, delta) {
    let cart = getCart();
    const itemIndex = cart.findIndex(i => i.id === productId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart(cart);
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

let discountPercent = 0;

// ========== HIỂN THỊ THÔNG BÁO GIỮA MÀN HÌNH (MODAL) ==========
function showModal(message, isSuccess = true) {
    // Xóa modal cũ nếu có
    const oldModal = document.querySelector('.custom-modal');
    if (oldModal) oldModal.remove();
    
    // Tạo modal mới
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
    
    // Hiệu ứng hiện ra
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Đóng modal khi bấm nút
    modal.querySelector('.modal-close-btn').onclick = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };
    
    // Tự động đóng sau 2.5 giây
    setTimeout(() => {
        if (modal.parentNode) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }, 2500);
}

// ========== ÁP DỤNG MÃ GIẢM GIÁ (CÓ MODAL) ==========
function applyVoucher() {
    const code = document.getElementById('voucherCode')?.value;
    if (code === 'PHONE10') {
        discountPercent = 10;
        showModal('🎉 Áp dụng mã PHONE10 thành công! Giảm 10%', true);
    } else if (code === 'SALE20') {
        discountPercent = 20;
        showModal('🎉 Áp dụng mã SALE20 thành công! Giảm 20%', true);
    } else if (code === '') {
        discountPercent = 0;
        showModal('Đã xóa mã giảm giá', true);
    } else {
        showModal('❌ Mã giảm giá không hợp lệ! Thử với PHONE10 hoặc SALE20', false);
    }
    renderCartPage();
}

// ========== THANH TOÁN - CHUYỂN SANG TRANG CHECKOUT ==========
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showModal('⚠️ Giỏ hàng của bạn đang trống!', false);
        return;
    }
    
    // Lưu thông tin đơn hàng tạm thời để trang checkout lấy
    const orderInfo = {
        items: cart,
        subtotal: calculateSubtotal(),
        discount: discountPercent,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('checkoutOrder', JSON.stringify(orderInfo));
    
    // Chuyển sang trang thanh toán
    window.location.href = 'checkout.html';
}

// Tính tạm tính
function calculateSubtotal() {
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            subtotal += product.price * (item.quantity || 1);
        }
    });
    return subtotal;
}

// ========== RENDER TRANG GIỎ HÀNG ==========
function renderCartPage() {
    const container = document.getElementById('cartContainer');
    if (!container) {
        console.error('Không tìm thấy thẻ #cartContainer');
        return;
    }

    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Giỏ hàng trống</h3>
                <p>Hãy thêm sản phẩm từ trang chủ</p>
                <a href="index.html" class="shop-now-btn">Mua ngay</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    let html = `
        <div class="cart-layout">
            <div class="cart-items-section">
                <table class="cart-table">
                    <thead>
                        <tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr>
                    </thead>
                    <tbody>
    `;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const qty = item.quantity || 1;
        const total = product.price * qty;
        subtotal += total;

        html += `
            <tr>
                <td>
                    <div class="cart-product">
                        <div class="cart-product-img"><img src="${product.image}"></div>
                        <div class="cart-product-info"><h4>${product.name}</h4></div>
                    </div>
                </td>
                <td class="cart-price">${formatPrice(product.price)}</td>
                <td>
                    <div class="cart-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${qty}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td class="cart-total-item">${formatPrice(total)}</td>
                <td><button class="cart-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
    });

    const discount = subtotal * discountPercent / 100;
    const shipping = subtotal > 500000 ? 0 : 30000;
    const finalTotal = subtotal - discount + shipping;

    html += `
                    </tbody>
                </table>
            </div>
            <div class="cart-summary">
                <h3>Đơn hàng</h3>
                <div class="summary-row"><span>Tạm tính:</span><span>${formatPrice(subtotal)}</span></div>
                <div class="summary-row"><span>Giảm giá:</span><span style="color:#ff4757">-${formatPrice(discount)}</span></div>
                <div class="summary-row"><span>Phí ship:</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div class="voucher-input">
                    <input type="text" id="voucherCode" placeholder="Mã: PHONE10 hoặc SALE20">
                    <button onclick="applyVoucher()">Áp dụng</button>
                </div>
                <div class="summary-row total"><span>Tổng cộng:</span><span>${formatPrice(finalTotal)}</span></div>
                <button class="checkout-btn" onclick="checkout()">Thanh toán </button>
                <a href="index.html" class="continue-shopping">← Tiếp tục mua sắm</a>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn) {
        searchBtn.onclick = () => {
            const keyword = searchInput.value;
            if (keyword) localStorage.setItem('searchKeyword', keyword);
            window.location.href = 'index.html';
        };
    }
}

// Chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
    updateCartCount();
    setupSearch();
});