'use strict';
/* =============================================
   MOBISTORE – PROMOTIONS  |  promotions.js
   ============================================= */

// ─── CONFIG ───
const TYPE_CFG = {
    percent: { label: '%', icon: 'fa-percent', band: 'linear-gradient(135deg,#7c3aed,#06b6d4)', iconBg: 'rgba(124,58,237,.18)', iconColor: '#a78bfa' },
    fixed: { label: '₫', icon: 'fa-dollar-sign', band: 'linear-gradient(135deg,#10b981,#06b6d4)', iconBg: 'rgba(16,185,129,.18)', iconColor: '#10b981' },
    freeship: { label: '🚚', icon: 'fa-truck', band: 'linear-gradient(135deg,#06b6d4,#3b82f6)', iconBg: 'rgba(6,182,212,.18)', iconColor: '#06b6d4' },
    gift: { label: '🎁', icon: 'fa-gift', band: 'linear-gradient(135deg,#f97316,#ec4899)', iconBg: 'rgba(249,115,22,.18)', iconColor: '#f97316' },
};
const STATUS_CFG = {
    active: { label: 'Đang hoạt động', cls: 's-active' },
    scheduled: { label: 'Sắp diễn ra', cls: 's-scheduled' },
    expired: { label: 'Đã hết hạn', cls: 's-expired' },
    paused: { label: 'Tạm dừng', cls: 's-paused' },
};
const APPLY_LABELS = {
    all: 'Tất cả KH', new: 'KH mới', vip: 'KH VIP', birthday: 'Sinh nhật'
};

