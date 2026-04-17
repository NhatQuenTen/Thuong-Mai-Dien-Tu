# 📱 Hệ Thống Cửa Hàng Bán Điện Thoại Trực Tuyến

<div align="center">

![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Một nền tảng thương mại điện tử hiện đại để mua bán điện thoại di động trực tuyến**

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Chính](#-tính-năng-chính)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt & Thiết Lập](#-cài-đặt--thiết-lập)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Bảo Mật](#-bảo-mật)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Đóng Góp](#-đóng-góp)
- [Support & Liên Hệ](#-support--liên-hệ)

---

## 😊 Giới Thiệu

**phoneStore** là một ứng dụng thương mại điện tử toàn diện được thiết kế để quản lý bán lẻ điện thoại di động. Hệ thống cung cấp một trải nghiệm mua sắm mượt mà cho khách hàng cùng với công cụ quản lý mạnh mẽ cho nhà quản trị.

### Đặc Điểm Nổi Bật:
- 🛍️ **Giao diện mua sắm hiện đại** - Website chuẩn HTML5/CSS3 với UX/UI tối ưu
- 👨‍💼 **Dashboard quản trị toàn diện** - Quản lý sản phẩm, đơn hàng, người dùng, khuyến mãi
- 🔐 **Xác thực bảo mật** - Firebase Authentication + Firestore Security Rules
- 📊 **Phân tích dữ liệu** - Tổng hợp báo cáo bán hàng và thống kê khách hàng
- 📦 **Quản lý kho** - Theo dõi tồn kho, nhập/xuất sản phẩm
- 💳 **Thanh toán linh hoạt** - Hỗ trợ nhiều phương thức thanh toán
- 🏷️ **Quản lý khuyến mãi** - Mã giảm giá, chương trình khuyến mãi theo mùa
- ⭐ **Hệ thống bình luận** - Khách hàng có thể đánh giá sản phẩm

---

## ✨ Tính Năng Chính

### Cho Khách Hàng
```
✓ Đăng ký/Đăng nhập tài khoản
✓ Duyệt và tìm kiếm sản phẩm
✓ Xem chi tiết sản phẩm, ảnh, thông số kỹ thuật
✓ Thêm sản phẩm vào giỏ hàng
✓ Quản lý giỏ hàng (thêm, xóa, cập nhật số lượng)
✓ Đặt hàng / thanh toán
✓ Theo dõi lịch sử đơn hàng
✓ Xem bảo hành sản phẩm
✓ Đánh giá và bình luận sản phẩm
✓ Quản lý thông tin cá nhân, địa chỉ giao hàng
✓ Xem các chương trình khuyến mãi
```

### Cho Quản Trị Viên
```
✓ Quản lý sản phẩm (CRUD)
✓ Quản lý danh mục sản phẩm
✓ Quản lý đơn hàng (xem, cập nhật trạng thái)
✓ Quản lý người dùng (khóa/mở khóa tài khoản)
✓ Quản lý khuyến mãi và mã giảm giá
✓ Quản lý bình luận và đánh giá
✓ Xem báo cáo doanh thu
✓ Quản lý ảnh sản phẩm (upload, xóa)
✓ Quản lý cài đặt website
✓ Nhập/xuất dữ liệu người dùng
```

---

## 🛠️ Công Nghệ Sử Dụng

<table>
<tr>
  <td><strong>Frontend</strong></td>
  <td>
    • React.js / HTML5<br>
    • CSS3 (Responsive Design)<br>
    • JavaScript (ES6+)<br>
    • Firebase SDK (Realtime Database, Auth)<br>
    • Google Authentication
  </td>
</tr>
<tr>
  <td><strong>Backend</strong></td>
  <td>
    • Node.js<br>
    • Express.js<br>
    • Firebase Admin SDK<br>
    • CORS middleware
  </td>
</tr>
<tr>
  <td><strong>Database</strong></td>
  <td>
    • Google Firestore<br>
    • Cloud Storage (Images)<br>
    • Firebase Realtime Features
  </td>
</tr>
<tr>
  <td><strong>Authentication</strong></td>
  <td>
    • Firebase Authentication<br>
    • JWT Token<br>
    • Google OAuth 2.0
  </td>
</tr>
<tr>
  <td><strong>Hosting & Deployment</strong></td>
  <td>
    • Firebase Hosting<br>
    • Node.js Server<br>
    • Cloud Functions (Optional)
  </td>
</tr>
<tr>
  <td><strong>Tools & DevOps</strong></td>
  <td>
    • Firebase CLI<br>
    • Git/GitHub<br>
    • npm/node package manager<br>
    • PowerShell scripts (Deploy automation)
  </td>
</tr>
</table>

---

## 💻 Yêu Cầu Hệ Thống

### Yêu Cầu Bắt Buộc
- **Node.js**: `v14.0.0` hoặc cao hơn (khuyến nghị v16+)
- **npm**: `v6.0.0` hoặc cao hơn
- **Git**: Để quản lý phiên bản code
- **Trình duyệt**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Tài Khoản & Services
- **Google Account** - Để truy cập Firebase Console
- **Firebase Project** - Dùng cho Firestore, Authentication, Hosting
- **Gmail SMTP** (tùy chọn) - Để gửi email thông báo

### Yêu Cầu Phát Triển
- **VS Code** hoặc IDE tương tương
- **Firebase CLI**: `npm install -g firebase-tools`
- **Postman** (tùy chọn) - Để test API

---

## 🚀 Cài Đặt & Thiết Lập

### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd Website-Store-Sells-Phones
```

### 2️⃣ Thiết Lập Firebase
```bash
# Đăng nhập Firebase
firebase login

# Thiết lập Firebase project
firebase init

# Chọn các services: Firestore, Hosting, Functions
```

### 3️⃣ Cài Đặt Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4️⃣ Cấu Hình Biến Môi Trường

**Backend - tạo file `.env` trong thư mục `backend/`:**
```env
NODE_ENV=development
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@appspot.gserviceaccount.com
```

**Frontend - tạo file `.env.local` trong thư mục `frontend/`:**
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_BACKEND_URL=http://localhost:3001
```

### 5️⃣ Chạy Ứng Dụng

**Development Mode:**
```bash
# Terminal 1: Backend
cd backend
npm start
# Server chạy tại http://localhost:3001

# Terminal 2: Frontend
cd frontend
npm start
# Client chạy tại http://localhost:3000
```

**Production Mode:**
```bash
# Build frontend
cd frontend
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

---

## 📁 Cấu Trúc Dự Án

```
Website-Store-Sells-Phones/
│
├── 📄 README.md                          # Tài liệu dự án
├── 📄 firebase.json                      # Cấu hình Firebase
├── 📄 firestore.rules                    # Firestore Security Rules
├── 📄 firestore.indexes.json             # Firestore Indexes
├── 📄 package.json                       # Root dependencies
│
├── 📁 backend/                           # Backend Server
│   ├── 📄 server.js                      # Entry point
│   ├── 📄 firebase-admin.js              # Firebase Admin Config
│   ├── 📄 import-users.js                # User Import Script
│   ├── 📄 package.json                   # Backend dependencies
│   │
│   ├── 📁 src/
│   │   ├── 📁 config/                    # Cấu hình (DB, Auth...)
│   │   ├── 📁 controllers/               # Controllers (Business Logic)
│   │   ├── 📁 routes/                    # API Routes
│   │   ├── 📁 services/                  # Services (Data Processing)
│   │   ├── 📁 models/                    # Data Models
│   │   ├── 📁 middlewares/               # Express Middlewares
│   │   ├── 📁 validators/                # Input Validators
│   │   ├── 📁 repositories/              # Database Repositories
│   │   └── 📁 utils/                     # Utility Functions
│   │
│   └── 📁 database/
│       ├── 📁 migrations/                # Database Migrations
│       ├── 📁 seeders/                   # Database Seeders
│       └── 📁 sql/                       # SQL Scripts
│
├── 📁 frontend/                          # Frontend Application
│   ├── 📄 package.json                   # Frontend dependencies
│   │
│   ├── 📁 src/                           # React Source
│   │   ├── 📄 App.jsx                    # Root Component
│   │   ├── 📁 components/                # Reusable Components
│   │   ├── 📁 pages/                     # Page Components
│   │   ├── 📁 layouts/                   # Layout Components
│   │   ├── 📁 routes/                    # Route Configuration
│   │   ├── 📁 services/                  # API Services
│   │   ├── 📁 store/                     # State Management (Redux/Context)
│   │   ├── 📁 hooks/                     # Custom Hooks
│   │   ├── 📁 utils/                     # Utility Functions
│   │   ├── 📁 assets/                    # Images, Icons, Fonts
│   │   └── 📁 css/                       # Global Styles
│   │
│   ├── 📁 project/                       # Static HTML Project
│   │   ├── 📄 index.html                 # Home Page
│   │   ├── 📄 products.html              # Products Page
│   │   ├── 📄 detail.html                # Product Detail
│   │   ├── 📄 cart.html                  # Shopping Cart
│   │   ├── 📄 signin.html                # Login Page
│   │   ├── 📄 signup.html                # Register Page
│   │   ├── 📁 assets/                    # Static Assets
│   │   ├── 📁 css/                       # Stylesheets
│   │   └── 📁 js/                        # JavaScript Files
│   │
│   └── 📁 Dashboard/                     # Admin Dashboard
│       ├── 📄 dashboard.html             # Dashboard Main
│       ├── 📄 products.html              # Products Management
│       ├── 📄 orders.html                # Orders Management
│       ├── 📄 Customers.html             # Customers Management
│       ├── 📄 analytics.html             # Analytics & Reports
│       ├── 📄 Promotions.html            # Promotions Management
│       ├── 📄 Reviews.html               # Reviews Management
│       ├── 📄 settings.html              # Settings
│       └── 📁 css/ & 📁 js/              # Dashboard Styles & Scripts
│
├── 📁 public/                            # Built/Public Files (Firebase Hosting)
│   ├── 📄 index.html
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 assets/
│
├── 📁 docs/                              # Documentation
│   ├── 📁 database/                      # Database Documentation
│   ├── 📁 diagrams/                      # Architecture Diagrams
│   ├── 📁 usecase/                       # Use Case Diagrams
│   └── 📁 report/                        # Project Reports
│
└── 📁 uploads/                           # User Uploads
    ├── 📁 avatars/                       # User Avatars
    ├── 📁 products/                      # Product Images
    └── 📁 banners/                       # Banner Images
```

### Giải Thích Từng Thành Phần:

**Backend Structure:**
- `config/` - Cấu hình database, Firebase, environment
- `controllers/` - Xử lý logic yêu cầu HTTP (Routes handlers)
- `services/` - Xử lý business logic, gọi repository
- `repositories/` - Truy vấn Firestore trực tiếp
- `routes/` - Định nghĩa API endpoints
- `middlewares/` - Xác thực token, CORS, logging, error handling
- `validators/` - Kiểm tra dữ liệu đầu vào request

**Frontend Structure:**
- `components/` - UI reusable components (Button, Card, Modal...)
- `pages/` - Full page components (Home, Products, Cart...)
- `services/` - API calls, Firebase services
- `store/` - Global state (Redux hoặc Context API)
- `hooks/` - Custom React hooks
- `utils/` - Hàm tiện ích chung (formatters, validators...)

---

## 📖 Hướng Dẫn Sử Dụng

### Cho Khách Hàng: Mua Sắm Trực Tuyến

#### 1. Đăng Ký Tài Khoản
- Truy cập trang Đăng Ký (`/signup`)
- Nhập email, mật khẩu và thông tin cá nhân
- Xác nhận email (nếu cần)
- Đăng nhập thành công

#### 2. Duyệt & Tìm Kiếm Sản Phẩm
- Truy cập trang Sản phẩm (`/products`)
- Sử dụng bộ lọc: danh mục, giá, nhãn hiệu, xếp hạng
- Tìm kiếm theo từ khóa

#### 3. Xem Chi Tiết Sản Phẩm
- Nhấp vào sản phẩm để xem:
  - Mô tả chi tiết, thông số kỹ thuật
  - Ảnh sản phẩm, video (nếu có)
  - Giá, khuyến mãi
  - Bình luận và đánh giá
  - Tình trạng bảo hành

#### 4. Quản Lý Giỏ Hàng
```
Thêm: Nhấp "Thêm vào giỏ"
Xem: Truy cập /cart
Cập nhật: Thay đổi số lượng
Xóa: Nhấp icon xóa
Áp dụng mã: Nhập mã giảm giá
```

#### 5. Thanh Toán & Đặt Hàng
- Kiểm tra lại đơn hàng
- Chọn địa chỉ giao hàng
- Chọn phương thức thanh toán
- Xác nhận đặt hàng
- Nhận email xác nhận

#### 6. Theo Dõi Đơn Hàng
- Truy cập `/order-history`
- Xem trạng thái các đơn hàng
- Theo dõi chi tiết giao hàng
- Hủy đơn (nếu chưa xử lý)

---

### Cho Quản Trị Viên: Quản Lý Hệ Thống

#### 1. Đăng Nhập Admin
- Truy cập `/admin`
- Nhập credentials admin:
  - Email: `admin@gmail.com` / `admin@mobistore.vn`
  - Password: Theo cấu hình

#### 2. Dashboard Tổng Quan
- Xem thống kê hôm nay
- Doanh thu, số đơn hàng, khách hàng mới
- Biểu đồ bán hàng

#### 3. Quản Lý Sản Phẩm
```
Thêm:        Nhấp "Thêm sản phẩm mới"
Sửa:         Nhấp icon chỉnh sửa trên sản phẩm
Xóa:         Nhấp icon xóa (có xác nhận)
Upload Ảnh:  Tại trang "Upload"
Danh Mục:    Quản lý categories
```

#### 4. Quản Lý Đơn Hàng
- Xem danh sách tất cả đơn hàng
- Cập nhật trạng thái: Chờ duyệt → Đang chuẩn bị → Đã gửi → Đã giao
- Xem chi tiết đơn hàng
- Xuất báo cáo đơn hàng

#### 5. Quản Lý Người Dùng
- Xem danh sách khách hàng
- Xem thông tin chi tiết
- Khóa/mở khóa tài khoản
- Xuất dữ liệu người dùng

#### 6. Quản Lý Khuyến Mãi
- Tạo mã giảm giá
- Tạo chương trình khuyến mãi
- Đặt thời gian có hiệu lực
- Quản lý các ưu đãi đang chạy

#### 7. Quản Lý Bình Luận
- Xem tất cả reviews/comments
- Duyệt/từ chối comments
- Xóa comments không phù hợp
- Trả lời bình luận

---

## 🔌 API Documentation

### Base URL
```
Production: https://myteamproject-36c2f.web.app/api
Development: http://localhost:3001/api
```

### Authentication Endpoints

#### 1. Admin Login
```http
POST /api/admin-login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "123456"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "uid": "admin-gmail",
  "token": "jwt-token-here"
}
```

#### 2. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0987654321"
}

Response (201):
{
  "success": true,
  "uid": "user-id",
  "message": "User registered successfully"
}
```

### Products Endpoints

#### 3. Get All Products
```http
GET /api/products?category=smartphones&sort=price&limit=20

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "name": "iPhone 15",
      "price": 999,
      "discount": 10,
      "category": "smartphones",
      "brand": "Apple",
      "rating": 4.5,
      "reviews": 128,
      "inStock": true,
      "image": "url-to-image",
      "description": "..."
    }
  ],
  "total": 45
}
```

#### 4. Get Product Details
```http
GET /api/products/{productId}

Response (200):
{
  "success": true,
  "data": {
    "id": "prod-1",
    "name": "iPhone 15",
    "description": "Full description...",
    "specifications": {...},
    "price": 999,
    "warranty": "12 months",
    "images": [],
    "reviews": []
  }
}
```

### Orders Endpoints

#### 5. Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "prod-1",
      "quantity": 2,
      "price": 999
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Hanoi",
    "zip": "10000"
  },
  "paymentMethod": "credit_card"
}

