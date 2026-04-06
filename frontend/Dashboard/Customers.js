'use strict';
/* =============================================
   MOBISTORE – CUSTOMERS  |  customers.js
   Features: CRUD, search, filter, sort,
   pagination, grid/table toggle, bulk, export
   ============================================= */

// ─── Avatar gradient palettes (for initials avatars) ───
const GRADIENTS = [
    'linear-gradient(135deg,#7c3aed,#06b6d4)',
    'linear-gradient(135deg,#10b981,#06b6d4)',
    'linear-gradient(135deg,#f97316,#ec4899)',
    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'linear-gradient(135deg,#ec4899,#f97316)',
    'linear-gradient(135deg,#10b981,#3b82f6)',
];
const gradientOf = name => GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];
const initials = name => name.trim().split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

// ─── Card colour bar per type ───
const CARD_BORDER = {
    'VIP': 'linear-gradient(135deg,#f59e0b,#d97706)',
    'Thường xuyên': 'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'Mới': 'linear-gradient(135deg,#10b981,#06b6d4)',
    'Không hoạt động': 'linear-gradient(135deg,#ef4444,#dc2626)',
};

// ─── Sample data ───
const SAMPLE = [
    { id: 'KH-001', name: 'Nguyễn Văn An', gender: 'Nam', phone: '0901234567', email: 'an.nguyen@email.com', address: '123 Lê Lợi, Q.1', city: 'TP. Hồ Chí Minh', dob: '1990-05-12', joinDate: '2024-01-15', type: 'VIP', orders: 28, spent: 185600000, points: 1856, note: 'Khách VIP ưu tiên', avatar: '' },
    { id: 'KH-002', name: 'Trần Thị Bình', gender: 'Nữ', phone: '0912345678', email: 'binh.tran@email.com', address: '456 Nguyễn Huệ, Q.1', city: 'TP. Hồ Chí Minh', dob: '1995-08-22', joinDate: '2024-02-10', type: 'Thường xuyên', orders: 12, spent: 67400000, points: 674, note: '', avatar: '' },
    { id: 'KH-003', name: 'Lê Minh Cường', gender: 'Nam', phone: '0923456789', email: 'cuong.le@email.com', address: '789 CMT8, Q.3', city: 'TP. Hồ Chí Minh', dob: '1988-11-30', joinDate: '2024-03-05', type: 'Thường xuyên', orders: 9, spent: 52300000, points: 523, note: '', avatar: '' },
    { id: 'KH-004', name: 'Phạm Thu Dung', gender: 'Nữ', phone: '0934567890', email: 'dung.pham@email.com', address: '321 Điện Biên Phủ, Q.BT', city: 'TP. Hồ Chí Minh', dob: '1993-03-18', joinDate: '2024-03-20', type: 'VIP', orders: 21, spent: 134900000, points: 1349, note: 'Giao hàng tận nơi', avatar: '' },
    { id: 'KH-005', name: 'Hoàng Văn Em', gender: 'Nam', phone: '0945678901', email: 'em.hoang@email.com', address: '654 Võ Thị Sáu, Q.3', city: 'TP. Hồ Chí Minh', dob: '1985-07-04', joinDate: '2023-11-12', type: 'VIP', orders: 35, spent: 298500000, points: 2985, note: '', avatar: '' },
    { id: 'KH-006', name: 'Vũ Thị Phương', gender: 'Nữ', phone: '0956789012', email: 'phuong.vu@email.com', address: '987 Lạc Long Quân, Q.11', city: 'TP. Hồ Chí Minh', dob: '1997-01-25', joinDate: '2025-01-08', type: 'Mới', orders: 2, spent: 8900000, points: 89, note: '', avatar: '' },
    { id: 'KH-007', name: 'Đỗ Quang Hải', gender: 'Nam', phone: '0967890123', email: 'hai.do@email.com', address: '147 Trần Hưng Đạo, Q.5', city: 'TP. Hồ Chí Minh', dob: '1991-09-09', joinDate: '2024-06-14', type: 'Không hoạt động', orders: 3, spent: 14200000, points: 142, note: 'Đã liên hệ nhưng không phản hồi', avatar: '' },
    { id: 'KH-008', name: 'Bùi Thị Lan', gender: 'Nữ', phone: '0978901234', email: 'lan.bui@email.com', address: '258 Nguyễn Trãi, Q.5', city: 'TP. Hồ Chí Minh', dob: '1994-12-03', joinDate: '2024-04-30', type: 'Thường xuyên', orders: 7, spent: 38600000, points: 386, note: '', avatar: '' },
    { id: 'KH-009', name: 'Ngô Thanh Minh', gender: 'Nam', phone: '0989012345', email: 'minh.ngo@email.com', address: '369 Phan Xích Long, Q.PN', city: 'TP. Hồ Chí Minh', dob: '1989-06-17', joinDate: '2025-02-01', type: 'Mới', orders: 1, spent: 26990000, points: 270, note: '', avatar: '' },
    { id: 'KH-010', name: 'Lý Thị Nga', gender: 'Nữ', phone: '0990123456', email: 'nga.ly@email.com', address: '741 Hoàng Văn Thụ, Q.TB', city: 'TP. Hồ Chí Minh', dob: '1996-04-11', joinDate: '2024-07-22', type: 'Thường xuyên', orders: 6, spent: 29700000, points: 297, note: '', avatar: '' },
    { id: 'KH-011', name: 'Trịnh Văn Phú', gender: 'Nam', phone: '0901357924', email: 'phu.trinh@email.com', address: '852 Cộng Hòa, Q.TB', city: 'TP. Hồ Chí Minh', dob: '1987-02-28', joinDate: '2024-09-10', type: 'VIP', orders: 19, spent: 121400000, points: 1214, note: '', avatar: '' },
    { id: 'KH-012', name: 'Đinh Thị Quỳnh', gender: 'Nữ', phone: '0912468013', email: 'quynh.dinh@email.com', address: '963 Tô Hiến Thành, Q.10', city: 'TP. Hồ Chí Minh', dob: '1999-10-07', joinDate: '2025-03-15', type: 'Mới', orders: 1, spent: 26280000, points: 263, note: '', avatar: '' },
    { id: 'KH-013', name: 'Phan Thị Thanh', gender: 'Nữ', phone: '0923571468', email: 'thanh.phan@email.com', address: '12 Nguyễn Đình Chiểu, HK', city: 'Hà Nội', dob: '1992-08-14', joinDate: '2024-05-20', type: 'Thường xuyên', orders: 8, spent: 44200000, points: 442, note: '', avatar: '' },
    { id: 'KH-014', name: 'Nguyễn Văn Tuấn', gender: 'Nam', phone: '0934682579', email: 'tuan.nguyen@email.com', address: '34 Trần Phú, Hải Châu', city: 'Đà Nẵng', dob: '1990-03-22', joinDate: '2024-08-05', type: 'Thường xuyên', orders: 5, spent: 19500000, points: 195, note: '', avatar: '' },
    { id: 'KH-015', name: 'Cao Thị Uyên', gender: 'Nữ', phone: '0945793680', email: 'uyen.cao@email.com', address: '56 Hoàng Diệu, Ninh Kiều', city: 'Cần Thơ', dob: '1998-11-30', joinDate: '2025-01-20', type: 'Mới', orders: 2, spent: 9800000, points: 98, note: '', avatar: '' },
];

// ─── STATE ───
let customers = JSON.parse(localStorage.getItem('ms_customers') || 'null') || SAMPLE.map(c => ({ ...c }));
let filtered = [...customers];
let currentPage = 1;
const PAGE_SIZE = 8;
let sortCol = 'joinDate';
let sortDir = 'desc';
let selectedIds = new Set();
let deleteTarget = null;
let viewDetailId = null;
let isEditMode = false;
let currentView = 'table'; // 'table' | 'grid'

// ─── HELPERS ───
const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
const fmtShort = n => {
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + ' tỷ';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.?0+$/, '') + ' tr';
    return new Intl.NumberFormat('vi-VN').format(n);
};
const fmtDate = d => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
};