// ─── SAMPLE DATA ───
const SAMPLE = [
    { id: 'KM-001', title: 'Flash Sale Tháng 4', code: 'FLASH4', type: 'percent', value: 20, maxDiscount: 500000, minOrder: 500000, limit: 500, used: 312, applyFor: 'all', category: 'all', startDate: '2026-04-01', endDate: '2026-04-30', status: 'active', desc: 'Giảm 20% tất cả đơn hàng từ 500K trong tháng 4.' },
    { id: 'KM-002', title: 'Miễn Phí Ship Hè', code: 'FREESHIP', type: 'freeship', value: 0, maxDiscount: 50000, minOrder: 300000, limit: 1000, used: 488, applyFor: 'all', category: 'all', startDate: '2026-05-01', endDate: '2026-08-31', status: 'scheduled', desc: 'Miễn phí vận chuyển toàn quốc cho đơn từ 300K.' },
    { id: 'KM-003', title: 'Ưu Đãi Điện Thoại', code: 'PHONE15', type: 'percent', value: 15, maxDiscount: 2000000, minOrder: 10000000, limit: 200, used: 87, applyFor: 'all', category: 'Điện thoại', startDate: '2026-03-15', endDate: '2026-04-15', status: 'active', desc: 'Giảm 15% khi mua điện thoại cao cấp từ 10 triệu.' },
    { id: 'KM-004', title: 'Chào Mừng Thành Viên', code: 'WELCOME', type: 'fixed', value: 200000, maxDiscount: 200000, minOrder: 500000, limit: null, used: 234, applyFor: 'new', category: 'all', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', desc: 'Giảm 200K cho khách hàng đăng ký lần đầu.' },
    { id: 'KM-005', title: 'VIP Exclusive', code: 'VIP30', type: 'percent', value: 30, maxDiscount: 3000000, minOrder: 5000000, limit: 100, used: 42, applyFor: 'vip', category: 'all', startDate: '2026-04-01', endDate: '2026-06-30', status: 'active', desc: 'Ưu đãi độc quyền 30% dành cho khách hàng VIP.' },
    { id: 'KM-006', title: 'Sinh Nhật Đặc Biệt', code: 'BIRTHDAY', type: 'percent', value: 25, maxDiscount: 1000000, minOrder: 0, limit: null, used: 156, applyFor: 'birthday', category: 'all', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', desc: 'Tặng ngay ưu đãi 25% vào ngày sinh nhật của bạn.' },
    { id: 'KM-007', title: 'Laptop Giảm Mạnh', code: 'LAPTOP10', type: 'percent', value: 10, maxDiscount: 5000000, minOrder: 20000000, limit: 50, used: 50, applyFor: 'all', category: 'Laptop', startDate: '2026-03-01', endDate: '2026-03-31', status: 'expired', desc: 'Giảm 10% toàn bộ laptop trong tháng 3.' },
    { id: 'KM-008', title: 'Combo Phụ Kiện', code: 'ACC200K', type: 'fixed', value: 200000, maxDiscount: 200000, minOrder: 1000000, limit: 300, used: 178, applyFor: 'all', category: 'Phụ kiện', startDate: '2026-04-10', endDate: '2026-05-10', status: 'scheduled', desc: 'Giảm ngay 200K khi mua combo phụ kiện từ 1 triệu.' },
    { id: 'KM-009', title: 'Tạm Dừng Test', code: 'PAUSE99', type: 'percent', value: 5, maxDiscount: 100000, minOrder: 0, limit: 99, used: 10, applyFor: 'all', category: 'all', startDate: '2026-04-01', endDate: '2026-04-20', status: 'paused', desc: 'Mã test đang tạm dừng.' },
    { id: 'KM-010', title: 'Smartwatch Deal', code: 'WATCH20', type: 'percent', value: 20, maxDiscount: 1500000, minOrder: 3000000, limit: 150, used: 63, applyFor: 'all', category: 'Smartwatch', startDate: '2026-04-05', endDate: '2026-04-25', status: 'active', desc: 'Giảm 20% tất cả smartwatch trong chương trình.' },
];

// ─── STATE ───
let promos = JSON.parse(localStorage.getItem('ms_promos') || 'null') || SAMPLE.map(p => ({ ...p }));
let filtered = [...promos];
let currentPage = 1;
const PAGE_SIZE = 9;
let selectedIds = new Set();
let deleteTarget = null;
let viewDetailId = null;
let isEditMode = false;

// ─── HELPERS ───
const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
const fmtShort = n => {
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + ' tỷ';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.?0+$/, '') + ' tr';
    return new Intl.NumberFormat('vi-VN').format(n);
};
const fmtDate = d => { if (!d) return '—'; const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };
const parseNum = s => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

function genId() {
    const nums = promos.map(p => parseInt(p.id.replace('KM-', '')) || 0);
    return 'KM-' + (Math.max(0, ...nums) + 1).toString().padStart(3, '0');
}
function genCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const len = 6 + Math.floor(Math.random() * 3);
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function saveStorage() { localStorage.setItem('ms_promos', JSON.stringify(promos)); }

function computeStatus(p) {
    if (p.status === 'paused') return 'paused';
    const today = new Date().toISOString().split('T')[0];
    if (p.endDate < today) return 'expired';
    if (p.startDate > today) return 'scheduled';
    return 'active';
}

function formatValue(p) {
    if (p.type === 'percent') return `${p.value}%`;
    if (p.type === 'fixed') return fmtShort(p.value);
    if (p.type === 'freeship') return 'Free Ship';
    if (p.type === 'gift') return 'Gift';
    return '';
}

function daysLeft(endDate) {
    const diff = Math.ceil((new Date(endDate) - new Date()) / 86400000);
    return diff;
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

// ─── FILTER ───
function applyFilter() {
    const q = $('searchInput').value.trim().toLowerCase();
    const type = $('filterType').value;
    const status = $('filterStatus').value;

    filtered = promos.filter(p => {
        const cs = computeStatus(p);
        const mQ = !q || p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q);
        const mT = !type || p.type === type;
        const mS = !status || cs === status;
        return mQ && mT && mS;
    });

    currentPage = 1; selectedIds.clear();
    renderAll();
}

$('searchInput').addEventListener('input', applyFilter);
$('filterType').addEventListener('change', applyFilter);
$('filterStatus').addEventListener('change', applyFilter);
$('btnReset').addEventListener('click', () => {
    $('searchInput').value = ''; $('filterType').value = ''; $('filterStatus').value = '';
    applyFilter();
});

// ─── RENDER ───
function renderAll() { renderKPI(); renderGrid(); renderPagination(); renderBulkBar(); }

function renderKPI() {
    const totalUsed = promos.reduce((s, p) => s + p.used, 0);
    const totalSaved = promos.reduce((s, p) => {
        if (p.type === 'percent') return s + p.used * Math.min((p.value / 100) * 1000000, p.maxDiscount || 1e9);
        if (p.type === 'fixed') return s + p.used * p.value;
        return s;
    }, 0);
    const activeCount = promos.filter(p => computeStatus(p) === 'active').length;

    $('kpiAll').textContent = promos.length;
    $('kpiActive').textContent = activeCount;
    $('kpiUsed').textContent = totalUsed.toLocaleString('vi-VN');
    $('kpiSaved').textContent = fmtShort(totalSaved);

    $('kpiAllSub').textContent = `${promos.filter(p => computeStatus(p) === 'scheduled').length} sắp diễn ra`;
    $('kpiActiveSub').textContent = `${promos.filter(p => computeStatus(p) === 'expired').length} đã hết hạn`;
    $('kpiUsedSub').textContent = 'Tổng lượt dùng mã';
    $('kpiSavedSub').textContent = 'Ước tính tiết kiệm';
}

function renderGrid() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);
    const grid = $('promoGrid');
    const empty = $('emptyState');

    if (page.length === 0) { grid.innerHTML = ''; empty.classList.add('show'); return; }
    empty.classList.remove('show');

    grid.innerHTML = page.map((p, idx) => {
        const cfg = TYPE_CFG[p.type] || TYPE_CFG.percent;
        const cs = computeStatus(p);
        const scfg = STATUS_CFG[cs] || STATUS_CFG.active;
        const pct = p.limit ? Math.min(100, Math.round(p.used / p.limit * 100)) : null;
        const days = daysLeft(p.endDate);
        const isSelected = selectedIds.has(p.id);
        const valueStr = formatValue(p);

        // value badge colour
        const valueBg = p.type === 'percent' ? 'rgba(124,58,237,.15)' : p.type === 'fixed' ? 'rgba(16,185,129,.15)' : p.type === 'freeship' ? 'rgba(6,182,212,.15)' : 'rgba(249,115,22,.15)';
        const valueColor = p.type === 'percent' ? '#a78bfa' : p.type === 'fixed' ? '#10b981' : p.type === 'freeship' ? '#06b6d4' : '#f97316';

        return `
    <div class="promo-card${isSelected ? ' selected' : ''}" data-id="${p.id}" style="animation-delay:${idx * .05}s">
      <div class="promo-card-band" style="background:${cfg.band}"></div>
      <div class="promo-card-header">
        <div class="promo-card-left">
          <div class="promo-type-icon" style="background:${cfg.iconBg};color:${cfg.iconColor}">
            <i class="fas ${cfg.icon}"></i>
          </div>
          <div class="promo-card-title-wrap">
            <div class="promo-card-title" title="${p.title}">${p.title}</div>
            <div class="promo-card-code" onclick="copyCode('${p.code}')">
              <i class="fas fa-copy"></i>${p.code}
            </div>
          </div>
        </div>
        <div class="promo-card-right">
          <input type="checkbox" class="promo-select-check" data-id="${p.id}" ${isSelected ? 'checked' : ''}>
          <div class="promo-value-badge" style="background:${valueBg};color:${valueColor}">${valueStr}</div>
        </div>
      </div>

      <div class="promo-card-body">
        ${p.desc ? `<div class="promo-desc">${p.desc}</div>` : ''}

        <div class="promo-stats">
          <div class="promo-stat">
            <div class="promo-stat-val" style="color:var(--accent-primary-light)">${p.used}</div>
            <div class="promo-stat-lbl">Đã dùng</div>
          </div>
          <div class="promo-stat">
            <div class="promo-stat-val" style="color:var(--accent-secondary)">${p.limit ? p.limit : '∞'}</div>
            <div class="promo-stat-lbl">Tổng mã</div>
          </div>
          <div class="promo-stat">
            <div class="promo-stat-val" style="color:var(--success)">${p.minOrder ? fmtShort(p.minOrder) : '0'}</div>
            <div class="promo-stat-lbl">ĐH tối thiểu</div>
          </div>
        </div>

        ${pct !== null ? `
        <div class="promo-progress-wrap">
          <div class="promo-progress-info">
            <span>Đã dùng ${pct}%</span>
            <span>${p.limit - p.used} còn lại</span>
          </div>
          <div class="promo-progress-bar">
            <div class="promo-progress-fill" style="width:${pct}%;background:${pct >= 90 ? 'var(--danger)' : pct >= 60 ? 'var(--warning)' : cfg.band}"></div>
          </div>
        </div>` : ''}

        <div class="promo-dates">
          <i class="fas fa-calendar-alt"></i>
          <span>${fmtDate(p.startDate)}</span>
          <span class="sep">→</span>
          <span>${fmtDate(p.endDate)}</span>
          ${cs === 'active' && days <= 7 && days >= 0 ? `<span class="promo-countdown"><i class="fas fa-fire"></i> Còn ${days} ngày</span>` : ''}
          ${cs === 'active' && days < 0 ? '<span class="promo-countdown"><i class="fas fa-clock"></i> Hết hạn hôm nay</span>' : ''}
        </div>
      </div>

      <div class="promo-card-footer">
        <span class="status-badge ${scfg.cls}">${scfg.label}</span>
        <div class="card-actions">
          <button class="icon-btn view-btn"   onclick="openDetail('${p.id}')"   title="Xem chi tiết"><i class="fas fa-eye"></i></button>
          <button class="icon-btn edit-btn"   onclick="openEditModal('${p.id}')" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
          <button class="icon-btn copy-btn"   onclick="copyCode('${p.code}')"   title="Sao chép mã"><i class="fas fa-copy"></i></button>
          <button class="icon-btn toggle-btn" onclick="toggleStatus('${p.id}')" title="${cs === 'paused' ? 'Kích hoạt' : 'Tạm dừng'}">
            <i class="fas ${cs === 'paused' ? 'fa-play' : 'fa-pause'}"></i>
          </button>
          <button class="icon-btn delete-btn" onclick="confirmDelete('${p.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`;
    }).join('');

    // checkbox handlers
    $('promoGrid').querySelectorAll('.promo-select-check').forEach(cb => {
        cb.addEventListener('change', e => {
            const id = e.target.dataset.id;
            e.target.checked ? selectedIds.add(id) : selectedIds.delete(id);
            e.target.closest('.promo-card').classList.toggle('selected', e.target.checked);
            renderBulkBar();
        });
    });
}

