'use strict';
/* =============================================
   PHONESTORE – ORDER HISTORY  |  order-history.js
   Features: list, filter, search, detail modal
   with timeline, cancel, reorder, review, 
   pagination, toast, cart sync
   ============================================= */

// ─── SAMPLE DATA ────────────────────────────
const SAMPLE_ORDERS = [
    {
        id: 'PS-2026-0041',
        date: '2026-04-03T14:22:00',
        status: 'shipping',
        items: [
            { name: 'iPhone 16 Pro Max 256GB', variant: 'Titan Đen / 256GB', qty: 1, price: 34990000, img: 'https://placehold.co/120x120/fff5e6/b7791f?text=iPhone+16' },
            { name: 'Ốp lưng Apple Silicone', variant: 'Đen', qty: 1, price: 790000, img: 'https://placehold.co/120x120/fff5e6/b7791f?text=Case' },
        ],
        shipping: 0, discount: 500000,
        address: { name: 'Nguyễn Văn A', phone: '0901 234 567', full: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM' },
        payment: { method: 'Chuyển khoản ngân hàng', status: 'Đã thanh toán', bank: 'VCB - 1234 5678 9012' },
        timeline: [
            { step: 'Đặt hàng', time: '03/04/2026 14:22', done: true },
            { step: 'Xác nhận', time: '03/04/2026 14:45', done: true },
            { step: 'Đang đóng gói', time: '03/04/2026 16:00', done: true },
            { step: 'Đang giao', time: '04/04/2026 08:30', done: true, current: true },
            { step: 'Hoàn thành', time: '', done: false },
        ],
        note: 'Giao giờ hành chính, gọi trước 30 phút.',
    },
    {
        id: 'PS-2026-0038',
        date: '2026-03-28T09:15:00',
        status: 'delivered',
        items: [
            { name: 'Samsung Galaxy S25 Ultra 256GB', variant: 'Titanium Gray / 256GB', qty: 1, price: 31990000, img: 'https://placehold.co/120x120/e3f2fd/1565c0?text=Samsung' },
        ],
        shipping: 30000, discount: 0,
        address: { name: 'Nguyễn Văn A', phone: '0901 234 567', full: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM' },
        payment: { method: 'Thẻ tín dụng Visa', status: 'Đã thanh toán', bank: '**** **** **** 4567' },
        timeline: [
            { step: 'Đặt hàng', time: '28/03/2026 09:15', done: true },
            { step: 'Xác nhận', time: '28/03/2026 09:30', done: true },
            { step: 'Đang đóng gói', time: '28/03/2026 11:00', done: true },
            { step: 'Đang giao', time: '29/03/2026 07:20', done: true },
            { step: 'Hoàn thành', time: '29/03/2026 14:15', done: true },
        ],
        note: '',
        reviewed: false,
    },
    {
        id: 'PS-2026-0035',
        date: '2026-03-20T16:44:00',
        status: 'delivered',
        items: [
            { name: 'AirPods Pro 2 (USB-C)', variant: 'Trắng', qty: 1, price: 7490000, img: 'https://placehold.co/120x120/f0ebfa/6f42c1?text=AirPods' },
            { name: 'Apple Watch Series 10 44mm', variant: 'Nhôm Bạc / Sport Band', qty: 1, price: 12990000, img: 'https://placehold.co/120x120/f0ebfa/6f42c1?text=Watch' },
            { name: 'Cáp MagSafe 1m', variant: 'Trắng', qty: 2, price: 890000, img: 'https://placehold.co/120x120/f0ebfa/6f42c1?text=Cable' },
        ],
        shipping: 0, discount: 1000000,
        address: { name: 'Nguyễn Văn A', phone: '0901 234 567', full: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM' },
        payment: { method: 'Ví MoMo', status: 'Đã thanh toán', bank: '' },
        timeline: [
            { step: 'Đặt hàng', time: '20/03/2026 16:44', done: true },
            { step: 'Xác nhận', time: '20/03/2026 17:00', done: true },
            { step: 'Đang đóng gói', time: '21/03/2026 08:30', done: true },
            { step: 'Đang giao', time: '21/03/2026 14:00', done: true },
            { step: 'Hoàn thành', time: '22/03/2026 10:30', done: true },
        ],
        note: '',
        reviewed: true,
    },
    {
        id: 'PS-2026-0031',
        date: '2026-03-10T11:30:00',
        status: 'delivered',
        items: [
            { name: 'MacBook Pro M4 14-inch 512GB', variant: 'Space Black / 16GB RAM', qty: 1, price: 52990000, img: 'https://placehold.co/120x120/e8f5e9/1b5e20?text=MacBook' },
        ],
        shipping: 0, discount: 2000000,
        address: { name: 'Nguyễn Văn A', phone: '0901 234 567', full: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM' },
        payment: { method: 'Chuyển khoản ngân hàng', status: 'Đã thanh toán', bank: 'TCB - 9988 7766 5544' },
        timeline: [
            { step: 'Đặt hàng', time: '10/03/2026 11:30', done: true },
            { step: 'Xác nhận', time: '10/03/2026 12:00', done: true },
            { step: 'Đang đóng gói', time: '10/03/2026 15:30', done: true },
            { step: 'Đang giao', time: '11/03/2026 09:00', done: true },
            { step: 'Hoàn thành', time: '11/03/2026 14:45', done: true },
        ],
        note: 'Không có ở nhà buổi sáng, giao chiều sau 13:00.',
        reviewed: false,
    },
    {
        id: 'PS-2026-0027',
        date: '2026-02-28T20:05:00',
        status: 'cancelled',
        items: [
            { name: 'OPPO Find X8 Pro 256GB', variant: 'Đen Vũ Trụ / 256GB', qty: 1, price: 29990000, img: 'https://placehold.co/120x120/fde8ea/c62828?text=OPPO' },
        ],
        shipping: 30000, discount: 500000,
        address: { name: 'Nguyễn Văn A', phone: '0901 234 567', full: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM' },
        payment: { method: 'Tiền mặt khi nhận hàng', status: 'Chưa thanh toán', bank: '' },
        timeline: [
            { step: 'Đặt hàng', time: '28/02/2026 20:05', done: true },
            { step: 'Xác nhận', time: '28/02/2026 20:20', done: true },
            { step: 'Đã hủy', time: '01/03/2026 09:00', done: true, cancelled: true },
        ],
        cancelReason: 'Tôi muốn thay đổi sản phẩm',
        note: '',
    },
    {
        id: 'PS-2026-0022',
        date: '2026-02-14T13:20:00',
        status: 'pending',
        items: [
            { name: 'Sony WH-1000XM5', variant: 'Đen', qty: 1, price: 8990000, img: 'https://placehold.co/120x120/e3f2fd/0d47a1?text=Sony' },
            { name: 'Sạc nhanh Anker 67W GaNPrime', variant: 'Đen', qty: 1, price: 690000, img: 'https://placehold.co/120x120/e3f2fd/0d47a1?text=Anker' },
        ],
        shipping: 30000, discount: 0,
        address: { name: 'Nguyễn Văn A', phone: '0901 234 567', full: '456 Nguyễn Huệ, Quận 1, TP.HCM' },
        payment: { method: 'ZaloPay', status: 'Đã thanh toán', bank: '' },
        timeline: [
            { step: 'Đặt hàng', time: '14/02/2026 13:20', done: true },
            { step: 'Xác nhận', time: '', done: false, current: true },
            { step: 'Đang đóng gói', time: '', done: false },
            { step: 'Đang giao', time: '', done: false },
            { step: 'Hoàn thành', time: '', done: false },
        ],
        note: '',
    },
    {
        id: 'PS-2026-0018',
        date: '2026-02-05T08:50:00',
        status: 'processing',
        items: [
            { name: 'iPad Air M2 64GB WiFi', variant: 'Xanh Dương / 64GB', qty: 1, price: 18990000, img: 'https://placehold.co/120x120/fff3e0/e65100?text=iPad' },
            { name: 'Apple Pencil 2', variant: 'Trắng', qty: 1, price: 3990000, img: 'https://placehold.co/120x120/fff3e0/e65100?text=Pencil' },
        ],
        shipping: 0, discount: 500000,
        address: { name: 'Nguyễn Văn A', phone: '0901 234 567', full: '789 Trần Hưng Đạo, Quận 5, TP.HCM' },
        payment: { method: 'Thẻ tín dụng Mastercard', status: 'Đã thanh toán', bank: '**** **** **** 8890' },
        timeline: [
            { step: 'Đặt hàng', time: '05/02/2026 08:50', done: true },
            { step: 'Xác nhận', time: '05/02/2026 09:00', done: true },
            { step: 'Đang đóng gói', time: '05/02/2026 10:30', done: true, current: true },
            { step: 'Đang giao', time: '', done: false },
            { step: 'Hoàn thành', time: '', done: false },
        ],
        note: '',
    },
];

// ─── STATE ──────────────────────────────────
let orders = JSON.parse(localStorage.getItem('ps_orders') || 'null') || SAMPLE_ORDERS;
let filtered = [...orders];
let activeStatus = '';
let searchQuery = '';
let currentPage = 1;
const PAGE_SIZE = 5;
let detailId = null;
let cancelId = null;

// ─── HELPERS ────────────────────────────────
const $ = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};
const orderSubtotal = (o) => o.items.reduce((s, i) => s + i.price * i.qty, 0);
const orderTotal = (o) => orderSubtotal(o) + (o.shipping || 0) - (o.discount || 0);

const STATUS_LABEL = {
    pending: 'Chờ xác nhận', processing: 'Đang xử lý',
    shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy'
};
const STATUS_ICON = {
    pending: 'fa-clock', processing: 'fa-cog fa-spin',
    shipping: 'fa-truck', delivered: 'fa-check-circle', cancelled: 'fa-times-circle'
};
const PAY_ICON = {
    'Chuyển khoản ngân hàng': 'fa-university',
    'Thẻ tín dụng Visa': 'fa-credit-card',
    'Thẻ tín dụng Mastercard': 'fa-credit-card',
    'Tiền mặt khi nhận hàng': 'fa-money-bill-wave',
    'Ví MoMo': 'fa-wallet',
    'ZaloPay': 'fa-wallet',
    'VNPay': 'fa-qrcode'
};
const TL_ICONS = {
    'Đặt hàng': 'fa-shopping-cart', 'Xác nhận': 'fa-check',
    'Đang đóng gói': 'fa-box', 'Đang giao': 'fa-truck',
    'Hoàn thành': 'fa-check-double', 'Đã hủy': 'fa-times'
};

function saveOrders() {
    localStorage.setItem('ps_orders', JSON.stringify(orders));
}

// ─── CART COUNT SYNC (from main site) ───────
function syncCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((s, i) => s + (i.quantity || 1), 0);
        const el = $('cartCount');
        if (el) el.textContent = count;
    } catch (e) { /* silent */ }
}

// ─── TOAST ──────────────────────────────────
function toast(msg, type = 'success') {
    const icons = {
        success: 'fa-check-circle', error: 'fa-times-circle',
        info: 'fa-tag', warning: 'fa-exclamation-circle'
    };
    const el = document.createElement('div');
    el.className = `oh-toast ${type}`;
    el.innerHTML = `
        <div class="oh-toast-icon"><i class="fas ${icons[type]}"></i></div>
        <span>${msg}</span>`;
    $('toastContainer').appendChild(el);
    setTimeout(() => {
        el.classList.add('hide');
        setTimeout(() => el.remove(), 320);
    }, 3200);
}

// ─── FILTER & RENDER ────────────────────────
function applyFilter() {
    filtered = orders.filter(o => {
        const mStatus = !activeStatus || o.status === activeStatus;
        const q = searchQuery.toLowerCase();
        const mSearch = !q || o.id.toLowerCase().includes(q) ||
            o.items.some(i => i.name.toLowerCase().includes(q));
        return mStatus && mSearch;
    });
    currentPage = 1;
    renderList();
    renderPagination();
    updateBadge();
}

function updateBadge() {
    $('ohTotalBadge').textContent = `${filtered.length} đơn hàng`;
}

// ─── RENDER ORDER LIST ──────────────────────
function renderList() {
    const list = $('ohList');
    const empty = $('ohEmpty');
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);

    if (page.length === 0) {
        list.innerHTML = '';
        empty.classList.add('show');
        return;
    }
    empty.classList.remove('show');

    list.innerHTML = page.map((o, idx) => {
        const total = orderTotal(o);
        const showItems = o.items.slice(0, 2);
        const moreCount = o.items.length - 2;
        const payIcon = PAY_ICON[o.payment.method] || 'fa-credit-card';
        const canCancel = ['pending', 'processing'].includes(o.status);
        const isDelivered = o.status === 'delivered';
        const isShipping = o.status === 'shipping';

        return `
        <div class="order-card" style="animation-delay:${idx * .07}s">
          <div class="order-card-header">
            <span class="order-card-id" onclick="openDetail('${o.id}')">
              <i class="fas fa-receipt" style="font-size:11px;margin-right:4px"></i>${o.id}
            </span>
            <span class="order-card-date">
              <i class="fas fa-calendar-alt"></i> ${fmtDate(o.date)}
            </span>
            <span class="order-status-badge status-${o.status}">
              <i class="fas ${STATUS_ICON[o.status]}"></i> ${STATUS_LABEL[o.status]}
            </span>
          </div>

          <div class="order-card-products">
            ${showItems.map(item => `
            <div class="order-prod-thumb">
              <img class="order-prod-img" src="${item.img}" alt="${item.name}"
                   onerror="this.src='https://placehold.co/56x56/fff5e6/b7791f?text=SP'">
              <div class="order-prod-info">
                <div class="order-prod-name">${item.name}</div>
                <div class="order-prod-variant">${item.variant}</div>
                <div class="order-prod-qty-price">
                  <span class="order-prod-qty">x${item.qty}</span>
                  <span class="order-prod-price">${fmt(item.price)}</span>
                </div>
              </div>
            </div>`).join('')}
            ${moreCount > 0 ? `<span class="order-more-items" onclick="openDetail('${o.id}')"><i class="fas fa-plus"></i> +${moreCount} sản phẩm</span>` : ''}
          </div>

          <div class="order-card-footer">
            <div>
              <div class="order-total-wrap">
                <span class="order-total-label">Tổng tiền</span>
                <span class="order-total-value">${fmt(total)}</span>
              </div>
              <div class="order-payment-method" style="margin-top:6px">
                <i class="fas ${payIcon}"></i> ${o.payment.method} · ${o.payment.status}
              </div>
            </div>
            <div class="order-card-actions">
              <button class="btn-view-detail" onclick="openDetail('${o.id}')"><i class="fas fa-eye"></i> Chi tiết</button>
              ${isShipping ? `<button class="btn-track" onclick="openDetail('${o.id}')"><i class="fas fa-map-marker-alt"></i> Theo dõi</button>` : ''}
              ${isDelivered ? `<button class="btn-review${o.reviewed ? ' btn-review-done' : ''}" onclick="reviewOrder('${o.id}')">
                <i class="fas fa-star"></i> ${o.reviewed ? 'Đã đánh giá' : 'Đánh giá'}
              </button>` : ''}
              ${isDelivered || o.status === 'cancelled' ? `<button class="btn-reorder" onclick="reorder('${o.id}')"><i class="fas fa-redo"></i> Mua lại</button>` : ''}
              ${canCancel ? `<button class="btn-cancel-order" onclick="openCancelModal('${o.id}')"><i class="fas fa-times"></i> Hủy đơn</button>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
}

// ─── PAGINATION ─────────────────────────────
function renderPagination() {
    const total = filtered.length;
    const pages = Math.ceil(total / PAGE_SIZE);
    const pg = $('ohPagination');
    if (pages <= 1) { pg.innerHTML = ''; return; }

    let h = `<button class="pg-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= pages; i++) {
        if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - currentPage) > 1) {
            if (i === 3 || i === pages - 2) h += `<span class="pg-btn" style="cursor:default;pointer-events:none">…</span>`;
            continue;
        }
        h += `<button class="pg-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    h += `<button class="pg-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    pg.innerHTML = h;
}

function goPage(p) {
    const pages = Math.ceil(filtered.length / PAGE_SIZE);
    if (p < 1 || p > pages) return;
    currentPage = p;
    renderList();
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── TAB FILTER ─────────────────────────────
document.querySelectorAll('.oh-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.oh-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeStatus = tab.dataset.status;
        applyFilter();
    });
});

// ─── SEARCH ─────────────────────────────────
$('ohSearch').addEventListener('input', e => {
    searchQuery = e.target.value;
    applyFilter();
});

// ─── DETAIL MODAL ───────────────────────────
function openDetail(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    detailId = id;

    $('modalOrderId').innerHTML = `<i class="fas fa-receipt"></i> ${o.id}`;
    $('modalDate').textContent = `Đặt ngày: ${fmtDate(o.date)}`;

    // Timeline
    renderTimeline(o);

    // Products
    $('modalProducts').innerHTML = o.items.map(item => `
    <div class="modal-prod-row">
      <img class="modal-prod-img" src="${item.img}" alt="${item.name}"
           onerror="this.src='https://placehold.co/64x64/fff5e6/b7791f?text=SP'">
      <div class="modal-prod-details">
        <div class="modal-prod-name">${item.name}</div>
        <div class="modal-prod-variant">${item.variant}</div>
        <div class="modal-prod-qty-price">
          <span class="modal-prod-qty">Số lượng: ${item.qty} · Đơn giá: ${fmt(item.price)}</span>
        </div>
      </div>
      <span class="modal-prod-subtotal">${fmt(item.price * item.qty)}</span>
    </div>`).join('');

    // Address
    $('modalAddress').innerHTML = `
      <strong>${o.address.name}</strong> &nbsp;
      <i class="fas fa-phone" style="color:var(--gold-primary);font-size:11px"></i> ${o.address.phone}<br>
      ${o.address.full}
      ${o.note ? `<br><span style="color:var(--gold-primary);font-size:12px;margin-top:4px;display:inline-block">
        <i class="fas fa-sticky-note"></i> ${o.note}</span>` : ''}`;

    // Payment
    const payIcon = PAY_ICON[o.payment.method] || 'fa-credit-card';
    $('modalPayment').innerHTML = `
      <strong><i class="fas ${payIcon}" style="color:var(--gold-primary);margin-right:5px"></i>${o.payment.method}</strong><br>
      ${o.payment.bank ? `<span style="font-size:12px;color:var(--text-muted)">${o.payment.bank}</span><br>` : ''}
      <span style="color:${o.payment.status === 'Đã thanh toán' ? 'var(--success)' : 'var(--warning)'};font-weight:700;font-size:12.5px">
        <i class="fas fa-${o.payment.status === 'Đã thanh toán' ? 'check-circle' : 'hourglass-half'}"></i> ${o.payment.status}
      </span>`;

    // Summary
    const sub = orderSubtotal(o);
    $('sumSubtotal').textContent = fmt(sub);
    $('sumShipping').textContent = o.shipping === 0 ? 'Miễn phí' : fmt(o.shipping);
    if (o.discount > 0) {
        $('discountRow').style.display = 'flex';
        $('sumDiscount').textContent = '- ' + fmt(o.discount);
    } else {
        $('discountRow').style.display = 'none';
    }
    $('sumTotal').textContent = fmt(orderTotal(o));

    // Footer buttons
    const canCancel = ['pending', 'processing'].includes(o.status);
    const isDelivered = o.status === 'delivered';
    const isShipping = o.status === 'shipping';
    $('modalFooter').innerHTML = `
      ${isShipping ? `<button class="btn-track" onclick="trackOrder()"><i class="fas fa-map-marker-alt"></i> Theo dõi đơn hàng</button>` : ''}
      ${isDelivered ? `<button class="btn-review${o.reviewed ? ' btn-review-done' : ''}" onclick="reviewOrder('${o.id}')">
        <i class="fas fa-star"></i> ${o.reviewed ? 'Đã đánh giá' : 'Đánh giá ngay'}
      </button>` : ''}
      ${isDelivered || o.status === 'cancelled' ? `<button class="btn-reorder" onclick="reorder('${o.id}')"><i class="fas fa-redo"></i> Mua lại</button>` : ''}
      ${canCancel ? `<button class="btn-cancel-order" onclick="closeDetail();openCancelModal('${o.id}')"><i class="fas fa-times"></i> Hủy đơn</button>` : ''}
      <button class="btn-view-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Đóng</button>`;

    showModal('modalBackdrop');
}

function renderTimeline(o) {
    const wrap = $('timelineWrap');
    const steps = o.timeline;
    const doneCount = steps.filter(s => s.done && !s.cancelled).length;
    const total = steps.length;
    let pct = total > 1 ? Math.max(0, (doneCount - 1) / (total - 1) * 100) : 0;
    if (o.status === 'cancelled') pct = ((steps.filter(s => s.done).length - 1) / (total - 1) * 100);

    wrap.innerHTML = `<div class="timeline-line-fill" style="width:${pct}%"></div>` +
        steps.map((step) => {
            let cls = 'tl-step-inactive';
            let dotCls = 'inactive';
            if (step.cancelled) { cls = 'tl-step-cancelled'; dotCls = 'done'; }
            else if (step.current) { cls = 'tl-step-current'; dotCls = 'current'; }
            else if (step.done) { cls = 'tl-step-done'; dotCls = 'done'; }
            const icon = TL_ICONS[step.step] || 'fa-circle';
            return `
            <div class="timeline-step ${cls}">
              <div class="tl-dot ${dotCls}" style="${step.cancelled ? 'background:var(--danger);border-color:var(--danger);color:#fff' : ''}">
                <i class="fas ${icon}" style="font-size:13px"></i>
              </div>
              <div class="tl-label">${step.step}</div>
              ${step.time ? `<div class="tl-time">${step.time}</div>` : ''}
            </div>`;
        }).join('');
}

function closeDetail() { hideModal('modalBackdrop'); }
$('modalClose').addEventListener('click', closeDetail);
$('modalBackdrop').addEventListener('click', e => {
    if (e.target === $('modalBackdrop')) closeDetail();
});

// ─── CANCEL ORDER ───────────────────────────
function openCancelModal(id) {
    cancelId = id;
    $('cancelText').innerHTML = `Bạn có chắc muốn hủy đơn hàng <strong>${id}</strong>? Thao tác này không thể hoàn tác.`;
    $('cancelReason').value = '';
    showModal('cancelBackdrop');
}

$('cancelYes').addEventListener('click', () => {
    if (!$('cancelReason').value) {
        toast('Vui lòng chọn lý do hủy đơn!', 'warning');
        return;
    }
    const o = orders.find(x => x.id === cancelId);
    if (!o) return;
    o.status = 'cancelled';
    o.cancelReason = $('cancelReason').value;
    o.timeline = [
        ...o.timeline.filter(t => t.done),
        {
            step: 'Đã hủy',
            time: new Date().toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }),
            done: true, cancelled: true
        }
    ];
    saveOrders();
    hideModal('cancelBackdrop');
    applyFilter();
    toast(`Đã hủy đơn hàng ${cancelId} thành công!`, 'info');
    cancelId = null;
});