function genId() {
    const nums = customers.map(c => parseInt(c.id.replace('KH-', '')) || 0);
    return 'KH-' + (Math.max(0, ...nums) + 1).toString().padStart(3, '0');
}

function saveStorage() { localStorage.setItem('ms_customers', JSON.stringify(customers)); }

function typeClass(t) {
    const m = { 'VIP': 'type-vip', 'Thường xuyên': 'type-regular', 'Mới': 'type-new', 'Không hoạt động': 'type-inactive' };
    return m[t] || 'type-new';
}
function typeIcon(t) {
    const m = { 'VIP': 'fa-crown', 'Thường xuyên': 'fa-repeat', 'Mới': 'fa-star', 'Không hoạt động': 'fa-moon' };
    return m[t] || 'fa-user';
}

// ─── TOAST ───
function toast(msg, type = 'success') {
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-circle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span>${msg}</span>`;
    $('toastContainer').appendChild(el);
    setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 360); }, 3000);
}

// ─── DATE ───
function initDate() {
    $('currentDate').textContent = new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── SIDEBAR ───
$('sidebarToggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('collapsed');
    $('mainContent').classList.toggle('expanded');
});

// ─── AVATAR HELPER ───
function renderAvatarHTML(c, size = 40, radius = 12) {
    if (c.avatar) {
        return `<img src="${c.avatar}" alt="${c.name}" style="width:${size}px;height:${size}px;border-radius:${radius}px;object-fit:cover;">`;
    }
    return `<div style="width:${size}px;height:${size}px;border-radius:${radius}px;background:${gradientOf(c.name)};display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * .35)}px;font-weight:700;color:#fff;flex-shrink:0;">${initials(c.name)}</div>`;
}

// ─── FILTER & SORT ───
function applyFilter() {
    const q = $('searchInput').value.trim().toLowerCase();
    const type = $('filterType').value;
    const gen = $('filterGender').value;
    const city = $('filterCity').value;

    filtered = customers.filter(c => {
        const mQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || '').toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
        const mT = !type || c.type === type;
        const mG = !gen || c.gender === gen;
        const mC = !city || c.city === city;
        return mQ && mT && mG && mC;
    });

    filtered.sort((a, b) => {
        let va, vb;
        if (sortCol === 'orders') { va = a.orders; vb = b.orders; }
        else if (sortCol === 'spent') { va = a.spent; vb = b.spent; }
        else if (sortCol === 'joinDate') { va = a.joinDate; vb = b.joinDate; }
        else if (sortCol === 'type') { va = a.type; vb = b.type; }
        else if (sortCol === 'phone') { va = a.phone; vb = b.phone; }
        else if (sortCol === 'city') { va = a.city; vb = b.city; }
        else { va = a[sortCol]; vb = b[sortCol]; }
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    selectedIds.clear();
    renderAll();
}

document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else { sortCol = col; sortDir = 'asc'; }
        document.querySelectorAll('.sortable').forEach(t => t.classList.remove('asc', 'desc'));
        th.classList.add(sortDir);
        applyFilter();
    });
});

$('searchInput').addEventListener('input', applyFilter);
$('filterType').addEventListener('change', applyFilter);
$('filterGender').addEventListener('change', applyFilter);
$('filterCity').addEventListener('change', applyFilter);
$('btnReset').addEventListener('click', () => {
    $('searchInput').value = '';
    $('filterType').value = $('filterGender').value = $('filterCity').value = '';
    applyFilter();
});

// ─── RENDER ───
function renderAll() {
    renderKPI();
    if (currentView === 'table') renderTable();
    else renderGrid();
    renderPagination();
    renderBulkBar();
}

function renderKPI() {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const vipCount = customers.filter(c => c.type === 'VIP').length;
    const newCount = customers.filter(c => c.joinDate && c.joinDate.startsWith(thisMonth)).length;
    const avgSpent = customers.length ? Math.round(customers.reduce((s, c) => s + c.spent, 0) / customers.length) : 0;

    $('kpiTotal').textContent = customers.length;
    $('kpiNew').textContent = newCount;
    $('kpiVip').textContent = vipCount;
    $('kpiAvg').textContent = fmtShort(avgSpent);
}

function renderTable() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);
    const tbody = $('customersTableBody');
    const empty = $('emptyState');

    $('tableView').style.display = '';
    $('gridView').classList.remove('show');

    if (page.length === 0) { tbody.innerHTML = ''; empty.classList.add('show'); return; }
    empty.classList.remove('show');

    tbody.innerHTML = page.map((c, idx) => `
    <tr data-id="${c.id}" style="animation-delay:${idx * .04}s" class="${selectedIds.has(c.id) ? 'selected' : ''}">
      <td><input type="checkbox" class="checkbox row-check" data-id="${c.id}" ${selectedIds.has(c.id) ? 'checked' : ''}></td>
      <td>
        <div class="customer-cell">
          <div class="customer-avatar">${renderAvatarHTML(c, 40, 12)}</div>
          <div class="customer-info">
            <span class="customer-name">${c.name}</span>
            <span class="customer-email">${c.email || '—'}</span>
          </div>
        </div>
      </td>
      <td class="phone-cell">${c.phone}</td>
      <td class="city-cell">${c.city || '—'}</td>
      <td class="orders-cell">${c.orders}</td>
      <td class="spent-cell">${fmtShort(c.spent)}</td>
      <td><span class="type-badge ${typeClass(c.type)}"><i class="fas ${typeIcon(c.type)}"></i> ${c.type}</span></td>
      <td class="date-cell">${fmtDate(c.joinDate)}</td>
      <td>
        <div class="action-btns">
          <button class="icon-btn view-btn"   onclick="openDetail('${c.id}')" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
          <button class="icon-btn edit-btn"   onclick="openEditModal('${c.id}')" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
          <button class="icon-btn delete-btn" onclick="confirmDelete('${c.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');

    tbody.querySelectorAll('.row-check').forEach(cb => {
        cb.addEventListener('change', e => {
            const id = e.target.dataset.id;
            e.target.checked ? selectedIds.add(id) : selectedIds.delete(id);
            e.target.closest('tr').classList.toggle('selected', e.target.checked);
            updateSelectAll();
            renderBulkBar();
        });
    });
}