function renderPagination() {
    const total = filtered.length;
    const pages = Math.ceil(total / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, total);
    $('paginationInfo').textContent = total > 0 ? `Hiển thị ${start}–${end} trong ${total} chương trình` : 'Không có kết quả';

    const pg = $('pagination');
    if (pages <= 1) { pg.innerHTML = ''; return; }
    let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= pages; i++) {
        if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - currentPage) > 1) { if (i === 3 || i === pages - 2) html += `<span class="page-btn" style="cursor:default">…</span>`; continue; }
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    pg.innerHTML = html;
}

function goPage(p) {
    const pages = Math.ceil(filtered.length / PAGE_SIZE);
    if (p < 1 || p > pages) return;
    currentPage = p; renderGrid(); renderPagination();
}

function renderBulkBar() {
    const bar = $('bulkBar');
    if (selectedIds.size > 0) { bar.classList.add('show'); $('bulkCount').textContent = `${selectedIds.size} mã được chọn`; }
    else bar.classList.remove('show');
}

// ─── COPY CODE ───
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => toast(`Đã sao chép mã: ${code}`, 'info'))
        .catch(() => { const ta = document.createElement('textarea'); ta.value = code; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast(`Đã sao chép: ${code}`, 'info'); });
}

// ─── TOGGLE STATUS ───
function toggleStatus(id) {
    const p = promos.find(x => x.id === id);
    if (!p) return;
    const cs = computeStatus(p);
    if (cs === 'paused') { p.status = 'active'; toast('Đã kích hoạt khuyến mãi!', 'success'); }
    else { p.status = 'paused'; toast('Đã tạm dừng khuyến mãi!', 'warning'); }
    saveStorage(); applyFilter();
}

