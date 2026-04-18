/* =============================================
   MOBISTORE – ORDERS PAGE  |  orders.js
   Features: CRUD, filter, sort, pagination,
             bulk actions, CSV export, detail view
   ============================================= */

"use strict";

// ─────────────────────────────────────────────
//  SAMPLE DATA
// ─────────────────────────────────────────────
const SAMPLE_ORDERS = [];

// ─────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────
let orders = [];
let filtered = [...orders];
let currentPage = 1;
const PAGE_SIZE = 8;
let sortCol = "date";
let sortDir = "desc";
let selectedIds = new Set();
let deleteTarget = null; // id or array
let isEditMode = false;
let viewDetailId = null;

// product catalog — loaded from Firestore
let PRODUCTS = [];

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";
const fmtShort = (n) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.?0+$/, "") + " tr";
  return new Intl.NumberFormat("vi-VN").format(n);
};

function genId() {
  const nums = orders.map((o) => parseInt(o.id.replace("DH-", "")) || 0);
  const next = (Math.max(0, ...nums) + 1).toString().padStart(3, "0");
  return "DH-" + next;
}

function calcTotal(items, discount, shipping) {
  const sub = items.reduce(
    (s, i) => s + (parseFloat(i.price) || 0) * (parseInt(i.qty) || 1),
    0,
  );
  return Math.max(
    0,
    sub - (parseFloat(discount) || 0) + (parseFloat(shipping) || 0),
  );
}

function calcSub(items) {
  return items.reduce(
    (s, i) => s + (parseFloat(i.price) || 0) * (parseInt(i.qty) || 1),
    0,
  );
}

function parsePrice(str) {
  return parseFloat(str.toString().replace(/[^0-9.]/g, "")) || 0;
}

function saveToStorage() {
  localStorage.setItem("ms_orders", JSON.stringify(orders));
}

function normalizeOrder(raw = {}, fallbackId = "") {
  const createdDate =
    raw.date ||
    (raw.createdAt?.toDate
      ? raw.createdAt.toDate().toISOString().split("T")[0]
      : raw.createdAt || new Date().toISOString().split("T")[0]);
  return {
    id: raw.id || fallbackId,
    customer: raw.customer || raw.name || "",
    phone: raw.phone || "",
    email: raw.email || "",
    address: raw.addressText || raw.address || "",
    items: Array.isArray(raw.items)
      ? raw.items.map((item) => ({
          name: item.name || "",
          qty: Number(item.qty || item.quantity) || 1,
          price: Number(item.price) || 0,
          img: item.img || item.image || "",
          variant: item.variant || "",
        }))
      : [],
    discount: Number(raw.discount) || 0,
    shipping: Number(raw.shipping) || 0,
    payment:
      raw.payment?.method ||
      raw.paymentMethod ||
      raw.payment ||
      "Tiền mặt khi nhận hàng",
    paymentStatus: raw.payment?.status || raw.paymentStatus || "Chờ xác nhận",
    status: raw.status || "Chờ xác nhận",
    date: createdDate,
    note: raw.note || "",
    userId: raw.userId || "",
  };
}

function getPaymentLabel(order) {
  return (
    order.payment?.method ||
    order.paymentMethod ||
    order.payment ||
    "Tiền mặt khi nhận hàng"
  );
}

function getPaymentStatus(order) {
  return order.payment?.status || order.paymentStatus || "Chờ xác nhận";
}

async function persistOrderToFirestore(order) {
  try {
    const db = await waitForFirebase();
    const payload = { ...order };
    delete payload.id;
    await db.collection("orders").doc(order.id).set(payload, { merge: true });
  } catch (error) {
    console.warn("Firestore save order failed:", error);
  }
}

async function deleteOrderFromFirestore(id) {
  try {
    const db = await waitForFirebase();
    await db.collection("orders").doc(id).delete();
  } catch (error) {
    console.warn("Firestore delete order failed:", error);
  }
}

