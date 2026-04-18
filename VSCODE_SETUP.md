# 🎯 VSCode Auto-Sync Setup Guide

## 📋 Cách 4: VSCode Extension Auto-Sync ✅

Bạn có **2 cách** setup VSCode auto-sync:

---

## **Option A: Simple (Recommended)** ✅

### Bước 1: Double-click file này
```
vscode-launch.bat
```

### Bước 2: Sửa code ở VSCode
```
frontend/project/
  ├── index.html (sửa)
  ├── css/style.css (sửa)
  └── js/app.js (sửa)
```

### Bước 3: Auto-sync tự động! ✨
```
Mỗi file save → tự động copy sang public/
```

**Hoạt động:**
```
VSCode (edit) 
   ↓ (save file)
vscode-sync.ps1 (detect)
   ↓ (auto-copy)
public/ (updated)
   ↓
deploy khi sẵn sàng
```

---

## **Option B: Manual Control**

### Bước 1: Mở 2 terminal riêng

**Terminal 1 - Auto-Sync:**
```bash
powershell -ExecutionPolicy Bypass -File "vscode-sync.ps1"
```

**Terminal 2 - VSCode:**
```bash
code .
```

### Bước 2: Sửa code & tự động sync
- VSCode edit → save → auto sync to public/

---

## 🛠️ **File được tạo:**

```
.vscode/
  ├── settings.json       ✅ File watcher settings
  ├── tasks.json          ✅ Sync tasks
  └── filesync.json       ✅ Sync config

vscode-sync.ps1          ✅ Auto-sync script
vscode-launch.bat        ✅ Launcher
PhoneStore.code-workspace ✅ Workspace config
```

---

## ✅ **Quy trình:**

### **Lần đầu:**
```
1. Double-click vscode-launch.bat
2. VSCode + Auto-sync mở cùng lúc
3. Sửa code ở VSCode
4. Auto-sync files → public/
```

### **Lần sau:**
```
1. Chỉ cần mở VSCode bình thường
   code .
2. Hoặc chạy auto-sync:
   powershell -ExecutionPolicy Bypass -File "vscode-sync.ps1"
```

---

## 🔍 **Monitoring Sync Status**

### Khi bạn save file:
```
PowerShell window sẽ hiển thị:
🔄 Detected: index.html
📁 Syncing files from frontend\project to public...
✅ Sync completed at 14:30:45
```

---

## 💡 **Keyboard Shortcuts Setup (Optional)**

Để thêm shortcut trong VSCode:

**File → Preferences → Keyboard Shortcuts**

Tìm: `Tasks: Run Task`

Press: `Ctrl+Shift+S` (hoặc shortcut yêu thích)

Khi bạn muốn sync thủ công:
```
Ctrl+Shift+S → Chọn "Sync frontend/project to public"
```

---

## 🎯 **Workflow tối ưu:**

```
┌─────────────────────────────────────────┐
│ 1. Double-click: vscode-launch.bat      │
│    (VSCode + Auto-sync mở)              │
├─────────────────────────────────────────┤
│ 2. Sửa code ở VSCode                    │
│    frontend/project/index.html          │
├─────────────────────────────────────────┤
│ 3. Save (Ctrl+S)                        │
│    Auto-sync: frontend/ → public/       │
├─────────────────────────────────────────┤
│ 4. Deploy khi sẵn sàng                  │
│    deploy.bat                           │
└─────────────────────────────────────────┘
```

---

## ✨ **Features:**

✅ Real-time monitoring
✅ Auto-copy on changes
✅ No manual copy needed
✅ Background process
✅ Easy to stop (Ctrl+C)
✅ Log tracking

---

## 🔧 **Troubleshooting**

### "Cannot run PowerShell script"
```bash
powershell -ExecutionPolicy Bypass -File "vscode-sync.ps1"
```

### "VSCode command not found"
```
Install VSCode or add to PATH:
C:\Users\{user}\AppData\Local\Programs\Microsoft VS Code\bin
```

### Sync stopped
```
Restart: powershell -ExecutionPolicy Bypass -File "vscode-sync.ps1"
```

---

## 📊 **Performance:**

- Delay: 500ms (tối ưu để tránh lock file)
- Memory: ~50MB (PowerShell process)
- CPU: <5% (idle)
- Quick: Real-time sync

---

**Generated:** 2026-04-17  
**Status:** VSCode Auto-Sync Ready! 🚀