// ─── BULK ───
$('bulkActivate').addEventListener('click', () => {
    promos.forEach(p => { if (selectedIds.has(p.id)) p.status = 'active'; });
    selectedIds.clear(); saveStorage(); applyFilter(); toast(`Đã kích hoạt ${selectedIds.size || 'các'} mã!`, 'success');
});
$('bulkPause').addEventListener('click', () => {
    promos.forEach(p => { if (selectedIds.has(p.id)) p.status = 'paused'; });
    selectedIds.clear(); saveStorage(); applyFilter(); toast('Đã tạm dừng các mã được chọn!', 'warning');
});
$('bulkDelete').addEventListener('click', () => {
    if (!confirm(`Xóa ${selectedIds.size} khuyến mãi đã chọn?`)) return;
    promos = promos.filter(p => !selectedIds.has(p.id));
    selectedIds.clear(); saveStorage(); applyFilter(); toast('Đã xóa các khuyến mãi!', 'success');
});

// ─── ADD / EDIT MODAL ───
function openAddModal() {
    isEditMode = false;
    $('modalTitle').innerHTML = '<i class="fas fa-tags"></i> Tạo khuyến mãi mới';
    $('editId').value = '';
    resetForm();
    const today = new Date().toISOString().split('T')[0];
    $('fStartDate').value = today;
    const end = new Date(); end.setDate(end.getDate() + 30);
    $('fEndDate').value = end.toISOString().split('T')[0];
    updateValueLabel(); updatePreview();
    showModal('modalOverlay');
}