async function updateOrderStatus(id, newStatus) {
  const order = orders.find((item) => item.id === id);
  if (!order) return;
  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  saveToStorage();
  await persistOrderToFirestore(order);
  applyFilter();
  toast(`Đã cập nhật trạng thái: ${newStatus}`, "success");
}

// ─────────────────────────────────────────────
//  FIREBASE FIRESTORE SYNC
// ─────────────────────────────────────────────
function waitForFirebase() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      if (window.firebaseDb) resolve(window.firebaseDb);
      else if (attempts++ > 50) reject(new Error("Firebase DB not available"));
      else setTimeout(check, 100);
    };
    check();
  });
}

function subscribeOrders() {
  waitForFirebase()
    .then((db) => {
      console.log("🔄 Subscribing to Firestore orders...");
      db.collection("orders").onSnapshot(
        (snapshot) => {
          orders = snapshot.docs.map((doc) =>
            normalizeOrder({ id: doc.id, ...doc.data() }, doc.id),
          );
          localStorage.setItem("ms_orders", JSON.stringify(orders));
          filtered = [...orders];
          console.log(`✅ Loaded ${orders.length} orders from Firestore`);
          applyFilter();
        },
        (error) => {
          console.error("❌ Firestore orders error:", error);
        },
      );
    })
    .catch((err) =>
      console.warn("⚠️ Firebase not available for orders:", err.message),
    );
}

function subscribeProductsCatalog() {
  waitForFirebase()
    .then((db) => {
      db.collection("products").onSnapshot((snapshot) => {
        PRODUCTS = snapshot.docs.map((doc) => {
          const d = doc.data();
          return { name: d.name || "", price: Number(d.price) || 0 };
        });
        console.log(`✅ Product catalog loaded: ${PRODUCTS.length} products`);
      });
    })
    .catch(() => {});
}

async function saveOrderToFirestore(order) {
  try {
    const db = await waitForFirebase();
    const data = { ...order };
    const docId = data.id;
    delete data.id;
    if (docId && !docId.startsWith("DH-")) {
      await db.collection("orders").doc(docId).set(data, { merge: true });
    } else {
      data.originalId = docId;
      const ref = await db.collection("orders").add(data);
      order.id = ref.id;
    }
  } catch (e) {
    console.error("Firestore save order failed:", e);
    saveToStorage();
  }
}

function statusClass(s) {
  const map = {
    "Chờ xác nhận": "s-pending",
    "Đã xác nhận": "s-processing",
    "Đang giao hàng": "s-shipping",
    "Đã giao hàng thành công": "s-done",
    "Đã hủy": "s-cancelled",
  };
  return map[s] || "s-pending";
}

function paymentClass(p) {
  const method = typeof p === "object" ? p?.method : p;
  const map = {
    "Tiền mặt khi nhận hàng": "pay-cash",
    "Chuyển khoản ngân hàng": "pay-transfer",
    "Ví MoMo": "pay-ewallet",
    VNPay: "pay-card",
  };
  return map[method] || "pay-cash";
}

function paymentIcon(p) {
  const method = typeof p === "object" ? p?.method : p;
  const map = {
    "Tiền mặt khi nhận hàng": "fa-money-bill-wave",
    "Chuyển khoản ngân hàng": "fa-university",
    "Ví MoMo": "fa-wallet",
    VNPay: "fa-qrcode",
  };
  return map[method] || "fa-money-bill-wave";
}

function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

