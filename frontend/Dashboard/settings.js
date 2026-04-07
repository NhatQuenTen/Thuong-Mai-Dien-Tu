'use strict';
/* =============================================
   MOBISTORE – SETTINGS  |  settings.js
   ============================================= */

const $ = id => document.getElementById(id);

// ─── Toast ───
function toast(msg, type = 'success') {
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-circle' };
    const el = document.createElement('div'); el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span>${msg}</span>`;
    $('toastContainer').appendChild(el);
    setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 360); }, 3000);
}

// ─── Date ───
$('currentDate').textContent = new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

// ─── Sidebar toggle ───
$('sidebarToggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('collapsed');
    $('mainContent').classList.toggle('expanded');
});

// ─── Settings nav ───
document.querySelectorAll('.snav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.snav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
        item.classList.add('active');
        $('panel-' + item.dataset.section)?.classList.add('active');
    });
});

// ─── Save all ───
$('btnSaveAll').addEventListener('click', () => {
    toast('Đã lưu tất cả thay đổi!', 'success');
});

// ─── Per-section save ───
document.querySelectorAll('.btn-save-section').forEach(btn => {
    btn.addEventListener('click', () => {
        const s = btn.dataset.section;
        const labels = { profile: 'Hồ sơ', store: 'Cửa hàng', notifications: 'Thông báo', security: 'Bảo mật', payment: 'Thanh toán', shipping: 'Vận chuyển', appearance: 'Giao diện' };
        toast(`Đã lưu cài đặt ${labels[s] || s}!`, 'success');
    });
});

// ─── Avatar upload ───
$('changeAvatarBtn').addEventListener('click', () => $('avatarFileInput').click());
$('profileAvatarWrap').addEventListener('click', () => $('avatarFileInput').click());
$('avatarFileInput').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { $('profileAvatarImg').src = ev.target.result; };
    reader.readAsDataURL(file);
    toast('Đã cập nhật ảnh đại diện!', 'success');
});
$('removeAvatarBtn').addEventListener('click', () => {
    $('profileAvatarImg').src = 'https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff&size=100';
    toast('Đã xóa ảnh đại diện', 'info');
});
$('pName').addEventListener('input', () => {
    const v = $('pName').value;
    $('avatarDisplayName').textContent = v || 'Admin';
});

// ─── Password strength ───
$('pwdNew').addEventListener('input', () => {
    const val = $('pwdNew').value;
    const bars = $('pwdStrength');
    const lvl = val.length === 0 ? 0 : val.length < 6 ? 1 : val.length < 10 ? 2 : /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val) ? 4 : 3;
    const colors = ['', '#ef4444', '#f97316', '#f59e0b', '#10b981'];
    bars.innerHTML = [1, 2, 3, 4].map(i => `<div class="pwd-strength-bar" style="background:${i <= lvl ? colors[lvl] : 'var(--bg-card)'}"></div>`).join('');
});

// ─── Password toggle ───
document.querySelectorAll('.pwd-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.querySelector('i').className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
});

// ─── Change password ───
$('btnChangePwd').addEventListener('click', () => {
    const cur = $('pwdCurrent').value; const nw = $('pwdNew').value; const cf = $('pwdConfirm').value;
    if (!cur) return toast('Nhập mật khẩu hiện tại!', 'error');
    if (nw.length < 8) return toast('Mật khẩu mới ít nhất 8 ký tự!', 'error');
    if (nw !== cf) return toast('Mật khẩu xác nhận không khớp!', 'error');
    $('pwdCurrent').value = $('pwdNew').value = $('pwdConfirm').value = '';
    $('pwdStrength').innerHTML = '';
    toast('Đổi mật khẩu thành công!', 'success');
});

// ─── 2FA toggle ───
$('toggle2fa').addEventListener('change', e => {
    $('label2fa').textContent = e.target.checked ? 'Đang bật' : 'Đã tắt';
    toast(e.target.checked ? 'Đã bật xác thực 2FA!' : 'Đã tắt xác thực 2FA!', e.target.checked ? 'success' : 'warning');
});

// ─── Revoke all sessions ───
$('btnRevokeAll').addEventListener('click', () => {
    if (confirm('Đăng xuất tất cả thiết bị khác? Bạn sẽ cần đăng nhập lại trên các thiết bị đó.')) {
        toast('Đã đăng xuất tất cả thiết bị!', 'warning');
    }
});

// ════════════════════════════════════════════════
//  DYNAMIC SECTIONS
// ════════════════════════════════════════════════

// ─── Working hours ───
function renderWorkingHours() {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const el = $('workingHours');
    el.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-bottom:8px';
    days.forEach((d, i) => {
        const isOff = i === 6;
        el.innerHTML += `
    <div style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--border-radius)">
      <span style="width:70px;font-size:.82rem;font-weight:600;color:var(--text-secondary)">${d}</span>
      <label class="toggle"><input type="checkbox" ${isOff ? '' : 'checked'} onchange="this.closest('div').querySelector('.hours-wrap').style.opacity=this.checked?'1':'.4'"><span class="toggle-slider"></span></label>
      <div class="hours-wrap" style="display:flex;align-items:center;gap:8px;opacity:${isOff ? '.4' : '1'}">
        <input type="time" value="${isOff ? '09:00' : '08:00'}" style="padding:6px 10px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:6px;color:var(--text-primary);font-size:.8rem;font-family:inherit;outline:none;color-scheme:dark">
        <span style="color:var(--text-muted);font-size:.8rem">—</span>
        <input type="time" value="${isOff ? '18:00' : '22:00'}" style="padding:6px 10px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:6px;color:var(--text-primary);font-size:.8rem;font-family:inherit;outline:none;color-scheme:dark">
      </div>
    </div>`;
    });
}

// ─── Notifications ───
function renderNotifications() {
    const GROUPS = [
        {
            title: 'Đơn hàng', items: [
                { icon: 'fa-shopping-cart', iconBg: 'rgba(124,58,237,.15)', iconColor: '#a78bfa', title: 'Đơn hàng mới', desc: 'Thông báo khi có đơn hàng mới được tạo', email: true, push: true, sms: false },
                { icon: 'fa-truck', iconBg: 'rgba(6,182,212,.15)', iconColor: '#06b6d4', title: 'Cập nhật vận chuyển', desc: 'Thay đổi trạng thái giao hàng', email: true, push: true, sms: true },
                { icon: 'fa-times-circle', iconBg: 'rgba(239,68,68,.15)', iconColor: '#ef4444', title: 'Đơn hàng bị hủy', desc: 'Khi đơn hàng bị hủy bởi khách hoặc hệ thống', email: true, push: false, sms: false },
            ]
        },
        {
            title: 'Sản phẩm & Kho', items: [
                { icon: 'fa-exclamation-triangle', iconBg: 'rgba(245,158,11,.15)', iconColor: '#f59e0b', title: 'Sắp hết hàng', desc: 'Khi số lượng tồn kho dưới ngưỡng cảnh báo', email: true, push: true, sms: false },
                { icon: 'fa-box-open', iconBg: 'rgba(239,68,68,.15)', iconColor: '#ef4444', title: 'Hết hàng', desc: 'Khi sản phẩm hết hàng hoàn toàn', email: true, push: true, sms: true },
            ]
        },
        {
            title: 'Khách hàng', items: [
                { icon: 'fa-user-plus', iconBg: 'rgba(16,185,129,.15)', iconColor: '#10b981', title: 'Khách hàng mới', desc: 'Khi có tài khoản khách hàng mới đăng ký', email: false, push: true, sms: false },
                { icon: 'fa-star', iconBg: 'rgba(245,158,11,.15)', iconColor: '#f59e0b', title: 'Đánh giá mới', desc: 'Khi khách hàng gửi đánh giá sản phẩm', email: true, push: true, sms: false },
            ]
        },
        {
            title: 'Hệ thống', items: [
                { icon: 'fa-shield-alt', iconBg: 'rgba(59,130,246,.15)', iconColor: '#3b82f6', title: 'Đăng nhập bất thường', desc: 'Phát hiện đăng nhập từ thiết bị lạ', email: true, push: true, sms: true },
                { icon: 'fa-database', iconBg: 'rgba(124,58,237,.15)', iconColor: '#a78bfa', title: 'Sao lưu hoàn tất', desc: 'Khi quá trình sao lưu tự động hoàn thành', email: true, push: false, sms: false },
            ]
        },
    ];

    const el = $('notifGroups');
    GROUPS.forEach(group => {
        let itemsHtml = group.items.map(item => `
    <div class="notif-item">
      <div class="notif-item-left">
        <div class="notif-item-icon" style="background:${item.iconBg};color:${item.iconColor}"><i class="fas ${item.icon}"></i></div>
        <div><div class="notif-item-title">${item.title}</div><div class="notif-item-desc">${item.desc}</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:16px">
        ${['Email', 'Push', 'SMS'].map((ch, ci) => {
            const checked = [item.email, item.push, item.sms][ci];
            return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <label class="toggle"><input type="checkbox" ${checked ? 'checked' : ''}><span class="toggle-slider"></span></label>
            <span style="font-size:.65rem;color:var(--text-muted)">${ch}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`).join('');
        el.innerHTML += `<div><div class="notif-group-title">${group.title}</div><div class="notif-items">${itemsHtml}</div></div>`;
    });
}

// ─── Sessions ───
function renderSessions() {
    const SESSIONS = [
        { device: 'Chrome trên Windows 11', meta: 'TP.Hồ Chí Minh · Lần cuối: Vừa xong', icon: 'fa-desktop', current: true },
        { device: 'Safari trên iPhone 15', meta: 'TP.Hồ Chí Minh · Lần cuối: 2 giờ trước', icon: 'fa-mobile-alt', current: false },
        { device: 'Firefox trên MacBook Pro', meta: 'Hà Nội · Lần cuối: Hôm qua, 14:30', icon: 'fa-laptop', current: false },
    ];
    const el = $('sessionsList');
    SESSIONS.forEach(s => {
        el.innerHTML += `
    <div class="session-item">
      <div class="session-icon"><i class="fas ${s.icon}"></i></div>
      <div class="session-info">
        <div class="session-device" style="display:flex;align-items:center;gap:8px">${s.device}${s.current ? '<span class="session-current">Hiện tại</span>' : ''}</div>
        <div class="session-meta">${s.meta}</div>
      </div>
      ${!s.current ? `<button class="session-revoke" onclick="toast('Đã đăng xuất thiết bị!','warning')">Đăng xuất</button>` : ''}
    </div>`;
    });
}

// ─── Payment methods ───
function renderPaymentMethods() {
    const METHODS = [
        { icon: 'fa-university', iconBg: 'rgba(59,130,246,.15)', iconColor: '#3b82f6', name: 'Chuyển khoản ngân hàng', desc: 'VietcomBank, Techcombank, MB Bank...', enabled: true },
        { icon: 'fa-credit-card', iconBg: 'rgba(124,58,237,.15)', iconColor: '#a78bfa', name: 'Thẻ tín dụng / Ghi nợ', desc: 'Visa, Mastercard, JCB', enabled: true },
        { icon: 'fa-money-bill-wave', iconBg: 'rgba(16,185,129,.15)', iconColor: '#10b981', name: 'Tiền mặt khi nhận hàng', desc: 'COD - Thu tiền tại địa chỉ giao hàng', enabled: true },
        { icon: 'fa-wallet', iconBg: 'rgba(249,115,22,.15)', iconColor: '#f97316', name: 'Ví điện tử', desc: 'MoMo, ZaloPay, VNPay, Shopeepay', enabled: true },
        { icon: 'fa-qrcode', iconBg: 'rgba(6,182,212,.15)', iconColor: '#06b6d4', name: 'QR Code', desc: 'Quét mã QR thanh toán nhanh', enabled: false },
    ];
    const el = $('paymentMethods');
    METHODS.forEach(m => {
        el.innerHTML += `
    <div class="pay-method-card">
      <div class="pay-method-icon" style="background:${m.iconBg};color:${m.iconColor}"><i class="fas ${m.icon}"></i></div>
      <div class="pay-method-info">
        <div class="pay-method-name">${m.name}</div>
        <div class="pay-method-desc">${m.desc}</div>
      </div>
      <div class="pay-method-actions">
        <button class="pay-config-btn" onclick="toast('Mở cấu hình ${m.name}','info')"><i class="fas fa-sliders-h"></i> Cấu hình</button>
        <label class="toggle"><input type="checkbox" ${m.enabled ? 'checked' : ''} onchange="toast(this.checked?'Đã bật ${m.name}':'Đã tắt ${m.name}',this.checked?'success':'warning')"><span class="toggle-slider"></span></label>
      </div>
    </div>`;
    });
}

// ─── Shipping providers ───
function renderShipping() {
    const PROVIDERS = [
        { name: 'Giao Hàng Nhanh (GHN)', fee: '15,000–30,000₫', color: '#ef4444', enabled: true },
        { name: 'Giao Hàng Tiết Kiệm', fee: '12,000–25,000₫', color: '#f97316', enabled: true },
        { name: 'J&T Express', fee: '18,000–35,000₫', color: '#f59e0b', enabled: true },
        { name: 'Viettel Post', fee: '10,000–22,000₫', color: '#3b82f6', enabled: false },
    ];
    const el = $('shippingProviders');
    PROVIDERS.forEach(p => {
        el.innerHTML += `
    <div class="ship-card">
      <div class="ship-card-top">
        <div>
          <div class="ship-card-name">${p.name}</div>
          <div class="ship-card-fee">${p.fee}</div>
        </div>
        <label class="toggle"><input type="checkbox" ${p.enabled ? 'checked' : ''} onchange="toast(this.checked?'Đã bật '+this.closest('.ship-card').querySelector('.ship-card-name').textContent:'Đã tắt','${p.enabled ? 'success' : 'warning'}')"><span class="toggle-slider"></span></label>
      </div>
      <div style="height:3px;border-radius:2px;background:${p.color}30;overflow:hidden"><div style="height:100%;width:${p.enabled ? '80' : '20'}%;background:${p.color};transition:width .5s"></div></div>
    </div>`;
    });
}

// ─── Theme picker ───
function renderThemePicker() {
    const THEMES = [
        { name: 'Violet Cyan', grad: 'linear-gradient(135deg,#7c3aed,#06b6d4)', active: true },
        { name: 'Emerald', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', active: false },
        { name: 'Warm', grad: 'linear-gradient(135deg,#f97316,#ec4899)', active: false },
        { name: 'Cool', grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)', active: false },
        { name: 'Gold', grad: 'linear-gradient(135deg,#f59e0b,#d97706)', active: false },
        { name: 'Rose', grad: 'linear-gradient(135deg,#ec4899,#8b5cf6)', active: false },
    ];
    const el = $('themePicker');
    THEMES.forEach(t => {
        const div = document.createElement('div');
        div.className = `theme-swatch${t.active ? ' active' : ''}`;
        div.style.background = t.grad;
        div.title = t.name;
        div.addEventListener('click', () => {
            document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
            div.classList.add('active');
            toast(`Đã áp dụng chủ đề ${t.name}!`, 'success');
        });
        el.appendChild(div);
    });
}

// ─── Appearance toggles ───
function renderAppearanceToggles() {
    const ITEMS = [
        { title: 'Chế độ tối (Dark Mode)', desc: 'Giao diện nền tối mặc định của hệ thống', checked: true },
        { title: 'Sidebar thu gọn khi khởi động', desc: 'Tự động thu gọn sidebar khi mở trang', checked: false },
        { title: 'Hoạt ảnh & hiệu ứng', desc: 'Bật/tắt toàn bộ animation trên giao diện', checked: true },
        { title: 'Thông báo toast', desc: 'Hiển thị thông báo góc phải màn hình', checked: true },
        { title: 'Bảng điều khiển dày đặc', desc: 'Hiển thị nhiều thông tin hơn trên mỗi hàng', checked: false },
    ];
    const el = $('appearanceToggles');
    ITEMS.forEach(item => {
        el.innerHTML += `
    <div class="appear-row">
      <div><div class="appear-label">${item.title}</div><div class="appear-desc">${item.desc}</div></div>
      <label class="toggle"><input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toast(this.checked?'Đã bật':'Đã tắt','info')"><span class="toggle-slider"></span></label>
    </div>`;
    });
}

// ─── Integrations ───
function renderIntegrations() {
    const INTEGRATIONS = [
        { name: 'Google Analytics', category: 'Phân tích', icon: 'fa-chart-bar', iconBg: 'rgba(249,115,22,.15)', iconColor: '#f97316', desc: 'Theo dõi lượt truy cập và hành vi người dùng trên website.', connected: true },
        { name: 'Facebook Pixel', category: 'Marketing', icon: 'fa-facebook', iconBg: 'rgba(59,130,246,.15)', iconColor: '#3b82f6', desc: 'Theo dõi conversion và chạy quảng cáo Facebook hiệu quả.', connected: true },
        { name: 'Zalo OA', category: 'Liên lạc', icon: 'fa-comment-dots', iconBg: 'rgba(6,182,212,.15)', iconColor: '#06b6d4', desc: 'Gửi thông báo đơn hàng và chăm sóc khách hàng qua Zalo.', connected: true },
        { name: 'Mailchimp', category: 'Email Marketing', icon: 'fa-envelope', iconBg: 'rgba(245,158,11,.15)', iconColor: '#f59e0b', desc: 'Tự động gửi email marketing và newsletter cho khách hàng.', connected: false },
        { name: 'VNPAY', category: 'Thanh toán', icon: 'fa-qrcode', iconBg: 'rgba(239,68,68,.15)', iconColor: '#ef4444', desc: 'Tích hợp cổng thanh toán VNPAY cho đơn hàng online.', connected: true },
        { name: 'Google Sheets', category: 'Xuất dữ liệu', icon: 'fa-table', iconBg: 'rgba(16,185,129,.15)', iconColor: '#10b981', desc: 'Đồng bộ dữ liệu đơn hàng và khách hàng lên Google Sheets.', connected: false },
    ];
    const el = $('integrationsGrid');
    INTEGRATIONS.forEach(int => {
        el.innerHTML += `
    <div class="integration-card">
      <div class="int-card-top">
        <div class="int-icon" style="background:${int.iconBg};color:${int.iconColor}"><i class="fas ${int.icon}"></i></div>
        <div><div class="int-name">${int.name}</div><div class="int-category">${int.category}</div></div>
      </div>
      <div class="int-desc">${int.desc}</div>
      <div class="int-card-footer">
        <span class="int-status ${int.connected ? 'connected' : 'disconnected'}">${int.connected ? 'Đã kết nối' : 'Chưa kết nối'}</span>
        <button class="int-btn ${int.connected ? 'disconnect' : 'connect'}" onclick="toggleIntegration(this,'${int.name}')">
          ${int.connected ? 'Ngắt kết nối' : 'Kết nối'}
        </button>
      </div>
    </div>`;
    });
}
//logout
function logout() {
    localStorage.removeItem('mobistore_auth');
    sessionStorage.removeItem('mobistore_auth');
    window.location.href = 'login.html';
}
function toggleIntegration(btn, name) {
    const isConnect = btn.classList.contains('connect');
    const card = btn.closest('.integration-card');
    const status = card.querySelector('.int-status');
    if (isConnect) {
        btn.classList.replace('connect', 'disconnect'); btn.textContent = 'Ngắt kết nối';
        status.classList.replace('disconnected', 'connected'); status.textContent = 'Đã kết nối';
        toast(`Đã kết nối ${name}!`, 'success');
    } else {
        btn.classList.replace('disconnect', 'connect'); btn.textContent = 'Kết nối';
        status.classList.replace('connected', 'disconnected'); status.textContent = 'Chưa kết nối';
        toast(`Đã ngắt kết nối ${name}`, 'warning');
    }
}

// ─── Backup ───
function renderBackup() {
    $('backupStatus').innerHTML = `
    <div class="backup-icon"><i class="fas fa-check-circle"></i></div>
    <div class="backup-info">
      <div class="backup-title">Sao lưu tự động đang hoạt động</div>
      <div class="backup-meta">Sao lưu cuối: Hôm nay 03:00 AM · Kích thước: 142 MB · Lưu trữ: Google Drive</div>
    </div>
    <button class="backup-btn" onclick="toast('Đang sao lưu dữ liệu...','info')"><i class="fas fa-sync-alt"></i> Sao lưu ngay</button>`;

    const backups = [
        { name: 'backup_2026-04-07_03-00.zip', size: '142 MB', date: '07/04/2026 03:00' },
        { name: 'backup_2026-04-06_03-00.zip', size: '139 MB', date: '06/04/2026 03:00' },
        { name: 'backup_2026-04-05_03-00.zip', size: '138 MB', date: '05/04/2026 03:00' },
        { name: 'backup_2026-04-01_03-00.zip', size: '130 MB', date: '01/04/2026 03:00' },
    ];
    const el = $('backupList');
    backups.forEach(b => {
        el.innerHTML += `
    <div class="backup-item">
      <div class="backup-item-icon"><i class="fas fa-file-archive"></i></div>
      <div class="backup-item-info">
        <div class="backup-item-name">${b.name}</div>
        <div class="backup-item-meta">${b.size} · ${b.date}</div>
      </div>
      <button class="backup-dl-btn" onclick="toast('Đang tải xuống ${b.name}','info')"><i class="fas fa-download"></i> Tải xuống</button>
    </div>`;
    });

    $('dangerZone').innerHTML = `
    <div class="danger-item">
      <div>
        <div class="danger-item-title">Xóa tất cả đơn hàng cũ</div>
        <div class="danger-item-desc">Xóa vĩnh viễn đơn hàng trước 01/01/2025. Không thể phục hồi.</div>
      </div>
      <button class="danger-btn" onclick="if(confirm('Chắc chắn xóa?')) toast('Đã xóa đơn hàng cũ','warning')">Xóa dữ liệu cũ</button>
    </div>
    <div class="danger-item">
      <div>
        <div class="danger-item-title">Đặt lại toàn bộ cài đặt</div>
        <div class="danger-item-desc">Khôi phục tất cả cài đặt về mặc định ban đầu.</div>
      </div>
      <button class="danger-btn" onclick="if(confirm('Đặt lại cài đặt?')) toast('Đã đặt lại cài đặt','warning')">Đặt lại</button>
    </div>
    <div class="danger-item">
      <div>
        <div class="danger-item-title" style="color:var(--danger)">Xóa toàn bộ dữ liệu</div>
        <div class="danger-item-desc">Xóa vĩnh viễn tất cả sản phẩm, đơn hàng và khách hàng. KHÔNG THỂ PHỤC HỒI.</div>
      </div>
      <button class="danger-btn" onclick="if(confirm('⚠️ HÀNH ĐỘNG NÀY XÓA TOÀN BỘ DỮ LIỆU! Tiếp tục?')) toast('Đã hủy - Bảo vệ dữ liệu của bạn','info')">Xóa tất cả</button>
    </div>`;
}

// ─── Init all sections ───
window.addEventListener('DOMContentLoaded', () => {
    renderWorkingHours();
    renderNotifications();
    renderSessions();
    renderPaymentMethods();
    renderShipping();
    renderThemePicker();
    renderAppearanceToggles();
    renderIntegrations();
    renderBackup();
});