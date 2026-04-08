import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { collection, getFirestore, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzQyH_VLOeuO8Q0bvuFVZ2uPPP9uShR6c",
    authDomain: "myteamproject-36c2f.firebaseapp.com",
    projectId: "myteamproject-36c2f",
    storageBucket: "myteamproject-36c2f.firebasestorage.app",
    messagingSenderId: "790145988623",
    appId: "1:790145988623:web:112b090cd32a4c28dd4b7a"
};

const CATEGORY_NAME_MAP = {
    phone: "Điện thoại",
    headphone: "Tai nghe",
    charger: "Sạc",
    tablet: "Máy tính bảng",
    laptop: "Laptop",
    watch: "Đồng hồ thông minh",
    speaker: "Loa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let currentProduct = null;

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function resolveImageUrl(imagePath) {
    if (!imagePath) return "https://placehold.co/400x400?text=No+Image";

    const normalizedPath = String(imagePath).replace(/\\/g, "/").trim();

    if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
        return normalizedPath;
    }

    if (normalizedPath.startsWith("./") || normalizedPath.startsWith("../")) {
        return normalizedPath;
    }

    if (normalizedPath.startsWith("assets/images/")) {
        return normalizedPath;
    }

    return `assets/images/${normalizedPath.split("/").pop()}`;
}

function getProductCreatedAtValue(data) {
    const createdAtMs = Number(data?.createdAtMs) || 0;
    const createdAt = typeof data?.createdAt?.toMillis === "function"
        ? data.createdAt.toMillis()
        : 0;

    return Math.max(createdAtMs, createdAt);
}

function getOldPrice(price, oldPrice, discount) {
    const normalizedOldPrice = Number(oldPrice) || 0;
    if (normalizedOldPrice > 0) return normalizedOldPrice;

    const normalizedPrice = Number(price) || 0;
    const normalizedDiscount = Number(discount) || 0;
    if (!normalizedPrice || normalizedDiscount <= 0 || normalizedDiscount >= 100) return 0;

    return Math.round(normalizedPrice / (1 - normalizedDiscount / 100));
}

function mapProduct(doc) {
    const data = doc.data() || {};
    const price = Number(data.price) || 0;
    const discount = Number(data.discount) || 0;

    return {
        id: doc.id,
        name: data.name || "Sản phẩm chưa có tên",
        brand: data.brand || "",
        category: data.category || "phone",
        categoryName: data.categoryName || CATEGORY_NAME_MAP[data.category] || data.category || "Sản phẩm",
        price,
        oldPrice: getOldPrice(price, data.oldPrice, discount),
        discount,
        image: resolveImageUrl(data.image),
        desc: data.desc || "Sản phẩm đang được cập nhật mô tả.",
        specs: data.specs && typeof data.specs === "object" ? data.specs : {},
        rating: Number(data.rating) || 4.5,
        reviewCount: Number(data.reviewCount) || 0,
        createdAt: getProductCreatedAtValue(data)
    };
}