// ─────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────
function toast(msg, type = "success") {
  const icons = {
    success: "fa-check-circle",
    error: "fa-times-circle",
    info: "fa-info-circle",
    warning: "fa-exclamation-circle",
  };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span>${msg}</span>`;
  $("toastContainer").appendChild(el);
  setTimeout(() => {
    el.classList.add("hide");
    setTimeout(() => el.remove(), 350);
  }, 3000);
}

// ─────────────────────────────────────────────
//  DATE
// ─────────────────────────────────────────────
function initDate() {
  const d = new Date();
  const opts = {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  $("currentDate").textContent = d.toLocaleDateString("vi-VN", opts);
}

// ─────────────────────────────────────────────
//  SIDEBAR TOGGLE
// ─────────────────────────────────────────────
$("sidebarToggle").addEventListener("click", () => {
  $("sidebar").classList.toggle("collapsed");
  $("mainContent").classList.toggle("expanded");
});

// ─────────────────────────────────────────────
//  FILTER & SORT
// ─────────────────────────────────────────────
function applyFilter() {
  const q = $("searchInput").value.trim().toLowerCase();
  const status = $("filterStatus").value;
  const pay = $("filterPayment").value;
  const from = $("filterDateFrom").value;
  const to = $("filterDateTo").value;

  filtered = orders.filter((o) => {
    const matchQ =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q));
    const matchS = !status || o.status === status;
    const matchP = !pay || o.payment === pay;
    const matchF = !from || o.date >= from;
    const matchT = !to || o.date <= to;
    return matchQ && matchS && matchP && matchF && matchT;
  });

  // sort
  filtered.sort((a, b) => {
    let va, vb;
    if (sortCol === "id") {
      va = a.id;
      vb = b.id;
    } else if (sortCol === "total") {
      va = calcTotal(a.items, a.discount, a.shipping);
      vb = calcTotal(b.items, b.discount, b.shipping);
    } else if (sortCol === "status") {
      va = a.status;
      vb = b.status;
    } else if (sortCol === "date") {
      va = a.date;
      vb = b.date;
    } else {
      va = a[sortCol];
      vb = b[sortCol];
    }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  currentPage = 1;
  selectedIds.clear();
  renderAll();
}

// sort click
document.querySelectorAll(".sortable").forEach((th) => {
  th.addEventListener("click", () => {
    const col = th.dataset.col;
    if (sortCol === col) sortDir = sortDir === "asc" ? "desc" : "asc";
    else {
      sortCol = col;
      sortDir = "asc";
    }
    document
      .querySelectorAll(".sortable")
      .forEach((t) => t.classList.remove("asc", "desc"));
    th.classList.add(sortDir);
    applyFilter();
  });
});

$("searchInput").addEventListener("input", applyFilter);
$("filterStatus").addEventListener("change", applyFilter);
$("filterPayment").addEventListener("change", applyFilter);
$("filterDateFrom").addEventListener("change", applyFilter);
$("filterDateTo").addEventListener("change", applyFilter);
$("btnReset").addEventListener("click", () => {
  $("searchInput").value = "";
  $("filterStatus").value = "";
  $("filterPayment").value = "";
  $("filterDateFrom").value = "";
  $("filterDateTo").value = "";
  applyFilter();
});

// stat cards filter
document.querySelectorAll(".stat-card").forEach((card) => {
  card.addEventListener("click", () => {
    document
      .querySelectorAll(".stat-card")
      .forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    $("filterStatus").value = card.dataset.filter;
    applyFilter();
  });
});

// ─────────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────────
function renderAll() {
  renderKPI();
  renderTable();
  renderPagination();
  renderBulkBar();
}

function renderKPI() {
  const count = (s) => orders.filter((o) => o.status === s).length;
  $("kpiAll").textContent = orders.length;
  $("kpiPending").textContent = count("Chờ xác nhận");
  $("kpiProcessing").textContent = count("Đã xác nhận");
  $("kpiShipping").textContent = count("Đang giao hàng");
  $("kpiDone").textContent = count("Đã giao hàng thành công");
  $("kpiCancelled").textContent = count("Đã hủy");
  $("pendingBadge").textContent = count("Chờ xác nhận");
}

function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = filtered.slice(start, start + PAGE_SIZE);
  const tbody = $("ordersTableBody");
  const empty = $("emptyState");

  if (page.length === 0) {
    tbody.innerHTML = "";
    empty.classList.add("show");
    return;
  }
  empty.classList.remove("show");

  tbody.innerHTML = page
    .map((o, idx) => {
      const total = calcTotal(o.items, o.discount, o.shipping);
      const itemTags = o.items
        .slice(0, 2)
        .map((i) => `<span class="product-tag">${i.name} x${i.qty}</span>`)
        .join("");
      const moreTags =
        o.items.length > 2
          ? `<span class="product-tag more">+${o.items.length - 2}</span>`
          : "";
      const delay = idx * 0.04;
      const paymentLabel = getPaymentLabel(o);
      return `
    <tr data-id="${o.id}" style="animation-delay:${delay}s" class="${selectedIds.has(o.id) ? "selected" : ""}">
      <td><input type="checkbox" class="checkbox row-check" data-id="${o.id}" ${selectedIds.has(o.id) ? "checked" : ""}></td>
      <td><span class="order-id">${o.id}</span></td>
      <td>
        <div class="customer-cell">
          <span class="customer-name">${o.customer}</span>
          <span class="customer-phone">${o.phone}</span>
        </div>
      </td>
      <td>
        <div class="products-cell">${itemTags}${moreTags}</div>
      </td>
      <td><span class="total-price">${fmt(total)}</span></td>
      <td>
                <span class="payment-badge ${paymentClass(o.payment)}">
                    <i class="fas ${paymentIcon(o.payment)}"></i>${paymentLabel}
        </span>
      </td>
            <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
      <td><span class="date-cell">${fmtDate(o.date)}</span></td>
      <td>
        <div class="action-btns">
                    ${o.status === "Chờ xác nhận" ? `<button class="icon-btn confirm-btn" onclick="updateOrderStatus('${o.id}', 'Đã xác nhận')" title="Xác nhận"><i class="fas fa-check"></i></button>` : ""}
                    ${o.status === "Đã xác nhận" || o.status === "Đang giao hàng" ? `<button class="icon-btn ship-btn" onclick="updateOrderStatus('${o.id}', 'Đã giao hàng thành công')" title="Đã giao hàng thành công"><i class="fas fa-truck"></i></button>` : ""}
          <button class="icon-btn view-btn"   onclick="openDetail('${o.id}')"  title="Xem chi tiết"><i class="fas fa-eye"></i></button>
          <button class="icon-btn edit-btn"   onclick="openEditModal('${o.id}')" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
          <button class="icon-btn delete-btn" onclick="confirmDelete('${o.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
    })
    .join("");

  // row checkboxes
  tbody.querySelectorAll(".row-check").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) selectedIds.add(id);
      else selectedIds.delete(id);
      const tr = e.target.closest("tr");
      tr.classList.toggle("selected", e.target.checked);
      updateSelectAll();
      renderBulkBar();
    });
  });
}