Response (201):
{
  "success": true,
  "orderId": "order-123",
  "totalAmount": 2000,
  "status": "pending"
}
```

#### 6. Get User Orders
```http
GET /api/orders
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "order-123",
      "date": "2024-01-15",
      "totalAmount": 2000,
      "status": "shipped",
      "items": []
    }
  ]
}
```

### Complete API List:
```
Authentication:
  POST   /api/admin-login          - Admin login
  POST   /api/auth/register        - Register user
  POST   /api/auth/login           - User login
  POST   /api/auth/logout          - Logout
  GET    /api/auth/profile         - Get user profile

Products:
  GET    /api/products             - Get all products
  GET    /api/products/{id}        - Get product detail
  POST   /api/products             - Create product (admin)
  PUT    /api/products/{id}        - Update product (admin)
  DELETE /api/products/{id}        - Delete product (admin)
  GET    /api/categories           - Get categories

Orders:
  POST   /api/orders               - Create order
  GET    /api/orders               - Get user orders
  GET    /api/orders/{id}          - Get order detail
  PUT    /api/orders/{id}          - Update order status (admin)

Users (Admin):
  GET    /api/users                - Get all users
  PUT    /api/users/{id}           - Update user
  DELETE /api/users/{id}           - Delete user

Promotions:
  GET    /api/promotions           - Get promotions
  POST   /api/promotions           - Create promotion (admin)
  PUT    /api/promotions/{id}      - Update promotion (admin)
  POST   /api/promotions/validate  - Validate coupon code

