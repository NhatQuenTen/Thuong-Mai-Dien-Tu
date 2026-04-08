'use strict';
/* =============================================
   MOBISTORE – ANALYTICS  |  analytics.js
   ============================================= */

const $ = id => document.getElementById(id);

// ─── Global Chart.js defaults ───
Chart.defaults.color = '#64748b';
Chart.defaults.borderColor = 'rgba(148,163,184,.08)';
Chart.defaults.font.family = 'Inter, sans-serif';

// ─── Color palette ───
const PALETTE = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#f97316', '#3b82f6', '#ec4899'];
const alpha = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, '0');

// ─── Data generators ───
function genMonthly(base, variance, months = 12) {
    return Array.from({ length: months }, (_, i) => Math.round(base + (Math.random() - 0.4) * variance + i * base * 0.02));
}

const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const DATA = {
    revenue: Array(12).fill(0),
    orders: Array(12).fill(0),
    revenueBy: { labels: [], vals: [] },
    byDay: Array(7).fill(0),
    funnel: [],
    geo: [],
    topProds: [],
    payment: { labels: [], vals: [] },
    ctype: [],
};

// ─── Chart instances ───
let mainChartInst, donutChartInst, barChartInst, paymentChartInst;

// ─── Sparkline (tiny inline canvas) ───
function drawSparkline(containerId, vals, color) {
    const el = $(containerId);
    if (!el) return;
    const canvas = document.createElement('canvas');
    canvas.width = 70; canvas.height = 36;
    el.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const max = Math.max(...vals), min = Math.min(...vals);
    const pts = vals.map((v, i) => ({
        x: i / (vals.length - 1) * 68 + 1,
        y: 34 - (v - min) / (max - min + 1) * 30,
    }));
    const grad = ctx.createLinearGradient(0, 0, 0, 36);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '00');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, 36);
    ctx.lineTo(pts[0].x, 36);
    ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
}

// ─── Main revenue+orders chart ───
function initMainChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const revGrad = ctx.createLinearGradient(0, 0, 0, 280);
    revGrad.addColorStop(0, 'rgba(124,58,237,.35)');
    revGrad.addColorStop(1, 'rgba(124,58,237,.00)');

    mainChartInst = new Chart(ctx, {
        type: 'line',
        data: {
            labels: MONTHS,
            datasets: [
                {
                    label: 'Doanh thu (triệu ₫)',
                    data: DATA.revenue,
                    borderColor: '#7c3aed',
                    backgroundColor: revGrad,
                    borderWidth: 2.5,
                    pointBackgroundColor: '#7c3aed',
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y',
                },
                {
                    label: 'Đơn hàng',
                    data: DATA.orders,
                    borderColor: '#06b6d4',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 3],
                    pointBackgroundColor: '#06b6d4',
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    tension: 0.4,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1f35', borderColor: 'rgba(148,163,184,.15)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12,
                    callbacks: {
                        label: ctx => ctx.datasetIndex === 0
                            ? ` Doanh thu: ${ctx.raw} tr ₫`
                            : ` Đơn hàng: ${ctx.raw}`,
                    }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(148,163,184,.06)' }, ticks: { color: '#64748b', font: { size: 11 } } },
                y: { position: 'left', grid: { color: 'rgba(148,163,184,.06)' }, ticks: { color: '#64748b', font: { size: 11 }, callback: v => v + 'tr' } },
                y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#64748b', font: { size: 11 } } }
            }
        }
    });

    // Custom legend
    $('mainLegend').innerHTML = `
    <div class="legend-item"><div class="legend-dot" style="background:#7c3aed"></div>Doanh thu</div>
    <div class="legend-item"><div class="legend-dot" style="background:#06b6d4"></div>Đơn hàng</div>`;
}

// ─── Donut chart ───
function initDonutChart() {
    const ctx = document.getElementById('donutChart').getContext('2d');
    donutChartInst = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: DATA.revenueBy.labels,
            datasets: [{ data: DATA.revenueBy.vals, backgroundColor: PALETTE, borderColor: '#1a1f35', borderWidth: 3, hoverOffset: 8 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '68%',
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1a1f35', borderColor: 'rgba(148,163,184,.15)', borderWidth: 1, titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12 }
            }
        }
    });
    // Custom legend
    const leg = $('donutLegend');
    DATA.revenueBy.labels.forEach((lbl, i) => {
        const total = DATA.revenueBy.vals.reduce((a, b) => a + b, 0);
        const pct = DATA.revenueBy.vals[i];
        leg.innerHTML += `
    <div class="donut-leg-item">
      <div class="donut-leg-left"><div class="donut-leg-color" style="background:${PALETTE[i]}"></div><span class="donut-leg-name">${lbl}</span></div>
      <span class="donut-leg-val">${pct}%</span>
    </div>`;
    });
}

// ─── Bar chart (orders by day) ───
function initBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    barChartInst = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DAYS,
            datasets: [{
                label: 'Đơn hàng',
                data: DATA.byDay,
                backgroundColor: DATA.byDay.map((v, i) => i === DATA.byDay.indexOf(Math.max(...DATA.byDay)) ? '#7c3aed' : 'rgba(124,58,237,.35)'),
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1f35', borderColor: 'rgba(148,163,184,.15)', borderWidth: 1, titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12 } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
                y: { grid: { color: 'rgba(148,163,184,.06)' }, ticks: { color: '#64748b', font: { size: 11 } } }
            }
        }
    });
}