function updateSelectAll() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageIds = filtered.slice(start, start + PAGE_SIZE).map((o) => o.id);
  $("selectAll").checked =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  $("selectAll").indeterminate =
    pageIds.some((id) => selectedIds.has(id)) && !$("selectAll").checked;
}

$("selectAll").addEventListener("change", (e) => {
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageIds = filtered.slice(start, start + PAGE_SIZE).map((o) => o.id);
  pageIds.forEach((id) =>
    e.target.checked ? selectedIds.add(id) : selectedIds.delete(id),
  );
  renderTable();
  renderBulkBar();
});

function renderPagination() {
  const total = filtered.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const info = $("paginationInfo");
  const pg = $("pagination");
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, total);

  info.textContent =
    total > 0
      ? `Hiển thị ${start}–${end} trong ${total} đơn hàng`
      : "Không có kết quả";

  if (pages <= 1) {
    pg.innerHTML = "";
    return;
  }

  let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>
    <i class="fas fa-chevron-left"></i></button>`;

  for (let i = 1; i <= pages; i++) {
    if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - currentPage) > 1) {
      if (i === 3 || i === pages - 2)
        html += `<span class="page-btn" style="cursor:default">…</span>`;
      continue;
    }
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goPage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? "disabled" : ""}>
    <i class="fas fa-chevron-right"></i></button>`;
  pg.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
  renderPagination();
}
function logout() {
  localStorage.removeItem("mobistore_auth");
  sessionStorage.removeItem("mobistore_auth");
  window.location.href = "login.html";
}
function renderBulkBar() {
  const bar = $("bulkBar");
  if (selectedIds.size > 0) {
    bar.classList.add("show");
    $("bulkCount").textContent = `${selectedIds.size} đơn hàng được chọn`;
  } else {
    bar.classList.remove("show");
  }
}