Reviews:
  GET    /api/reviews/{productId}  - Get product reviews
  POST   /api/reviews              - Create review
  PUT    /api/reviews/{id}         - Update review
```

---

## 🗄️ Database Schema

### Firestore Collections:

#### 1. Users Collection
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0987654321",
  "avatar": "url-to-avatar",
  "role": "customer",         // customer, admin
  "status": "active",         // active, blocked
  "createdAt": "2024-01-01",
  "updatedAt": "2024-01-15",
  "addresses": [
    {
      "id": "addr-1",
      "street": "123 Main St",
      "city": "Hanoi",
      "zip": "10000",
      "isDefault": true
    }
  ],
  "preferences": {
    "newsletter": true,
    "notifications": true
  }
}
```

#### 2. Products Collection
```json
{
  "id": "prod-1",
  "name": "iPhone 15",
  "description": "Latest Apple flagship...",
  "category": "smartphones",
  "brand": "Apple",
  "price": 999,
  "discount": 10,
  "finalPrice": 899.1,
  "sku": "IPHONE-15-001",
  "stock": 50,
  "warranty": "12 months",
  "images": ["url1", "url2"],
  "specifications": {
    "os": "iOS 17",
    "processor": "A17 Pro",
    "ram": "8GB",
    "storage": "256GB"
  },
  "rating": 4.5,
  "reviews": 128,
  "status": "active",
  "createdAt": "2024-01-01",
  "updatedAt": "2024-01-15"
}
```