function openEditModal(id) {
    const p = promos.find(x => x.id === id); if (!p) return;
    isEditMode = true;
    $('modalTitle').innerHTML = `<i class="fas fa-edit"></i> Chỉnh sửa — ${p.title}`;
    $('editId').value = id;
    $('fTitle').value = p.title;
    $('fCode').value = p.code;
    $('fType').value = p.type;
    $('fValue').value = p.value;
    $('fMaxDiscount').value = p.maxDiscount ? new Intl.NumberFormat('vi-VN').format(p.maxDiscount) : '';
    $('fMinOrder').value = p.minOrder ? new Intl.NumberFormat('vi-VN').format(p.minOrder) : '';
    $('fLimit').value = p.limit ?? '';
    $('fPerUser').value = p.perUser ?? 1;
    $('fApplyFor').value = p.applyFor || 'all';
    $('fCategory').value = p.category || 'all';
    $('fStartDate').value = p.startDate;
    $('fEndDate').value = p.endDate;
    $('fStatus').value = p.status;
    $('fDesc').value = p.desc || '';
    clearErrors(); updateValueLabel(); updatePreview();
    showModal('modalOverlay');
}

function resetForm() {
    ['fTitle', 'fCode', 'fMaxDiscount', 'fMinOrder', 'fLimit', 'fDesc'].forEach(id => $(id).value = '');
    $('fType').value = 'percent'; $('fValue').value = 10; $('fPerUser').value = 1;
    $('fApplyFor').value = 'all'; $('fCategory').value = 'all'; $('fStatus').value = 'active';
    clearErrors();
}
function clearErrors() {
    ['errTitle', 'errCode', 'errValue', 'errStart', 'errEnd'].forEach(id => $(id).textContent = '');
    ['fTitle', 'fCode', 'fValue', 'fStartDate', 'fEndDate'].forEach(id => $(id).classList.remove('error'));
}
function validateForm() {
    let ok = true; clearErrors();
    if (!$('fTitle').value.trim()) { $('errTitle').textContent = 'Nhập tên chương trình'; $('fTitle').classList.add('error'); ok = false; }
    if (!$('fCode').value.trim()) { $('errCode').textContent = 'Nhập mã khuyến mãi'; $('fCode').classList.add('error'); ok = false; }
    if (!$('fStartDate').value) { $('errStart').textContent = 'Chọn ngày bắt đầu'; $('fStartDate').classList.add('error'); ok = false; }
    if (!$('fEndDate').value) { $('errEnd').textContent = 'Chọn ngày kết thúc'; $('fEndDate').classList.add('error'); ok = false; }
    if ($('fStartDate').value && $('fEndDate').value && $('fEndDate').value < $('fStartDate').value) {
        $('errEnd').textContent = 'Ngày kết thúc phải sau ngày bắt đầu'; $('fEndDate').classList.add('error'); ok = false;
    }
    const t = $('fType').value;
    if ((t === 'percent' || t === 'fixed') && !$('fValue').value) { $('errValue').textContent = 'Nhập giá trị giảm'; $('fValue').classList.add('error'); ok = false; }
    return ok;
}

$('btnAddPromo').addEventListener('click', openAddModal);