$('cancelNo').addEventListener('click', () => hideModal('cancelBackdrop'));
$('cancelBackdrop').addEventListener('click', e => {
    if (e.target === $('cancelBackdrop')) hideModal('cancelBackdrop');
});

// ─── ACTIONS ────────────────────────────────
function reorder(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    // Sync with main site cart logic
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        o.items.forEach(item => {
            const existing = cart.find(c => c.name === item.name);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + item.qty;
            } else {
                cart.push({
                    name: item.name,
                    price: item.price,
                    image: item.img,
                    quantity: item.qty
                });
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        syncCartCount();
    } catch (e) { /* silent */ }
    toast(`Đã thêm ${o.items.length} sản phẩm vào giỏ hàng!`, 'success');
    closeDetail();
}

function reviewOrder(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    if (o.reviewed) {
        toast('Bạn đã đánh giá đơn hàng này rồi!', 'info');
        return;
    }
    toast('Mở trang đánh giá sản phẩm...', 'info');
    // window.location.href = `review.html?order=${id}`;
}

function trackOrder() {
    toast('Đang tải thông tin vận chuyển...', 'info');
}

// ─── MODAL HELPERS ──────────────────────────
function showModal(id) {
    $(id).classList.add('show');
    document.body.style.overflow = 'hidden';
}
function hideModal(id) {
    $(id).classList.remove('show');
    document.body.style.overflow = '';
}

// ─── BACK TO TOP ────────────────────────────
const backToTop = $('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 300);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── KEYBOARD SHORTCUT: ESC to close modals ─
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if ($('cancelBackdrop').classList.contains('show')) {
            hideModal('cancelBackdrop');
        } else if ($('modalBackdrop').classList.contains('show')) {
            closeDetail();
        }
    }
});

// ─── INIT ───────────────────────────────────
syncCartCount();
applyFilter();