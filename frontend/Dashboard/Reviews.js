'use strict';
/* =============================================
   MOBISTORE – REVIEWS  |  reviews.js
   Features: CRUD, filter, approve/reject,
   reply, rating distribution, bulk actions
   ============================================= */

// ─── Avatar gradients by name ───
const GRADS = [
    'linear-gradient(135deg,#7c3aed,#06b6d4)',
    'linear-gradient(135deg,#10b981,#06b6d4)',
    'linear-gradient(135deg,#f97316,#ec4899)',
    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
];
const avatarGrad = n => GRADS[(n.charCodeAt(0) || 0) % GRADS.length];
const initials = n => n.trim().split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

// ─── Reply templates ───
const REPLY_TEMPLATES = [
    'Cảm ơn bạn đã tin tưởng MobiStore! Chúng tôi rất vui khi sản phẩm đáp ứng được kỳ vọng của bạn. 🙏',
    'Cảm ơn bạn đã phản hồi! Chúng tôi sẽ cố gắng cải thiện để phục vụ bạn tốt hơn.',
    'MobiStore trân trọng đánh giá của bạn. Mong bạn tiếp tục ủng hộ cửa hàng nhé! 💜',
    'Xin lỗi vì trải nghiệm chưa tốt. Chúng tôi đã ghi nhận và sẽ khắc phục ngay. Mời bạn liên hệ hotline để được hỗ trợ.',
    'Chào bạn! Cảm ơn đã đánh giá 5 sao. Hẹn gặp lại bạn ở lần mua sắm tiếp theo! 🎉',
];

// ─── Sample data ───
const SAMPLE_REVIEWS = [];

// ─── STATE ───
let reviews = JSON.parse(localStorage.getItem('ms_reviews') || 'null') || [];
let filtered = [...reviews];
let currentPage = 1;
const PAGE_SIZE = 6;
let selectedIds = new Set();
let deleteTarget = null;
let replyTargetId = null;
let detailId = null;
let isEditMode = false;
let confirmCb = null;
let activeTab = '';
let selectedStar = 5;

// ─── HELPERS ───
const $ = id => document.getElementById(id);
const fmtDate = d => { if (!d) return '—'; const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };

function genId() {
    const nums = reviews.map(r => parseInt(r.id.replace('RV-', '')) || 0);
    return 'RV-' + (Math.max(0, ...nums) + 1).toString().padStart(3, '0');
}
function saveStorage() { localStorage.setItem('ms_reviews', JSON.stringify(reviews)); }

function renderStars(n, size = '.82rem') {
    let h = '';
    for (let i = 1; i <= 5; i++) h += `<span class="s${i > n ? ' empty' : ''}" style="font-size:${size}"><i class="fa${i <= n ? 's' : 'r'} fa-star"></i></span>`;
    return h;
}

function resolveStatus(r) {
    if (r.reply && r.reply.trim()) return 'replied';
    return r.status;
}

// ─── TOAST ───
function toast(msg, type = 'success') {
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-circle' };
    const el = document.createElement('div'); el.className = `toast ${type}`;
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
    const star = $('filterStar').value;
    const sort = $('filterSort').value;

    filtered = reviews.filter(r => {
        const rs = resolveStatus(r);
        const mQ = !q || r.customer.toLowerCase().includes(q) || (r.product || '').toLowerCase().includes(q) || r.content.toLowerCase().includes(q);
        const mS = !activeTab || rs === activeTab;
        const mStar = !star || r.star === parseInt(star);
        return mQ && mS && mStar;
    });

    // sort
    filtered.sort((a, b) => {
        if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sort === 'highest') return b.star - a.star;
        if (sort === 'lowest') return a.star - b.star;
        if (sort === 'liked') return (b.likes || 0) - (a.likes || 0);
        return new Date(b.date) - new Date(a.date); // newest
    });

    currentPage = 1; selectedIds.clear();
    renderAll();
}

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.dataset.status;
        applyFilter();
    });
});

$('searchInput').addEventListener('input', applyFilter);
$('filterStar').addEventListener('change', applyFilter);
$('filterSort').addEventListener('change', applyFilter);

// ─── RENDER ALL ───
function renderAll() {
    renderKPI();
    renderDistribution();
    renderList();
    renderPagination();
    renderBulkBar();
}

