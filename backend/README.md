# Backend API - Fastify & Mongoose

Backend API server sử dụng Fastify và MongoDB với Mongoose.

## 📁 Cấu trúc thư mục

```
backend/
├── config/           # Các file cấu hình
│   ├── index.js     # Cấu hình chung
│   └── database.js  # Cấu hình kết nối MongoDB
├── controllers/     # Controllers xử lý logic
│   └── index.controller.js
├── models/          # Mongoose models
│   └── User.js
├── routes/          # Định nghĩa routes
│   └── index.routes.js
├── utils/           # Các hàm tiện ích
├── .env            # Biến môi trường
├── index.js        # Entry point
└── package.json
```

## 🚀 Cài đặt

```bash
npm install
```

## ⚙️ Cấu hình

Chỉnh sửa file `.env` để cấu hình:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wedhook
CORS_ORIGIN=http://localhost:3000
```

## 🏃 Chạy server

```bash
# Development mode với nodemon (auto-restart)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check

## 🔧 Mở rộng

### Thêm route mới

1. Tạo controller trong `controllers/`
2. Tạo route trong `routes/`
3. Register route trong `index.js`

### Thêm model mới

1. Tạo file model trong `models/`
2. Define schema với Mongoose
3. Export model để sử dụng

### Thêm middleware

Register middleware trong `index.js`:
```javascript
fastify.register(require('./middleware/yourMiddleware'));
```

## 📦 Dependencies

- **fastify** - Web framework nhanh và hiệu quả
- **mongoose** - MongoDB ODM
- **@fastify/cors** - CORS support
- **dotenv** - Environment variables
- **nodemon** (dev) - Auto-restart server