// ─── Payment doughnut ───
function initPaymentChart() {
    const ctx = document.getElementById('paymentChart').getContext('2d');
    const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'];
    paymentChartInst = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: DATA.payment.labels,
            datasets: [{ data: DATA.payment.vals, backgroundColor: colors, borderColor: '#1a1f35', borderWidth: 3, hoverOffset: 6 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '60%',
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1f35', borderColor: 'rgba(148,163,184,.15)', borderWidth: 1, titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 10 } }
        }
    });
    const leg = $('paymentLegend');
    DATA.payment.labels.forEach((lbl, i) => {
        leg.innerHTML += `
    <div class="pay-leg-item">
      <div class="pay-leg-dot" style="background:${colors[i]}"></div>
      <span class="pay-leg-name">${lbl}</span>
      <span class="pay-leg-pct">${DATA.payment.vals[i]}%</span>
    </div>`;
    });
}
//logout
function logout() {
    localStorage.removeItem('mobistore_auth');
    sessionStorage.removeItem('mobistore_auth');
    window.location.href = 'login.html';
}

// ─── Funnel ───
function renderFunnel() {
    const el = $('funnelWrap');
    const max = DATA.funnel[0].val;
    const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f97316'];
    DATA.funnel.forEach((step, i) => {
        const pct = Math.round(step.val / max * 100);
        const dropPct = i > 0 ? Math.round((1 - step.val / DATA.funnel[i - 1].val) * 100) : null;
        el.innerHTML += `
    <div class="funnel-step">
      <div class="funnel-label-row">
        <span class="funnel-step-name">${step.name}</span>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="funnel-step-val">${step.val.toLocaleString('vi-VN')}</span>
          <span class="funnel-step-pct">${pct}%</span>
        </div>
      </div>
      <div class="funnel-bar-track">
        <div class="funnel-bar-fill" style="width:${pct}%;background:${colors[i]}">${pct > 15 ? step.name.split(' ')[0] : ''}</div>
      </div>
      ${dropPct !== null ? `<div class="funnel-drop"><i class="fas fa-arrow-down"></i>Giảm ${dropPct}%</div>` : ''}
    </div>`;
    });
}

// ─── Geo ───
function renderGeo() {
    const el = $('geoList');
    const gColors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f97316'];
    DATA.geo.forEach((g, i) => {
        el.innerHTML += `
    <div class="geo-item">
      <div class="geo-rank" style="background:${gColors[i]}">${i + 1}</div>
      <span class="geo-name">${g.name}</span>
      <div class="geo-bar-track">
        <div class="geo-bar-fill" style="width:${g.pct}%;background:${gColors[i]}"></div>
      </div>
      <span class="geo-val">${g.val}</span>
    </div>`;
    });
}

// ─── Top Products ───
function renderTopProducts() {
    const el = $('topProducts');
    DATA.topProds.forEach((p, i) => {
        const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
        const barColor = PALETTE[i % PALETTE.length];
        el.innerHTML += `
    <div class="tp-item">
      <div class="tp-rank ${rankClass}">${i + 1}</div>
      <div class="tp-info">
        <div class="tp-name">${p.name}</div>
        <div class="tp-units">${p.units} đã bán</div>
      </div>
      <div class="tp-bar-wrap">
        <span style="font-size:.72rem;color:var(--accent-primary-light);font-weight:700">${p.rev}</span>
        <div class="tp-bar-track"><div class="tp-bar-fill" style="width:${p.pct}%;background:${barColor}"></div></div>
      </div>
    </div>`;
    });
}

// ─── Customer type ───
function renderCtype() {
    const el = $('ctypeList');
    DATA.ctype.forEach(c => {
        el.innerHTML += `
    <div class="ctype-item">
      <div class="ctype-dot" style="background:${c.color}"></div>
      <span class="ctype-name">${c.name}</span>
      <div class="ctype-bar-track">
        <div class="ctype-bar-fill" style="width:${c.pct}%;background:${c.color}"></div>
      </div>
      <span class="ctype-val">${c.pct}%</span>
    </div>`;
    });
}

// ─── Sparklines ───
function renderSparklines() {
    drawSparkline('sparkRev', Array(12).fill(0), '#7c3aed');
    drawSparkline('sparkOrd', Array(12).fill(0), '#06b6d4');
    drawSparkline('sparkCus', Array(12).fill(0), '#10b981');
    drawSparkline('sparkAov', Array(12).fill(0), '#f97316');
}

// ─── Date range change ───
dateRange.addEventListener('change', () => {
    mainChartInst.data.datasets[0].data = Array(12).fill(0);
    mainChartInst.data.datasets[1].data = Array(12).fill(0);
    mainChartInst.update();
    toast('Chua co du lieu thuc de hien thi', 'info');
});

// ─── Export ───
$('btnExport').addEventListener('click', () => {
    const rows = [['Tháng', 'Doanh Thu (triệu ₫)', 'Đơn Hàng']];
    MONTHS.forEach((m, i) => rows.push([m, DATA.revenue[i], DATA.orders[i]]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast('Xuất báo cáo thành công!', 'info');
});

// ─── Sidebar toggle ───
$('sidebarToggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('collapsed');
    $('mainContent').classList.toggle('expanded');
    setTimeout(() => { mainChartInst?.resize(); barChartInst?.resize(); donutChartInst?.resize(); }, 350);
});

// ─── Toast ───
function toast(msg, type = 'info') {
    const icons = { info: 'fa-info-circle', success: 'fa-check-circle' };
    const el = document.createElement('div'); el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'} toast-icon"></i><span>${msg}</span>`;
    $('toastContainer').appendChild(el);
    setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 360); }, 3000);
}

// ─── Init ───
$('currentDate').textContent = new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

window.addEventListener('DOMContentLoaded', () => {
    initMainChart();
    initDonutChart();
    initBarChart();
    initPaymentChart();
    renderFunnel();
    renderGeo();
    renderTopProducts();
    renderCtype();
    renderSparklines();
});