// ─── KPI ───
function renderKPI() {
    const total = reviews.length;
    const pending = reviews.filter(r => resolveStatus(r) === 'pending').length;
    const replied = reviews.filter(r => r.reply && r.reply.trim()).length;
    const avgScore = total ? (reviews.reduce((s, r) => s + r.star, 0) / total).toFixed(1) : '0.0';
    $('kpiTotal').textContent = total;
    $('kpiAvg').textContent = avgScore;
    $('kpiPending').textContent = pending;
    $('kpiReplied').textContent = replied;
    $('pendingBadge').textContent = pending;
    $('pendingBadge').style.display = pending > 0 ? '' : 'none';

    // mini stars in KPI
    const kpiStars = $('kpiStars'); kpiStars.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const el = document.createElement('i');
        el.className = `s-star fas fa-star${i <= Math.round(parseFloat(avgScore)) ? '' : ' empty'}`;
        kpiStars.appendChild(el);
    }
}

// ─── DISTRIBUTION ───
function renderDistribution() {
    const total = reviews.length;
    const avg = total ? (reviews.reduce((s, r) => s + r.star, 0) / total).toFixed(1) : '0.0';
    $('distAvg').textContent = avg;
    $('distCount').textContent = `${total} đánh giá`;

    // Big stars
    const distStars = $('distStars'); distStars.innerHTML = '';
    for (let i = 1; i <= 5; i++) { const el = document.createElement('i'); el.className = `s fa${i <= Math.round(parseFloat(avg)) ? 's' : 'r'} fa-star`; distStars.appendChild(el); }

    // Bars
    const bars = $('distBars'); bars.innerHTML = '';
    for (let s = 5; s >= 1; s--) {
        const cnt = reviews.filter(r => r.star === s).length;
        const pct = total ? Math.round(cnt / total * 100) : 0;
        const colors = ['', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#7c3aed'];
        bars.innerHTML += `
    <div class="dist-bar-row">
      <div class="dist-bar-label"><i class="fas fa-star"></i> ${s}</div>
      <div class="dist-bar-track">
        <div class="dist-bar-fill" style="width:${pct}%;background:${colors[s]}"></div>
      </div>
      <div class="dist-bar-count">${cnt}</div>
    </div>`;
    }
}

// ─── RENDER LIST ───
function renderList() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);
    const list = $('reviewsList');
    const empty = $('emptyState');

    if (page.length === 0) { list.innerHTML = ''; empty.classList.add('show'); return; }
    empty.classList.remove('show');

    list.innerHTML = page.map((r, idx) => {
        const rs = resolveStatus(r);
        const scls = { pending: 's-pending', approved: 's-approved', rejected: 's-rejected', replied: 's-replied' }[rs] || 's-approved';
        const slbl = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', replied: 'Đã phản hồi' }[rs] || '';
        const avatarHtml = `<div class="review-avatar" style="background:${avatarGrad(r.customer)}">${initials(r.customer)}</div>`;
        const isLong = r.content.length > 220;
        const contentHtml = isLong
            ? `<div class="review-content collapsed" id="rc-${r.id}">${r.content}</div>
         <button class="read-more-btn" onclick="toggleReadMore('${r.id}')">Xem thêm ▾</button>`
            : `<div class="review-content">${r.content}</div>`;

        return `
    <div class="review-card status-${rs}${selectedIds.has(r.id) ? ' selected' : ''}" data-id="${r.id}" style="animation-delay:${idx * .05}s">
      <div class="review-card-header">
        ${avatarHtml}
        <div class="review-meta">
          <div class="review-meta-top">
            <span class="reviewer-name">${r.customer}</span>
            ${r.product ? `<span class="review-product"><i class="fas fa-box" style="font-size:.65rem"></i> ${r.product}</span>` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
            <div class="review-stars">${renderStars(r.star)}</div>
            <span class="review-date"><i class="fas fa-calendar-alt" style="font-size:.65rem;margin-right:3px"></i>${fmtDate(r.date)}</span>
          </div>
        </div>
        <div class="review-header-right">
          <input type="checkbox" class="review-check" data-id="${r.id}" ${selectedIds.has(r.id) ? 'checked' : ''}>
          <span class="status-badge ${scls}">${slbl}</span>
        </div>
      </div>
      <div class="review-body">
        ${contentHtml}
        ${r.images && r.images.length ? `<div class="review-images">${r.images.map(img => `<img class="review-img-thumb" src="${img}" alt="review img" onerror="this.style.display='none'">`).join('')}</div>` : ''}
        ${r.reply ? `
        <div class="review-reply">
          <div class="review-reply-header">
            <span class="reply-shop-badge"><i class="fas fa-store"></i> MobiStore</span>
            <span style="font-size:.72rem;color:var(--text-muted)">đã phản hồi</span>
          </div>
          <div class="review-reply-text">${r.reply}</div>
        </div>`: ''}
      </div>
      <div class="review-footer">
        <div class="review-stats">
          <span class="review-stat liked"><i class="fas fa-heart"></i> ${r.likes || 0}</span>
          <span class="review-stat helpful"><i class="fas fa-thumbs-up"></i> ${r.helpful || 0} hữu ích</span>
          ${r.verified ? `<span class="review-stat verified"><i class="fas fa-check-circle"></i> Đã mua hàng</span>` : ''}
        </div>
        <div class="review-actions">
          <button class="icon-btn view-btn"    onclick="openDetail('${r.id}')"   title="Xem chi tiết"><i class="fas fa-eye"></i></button>
          <button class="icon-btn reply-btn"   onclick="openReply('${r.id}')"    title="Phản hồi"><i class="fas fa-reply"></i></button>
          ${rs === 'pending' ? `
          <button class="icon-btn approve-btn" onclick="quickApprove('${r.id}')" title="Duyệt"><i class="fas fa-check"></i></button>
          <button class="icon-btn reject-btn"  onclick="quickReject('${r.id}')"  title="Từ chối"><i class="fas fa-ban"></i></button>` : ''}
          <button class="icon-btn edit-btn"    onclick="openEditModal('${r.id}')" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
          <button class="icon-btn delete-btn"  onclick="confirmDeleteReview('${r.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`;
    }).join('');

    // checkboxes
    list.querySelectorAll('.review-check').forEach(cb => {
        cb.addEventListener('change', e => {
            const id = e.target.dataset.id;
            e.target.checked ? selectedIds.add(id) : selectedIds.delete(id);
            e.target.closest('.review-card').classList.toggle('selected', e.target.checked);
            renderBulkBar();
        });
    });
}