#### 3. Orders Collection
```json
{
  "id": "order-123",
  "userId": "user-id",
  "items": [
    {
      "productId": "prod-1",
      "name": "iPhone 15",
      "quantity": 2,
      "price": 999,
      "subtotal": 1998
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Hanoi",
    "zip": "10000"
  },
  "paymentMethod": "credit_card",
  "subtotal": 1998,
  "tax": 199.8,
  "shipping": 5,
  "discount": 0,
  "totalAmount": 2202.8,
  "status": "pending",        // pending, confirmed, shipped, delivered, cancelled
  "createdAt": "2024-01-15",
  "updatedAt": "2024-01-15",
  "notes": "Please call before delivery"
}
```

#### 4. Promotions Collection
```json
{
  "id": "promo-1",
  "code": "WELCOME10",
  "type": "percentage",       // percentage, fixed
  "value": 10,
  "maxUses": 100,
  "used": 45,
  "minOrderValue": 50,
  "validFrom": "2024-01-01",
  "validTo": "2024-12-31",
  "status": "active",
  "description": "10% off for new customers",
  "createdAt": "2024-01-01"
}
```

#### 5. Reviews Collection
```json
{
  "id": "review-1",
  "productId": "prod-1",
  "userId": "user-id",
  "rating": 5,
  "title": "Excellent product!",
  "content": "Very satisfied with this purchase...",
  "helpful": 25,
  "status": "approved",       // pending, approved, rejected
  "createdAt": "2024-01-15"
}
```