// ─────────────────────────────────────────────
//  BULK ACTIONS
// ─────────────────────────────────────────────
$("bulkConfirm").addEventListener("click", () =>
  bulkUpdateStatus("Đã xác nhận"),
);
$("bulkShip").addEventListener("click", () =>
  bulkUpdateStatus("Đã giao hàng thành công"),
);
$("bulkCancel").addEventListener("click", () => bulkUpdateStatus("Đã hủy"));
$("bulkDelete").addEventListener("click", () => {
  if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.size} đơn hàng đã chọn?`))
    return;
  const deletedIds = [...selectedIds];
  orders = orders.filter((o) => !selectedIds.has(o.id));
  selectedIds.clear();
  saveToStorage();
  deletedIds.forEach((id) => deleteOrderFromFirestore(id));
  applyFilter();
  toast(`Đã xóa ${selectedIds.size} đơn hàng`, "success");
});

function bulkUpdateStatus(newStatus) {
  const targets = orders.filter((o) => selectedIds.has(o.id));
  orders.forEach((o) => {
    if (selectedIds.has(o.id)) o.status = newStatus;
  });
  selectedIds.clear();
  saveToStorage();
  targets.forEach((o) => persistOrderToFirestore(o));
  applyFilter();
  toast(`Đã cập nhật trạng thái: ${newStatus}`, "success");
}

// ─────────────────────────────────────────────
//  ADD / EDIT MODAL
// ─────────────────────────────────────────────
function openAddModal() {
  isEditMode = false;
  $("modalTitle").textContent = "Tạo đơn hàng mới";
  $("editId").value = "";
  resetForm();
  addItemRow();
  $("fDate").value = new Date().toISOString().split("T")[0];
  showModal("modalOverlay");
}

function openEditModal(id) {
  const o = orders.find((x) => x.id === id);
  if (!o) return;
  isEditMode = true;
  $("modalTitle").textContent = `Chỉnh sửa đơn hàng ${id}`;
  $("editId").value = id;

  $("fCustomer").value = o.customer;
  $("fPhone").value = o.phone;
  $("fEmail").value = o.email || "";
  $("fAddress").value = o.address || "";
  $("fPayment").value = o.payment;
  $("fStatus").value = o.status;
  $("fDate").value = o.date;
  $("fNote").value = o.note || "";
  $("fDiscount").value = o.discount || 0;
  $("fShipping").value = o.shipping ?? 30000;

  // items
  $("orderItemsList").innerHTML = "";
  o.items.forEach((i) => addItemRow(i));
  updateSummary();
  showModal("modalOverlay");
}

function resetForm() {
  ["fCustomer", "fPhone", "fEmail", "fAddress", "fNote"].forEach(
    (id) => ($(id).value = ""),
  );
  $("fPayment").value = "Tiền mặt khi nhận hàng";
  $("fStatus").value = "Chờ xác nhận";
  $("fDiscount").value = 0;
  $("fShipping").value = 30000;
  $("orderItemsList").innerHTML = "";
  clearErrors();
  updateSummary();
}

function clearErrors() {
  ["errCustomer", "errPhone"].forEach((id) => ($(id).textContent = ""));
  ["fCustomer", "fPhone"].forEach((id) => $(id).classList.remove("error"));
}

function validateForm() {
  let ok = true;
  clearErrors();
  if (!$("fCustomer").value.trim()) {
    $("errCustomer").textContent = "Vui lòng nhập tên khách hàng";
    $("fCustomer").classList.add("error");
    ok = false;
  }
  if (!$("fPhone").value.trim()) {
    $("errPhone").textContent = "Vui lòng nhập số điện thoại";
    $("fPhone").classList.add("error");
    ok = false;
  }
  const items = collectItems();
  if (items.length === 0 || items.every((i) => !i.name.trim())) {
    toast("Vui lòng thêm ít nhất một sản phẩm", "error");
    ok = false;
  }
  return ok;
}

$("btnAddOrder").addEventListener("click", openAddModal);

$("btnSave").addEventListener("click", () => {
  if (!validateForm()) return;
  const items = collectItems().filter((i) => i.name.trim());
  const discount = parseFloat($("fDiscount").value) || 0;
  const shipping = parseFloat($("fShipping").value) || 0;
  const data = {
    customer: $("fCustomer").value.trim(),
    phone: $("fPhone").value.trim(),
    email: $("fEmail").value.trim(),
    address: $("fAddress").value.trim(),
    items,
    discount,
    shipping,
    payment: $("fPayment").value,
    status: $("fStatus").value,
    date: $("fDate").value,
    note: $("fNote").value.trim(),
  };

  if (isEditMode) {
    const idx = orders.findIndex((o) => o.id === $("editId").value);
    if (idx !== -1) {
      orders[idx] = { id: orders[idx].id, ...data };
    }
    toast("Cập nhật đơn hàng thành công!", "success");
  } else {
    data.id = genId();
    orders.unshift(data);
    toast("Tạo đơn hàng thành công!", "success");
  }
  saveToStorage();
  persistOrderToFirestore({ id: data.id || $("editId").value, ...data });
  hideModal("modalOverlay");
  applyFilter();
});

// ─────────────────────────────────────────────
//  ORDER ITEMS
// ─────────────────────────────────────────────
$("btnAddItem").addEventListener("click", () => {
  addItemRow();
  updateSummary();
});

function addItemRow(item = null) {
  const row = document.createElement("div");
  row.className = "order-item-row";

  // build product options
  const opts = PRODUCTS.map(
    (p) =>
      `<option value="${p.name}" data-price="${p.price}">${p.name}</option>`,
  ).join("");

  row.innerHTML = `
    <select class="form-input item-name">
      <option value="">-- Chọn sản phẩm --</option>
      ${opts}
    </select>
    <input type="number" class="form-input item-qty"   value="${item ? item.qty : 1}" min="1" placeholder="Số lượng">
    <span class="item-price-display">${item ? fmt(item.price) : "0 ₫"}</span>
    <button type="button" class="btn-remove-item"><i class="fas fa-times"></i></button>
    <input type="hidden" class="item-price-val" value="${item ? item.price : 0}">
  `;

  const select = row.querySelector(".item-name");
  const qtyInp = row.querySelector(".item-qty");
  const priceD = row.querySelector(".item-price-display");
  const priceH = row.querySelector(".item-price-val");

  if (item) {
    // set existing
    const opt = [...select.options].find((o) => o.value === item.name);
    if (opt) select.value = item.name;
    else {
      const custom = document.createElement("option");
      custom.value = item.name;
      custom.textContent = item.name;
      custom.dataset.price = item.price;
      select.appendChild(custom);
      select.value = item.name;
    }
  }

  select.addEventListener("change", () => {
    const chosen = select.options[select.selectedIndex];
    const price = parseFloat(chosen.dataset.price) || 0;
    priceH.value = price;
    priceD.textContent = fmt(price * (parseInt(qtyInp.value) || 1));
    updateSummary();
  });

  qtyInp.addEventListener("input", () => {
    priceD.textContent = fmt(
      (parseFloat(priceH.value) || 0) * (parseInt(qtyInp.value) || 1),
    );
    updateSummary();
  });

  row.querySelector(".btn-remove-item").addEventListener("click", () => {
    row.remove();
    updateSummary();
  });

  $("orderItemsList").appendChild(row);
}

function collectItems() {
  return [...$("orderItemsList").querySelectorAll(".order-item-row")].map(
    (row) => ({
      name: row.querySelector(".item-name").value,
      qty: parseInt(row.querySelector(".item-qty").value) || 1,
      price: parseFloat(row.querySelector(".item-price-val").value) || 0,
    }),
  );
}

function updateSummary() {
  const items = collectItems();
  const sub = calcSub(items);
  const discount = parseFloat($("fDiscount").value) || 0;
  const shipping = parseFloat($("fShipping").value) || 0;
  const total = Math.max(0, sub - discount + shipping);
  $("subtotalDisplay").textContent = fmt(sub);
  $("totalDisplay").textContent = fmt(total);
}

$("fDiscount").addEventListener("input", updateSummary);
$("fShipping").addEventListener("input", updateSummary);

// ─────────────────────────────────────────────
//  DELETE
// ─────────────────────────────────────────────
function confirmDelete(id) {
  deleteTarget = id;
  const o = orders.find((x) => x.id === id);
  $("confirmText").innerHTML =
    `Bạn có chắc muốn xóa đơn hàng <strong>${id}</strong>
    (${o ? o.customer : ""})? <br>Hành động này không thể hoàn tác.`;
  showModal("confirmOverlay");
}

$("confirmOk").addEventListener("click", () => {
  if (!deleteTarget) return;
  orders = orders.filter((o) => o.id !== deleteTarget);
  saveToStorage();
  deleteOrderFromFirestore(deleteTarget);
  hideModal("confirmOverlay");
  applyFilter();
  toast("Đã xóa đơn hàng thành công!", "success");
  deleteTarget = null;
});
$("confirmCancel").addEventListener("click", () => {
  hideModal("confirmOverlay");
  deleteTarget = null;
});

// ─────────────────────────────────────────────
//  DETAIL VIEW
// ─────────────────────────────────────────────
function openDetail(id) {
  const o = orders.find((x) => x.id === id);
  if (!o) return;
  viewDetailId = id;
  const total = calcTotal(o.items, o.discount, o.shipping);
  const sub = calcSub(o.items);

  $("detailTitle").innerHTML =
    `<span style="color:var(--primary)">${o.id}</span> — Chi tiết đơn hàng`;
  $("detailBody").innerHTML = `
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-user"></i> Khách hàng</div>
      <div class="detail-grid">
        <div class="detail-field"><span class="detail-lbl">Tên khách hàng</span><span class="detail-val">${o.customer}</span></div>
        <div class="detail-field"><span class="detail-lbl">Số điện thoại</span><span class="detail-val">${o.phone}</span></div>
        <div class="detail-field"><span class="detail-lbl">Email</span><span class="detail-val">${o.email || "—"}</span></div>
        <div class="detail-field"><span class="detail-lbl">Địa chỉ giao hàng</span><span class="detail-val">${o.address || "—"}</span></div>
      </div>
    </div>
    <div class="detail-divider"></div>
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-box"></i> Sản phẩm</div>
      <table class="detail-items-table">
        <thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>SL</th><th>Thành tiền</th></tr></thead>
        <tbody>
          ${o.items
            .map(
              (i) => `
            <tr>
              <td>${i.name}</td>
              <td>${fmt(i.price)}</td>
              <td>${i.qty}</td>
              <td>${fmt(i.price * i.qty)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <div style="margin-top:12px; display:flex; flex-direction:column; gap:6px; font-size:13px; color:var(--text-secondary)">
        <div style="display:flex;justify-content:space-between"><span>Tạm tính:</span><span>${fmt(sub)}</span></div>
        <div style="display:flex;justify-content:space-between"><span>Giảm giá:</span><span>-${fmt(o.discount || 0)}</span></div>
        <div style="display:flex;justify-content:space-between"><span>Phí vận chuyển:</span><span>+${fmt(o.shipping ?? 30000)}</span></div>
      </div>
      <div class="detail-total-row">
        <span class="detail-total-label">Tổng cộng</span>
        <span class="detail-total-val">${fmt(total)}</span>
      </div>
    </div>
    <div class="detail-divider"></div>
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-info-circle"></i> Thông tin đơn hàng</div>
      <div class="detail-grid">
        <div class="detail-field">
          <span class="detail-lbl">Trạng thái</span>
          <span class="detail-val"><span class="status-badge ${statusClass(o.status)}">${o.status}</span></span>
        </div>
        <div class="detail-field">
          <span class="detail-lbl">Thanh toán</span>
          <span class="detail-val"><span class="payment-badge ${paymentClass(o.payment)}"><i class="fas ${paymentIcon(o.payment)}"></i> ${o.payment}</span></span>
        </div>
        <div class="detail-field"><span class="detail-lbl">Ngày đặt hàng</span><span class="detail-val">${fmtDate(o.date)}</span></div>
        <div class="detail-field"><span class="detail-lbl">Ghi chú</span><span class="detail-val">${o.note || "—"}</span></div>
      </div>
    </div>
  `;
  showModal("detailOverlay");
}

$("detailClose").addEventListener("click", () => hideModal("detailOverlay"));
$("detailCloseBtn").addEventListener("click", () => hideModal("detailOverlay"));
$("detailEditBtn").addEventListener("click", () => {
  hideModal("detailOverlay");
  openEditModal(viewDetailId);
});

// ─────────────────────────────────────────────
//  MODAL HELPERS
// ─────────────────────────────────────────────
function showModal(id) {
  $(id).classList.add("show");
  document.body.style.overflow = "hidden";
}
function hideModal(id) {
  $(id).classList.remove("show");
  document.body.style.overflow = "";
}

$("modalClose").addEventListener("click", () => hideModal("modalOverlay"));
$("btnCancel").addEventListener("click", () => hideModal("modalOverlay"));

// close on overlay click
["modalOverlay", "detailOverlay", "confirmOverlay"].forEach((id) => {
  $(id).addEventListener("click", (e) => {
    if (e.target === $(id)) hideModal(id);
  });
});

// ─────────────────────────────────────────────
//  CSV EXPORT
// ─────────────────────────────────────────────
$("btnExport").addEventListener("click", () => {
  const rows = [
    [
      "Mã đơn",
      "Khách hàng",
      "SĐT",
      "Email",
      "Sản phẩm",
      "Tổng tiền",
      "Thanh toán",
      "Trạng thái",
      "Ngày đặt",
      "Ghi chú",
    ],
  ];
  filtered.forEach((o) => {
    const total = calcTotal(o.items, o.discount, o.shipping);
    const products = o.items.map((i) => `${i.name} x${i.qty}`).join(" | ");
    rows.push([
      o.id,
      o.customer,
      o.phone,
      o.email || "",
      products,
      total,
      o.payment,
      o.status,
      fmtDate(o.date),
      o.note || "",
    ]);
  });
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Xuất CSV thành công!", "info");
});

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
initDate();
// Load from localStorage cache first
orders = JSON.parse(localStorage.getItem("ms_orders") || "[]");
filtered = [...orders];
applyFilter();
// Subscribe to Firestore for real-time sync
subscribeOrders();
subscribeProductsCatalog();