function toggleReadMore(id) {
    const el = $(`rc-${id}`);
    const btn = el.nextElementSibling;
    if (el.classList.contains('collapsed')) { el.classList.remove('collapsed'); btn.textContent = 'Thu gọn ▴'; }
    else { el.classList.add('collapsed'); btn.textContent = 'Xem thêm ▾'; }
}

// ─── PAGINATION ───
function renderPagination() {
    const total = filtered.length; const pages = Math.ceil(total / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE + 1; const end = Math.min(currentPage * PAGE_SIZE, total);
    $('paginationInfo').textContent = total > 0 ? `Hiển thị ${start}–${end} trong ${total} đánh giá` : 'Không có kết quả';
    const pg = $('pagination'); if (pages <= 1) { pg.innerHTML = ''; return; }
    let h = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= pages; i++) {
        if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - currentPage) > 1) { if (i === 3 || i === pages - 2) h += `<span class="page-btn" style="cursor:default">…</span>`; continue; }
        h += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    h += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    pg.innerHTML = h;
}
function goPage(p) { const pages = Math.ceil(filtered.length / PAGE_SIZE); if (p < 1 || p > pages) return; currentPage = p; renderList(); renderPagination(); }

function renderBulkBar() {
    const bar = $('bulkBar');
    if (selectedIds.size > 0) { bar.classList.add('show'); $('bulkCount').textContent = `${selectedIds.size} đánh giá được chọn`; }
    else bar.classList.remove('show');
}

// ─── QUICK ACTIONS ───
function quickApprove(id) {
    const r = reviews.find(x => x.id === id); if (!r) return;
    r.status = 'approved'; saveStorage(); applyFilter();
    toast(`Đã duyệt đánh giá của ${r.customer}!`, 'success');
}
function quickReject(id) {
    const r = reviews.find(x => x.id === id); if (!r) return;
    r.status = 'rejected'; saveStorage(); applyFilter();
    toast(`Đã từ chối đánh giá của ${r.customer}!`, 'warning');
}