#### 6. Categories Collection
```json
{
  "id": "cat-1",
  "name": "Smartphones",
  "slug": "smartphones",
  "description": "Mobile phones and devices",
  "image": "url-to-image",
  "parent": null,
  "sortOrder": 1,
  "status": "active"
}
```

---

## 🔐 Bảo Mật

### Security Best Practices Implemented:

#### 1. Firestore Security Rules
```javascript
// Chỉ người dùng đã xác thực mới được đọc
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}

// Công khai xem sản phẩm, chỉ admin mới sửa
match /products/{document=**} {
  allow read: if true;
  allow write: if request.auth.token.admin == true;
}

// Chỉ chủ đơn hàng hoặc admin mới xem
match /orders/{orderId} {
  allow read: if resource.data.userId == request.auth.uid 
              || request.auth.token.admin == true;
  allow create: if request.auth != null;
}
```

#### 2. Authentication & Authorization
```
✓ Firebase Authentication (Email/Password, Google OAuth)
✓ Custom JWT tokens for backend API
✓ Role-based access control (RBAC)
✓ Token expiration & refresh mechanism
✓ Secure password hashing
```

#### 3. API Security
```
✓ CORS configuration (Cross-Origin Resource Sharing)
✓ Request validation & sanitization
✓ Rate limiting (tùy chọn)
✓ Input validation on all endpoints
✓ SQL injection prevention (N/A - using NoSQL)
✓ XSS protection
✓ CSRF token validation
```