function showModal(message, isSuccess = true) {
    const oldModal = document.querySelector(".custom-modal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.className = "custom-modal";
    modal.innerHTML = `
        <div class="custom-modal-content ${isSuccess ? "success" : "error"}">
            <i class="fas ${isSuccess ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <p>${message}</p>
            <button class="modal-close-btn">Đóng</button>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("show"), 10);

    modal.querySelector(".modal-close-btn").onclick = () => {
        modal.classList.remove("show");
        setTimeout(() => modal.remove(), 300);
    };

    setTimeout(() => {
        if (modal.parentNode) {
            modal.classList.remove("show");
            setTimeout(() => modal.remove(), 300);
        }
    }, 2500);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById("cartCount");
    if (cartCountElem) cartCountElem.innerText = total;
}

function getQuantity() {
    const quantityElem = document.getElementById("quantityValue");
    return quantityElem ? parseInt(quantityElem.innerText, 10) : 1;
}

function decreaseQuantity() {
    const quantityElem = document.getElementById("quantityValue");
    if (!quantityElem) return;

    const value = parseInt(quantityElem.innerText, 10) || 1;
    if (value > 1) quantityElem.innerText = value - 1;
}

function increaseQuantity() {
    const quantityElem = document.getElementById("quantityValue");
    if (!quantityElem) return;

    const value = parseInt(quantityElem.innerText, 10) || 1;
    quantityElem.innerText = value + 1;
}

function addToCart(productId, quantity = 1) {
    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => String(item.id) === String(productId));

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showModal(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, true);
}

function buyNow(productId, quantity) {
    addToCart(productId, quantity);
    setTimeout(() => {
        window.location.href = "cart.html";
    }, 900);
}

function formatPrice(price) {
    return `${(Number(price) || 0).toLocaleString("vi-VN")}₫`;
}

function renderRelatedProducts(product) {
    const related = [...products]
        .filter((item) => item.category === product.category && item.id !== product.id)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 4);

    const container = document.getElementById("related-products");
    if (!container) return;

    if (related.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:40px;">Không có sản phẩm liên quan</p>';
        return;
    }

    container.innerHTML = related.map((item) => `
        <div class="related-card" onclick="location.href='detail.html?id=${item.id}'">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/300x300?text=No+Image'">
            <div class="related-card-info">
                <h4>${item.name}</h4>
                <div class="price">${formatPrice(item.price)}</div>
            </div>
        </div>
    `).join("");
}

function renderProductDetail(product) {
    currentProduct = product;
    const container = document.getElementById("productDetail");
    if (!container) return;

    document.getElementById("breadcrumb-category").textContent = product.categoryName;
    document.getElementById("breadcrumb-name").textContent = product.name;
    document.title = `${product.name} - PhoneStore`;

    const discountPercent = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    const specsEntries = Object.entries(product.specs || {});
    const specsHtml = specsEntries.length
        ? specsEntries.map(([key, value]) => `<li><span class="spec-label">${key}:</span><span class="spec-value">${value}</span></li>`).join("")
        : '<li><span class="spec-value">Đang cập nhật thông số kỹ thuật</span></li>';

    const fullStars = Math.max(0, Math.min(5, Math.floor(product.rating)));
    const emptyStars = 5 - fullStars;
    const starsHtml = "★".repeat(fullStars) + "☆".repeat(emptyStars);

    container.innerHTML = `
        <div class="detail-layout">
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/500x500?text=No+Image'">
                </div>
            </div>
            <div class="product-info-detail">
                <h1>${product.name}</h1>
                <div class="product-rating">
                    <div class="stars">${starsHtml}</div>
                    <span class="review-count">(${product.reviewCount} đánh giá)</span>
                </div>
                <div class="price-box">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
                    ${discountPercent > 0 ? `<span class="discount-badge">-${discountPercent}%</span>` : ""}
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
                    <button class="btn-add-cart" onclick="addToCart('${product.id}', getQuantity())">
                        <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                    </button>
                    <button class="btn-buy-now" onclick="buyNow('${product.id}', getQuantity())">
                        <i class="fas fa-bolt"></i> Mua ngay
                    </button>
                </div>
            </div>
        </div>
    `;

    renderRelatedProducts(product);
}

function renderNotFound() {
    const container = document.getElementById("productDetail");
    if (!container) return;

    document.getElementById("breadcrumb-category").textContent = "Không tìm thấy";
    document.getElementById("breadcrumb-name").textContent = "Không tìm thấy sản phẩm";

    container.innerHTML = `
        <div style="text-align:center; padding:80px 20px; background:white; border-radius:20px;">
            <i class="fas fa-exclamation-triangle" style="font-size:60px; color:#ff4757;"></i>
            <h2 style="margin:20px 0; color:#2c1810;">Không tìm thấy sản phẩm!</h2>
            <p style="margin-bottom:30px; color:#666;">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <a href="index.html" style="background:linear-gradient(45deg,#d4a373,#b7791f); color:white; padding:12px 30px; border-radius:40px; text-decoration:none;">Quay lại trang chủ</a>
        </div>
    `;

    const related = document.getElementById("related-products");
    if (related) related.innerHTML = "";
}

function setupSearch() {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const keyword = searchInput.value.trim();
            if (!keyword) return;
            localStorage.setItem("searchKeyword", keyword);
            window.location.href = "index.html";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", (event) => {
            if (event.key !== "Enter") return;
            const keyword = event.target.value.trim();
            if (!keyword) return;
            localStorage.setItem("searchKeyword", keyword);
            window.location.href = "index.html";
        });
    }
}

function subscribeProducts() {
    const productId = getProductIdFromUrl();

    onSnapshot(collection(db, "products"), (snapshot) => {
        products = snapshot.docs.map(mapProduct);
        const product = products.find((item) => String(item.id) === String(productId));

        if (!product) {
            renderNotFound();
            return;
        }

        renderProductDetail(product);
    }, (error) => {
        console.error("Không thể đọc sản phẩm từ Firebase:", error);
        renderNotFound();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    subscribeProducts();
    updateCartCount();
    setupSearch();
});

window.addToCart = addToCart;
window.buyNow = buyNow;
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.getQuantity = getQuantity;
