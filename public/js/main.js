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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let currentBrand = "all";
let currentCategory = "all";

document.addEventListener("DOMContentLoaded", () => {
    setupBrandFilters();
    setupCategoryFilters();
    setupSearch();
    updateCartCount();
    setupBackToTop();
    subscribeProducts();
    
    const profileLinks = document.querySelectorAll('a[href="profile.html"], #profileLink');
    profileLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            if (!isLoggedIn()) {
                e.preventDefault();
                window.location.href = "signin.html";
            }
        });
    });
});

function subscribeProducts() {
    onSnapshot(collection(db, "products"), (snapshot) => {
        products = snapshot.docs.map((doc) => {
            const data = doc.data() || {};

            return {
                id: doc.id,
                name: data.name || "Sản phẩm chưa có tên",
                price: Number(data.price) || 0,
                brand: data.brand || "",
                category: data.category || "",
                image: resolveImageUrl(data.image),
                isNew: Boolean(data.isNew),
                isSale: Boolean(data.isSale),
                discount: Number(data.discount) || 0,
                rating: Number(data.rating) || 4.5,
                updatedAt: getProductActivityValue(data)
            };
        });

        renderFilteredProducts();
    }, (error) => {
        console.error("Không thể đọc sản phẩm từ Firebase:", error);
        showStatusMessage("new-products", "Không thể tải dữ liệu sản phẩm.");
        showStatusMessage("sale-products", "Không thể tải dữ liệu sản phẩm.");
        showStatusMessage("all-products", "Không thể tải dữ liệu sản phẩm.");
    });
}

function getProductActivityValue(data) {
    const updatedAtMs = Number(data?.updatedAtMs) || 0;
    const updatedAt = typeof data?.updatedAt?.toMillis === "function"
        ? data.updatedAt.toMillis()
        : 0;
    const createdAtMs = Number(data?.createdAtMs) || 0;
    const createdAt = typeof data?.createdAt?.toMillis === "function"
        ? data.createdAt.toMillis()
        : 0;

    return Math.max(updatedAtMs, updatedAt, createdAtMs, createdAt);
}

function resolveImageUrl(imagePath) {
    if (!imagePath) return "https://placehold.co/300x200?text=No+Image";

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

function getSortedProducts(productList) {
    return [...productList].sort((a, b) => {
        if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
        return String(b.id).localeCompare(String(a.id));
    });
}

function getFilteredProducts() {
    let filtered = getSortedProducts(products);

    if (currentBrand !== "all") {
        filtered = filtered.filter((product) => product.brand === currentBrand);
    }

    if (currentCategory !== "all") {
        filtered = filtered.filter((product) => product.category === currentCategory);
    }

    return filtered;
}

function renderFilteredProducts() {
    const filteredProducts = getFilteredProducts();
    const newestProducts = filteredProducts.slice(0, 8);
    const saleProducts = filteredProducts.filter((product) => product.isSale || product.discount > 0).slice(0, 8);

    renderProducts("new-products", newestProducts, 8);
    renderProducts("sale-products", saleProducts, 8);
    renderProducts("all-products", filteredProducts, 12);
}

function renderProducts(containerId, productList, limit = 8) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const displayProducts = productList.slice(0, limit);

    if (displayProducts.length === 0) {
        showStatusMessage(containerId, "Không có sản phẩm");
        return;
    }

    container.innerHTML = displayProducts.map((product) => createProductCard(product)).join("");
}

function showStatusMessage(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 40px;">${message}</div>`;
}