#### 4. Data Protection
```
✓ Encrypted passwords (bcrypt hashing)
✓ Sensitive data encryption at rest
✓ HTTPS for all communications
✓ Data encryption in transit (TLS/SSL)
✓ Regular backups (Firebase automatic backups)
✓ PII data protection
```

#### 5. Best Practices
```
✓ Environment variables for secrets (NO hardcoding)
✓ Firebase Cloud Functions for sensitive operations
✓ Secure image upload validation
✓ Admin account protection
✓ Session management
✓ Regular security audits
✓ Input/Output validation
```

### Checklist Bảo Mật Trước Deploy:
- [ ] Firestore Security Rules được cấu hình chính xác
- [ ] Không có API keys công khai trong code
- [ ] HTTPS được bật
- [ ] CORS chỉ cho phép origin hợp lệ
- [ ] Admin credentials được thay đổi từ defaults
- [ ] Rate limiting được cấu hình (nếu cần)
- [ ] Logs được bật để audit
- [ ] Backup strategy được thiết lập

---

## 🚀 Deployment

### Prerequisites
```bash
# Cài đặt Firebase CLI
npm install -g firebase-tools

# Đăng nhập
firebase login

# Xác minh project
firebase projects:list
```

### Option 1: Deploy to Firebase Hosting (Recommended)

#### Step 1: Build Frontend
```bash
cd frontend
npm run build
# Tạo folder 'build/' với optimized files
```

#### Step 2: Copy to Public
```bash
# Tự động bởi task "Sync frontend/project to public"
# Hoặc thủ công:
cp -r frontend/project/* public/
```

#### Step 3: Deploy
```bash
firebase deploy --only hosting

# Hoặc deploy tất cả (Hosting + Firestore Rules)
firebase deploy
```

#### Verify Deployment
```bash
firebase hosting:channel:list
# Truy cập: https://myteamproject-36c2f.web.app
```

---

### Option 2: Deploy Backend to Cloud Functions

#### Step 1: Prepare Cloud Function
```bash
cd backend
# Cấu hình firebase.json cho Cloud Functions
```

#### Step 2: Deploy
```bash
firebase deploy --only functions

# Hoặc specific function:
firebase functions:delete yourFunction
firebase deploy --only functions:yourFunction
```