function renderGrid() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);
    const grid = $('productsGrid') || $('customersGrid');
    const empty = $('emptyState');

    $('tableView').style.display = 'none';
    $('gridView').classList.add('show');

    const gridEl = $('customersGrid');
    if (page.length === 0) { gridEl.innerHTML = ''; empty.classList.add('show'); return; }
    empty.classList.remove('show');

    gridEl.innerHTML = page.map((c, idx) => `
    <div class="customer-card" style="animation-delay:${idx * .06}s;--card-border:${CARD_BORDER[c.type] || 'var(--accent-gradient)'};" data-id="${c.id}">
      <style>.customer-card[data-id='${c.id}']::before{background:${CARD_BORDER[c.type] || 'var(--accent-gradient)'};}</style>
      <div class="customer-card-avatar">${renderAvatarHTML(c, 64, 18)}</div>
      <div class="customer-card-name">${c.name}</div>
      <div class="customer-card-email">${c.email || c.phone}</div>
      <div class="customer-card-type"><span class="type-badge ${typeClass(c.type)}"><i class="fas ${typeIcon(c.type)}"></i> ${c.type}</span></div>
      <div class="customer-card-stats">
        <div class="card-stat">
          <div class="card-stat-val">${c.orders}</div>
          <div class="card-stat-lbl">Đơn hàng</div>
        </div>
        <div class="card-stat">
          <div class="card-stat-val">${fmtShort(c.spent)}</div>
          <div class="card-stat-lbl">Chi tiêu</div>
        </div>
        <div class="card-stat">
          <div class="card-stat-val">${c.points || 0}</div>
          <div class="card-stat-lbl">Điểm tích</div>
        </div>
        <div class="card-stat">
          <div class="card-stat-val">${c.city ? c.city.split('.').pop().trim() : '—'}</div>
          <div class="card-stat-lbl">Khu vực</div>
        </div>
      </div>
      <div class="customer-card-actions">
        <button class="icon-btn view-btn"   onclick="openDetail('${c.id}')" title="Xem"><i class="fas fa-eye"></i></button>
        <button class="icon-btn edit-btn"   onclick="openEditModal('${c.id}')" title="Sửa"><i class="fas fa-edit"></i></button>
        <button class="icon-btn delete-btn" onclick="confirmDelete('${c.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function updateSelectAll() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageIds = filtered.slice(start, start + PAGE_SIZE).map(c => c.id);
    $('selectAll').checked = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
    $('selectAll').indeterminate = pageIds.some(id => selectedIds.has(id)) && !$('selectAll').checked;
}

$('selectAll').addEventListener('change', e => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageIds = filtered.slice(start, start + PAGE_SIZE).map(c => c.id);
    pageIds.forEach(id => e.target.checked ? selectedIds.add(id) : selectedIds.delete(id));
    renderTable(); renderBulkBar();
});

function renderPagination() {
    const total = filtered.length;
    const pages = Math.ceil(total / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, total);
    $('paginationInfo').textContent = total > 0 ? `Hiển thị ${start}–${end} trong ${total} khách hàng` : 'Không có kết quả';

    const pg = $('pagination');
    if (pages <= 1) { pg.innerHTML = ''; return; }

    let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= pages; i++) {
        if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - currentPage) > 1) {
            if (i === 3 || i === pages - 2) html += `<span class="page-btn" style="cursor:default">…</span>`;
            continue;
        }
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    pg.innerHTML = html;
}

function goPage(p) {
    const pages = Math.ceil(filtered.length / PAGE_SIZE);
    if (p < 1 || p > pages) return;
    currentPage = p;
    if (currentView === 'table') renderTable(); else renderGrid();
    renderPagination();
}

function renderBulkBar() {
    const bar = $('bulkBar');
    if (selectedIds.size > 0) {
        bar.classList.add('show');
        $('bulkCount').textContent = `${selectedIds.size} khách hàng được chọn`;
    } else bar.classList.remove('show');
}

// ─── VIEW TOGGLE ───
$('btnTable').addEventListener('click', () => {
    currentView = 'table';
    $('btnTable').classList.add('active');
    $('btnGrid').classList.remove('active');
    renderAll();
});
$('btnGrid').addEventListener('click', () => {
    currentView = 'grid';
    $('btnGrid').classList.add('active');
    $('btnTable').classList.remove('active');
    renderAll();
});

// ─── BULK ACTIONS ───
$('bulkVip').addEventListener('click', () => {
    customers.forEach(c => { if (selectedIds.has(c.id)) c.type = 'VIP'; });
    selectedIds.clear(); saveStorage(); applyFilter(); toast('Đã cập nhật phân loại VIP!', 'success');
});
$('bulkEmail').addEventListener('click', () => {
    toast(`Đã gửi email đến ${selectedIds.size} khách hàng!`, 'info');
    selectedIds.clear(); renderBulkBar();
});
$('bulkDelete').addEventListener('click', () => {
    if (!confirm(`Xóa ${selectedIds.size} khách hàng đã chọn?`)) return;
    customers = customers.filter(c => !selectedIds.has(c.id));
    selectedIds.clear(); saveStorage(); applyFilter(); toast('Đã xóa khách hàng!', 'success');
});

// ─── ADD / EDIT MODAL ───
function openAddModal() {
    isEditMode = false;
    $('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Thêm khách hàng mới';
    $('editId').value = '';
    resetForm();
    $('fJoinDate').value = new Date().toISOString().split('T')[0];
    showModal('modalOverlay');
}

function openEditModal(id) {
    const c = customers.find(x => x.id === id);
    if (!c) return;
    isEditMode = true;
    $('modalTitle').innerHTML = `<i class="fas fa-edit"></i> Chỉnh sửa — ${c.name}`;
    $('editId').value = id;

    $('fName').value = c.name;
    $('fGender').value = c.gender || 'Nam';
    $('fPhone').value = c.phone;
    $('fEmail').value = c.email || '';
    $('fDob').value = c.dob || '';
    $('fAddress').value = c.address || '';
    $('fCity').value = c.city || '';
    $('fType').value = c.type;
    $('fJoinDate').value = c.joinDate || '';
    $('fOrders').value = c.orders || 0;
    $('fSpent').value = c.spent ? new Intl.NumberFormat('vi-VN').format(c.spent) : '';
    $('fPoints').value = c.points || 0;
    $('fNote').value = c.note || '';

    // avatar
    if (c.avatar) {
        $('avatarPreviewImg').src = c.avatar;
        $('avatarPreviewImg').classList.add('show');
        $('avatarPlaceholder').style.display = 'none';
    } else {
        $('avatarPreviewImg').classList.remove('show');
        $('avatarPlaceholder').style.display = '';
    }
    clearErrors();
    showModal('modalOverlay');
}

function resetForm() {
    ['fName', 'fPhone', 'fEmail', 'fAddress', 'fNote'].forEach(id => $(id).value = '');
    $('fGender').value = 'Nam'; $('fCity').value = ''; $('fType').value = 'Mới';
    $('fDob').value = ''; $('fOrders').value = 0; $('fSpent').value = '';
    $('fPoints').value = 0;
    $('avatarPreviewImg').classList.remove('show');
    $('avatarPreviewImg').src = '';
    $('avatarPlaceholder').style.display = '';
    $('fAvatar').value = '';
    clearErrors();
}

function clearErrors() {
    ['errName', 'errPhone'].forEach(id => $(id).textContent = '');
    ['fName', 'fPhone'].forEach(id => $(id).classList.remove('error'));
}

function validateForm() {
    let ok = true; clearErrors();
    if (!$('fName').value.trim()) { $('errName').textContent = 'Vui lòng nhập họ tên'; $('fName').classList.add('error'); ok = false; }
    if (!$('fPhone').value.trim()) { $('errPhone').textContent = 'Vui lòng nhập số điện thoại'; $('fPhone').classList.add('error'); ok = false; }
    return ok;
}

$('btnAddCustomer').addEventListener('click', openAddModal);

$('btnSave').addEventListener('click', () => {
    if (!validateForm()) return;
    const spentRaw = ($('fSpent').value || '0').replace(/[^0-9]/g, '');
    const avatar = $('avatarPreviewImg').src && $('avatarPreviewImg').classList.contains('show') ? $('avatarPreviewImg').src : '';

    const data = {
        name: $('fName').value.trim(),
        gender: $('fGender').value,
        phone: $('fPhone').value.trim(),
        email: $('fEmail').value.trim(),
        dob: $('fDob').value,
        address: $('fAddress').value.trim(),
        city: $('fCity').value,
        type: $('fType').value,
        joinDate: $('fJoinDate').value,
        orders: parseInt($('fOrders').value) || 0,
        spent: parseInt(spentRaw) || 0,
        points: parseInt($('fPoints').value) || 0,
        note: $('fNote').value.trim(),
        avatar,
    };

    if (isEditMode) {
        const idx = customers.findIndex(c => c.id === $('editId').value);
        if (idx !== -1) customers[idx] = { id: customers[idx].id, ...data };
        toast('Cập nhật khách hàng thành công!', 'success');
    } else {
        data.id = genId();
        customers.unshift(data);
        toast('Thêm khách hàng thành công!', 'success');
    }
    saveStorage(); hideModal('modalOverlay'); applyFilter();
});

// ─── AVATAR UPLOAD ───
$('uploadAvatarBtn').addEventListener('click', () => $('fAvatar').click());
$('avatarUploadArea').addEventListener('click', e => {
    if (e.target === $('uploadAvatarBtn') || $('uploadAvatarBtn').contains(e.target)) return;
    if (e.target === $('removeAvatarBtn') || $('removeAvatarBtn').contains(e.target)) return;
    $('fAvatar').click();
});
$('fAvatar').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        $('avatarPreviewImg').src = ev.target.result;
        $('avatarPreviewImg').classList.add('show');
        $('avatarPlaceholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
});
$('removeAvatarBtn').addEventListener('click', () => {
    $('avatarPreviewImg').src = '';
    $('avatarPreviewImg').classList.remove('show');
    $('avatarPlaceholder').style.display = '';
    $('fAvatar').value = '';
});

// ─── DELETE ───
function confirmDelete(id) {
    deleteTarget = id;
    const c = customers.find(x => x.id === id);
    $('confirmText').innerHTML = `Bạn có chắc muốn xóa khách hàng<br><strong>${c ? c.name : id}</strong>?<br><span style="font-size:.8rem;color:var(--text-muted)">Hành động này không thể hoàn tác.</span>`;
    showModal('confirmOverlay');
}
$('confirmOk').addEventListener('click', () => {
    customers = customers.filter(c => c.id !== deleteTarget);
    saveStorage(); hideModal('confirmOverlay'); applyFilter();
    toast('Đã xóa khách hàng!', 'success'); deleteTarget = null;
});
$('confirmCancel').addEventListener('click', () => { hideModal('confirmOverlay'); deleteTarget = null; });

// ─── DETAIL VIEW ───
function openDetail(id) {
    const c = customers.find(x => x.id === id);
    if (!c) return;
    viewDetailId = id;
    $('detailTitle').innerHTML = `<i class="fas fa-user"></i> ${c.name}`;
    $('detailBody').innerHTML = `
    <div class="detail-hero">
      <div class="detail-hero-avatar">${renderAvatarHTML(c, 72, 20)}</div>
      <div>
        <div class="detail-hero-name">${c.name}</div>
        <div style="margin-bottom:8px;"><span class="type-badge ${typeClass(c.type)}"><i class="fas ${typeIcon(c.type)}"></i> ${c.type}</span></div>
        <div class="detail-hero-meta">
          <span><i class="fas fa-phone"></i> ${c.phone}</span>
          ${c.email ? `<span><i class="fas fa-envelope"></i> ${c.email}</span>` : ''}
          ${c.city ? `<span><i class="fas fa-map-marker-alt"></i> ${c.city}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="detail-stats">
      <div class="detail-stat-card">
        <div class="detail-stat-val" style="color:var(--accent-primary-light)">${c.orders}</div>
        <div class="detail-stat-lbl">Đơn hàng</div>
      </div>
      <div class="detail-stat-card">
        <div class="detail-stat-val" style="color:var(--accent-secondary)">${fmtShort(c.spent)}</div>
        <div class="detail-stat-lbl">Tổng chi tiêu</div>
      </div>
      <div class="detail-stat-card">
        <div class="detail-stat-val" style="color:var(--gold)">${c.points || 0}</div>
        <div class="detail-stat-lbl">Điểm tích lũy</div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-id-card"></i> Thông tin cá nhân</div>
      <div class="detail-grid">
        <div class="detail-field"><span class="detail-lbl">Mã khách hàng</span><span class="detail-val" style="font-family:monospace;color:var(--accent-primary-light)">${c.id}</span></div>
        <div class="detail-field"><span class="detail-lbl">Giới tính</span><span class="detail-val">${c.gender || '—'}</span></div>
        <div class="detail-field"><span class="detail-lbl">Ngày sinh</span><span class="detail-val">${fmtDate(c.dob)}</span></div>
        <div class="detail-field"><span class="detail-lbl">Ngày tham gia</span><span class="detail-val">${fmtDate(c.joinDate)}</span></div>
        <div class="detail-field" style="grid-column:1/-1"><span class="detail-lbl">Địa chỉ</span><span class="detail-val">${c.address ? c.address + (c.city ? ', ' + c.city : '') : '—'}</span></div>
        ${c.note ? `<div class="detail-field" style="grid-column:1/-1"><span class="detail-lbl">Ghi chú</span><span class="detail-val">${c.note}</span></div>` : ''}
      </div>
    </div>`;
    showModal('detailOverlay');
}
$('detailClose').addEventListener('click', () => hideModal('detailOverlay'));
$('detailCloseBtn').addEventListener('click', () => hideModal('detailOverlay'));
$('detailEditBtn').addEventListener('click', () => { hideModal('detailOverlay'); openEditModal(viewDetailId); });

// ─── MODAL HELPERS ───
function showModal(id) { $(id).classList.add('show'); document.body.style.overflow = 'hidden'; }
function hideModal(id) { $(id).classList.remove('show'); document.body.style.overflow = ''; }
$('modalClose').addEventListener('click', () => hideModal('modalOverlay'));
$('btnCancel').addEventListener('click', () => hideModal('modalOverlay'));
['modalOverlay', 'detailOverlay', 'confirmOverlay'].forEach(id => {
    $(id).addEventListener('click', e => { if (e.target === $(id)) hideModal(id); });
});

// ─── CSV EXPORT ───
$('btnExport').addEventListener('click', () => {
    const rows = [['Mã KH', 'Họ tên', 'Giới tính', 'SĐT', 'Email', 'Ngày sinh', 'Địa chỉ', 'Tỉnh/TP', 'Phân loại', 'Đơn hàng', 'Chi tiêu', 'Điểm', 'Ngày tham gia', 'Ghi chú']];
    filtered.forEach(c => rows.push([c.id, c.name, c.gender || '', c.phone, c.email || '', fmtDate(c.dob), c.address || '', c.city || '', c.type, c.orders, c.spent, c.points || 0, fmtDate(c.joinDate), c.note || '']));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast('Xuất CSV thành công!', 'info');
});

// ─── INIT ───
initDate();
applyFilter();