function createProductCard(product) {
    const discountedPrice = product.discount > 0
        ? product.price * (100 - product.discount) / 100
        : product.price;

    let badgeHtml = "";
    if (product.updatedAt > 0 || product.isNew) badgeHtml += '<span class="badge-new">Mới</span>';
    if (product.isSale || product.discount > 0) {
        badgeHtml += `<span class="badge-sale">-${product.discount || 10}%</span>`;
    }

    return `
        <div class="product-card" data-id="${product.id}" onclick="window.goToProductDetail('${String(product.id).replace(/'/g, "\\'")}')" style="cursor: pointer;">
            <div class="product-badge">${badgeHtml}</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x200?text=No+Image'">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand || ""}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(discountedPrice)}</span>
                    ${product.discount > 0 ? `<span class="old-price">${formatPrice(product.price)}</span>` : ""}
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="event.stopPropagation(); window.addToCart('${String(product.id).replace(/'/g, "\\'")}')">
                        <i class="fas fa-shopping-cart"></i> Thêm giỏ
                    </button>
                    <button class="btn-buy-now" onclick="event.stopPropagation(); window.buyNow('${String(product.id).replace(/'/g, "\\'")}')">
                        <i class="fas fa-bolt"></i> Mua hàng
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupBrandFilters() {
    const brandBtns = document.querySelectorAll(".brand-btn");

    brandBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            brandBtns.forEach((item) => item.classList.remove("active"));
            this.classList.add("active");
            currentBrand = this.getAttribute("data-brand");
            renderFilteredProducts();
            document.querySelector(".filter-bar")?.scrollIntoView({ behavior: "smooth" });
        });
    });
}

function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll("#category-tabs .category-btn");

    categoryBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            categoryBtns.forEach((item) => item.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.getAttribute("data-category");
            renderFilteredProducts();
        });
    });
}

function setupBackToTop() {
    const backToTopBtn = document.getElementById("backToTop");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) backToTopBtn.classList.add("show");
        else backToTopBtn.classList.remove("show");
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function setupSearch() {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    const search = () => {
        if (!input) return;

        const keyword = input.value.trim();
        if (!keyword) return;

        localStorage.setItem("searchKeyword", keyword);
        window.location.href = "products.html";
    };

    if (btn) btn.addEventListener("click", search);
    if (input) input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") search();
    });
}

function isLoggedIn() {
    return localStorage.getItem("currentUser") !== null;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function addToCart(productId) {
    if (!isLoggedIn()) {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        const confirmLogin = confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ. Đăng nhập ngay?");
        if (confirmLogin) window.location.href = "signin.html";
        return;
    }

    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return;

    const userId = getCurrentUser().id;
    const cartKey = "cart_" + userId;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existing = cart.find((item) => String(item.id) === String(productId));

    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();

    const btn = event?.target?.closest(".btn-cart");
    if (btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
        }, 1500);
    }
}

function addToWishlist() {
    if (!isLoggedIn()) {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        const confirmLogin = confirm("Bạn cần đăng nhập để thêm vào yêu thích. Đăng nhập ngay?");
        if (confirmLogin) window.location.href = "signin.html";
        return;
    }

    alert("❤️ Đã thêm vào danh sách yêu thích!");
}

function updateCartCount() {
    const cartSpan = document.querySelector(".cart-count");
    if (!cartSpan) return;

    if (!isLoggedIn()) {
        cartSpan.textContent = "0";
        return;
    }

    const cart = JSON.parse(localStorage.getItem(getCartStorageKey()) || "[]");
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartSpan.textContent = count;
}

function formatPrice(price) {
    return price?.toLocaleString("vi-VN") + "₫" || "0₫";
}

window.goToProductDetail = function (productId) {
    window.location.href = `detail.html?id=${encodeURIComponent(productId)}`;
};

window.buyNow = function (productId) {
    if (!isLoggedIn()) {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        const confirmLogin = confirm("Bạn cần đăng nhập để mua hàng. Đăng nhập ngay?");
        if (confirmLogin) window.location.href = "signin.html";
        return;
    }

    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return;

    const userId = getCurrentUser().id;
    const cartKey = "cart_" + userId;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existing = cart.find((item) => String(item.id) === String(productId));

    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
    
    // Redirect to cart after a short delay
    setTimeout(() => {
        window.location.href = "cart.html";
    }, 500);
};

function getCartStorageKey() {
    const currentUser = getCurrentUser();
    return currentUser?.id ? `cart_${currentUser.id}` : "cart";
}

function getSharedCart() {
    return JSON.parse(localStorage.getItem(getCartStorageKey()) || "[]");
}

function saveSharedCart(cart) {
    localStorage.setItem(getCartStorageKey(), JSON.stringify(cart));
}

function showCartAddedModal(productName, quantity = 1) {
    const existingModal = document.querySelector(".custom-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "custom-modal";
    modal.innerHTML = `
        <div class="custom-modal-content success">
            <i class="fas fa-check-circle"></i>
            <p>Đã thêm ${quantity} sản phẩm vào giỏ hàng${productName ? `: ${productName}` : ""}</p>
            <button class="modal-close-btn">Đóng</button>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("show"), 10);

    modal.querySelector(".modal-close-btn").onclick = () => {
        modal.classList.remove("show");
        setTimeout(() => modal.remove(), 300);
    };
}

window.addToCart = function (productId) {
    if (!isLoggedIn()) {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        const confirmLogin = confirm("Báº¡n cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ thÃªm sáº£n pháº©m vÃ o giá». ÄÄƒng nháº­p ngay?");
        if (confirmLogin) window.location.href = "signin.html";
        return;
    }

    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return;

    const cart = getSharedCart();
    const existing = cart.find((item) => String(item.id) === String(productId));
    const currentPrice = product.discount > 0
        ? Math.round(product.price * (100 - product.discount) / 100)
        : product.price;

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: currentPrice,
            originalPrice: product.price,
            discount: product.discount || 0,
            quantity: 1
        });
    }

    saveSharedCart(cart);
    updateCartCount();
    showCartAddedModal(product.name, 1);
};