---

### Option 3: Deploy to External Server (VPS/Heroku)

#### Heroku Deployment:
```bash
# Đăng nhập Heroku
heroku login

# Tạo app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=xxx

# Deploy
git push heroku main

# Kiểm tra logs
heroku logs --tail
```

---

### Deployment Checklist
```
Before Deployment:
☐ Tất cả tests pass
☐ Không có console warnings/errors
☐ Environment variables được set
☐ Database rules được xem lại
☐ Security review hoàn tất
☐ Performance optimization done

After Deployment:
☐ Website hoạt động đúng ở production
☐ API endpoints responsive
☐ Database connections work
☐ Authentication flows tested
☐ Payment system tested
☐ Email notifications working
☐ Analytics tracking active
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Firebase Authentication Issues
**Problem:** Không thể đăng nhập ngay cả với credentials đúng
```
Solutions:
• Kiểm tra Firebase Console > Authentication > Users
• Verify email address trong Firebase Console
• Check firestore.rules có allow authentication không
• Xóa browser cache & cookies
• Reset password
```

#### 2. Firestore Connection Errors
**Problem:** `Error: Permission denied on document`
```
Solutions:
• Kiểm tra firestore.rules security rules
• Confirm user được authenticate đúng
• Check if collection/document exists
• Xem Firebase Documents > Data
• Adjust rules:
  allow read: if request.auth != null;
```

#### 3. CORS Errors
**Problem:** `Access to XMLHttpRequest blocked by CORS`
```
Solutions:
• Check firebase.json CORS configuration
• Verify backend has cors() middleware enabled:
  const cors = require('cors');
  app.use(cors());
• Check allowed origins in CORS config
```

#### 4. Build Errors
**Problem:** `npm install` fails
```
Solutions:
• Clear npm cache: npm cache clean --force
• Delete node_modules: rm -rf node_modules
• Delete package-lock.json
• Run: npm install again
• Check Node version: node -v (needs v14+)
```

#### 5. Firebase CLI Issues
**Problem:** `firebase command not found`
```
Solutions:
• Reinstall: npm install -g firebase-tools
• Check PATH: echo $PATH
• Use: npx firebase instead
• Update: npm update -g firebase-tools
```

#### 6. Image Upload Not Working
**Problem:** Uploaded images không xuất hiện
```
Solutions:
• Check file permissions in uploads/ folder
• Verify storage rules allow uploads:
  allow write: if auth.uid != null;
• Check file size limits
• Verify mime types allowed
• Check disk space on server
```

#### 7. Database Migration Issues
**Problem:** Database schema mismatch
```
Solutions:
• Run migrations: npm run migrate
• Check migration files in database/migrations/
• Backup database first: firebase firestore:export --export-path=backup
• Verify Firestore structure matches schema
```

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm start

# Firebase debugging
firebase functions:log
firebase functions:log --follow

# Check browser console
F12 > Console tab
```

### Kiểm Tra Trạng Thái Ứng Dụng
```bash
# Health check endpoint (if implemented)
curl http://localhost:3001/health

# Frontend bundling check
npm run build - kiểm tra có lỗi build không

# Database connectivity
firebase firestore:describe-indexes
```

---

## 🤝 Đóng Góp

Chúng tôi rất hoan nghênh các đóng góp từ cộng đồng!

### Quy Trình Đóng Góp:

1. **Fork repository**
```bash
git clone <your-fork-url>
cd Website-Store-Sells-Phones
```

2. **Tạo feature branch**
```bash
git checkout -b feature/your-feature-name
# hoặc bugfix/your-bug-fix
```

3. **Commit changes**
```bash
git add .
git commit -m "feat: Add new feature description"
# Sử dụng conventional commits format
```

4. **Push to branch**
```bash
git push origin feature/your-feature-name
```

5. **Tạo Pull Request**
- Mô tả rõ ràng thay đổi của bạn
- Reference issue nếu có
- Đợi review