// ─── BULK ACTIONS ───
$('bulkApprove').addEventListener('click', () => {
    reviews.forEach(r => { if (selectedIds.has(r.id)) r.status = 'approved'; });
    selectedIds.clear(); saveStorage(); applyFilter(); toast('Đã duyệt các đánh giá!', 'success');
});
$('bulkReject').addEventListener('click', () => {
    reviews.forEach(r => { if (selectedIds.has(r.id)) r.status = 'rejected'; });
    selectedIds.clear(); saveStorage(); applyFilter(); toast('Đã từ chối các đánh giá!', 'warning');
});
$('bulkDelete').addEventListener('click', () => {
    if (!confirm(`Xóa ${selectedIds.size} đánh giá đã chọn?`)) return;
    reviews = reviews.filter(r => !selectedIds.has(r.id));
    selectedIds.clear(); saveStorage(); applyFilter(); toast('Đã xóa các đánh giá!', 'info');
});

// ─── ADD / EDIT MODAL ───
function openAddModal() {
    isEditMode = false; $('editId').value = '';
    $('modalTitle').innerHTML = '<i class="fas fa-star"></i> Thêm đánh giá mới';
    resetForm(); $('fDate').value = new Date().toISOString().split('T')[0];
    setStarPicker(5); showModal('modalOverlay');
}
function openEditModal(id) {
    const r = reviews.find(x => x.id === id); if (!r) return;
    isEditMode = true; $('editId').value = id;
    $('modalTitle').innerHTML = `<i class="fas fa-edit"></i> Chỉnh sửa đánh giá`;
    $('fCustomer').value = r.customer; $('fProduct').value = r.product || '';
    $('fContent').value = r.content; $('fReply').value = r.reply || '';
    $('fStatus').value = r.status; $('fDate').value = r.date;
    $('fImages').value = (r.images || []).join('\n');
    setStarPicker(r.star); clearErrors(); showModal('modalOverlay');
}
function resetForm() {
    ['fCustomer', 'fProduct', 'fContent', 'fReply', 'fImages'].forEach(id => $(id).value = '');
    $('fStatus').value = 'pending'; setStarPicker(5); clearErrors();
}
function clearErrors() { ['errCustomer', 'errContent'].forEach(id => $(id).textContent = '');['fCustomer', 'fContent'].forEach(id => $(id).classList.remove('error')); }
function validateForm() {
    let ok = true; clearErrors();
    if (!$('fCustomer').value.trim()) { $('errCustomer').textContent = 'Nhập tên khách hàng'; $('fCustomer').classList.add('error'); ok = false; }
    if (!$('fContent').value.trim()) { $('errContent').textContent = 'Nhập nội dung đánh giá'; $('fContent').classList.add('error'); ok = false; }
    return ok;
}

$('btnAddReview').addEventListener('click', openAddModal);
$('btnSave').addEventListener('click', () => {
    if (!validateForm()) return;
    const images = $('fImages').value.trim() ? $('fImages').value.trim().split('\n').map(s => s.trim()).filter(Boolean) : [];
    const data = {
        customer: $('fCustomer').value.trim(), product: $('fProduct').value.trim(),
        star: selectedStar, content: $('fContent').value.trim(),
        reply: $('fReply').value.trim(), status: $('fStatus').value,
        date: $('fDate').value || new Date().toISOString().split('T')[0],
        images, likes: 0, helpful: 0, verified: false,
    };
    if (isEditMode) {
        const idx = reviews.findIndex(r => r.id === $('editId').value);
        if (idx !== -1) reviews[idx] = { ...reviews[idx], ...data };
        toast('Cập nhật đánh giá thành công!', 'success');
    } else {
        data.id = genId(); reviews.unshift(data);
        toast('Thêm đánh giá thành công!', 'success');
    }
    saveStorage(); hideModal('modalOverlay'); applyFilter();
});

