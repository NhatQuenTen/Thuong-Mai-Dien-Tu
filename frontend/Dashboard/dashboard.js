// ============================================
// MobiStore Dashboard - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!checkAuth()) return;

    initUserDisplay();
    initDateDisplay();
    initKPICounters();
    initRevenueChart();
    initCategoryChart();
    initEventListeners();
});

// ============================================
// AUTHENTICATION
// ============================================
function checkAuth() {
    const auth = localStorage.getItem('mobistore_auth') || sessionStorage.getItem('mobistore_auth');
    if (!auth) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function getAuthData() {
    const raw = localStorage.getItem('mobistore_auth') || sessionStorage.getItem('mobistore_auth');
    try { return JSON.parse(raw); } catch { return null; }
}

function logout() {
    localStorage.removeItem('mobistore_auth');
    sessionStorage.removeItem('mobistore_auth');
    window.location.href = 'login.html';
}

function initUserDisplay() {
    const auth = getAuthData();
    if (!auth) return;

    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');
    if (userName) {
        const displayName = auth.user.includes('@')
            ? auth.user.split('@')[0].charAt(0).toUpperCase() + auth.user.split('@')[0].slice(1)
            : auth.user.charAt(0).toUpperCase() + auth.user.slice(1);
        userName.textContent = displayName;
    }
    if (userRole) userRole.textContent = 'Quản trị viên';
}

// ============================================
// DATE DISPLAY
// ============================================
function initDateDisplay() {
    const dateEl = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('vi-VN', options);
}

// ============================================
// KPI ANIMATED COUNTERS
// ============================================
function initKPICounters() {
    const counters = [
        { el: document.getElementById('totalRevenue'), target: 2.85, suffix: ' tỷ', decimals: 2, duration: 2000 },
        { el: document.getElementById('totalOrders'), target: 0, suffix: '', decimals: 0, duration: 2000 },
        { el: document.getElementById('newCustomers'), target: 0, suffix: '', decimals: 0, duration: 2000 },
        { el: document.getElementById('conversionRate'), target: 0, suffix: '%', decimals: 1, duration: 2000 },
    ];

    counters.forEach(counter => {
        animateCounter(counter.el, 0, counter.target, counter.duration, counter.suffix, counter.decimals);
    });
}

function animateCounter(el, start, end, duration, suffix, decimals) {
    const startTimestamp = performance.now();

    function update(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = start + (end - start) * eased;

        if (decimals === 0) {
            el.textContent = Math.floor(current).toLocaleString('vi-VN') + suffix;
        } else {
            el.textContent = current.toFixed(decimals) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// ============================================
// REVENUE CHART
// ============================================
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');

    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const revenueData = Array(12).fill(0);
    const orderData = Array(12).fill(0);

    // Gradient for revenue
    const revenueGradient = ctx.createLinearGradient(0, 0, 0, 300);
    revenueGradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)');
    revenueGradient.addColorStop(1, 'rgba(124, 58, 237, 0.01)');

    // Gradient for orders
    const orderGradient = ctx.createLinearGradient(0, 0, 0, 300);
    orderGradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
    orderGradient.addColorStop(1, 'rgba(6, 182, 212, 0.01)');

    window.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Doanh thu (triệu đ)',
                    data: revenueData,
                    borderColor: '#7c3aed',
                    backgroundColor: revenueGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#7c3aed',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'Đơn hàng',
                    data: orderData,
                    borderColor: '#06b6d4',
                    backgroundColor: orderGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#06b6d4',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 11, weight: '500' },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 31, 53, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(124, 58, 237, 0.3)',
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 10,
                    titleFont: { family: 'Inter', size: 13, weight: '700' },
                    bodyFont: { family: 'Inter', size: 12 },
                    displayColors: true,
                    callbacks: {
                        title: (items) => `Tháng ${items[0].label}`,
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.06)',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#64748b',
                        font: { family: 'Inter', size: 11, weight: '500' }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.06)',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#64748b',
                        font: { family: 'Inter', size: 11, weight: '500' },
                        padding: 8,
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// ============================================
// CATEGORY CHART (DOUGHNUT)
// ============================================
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    const categories = [];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories.map(c => c.label),
            datasets: [{
                data: categories.map(c => c.value),
                backgroundColor: categories.map(c => c.color),
                borderWidth: 0,
                hoverOffset: 8,
                spacing: 3,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 31, 53, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(124, 58, 237, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    titleFont: { family: 'Inter', size: 13, weight: '700' },
                    bodyFont: { family: 'Inter', size: 12 },
                    callbacks: {
                        label: (context) => ` ${context.parsed}%`
                    }
                }
            }
        }
    });

    // Populate legend
    const legendContainer = document.getElementById('categoryLegend');
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class="legend-left">
                <span class="legend-color" style="background: ${cat.color}"></span>
                <span class="legend-label">${cat.label}</span>
            </div>
            <span class="legend-value">${cat.value}%</span>
        `;
        legendContainer.appendChild(item);
    });
}

// ============================================
// NEW ORDERS
// ============================================
function populateOrders() {
    const orders = [
        {
            id: 'DH-20261',
            customer: 'Trần Văn Minh',
            product: 'iPhone 16 Pro Max 256GB',
            amount: '34.990.000đ',
            time: '3 phút trước',
            status: 'new',
            statusText: 'Mới',
            gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)'
        },
        {
            id: 'DH-20260',
            customer: 'Nguyễn Thị Hương',
            product: 'Samsung Galaxy S25 Ultra',
            amount: '33.990.000đ',
            time: '8 phút trước',
            status: 'new',
            statusText: 'Mới',
            gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)'
        },
        {
            id: 'DH-20259',
            customer: 'Lê Hoàng Nam',
            product: 'MacBook Air M4 15"',
            amount: '32.490.000đ',
            time: '15 phút trước',
            status: 'processing',
            statusText: 'Xử lý',
            gradient: 'linear-gradient(135deg, #10b981, #34d399)'
        },
        {
            id: 'DH-20258',
            customer: 'Phạm Thùy Linh',
            product: 'iPad Pro M4 11" 256GB',
            amount: '28.990.000đ',
            time: '22 phút trước',
            status: 'confirmed',
            statusText: 'Xác nhận',
            gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
        },
        {
            id: 'DH-20257',
            customer: 'Vũ Đức Thịnh',
            product: 'AirPods Pro 3',
            amount: '6.990.000đ',
            time: '35 phút trước',
            status: 'processing',
            statusText: 'Xử lý',
            gradient: 'linear-gradient(135deg, #ec4899, #f472b6)'
        },
        {
            id: 'DH-20256',
            customer: 'Đặng Minh Tuấn',
            product: 'Xiaomi 15 Ultra',
            amount: '23.990.000đ',
            time: '1 giờ trước',
            status: 'new',
            statusText: 'Mới',
            gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
        }
    ];

    const container = document.getElementById('ordersList');
    orders.forEach((order, index) => {
        const initials = order.customer.split(' ').pop().charAt(0);
        const item = document.createElement('div');
        item.className = 'order-item';
        item.style.animationDelay = `${index * 0.1}s`;
        item.innerHTML = `
            <div class="order-avatar" style="background: ${order.gradient}">${initials}</div>
            <div class="order-details">
                <div class="order-customer">${order.customer}</div>
                <div class="order-product">${order.product}</div>
            </div>
            <div class="order-meta">
                <span class="order-amount">${order.amount}</span>
                <span class="order-status status-${order.status}">${order.statusText}</span>
                <span class="order-time">${order.time}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