### Commit Message Convention:
```
feat:     Thêm feature mới
fix:      Sửa bug
docs:     Cập nhật documentation
style:    Style changes (formatting, missing semicolons, etc.)
refactor: Code refactoring
perf:     Performance improvements
test:     Thêm tests
chore:    Build scripts, dependencies, etc.

Ví dụ:
git commit -m "feat: Add product filter by category and price range"
git commit -m "fix: Resolve checkout page crash on empty cart"
```

### Code Style Guidelines:
- Sử dụng ESLint configuration
- 2 spaces for indentation
- camelCase for variables
- PascalCase for classes/components
- Thêm comments cho logic phức tạp
- Viết meaningful variable names (không dùng a, b, c)

---

## 💬 Support & Liên Hệ

### Nhận Trợ Giúp

#### 📧 Email Support
```
📧 Email: support@phonestore.vn
📧 Tech Team: tech@phonestore.vn
Thời gian phản hồi: 1-2 ngày làm việc
```

#### 💬 Live Chat
Truy cập website hoặc click biểu tượng chat ở góc phải

#### 🐛 Issue Tracking
Báo bugs hoặc request features trên GitHub Issues:
```
https://github.com/your-org/Website-Store-Sells-Phones/issues
```

Template báo bug:
```
**Title:** [BUG] Brief description

**Description:** 
Mô tả chi tiết vấn đề

**Steps to Reproduce:**
1. ...
2. ...

**Expected vs Actual:**
- Expected: ...
- Actual: ...

**Screenshots/Logs:**
(Nếu có)

**Environment:**
- Browser: Chrome 90
- OS: Windows 10
- Node: v16.13.0
```

### Community Resources

#### 📚 Documentation
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [React Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com)

#### 🎓 Learning Resources
- Firebase YouTube Channel
- React Official Tutorial
- Node.js Best Practices

#### 👥 Community
- GitHub Discussions
- Stack Overflow tag: `phone-store` `firebase`
- Discord Community (nếu có)

---

## 📄 License

Dự án này được cấp phép dưới **MIT License**. Xem file [LICENSE](LICENSE) để biết chi tiết.

```
MIT License

Copyright (c) 2024 Your Company Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

## 🙏 Lời Cảm Ơn

Chúng tôi cảm ơn:
- **Firebase Team** - Incredible backend infrastructure
- **React Community** - Awesome frontend framework
- **Our Team** - Dedication và hard work
- **Contributors** - Helping improve the project
- **Users** - Using and supporting our platform

---

## 📊 Project Statistics

```
├─ Total Files: 200+
├─ Code Lines: 15,000+
├─ Languages: JavaScript, HTML, CSS, SQL
├─ Components: 50+ React components
├─ API Endpoints: 30+ REST endpoints
├─ Database Collections: 6+ Firestore collections
├─ Active Contributors: 5+
└─ Last Updated: January 2024
```

---

## 🗓️ Roadmap (Các Tính Năng Sắp Tới)

### Q1 2024
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Wishlist feature
- [ ] Product recommendations

### Q2 2024
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Real-time inventory sync
- [ ] SMS notifications
- [ ] Customer support chatbot

### Q3 2024
- [ ] Multi-language support
- [ ] AR product preview
- [ ] Subscription plans
- [ ] Advanced analytics dashboard

### Q4 2024
- [ ] Loyalty program
- [ ] Third-party marketplace integration
- [ ] Voice search
- [ ] AI-powered recommendations

---

## 📞 Quick Links

| Resource | Link |
|----------|------|
| 🌐 Website | https://myteamproject-36c2f.web.app |
| 📚 API Docs | https://docs.phonestore.vn/api |
| 🐛 Bug Report | https://github.com/your-org/issues |
| 💡 Feature Request | https://github.com/your-org/issues |
| 📧 Contact Us | support@phonestore.vn |
| 🔧 Dashboard | https://myteamproject-36c2f.web.app/admin |

---

<div align="center">

### Made with ❤️ by Your Team

**Website Store Sells Phones © 2024**

[⭐ Star us on GitHub](#) • [🐦 Follow us](#) • [📧 Subscribe](#)

**Happy coding! 🚀**

</div>
