# Hướng dẫn Deploy Dự Án Wedhook

## 1. Deploy Backend (Render)

### 1.1. Chuẩn bị
- Đăng ký tài khoản tại https://render.com
- Push code backend lên GitHub

### 1.2. Tạo Service mới
- Chọn "New Web Service"
- Kết nối với repo backend
- Chọn branch cần deploy (thường là main)
- Chọn môi trường Node.js, port: 8080

### 1.3. Cấu hình biến môi trường
Thêm các biến sau trong phần Environment:
```
PORT=8080
NODE_ENV=production
MONGODB_URI=<URI MongoDB Production>
GOOGLE_CLIENT_ID=<Google Client ID>
GOOGLE_CLIENT_SECRET=<Google Client Secret>
GOOGLE_CALLBACK_URL=https://wedhook-klo4.onrender.com/auth/google/callback
FRONTEND_URL=https://wedhook-wx94.vercel.app
JWT_SECRET=<Chuỗi bí mật JWT>
```

### 1.4. Deploy
- Nhấn "Create Web Service" để Render tự động build và deploy.

---

## 2. Deploy Frontend (Vercel)

### 2.1. Chuẩn bị
- Đăng ký tài khoản tại https://vercel.com
- Push code frontend lên GitHub

### 2.2. Tạo Project mới
- Chọn "Add New Project"
- Kết nối với repo frontend
- Chọn branch cần deploy (thường là main)

### 2.3. Cấu hình biến môi trường
Thêm biến sau trong phần Environment Variables:
```
NEXT_PUBLIC_API_URL=https://wedhook-klo4.onrender.com
```

### 2.4. Deploy
- Nhấn "Deploy" để Vercel tự động build và deploy.

---

## 3. Lưu ý
- Khi chạy local, dùng file `.env.local` cho frontend:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8080
  ```
- Backend local dùng `.env`:
  ```
  FRONTEND_URL=http://localhost:3000
  GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
  ```
- Đảm bảo các biến môi trường đúng domain khi deploy production.

---

## 4. Kiểm tra sau deploy
- Truy cập frontend: https://wedhook-wx94.vercel.app
- Đăng nhập Google, kiểm tra redirect về đúng domain frontend.
- Kiểm tra API frontend gọi đúng backend production.

---

Nếu gặp lỗi, kiểm tra lại biến môi trường và log của Render/Vercel.