$('btnSave').addEventListener('click', () => {
    if (!validateForm()) return;
    const data = {
        title: $('fTitle').value.trim(),
        code: $('fCode').value.trim().toUpperCase(),
        type: $('fType').value,
        value: parseNum($('fValue').value),
        maxDiscount: parseNum($('fMaxDiscount').value),
        minOrder: parseNum($('fMinOrder').value),
        limit: $('fLimit').value ? parseInt($('fLimit').value) : null,
        perUser: parseInt($('fPerUser').value) || 1,
        applyFor: $('fApplyFor').value,
        category: $('fCategory').value,
        startDate: $('fStartDate').value,
        endDate: $('fEndDate').value,
        status: $('fStatus').value,
        desc: $('fDesc').value.trim(),
    };

    if (isEditMode) {
        const idx = promos.findIndex(p => p.id === $('editId').value);
        if (idx !== -1) promos[idx] = { id: promos[idx].id, used: promos[idx].used || 0, ...data };
        toast('Cập nhật khuyến mãi thành công!', 'success');
    } else {
        data.id = genId(); data.used = 0;
        promos.unshift(data);
        toast('Tạo khuyến mãi thành công!', 'success');
    }
    saveStorage(); hideModal('modalOverlay'); applyFilter();
});

// Live value label update
function updateValueLabel() {
    const t = $('fType').value;
    const label = t === 'percent' ? 'Giá trị giảm (%)' : t === 'fixed' ? 'Giá trị giảm (₫)' : t === 'freeship' ? 'Phí ship tối đa (₫)' : 'Mô tả quà tặng';
    $('valueLabel').textContent = label;
    const valueRow = $('valueRow');
    valueRow.style.display = (t === 'freeship' || t === 'gift') ? 'none' : '';
}
$('fType').addEventListener('change', () => { updateValueLabel(); updatePreview(); });

// Live preview
function updatePreview() {
    const code = ($('fCode').value || 'ENTER_CODE').toUpperCase();
    const title = $('fTitle').value || 'Tên chương trình';
    const t = $('fType').value;
    const val = $('fValue').value;
    $('codePreviewText').textContent = code;
    let desc = `${title} — `;
    if (t === 'percent' && val) desc += `Giảm ${val}%`;
    else if (t === 'fixed' && val) desc += `Giảm ${fmtShort(parseNum(val))}`;
    else if (t === 'freeship') desc += 'Miễn phí vận chuyển';
    else if (t === 'gift') desc += 'Kèm quà tặng';
    else desc += 'Nhập giá trị để xem trước';
    $('codePreviewDesc').textContent = desc;
}
['fCode', 'fTitle', 'fValue'].forEach(id => $(id).addEventListener('input', updatePreview));

// Gen code button
$('btnGenCode').addEventListener('click', () => {
    $('fCode').value = genCode();
    updatePreview();
});
//logout
function logout() {
    localStorage.removeItem('mobistore_auth');
    sessionStorage.removeItem('mobistore_auth');
    window.location.href = 'login.html';
}
// ─── DELETE ───
function confirmDelete(id) {
    deleteTarget = id;
    const p = promos.find(x => x.id === id);
    $('confirmText').innerHTML = `Bạn có chắc muốn xóa chương trình<br><strong>${p ? p.title : id}</strong>?<br><span style="font-size:.8rem;color:var(--text-muted)">Mã <code style="color:var(--accent-primary-light)">${p ? p.code : ''}</code> sẽ không còn sử dụng được.</span>`;
    showModal('confirmOverlay');
}
$('confirmOk').addEventListener('click', () => {
    promos = promos.filter(p => p.id !== deleteTarget);
    saveStorage(); hideModal('confirmOverlay'); applyFilter();
    toast('Đã xóa khuyến mãi!', 'success'); deleteTarget = null;
});
$('confirmCancel').addEventListener('click', () => { hideModal('confirmOverlay'); deleteTarget = null; });