// ============================================
// TOP PRODUCTS
// ============================================
function populateTopProducts() {
    const products = [
        { name: 'iPhone 16 Pro Max', sold: 342, revenue: '11.9 tỷ' },
        { name: 'Samsung Galaxy S25 Ultra', sold: 287, revenue: '9.7 tỷ' },
        { name: 'Xiaomi 15 Ultra', sold: 198, revenue: '4.7 tỷ' },
        { name: 'iPad Pro M4', sold: 156, revenue: '4.5 tỷ' },
        { name: 'MacBook Air M4', sold: 134, revenue: '4.3 tỷ' },
        { name: 'AirPods Pro 3', sold: 423, revenue: '2.9 tỷ' }
    ];

    const container = document.getElementById('productsList');
    products.forEach((product, index) => {
        const rank = index + 1;
        let rankClass = 'rank-default';
        if (rank === 1) rankClass = 'rank-1';
        else if (rank === 2) rankClass = 'rank-2';
        else if (rank === 3) rankClass = 'rank-3';

        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-rank ${rankClass}">${rank}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-sold">Đã bán: ${product.sold} sản phẩm</div>
            </div>
            <span class="product-revenue">${product.revenue}</span>
        `;
        container.appendChild(item);
    });
}

// ============================================
// ACTIVITY TIMELINE
// ============================================
function populateActivityTimeline() {
    const activities = [
        {
            text: '<strong>Trần Văn Minh</strong> đặt mua iPhone 16 Pro Max',
            time: '3 phút trước',
            dot: 'dot-success'
        },
        {
            text: '<strong>Hệ thống</strong> cập nhật tồn kho Samsung Galaxy S25',
            time: '15 phút trước',
            dot: 'dot-info'
        },
        {
            text: '<strong>Cảnh báo:</strong> Sắp hết hàng AirPods Pro 3 (còn 5)',
            time: '28 phút trước',
            dot: 'dot-warning'
        },
        {
            text: '<strong>Khuyến mãi</strong> "Giảm 20% phụ kiện" đã kích hoạt',
            time: '45 phút trước',
            dot: 'dot-purple'
        },
        {
            text: '<strong>Đơn hàng DH-20250</strong> bị hủy bởi khách hàng',
            time: '1 giờ trước',
            dot: 'dot-danger'
        },
        {
            text: '<strong>Nguyễn Admin</strong> cập nhật giá 3 sản phẩm',
            time: '2 giờ trước',
            dot: 'dot-info'
        },
        {
            text: '<strong>Đánh giá mới:</strong> Galaxy S25 Ultra - 5 sao',
            time: '3 giờ trước',
            dot: 'dot-success'
        }
    ];

    const container = document.getElementById('activityTimeline');
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-dot ${activity.dot}"></div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ============================================
// NOTIFICATIONS
// ============================================
function populateNotifications() {
    const notifications = [
        {
            icon: 'fas fa-shopping-cart',
            iconClass: 'notif-order',
            title: 'Đơn hàng mới #DH-20261',
            desc: 'Trần Văn Minh vừa đặt mua iPhone 16 Pro Max - 34.990.000đ',
            time: '3 phút trước',
            unread: true
        },
        {
            icon: 'fas fa-shopping-cart',
            iconClass: 'notif-order',
            title: 'Đơn hàng mới #DH-20260',
            desc: 'Nguyễn Thị Hương đặt mua Samsung Galaxy S25 Ultra',
            time: '8 phút trước',
            unread: true
        },
        {
            icon: 'fas fa-exclamation-triangle',
            iconClass: 'notif-stock',
            title: 'Cảnh báo tồn kho',
            desc: 'AirPods Pro 3 chỉ còn 5 sản phẩm trong kho',
            time: '28 phút trước',
            unread: true
        },
        {
            icon: 'fas fa-check-circle',
            iconClass: 'notif-success',
            title: 'Giao hàng thành công',
            desc: 'Đơn hàng #DH-20245 đã giao đến Lê Minh Tuấn',
            time: '1 giờ trước',
            unread: false
        },
        {
            icon: 'fas fa-times-circle',
            iconClass: 'notif-alert',
            title: 'Đơn hàng bị hủy',
            desc: 'Đơn hàng #DH-20250 đã bị hủy bởi khách hàng',
            time: '1 giờ trước',
            unread: false
        },
        {
            icon: 'fas fa-star',
            iconClass: 'notif-success',
            title: 'Đánh giá mới',
            desc: 'Khách hàng đánh giá 5 sao cho Galaxy S25 Ultra',
            time: '3 giờ trước',
            unread: false
        }
    ];

    const container = document.getElementById('notificationList');
    notifications.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notification-item ${notif.unread ? 'unread' : ''}`;
        item.innerHTML = `
            <div class="notification-icon ${notif.iconClass}">
                <i class="${notif.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notif.title}</div>
                <div class="notification-desc">${notif.desc}</div>
                <div class="notification-time">${notif.time}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    // Notification panel toggle
    const notifBtn = document.getElementById('notificationBtn');
    const notifPanel = document.getElementById('notificationPanel');
    const overlay = document.getElementById('overlay');

    notifBtn.addEventListener('click', () => {
        notifPanel.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        notifPanel.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Mark all read
    document.getElementById('markAllRead').addEventListener('click', () => {
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        const dot = notifBtn.querySelector('.notification-dot');
        if (dot) dot.style.display = 'none';
    });

    // Chart filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateChartData(btn.dataset.period);
        });
    });

    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Mobile sidebar toggle
    const topbarLeft = document.querySelector('.topbar-left');
    if (topbarLeft) {
        topbarLeft.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                document.getElementById('sidebar').classList.toggle('open');
                overlay.classList.toggle('active');
            }
        });
    }
}

// ============================================
// UPDATE CHART DATA
// ============================================
function updateChartData(period) {
    const chart = window.revenueChart;
    if (!chart) return;

    let labels, revenueData, orderData;

    switch (period) {
        case 'weekly':
            labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
            revenueData = [95, 120, 110, 125];
            orderData = [62, 78, 71, 82];
            break;
        case 'daily':
            labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
            revenueData = [28, 35, 42, 38, 45, 55, 32];
            orderData = [18, 22, 28, 25, 30, 36, 21];
            break;
        default: // monthly
            labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            revenueData = [180, 220, 195, 310, 280, 350, 410, 380, 420, 390, 450, 480];
            orderData = [120, 150, 130, 210, 190, 240, 280, 260, 300, 270, 320, 340];
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = revenueData;
    chart.data.datasets[1].data = orderData;
    chart.update('active');
}

// ============================================
// LIVE NOTIFICATION TOASTS
// ============================================
function startLiveNotifications() {
    return;
}

