# Wedhook Project

Full-stack application với Backend (Fastify + MongoDB) và Frontend (Next.js)

## 📁 Cấu trúc dự án

```
wedhook/
├── backend/          # Fastify API Server
│   ├── config/      # Cấu hình
│   ├── controllers/ # Controllers
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   └── utils/       # Utilities
├── frontend/        # Next.js Application
└── README.md
```

## 🚀 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server chạy tại: http://localhost:8080

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📦 Tech Stack

### Backend
- Fastify - Web framework
- MongoDB + Mongoose - Database
- dotenv - Environment variables

### Frontend
- Next.js 15 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling

## 🛠️ Development

```bash
# Install all dependencies
npm install

# Run backend
cd backend && npm run dev

# Run frontend (in another terminal)
cd frontend && npm run dev
```

## 📝 License

MIT
