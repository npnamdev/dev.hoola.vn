# Wedhook - Google OAuth Authentication

## 🚀 Tính năng đăng nhập với Google đã hoàn thành!

### 📋 Cấu trúc dự án

#### Backend (Node.js + Fastify + MongoDB)
```
backend/
├── models/
│   └── User.js              # Schema MongoDB cho user
├── controllers/
│   └── authController.js    # Logic xử lý authentication
├── routes/
│   └── authRoutes.js        # API endpoints cho auth
├── config/
│   └── database.js          # Cấu hình MongoDB
├── index.js                 # Entry point + CORS config
├── .env.example             # Template biến môi trường
└── package.json
```

#### Frontend (Next.js 15 + React 19 + Shadcn UI)
```
frontend/
├── app/
│   └── page.tsx             # Trang chủ với login button
├── components/
│   ├── LoginButton.tsx      # Component đăng nhập
│   └── ui/                  # Shadcn UI components
├── lib/
│   └── auth.ts              # Auth service + useAuth hook
├── .env.example             # Template biến môi trường
└── package.json
```

---

## 🔧 Cách setup

### 1. Cấu hình Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Chọn **Web application**
6. Thêm **Authorized redirect URIs**:
   - Development: `http://localhost:8080/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`
7. Copy **Client ID** và **Client Secret**

### 2. Cấu hình Backend

```bash
cd backend

# Copy .env.example thành .env
cp .env.example .env

# Sửa file .env với thông tin của bạn:
# - GOOGLE_CLIENT_ID=your-google-client-id
# - GOOGLE_CLIENT_SECRET=your-google-client-secret
# - MONGODB_URI=mongodb://localhost:27017/wedhook
# - JWT_SECRET=random-secure-string
# - COOKIE_SECRET=random-secure-string

# Cài đặt dependencies (đã cài rồi)
npm install

# Chạy backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:8080`

### 3. Cấu hình Frontend

```bash
cd frontend

# Copy .env.example thành .env.local
cp .env.example .env.local

# File .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Chạy frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

---

## 🔄 Luồng hoạt động

### Khi user click "Đăng nhập với Google":

1. **Frontend** (`LoginButton.tsx`):
   - Mở popup window mới
   - Navigate đến `/auth/google` của backend

2. **Backend** (`/auth/google`):
   - Redirect user đến trang login của Google
   - User chọn tài khoản Google và đồng ý quyền

3. **Google**:
   - Redirect về `/auth/google/callback` với authorization code

4. **Backend** (`/auth/google/callback`):
   - Exchange code để lấy access token
   - Dùng access token để lấy thông tin user từ Google
   - Tìm hoặc tạo user trong MongoDB
   - Generate JWT token
   - Set JWT vào cookie (httpOnly, secure)
   - Redirect về frontend với `?login=success`

5. **Frontend**:
   - Popup tự đóng
   - Gọi `/auth/me` để lấy thông tin user
   - Hiển thị avatar và tên user
   - User có thể logout từ dropdown menu

---

## 🛠 API Endpoints

### Backend API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/auth/google` | Khởi tạo Google OAuth flow |
| GET | `/auth/google/callback` | Xử lý callback từ Google |
| GET | `/auth/me` | Lấy thông tin user hiện tại |
| POST | `/auth/logout` | Đăng xuất (clear cookie) |
| GET | `/api/health` | Health check |

---

## 💡 Các tính năng chính

### ✅ Backend
- ✨ Google OAuth 2.0 integration
- 🔐 JWT authentication với httpOnly cookies
- 🗄 MongoDB với Mongoose
- 🚀 Fastify framework (nhanh & nhẹ)
- 🔒 CORS configured cho frontend
- 👤 User model với Google profile data

### ✅ Frontend
- 🎨 Modern UI với Shadcn UI
- 🪝 Custom `useAuth` hook
- 🔄 Auto-refresh user state
- 🎭 Avatar với fallback
- 📱 Responsive design
- 🎪 Popup window cho OAuth flow
- 💾 Cookie-based authentication

---

## 🎯 Code highlights

### useAuth Hook (Clean & Reusable)
```typescript
const { user, loading, login, logout } = useAuth();
```

### Popup OAuth Flow
```typescript
// Mở popup cho Google login
const popup = window.open(url, 'Google Login', 'width=500,height=600');
// Track popup state và auto-close
```

### Protected Routes Pattern
```typescript
if (loading) return <Loader />;
if (!user) return <LoginButton />;
return <ProtectedContent />;
```

---

## 📝 Lưu ý

1. **MongoDB phải chạy**: Đảm bảo MongoDB đang chạy tại `mongodb://localhost:27017`
2. **Google OAuth setup**: Phải config đúng redirect URI trong Google Console
3. **Cookies**: Backend và frontend phải cùng domain hoặc config CORS đúng
4. **Production**: Nhớ đổi `secure: true` cho cookies và sử dụng HTTPS

---

## 🔐 Security Features

- ✅ JWT với expiry (7 ngày)
- ✅ HttpOnly cookies (XSS protection)
- ✅ Secure cookies trong production
- ✅ CORS configured
- ✅ No password storage (OAuth only)
- ✅ Token verification middleware ready

---

## 🚀 Next Steps

Một số tính năng có thể mở rộng:
- [ ] Middleware bảo vệ routes
- [ ] Refresh token mechanism
- [ ] Social login khác (Facebook, GitHub)
- [ ] User profile management
- [ ] Role-based access control (RBAC)

---

Enjoy coding! 🎉