// ─── DETAIL ───
function openDetail(id) {
    const p = promos.find(x => x.id === id); if (!p) return;
    viewDetailId = id;
    const cfg = TYPE_CFG[p.type] || TYPE_CFG.percent;
    const cs = computeStatus(p); const scfg = STATUS_CFG[cs] || STATUS_CFG.active;
    $('detailTitle').innerHTML = `<i class="fas ${cfg.icon}"></i> ${p.title}`;
    const pct = p.limit ? Math.min(100, Math.round(p.used / p.limit * 100)) : null;
    $('detailBody').innerHTML = `
    <div class="detail-promo-hero">
      <div class="detail-promo-icon" style="background:${cfg.iconBg};color:${cfg.iconColor}">
        <i class="fas ${cfg.icon}"></i>
      </div>
      <div>
        <div class="detail-promo-title">${p.title}</div>
        <div style="margin-bottom:8px"><span class="status-badge ${scfg.cls}">${scfg.label}</span></div>
        <div class="detail-promo-code" onclick="copyCode('${p.code}')">
          <i class="fas fa-copy"></i>${p.code}
          <span style="font-size:.7rem;color:var(--text-muted);margin-left:4px">nhấn để sao chép</span>
        </div>
      </div>
    </div>
    <div class="detail-stats-row">
      <div class="detail-stat-card">
        <div class="detail-stat-val" style="color:${cfg.iconColor}">${formatValue(p)}</div>
        <div class="detail-stat-lbl">Giá trị giảm</div>
      </div>
      <div class="detail-stat-card">
        <div class="detail-stat-val" style="color:var(--accent-primary-light)">${p.used}</div>
        <div class="detail-stat-lbl">Lượt dùng</div>
      </div>
      <div class="detail-stat-card">
        <div class="detail-stat-val" style="color:var(--accent-secondary)">${p.limit ?? '∞'}</div>
        <div class="detail-stat-lbl">Tổng mã</div>
      </div>
    </div>
    ${pct !== null ? `
    <div style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;font-size:.78rem;color:var(--text-muted);margin-bottom:6px">
        <span>Tỷ lệ sử dụng: ${pct}%</span><span>${p.limit - p.used} mã còn lại</span>
      </div>
      <div class="promo-progress-bar" style="height:8px">
        <div class="promo-progress-fill" style="width:${pct}%;background:${pct >= 90 ? 'var(--danger)' : pct >= 60 ? 'var(--warning)' : cfg.band}"></div>
      </div>
    </div>`: ''}
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-info-circle"></i> Thông tin chi tiết</div>
      <div class="detail-grid">
        <div class="detail-field"><span class="detail-lbl">Loại khuyến mãi</span><span class="detail-val">${p.type === 'percent' ? 'Phần trăm' : p.type === 'fixed' ? 'Số tiền cố định' : p.type === 'freeship' ? 'Miễn phí ship' : 'Quà tặng'}</span></div>
        <div class="detail-field"><span class="detail-lbl">Áp dụng cho</span><span class="detail-val">${APPLY_LABELS[p.applyFor] || 'Tất cả'}</span></div>
        <div class="detail-field"><span class="detail-lbl">Danh mục</span><span class="detail-val">${p.category === 'all' ? 'Tất cả' : p.category}</span></div>
        <div class="detail-field"><span class="detail-lbl">Giới hạn / KH</span><span class="detail-val">${p.perUser ?? 1} lần</span></div>
        <div class="detail-field"><span class="detail-lbl">Đơn tối thiểu</span><span class="detail-val">${p.minOrder ? fmt(p.minOrder) : 'Không'}</span></div>
        <div class="detail-field"><span class="detail-lbl">Giảm tối đa</span><span class="detail-val">${p.maxDiscount ? fmt(p.maxDiscount) : 'Không giới hạn'}</span></div>
        <div class="detail-field"><span class="detail-lbl">Bắt đầu</span><span class="detail-val">${fmtDate(p.startDate)}</span></div>
        <div class="detail-field"><span class="detail-lbl">Kết thúc</span><span class="detail-val">${fmtDate(p.endDate)}</span></div>
      </div>
      ${p.desc ? `<div style="margin-top:12px;padding:12px;background:var(--bg-input);border-radius:var(--border-radius-sm);font-size:.82rem;color:var(--text-secondary);line-height:1.6">${p.desc}</div>` : ''}
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
    const rows = [['Mã KM', 'Tên', 'Mã code', 'Loại', 'Giá trị', 'Đơn tối thiểu', 'Giảm tối đa', 'Giới hạn', 'Đã dùng', 'Áp dụng', 'Danh mục', 'Ngày BĐ', 'Ngày KT', 'Trạng thái', 'Mô tả']];
    filtered.forEach(p => rows.push([p.id, p.title, p.code, p.type, p.value, p.minOrder || 0, p.maxDiscount || 0, p.limit ?? 'Không giới hạn', p.used, p.applyFor, p.category, fmtDate(p.startDate), fmtDate(p.endDate), computeStatus(p), p.desc || '']));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `promotions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast('Xuất CSV thành công!', 'info');
});

// ─── INIT ───
initDate();
applyFilter();