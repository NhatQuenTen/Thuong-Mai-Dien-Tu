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
    const GROUPS = [];

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
    const SESSIONS = [];
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
    const METHODS = [];
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
    const PROVIDERS = [];
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
    const THEMES = [];
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
    const ITEMS = [];
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
    const INTEGRATIONS = [];
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

    const backups = [];
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