// ─── STAR PICKER ───
function setStarPicker(val) {
    selectedStar = val; $('fStar').value = val;
    document.querySelectorAll('.star-pick').forEach(s => {
        const v = parseInt(s.dataset.val);
        s.classList.toggle('active', v <= val);
    });
}
document.querySelectorAll('.star-pick').forEach(s => {
    s.addEventListener('mouseenter', () => {
        const v = parseInt(s.dataset.val);
        document.querySelectorAll('.star-pick').forEach(ss => ss.classList.toggle('hovered', parseInt(ss.dataset.val) <= v));
    });
    s.addEventListener('mouseleave', () => document.querySelectorAll('.star-pick').forEach(ss => ss.classList.remove('hovered')));
    s.addEventListener('click', () => setStarPicker(parseInt(s.dataset.val)));
});

// ─── REPLY MODAL ───
function openReply(id) {
    const r = reviews.find(x => x.id === id); if (!r) return;
    replyTargetId = id;
    $('replyPreview').innerHTML = `
    <div class="reply-preview-name">${r.customer}</div>
    <div class="reply-preview-stars">${renderStars(r.star, '.78rem').replace(/class="s /g, 'class="s ')}</div>
    <div class="reply-preview-text">${r.content.slice(0, 180)}${r.content.length > 180 ? '…' : ''}</div>`;
    $('replyText').value = r.reply || '';
    $('errReply').textContent = '';
    // templates
    const chips = $('replyTemplates'); chips.innerHTML = '';
    REPLY_TEMPLATES.forEach(t => {
        const el = document.createElement('div'); el.className = 'reply-chip';
        el.textContent = t.slice(0, 50) + '…';
        el.addEventListener('click', () => { $('replyText').value = t; });
        chips.appendChild(el);
    });
    showModal('replyOverlay');
}
$('replyClose').addEventListener('click', () => hideModal('replyOverlay'));
$('replyCancel').addEventListener('click', () => hideModal('replyOverlay'));
$('replySave').addEventListener('click', () => {
    const text = $('replyText').value.trim();
    if (!text) { $('errReply').textContent = 'Vui lòng nhập nội dung phản hồi'; return; }
    const r = reviews.find(x => x.id === replyTargetId); if (!r) return;
    r.reply = text; r.status = 'replied';
    saveStorage(); hideModal('replyOverlay'); applyFilter();
    toast('Đã gửi phản hồi thành công!', 'success');
});

// ─── DETAIL MODAL ───
function openDetail(id) {
    const r = reviews.find(x => x.id === id); if (!r) return;
    detailId = id;
    const rs = resolveStatus(r);
    const scls = { pending: 's-pending', approved: 's-approved', rejected: 's-rejected', replied: 's-replied' }[rs] || 's-approved';
    const slbl = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', replied: 'Đã phản hồi' }[rs] || '';
    $('detailBody').innerHTML = `
    <div class="detail-review-card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:48px;height:48px;border-radius:12px;background:${avatarGrad(r.customer)};display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:#fff;flex-shrink:0">${initials(r.customer)}</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;color:var(--text-primary)">${r.customer}</div>
          <div style="display:flex;gap:6px;align-items:center;margin-top:4px">
            <div class="review-stars">${renderStars(r.star)}</div>
            <span class="status-badge ${scls}">${slbl}</span>
          </div>
        </div>
        <div style="margin-left:auto;font-size:.78rem;color:var(--text-muted)">${fmtDate(r.date)}</div>
      </div>
      ${r.product ? `<div style="margin-bottom:10px;font-size:.8rem;color:var(--accent-primary-light);background:rgba(124,58,237,.1);padding:5px 12px;border-radius:6px;display:inline-block"><i class="fas fa-box" style="margin-right:5px"></i>${r.product}</div>` : ''}
    </div>
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-comment-dots"></i> Nội dung đánh giá</div>
      <div style="font-size:.88rem;color:var(--text-secondary);line-height:1.8;background:var(--bg-input);padding:16px;border-radius:var(--border-radius);border:1px solid var(--border-color);white-space:pre-line">${r.content}</div>
    </div>
    ${r.images && r.images.length ? `
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-images"></i> Hình ảnh đính kèm</div>
      <div class="review-images">${r.images.map(img => `<img class="review-img-thumb" src="${img}" alt="" onerror="this.style.display='none'">`).join('')}</div>
    </div>`: ''}
    ${r.reply ? `
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-reply"></i> Phản hồi của cửa hàng</div>
      <div class="review-reply" style="margin-bottom:0"><div class="review-reply-text">${r.reply}</div></div>
    </div>`: ''}
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-chart-bar"></i> Thống kê</div>
      <div class="detail-grid">
        <div class="detail-field"><span class="detail-lbl">Lượt thích</span><span class="detail-val" style="color:var(--danger)"><i class="fas fa-heart"></i> ${r.likes || 0}</span></div>
        <div class="detail-field"><span class="detail-lbl">Hữu ích</span><span class="detail-val" style="color:var(--success)"><i class="fas fa-thumbs-up"></i> ${r.helpful || 0}</span></div>
        <div class="detail-field"><span class="detail-lbl">Mã đánh giá</span><span class="detail-val" style="font-family:monospace;color:var(--accent-primary-light)">${r.id}</span></div>
        <div class="detail-field"><span class="detail-lbl">Đã xác minh</span><span class="detail-val">${r.verified ? '<span style="color:var(--info)"><i class="fas fa-check-circle"></i> Đã mua hàng</span>' : '<span style="color:var(--text-muted)">Chưa xác minh</span>'}</span></div>
      </div>
    </div>`;
    showModal('detailOverlay');
}
$('detailClose').addEventListener('click', () => hideModal('detailOverlay'));
$('detailCloseBtn').addEventListener('click', () => hideModal('detailOverlay'));
$('detailEditBtn').addEventListener('click', () => { hideModal('detailOverlay'); openEditModal(detailId); });
//logout
function logout() {
    localStorage.removeItem('mobistore_auth');
    sessionStorage.removeItem('mobistore_auth');
    window.location.href = 'login.html';
}
// ─── DELETE ───
function confirmDeleteReview(id) {
    const r = reviews.find(x => x.id === id);
    deleteTarget = id;
    $('confirmIcon').className = 'confirm-icon-wrap danger';
    $('confirmIcon').innerHTML = '<i class="fas fa-trash"></i>';
    $('confirmTitle').textContent = 'Xác nhận xóa';
    $('confirmText').innerHTML = `Bạn có chắc muốn xóa đánh giá của <strong>${r ? r.customer : id}</strong>?<br><small style="color:var(--text-muted)">Hành động này không thể hoàn tác.</small>`;
    $('confirmOk').innerHTML = '<i class="fas fa-trash"></i> Xóa';
    $('confirmOk').className = 'btn-danger';
    confirmCb = () => {
        reviews = reviews.filter(r => r.id !== deleteTarget);
        saveStorage(); hideModal('confirmOverlay'); applyFilter();
        toast('Đã xóa đánh giá!', 'info'); deleteTarget = null;
    };
    showModal('confirmOverlay');
}
$('confirmOk').addEventListener('click', () => { if (confirmCb) confirmCb(); });
$('confirmCancel').addEventListener('click', () => { hideModal('confirmOverlay'); confirmCb = null; });

// ─── MODAL HELPERS ───
function showModal(id) { $(id).classList.add('show'); document.body.style.overflow = 'hidden'; }
function hideModal(id) { $(id).classList.remove('show'); document.body.style.overflow = ''; }
$('modalClose').addEventListener('click', () => hideModal('modalOverlay'));
$('btnCancel').addEventListener('click', () => hideModal('modalOverlay'));
['modalOverlay', 'replyOverlay', 'detailOverlay', 'confirmOverlay'].forEach(id => {
    $(id).addEventListener('click', e => { if (e.target === $(id)) hideModal(id); });
});

// ─── CSV EXPORT ───
$('btnExport').addEventListener('click', () => {
    const rows = [['Mã', 'Khách hàng', 'Sản phẩm', 'Sao', 'Nội dung', 'Trạng thái', 'Ngày', 'Lượt thích', 'Hữu ích', 'Đã phản hồi']];
    filtered.forEach(r => rows.push([r.id, r.customer, r.product || '', r.star, r.content.replace(/\n/g, ' '), resolveStatus(r), fmtDate(r.date), r.likes || 0, r.helpful || 0, r.reply ? 'Có' : 'Không']));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `reviews_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast('Xuất CSV thành công!', 'info');
});

// ─── INIT ───
initDate();
applyFilter();
