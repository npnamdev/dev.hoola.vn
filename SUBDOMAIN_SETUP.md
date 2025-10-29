# Hướng dẫn cấu hình Subdomain cho Dashboard

## Tổng quan
Dự án đã được cấu hình để hỗ trợ subdomain routing. Bạn có thể truy cập dashboard qua:
- `yourdomain.com/dashboard` (routing thông thường)
- `dashboard.yourdomain.com` (subdomain routing)

## 1. Development - Local Testing

### Option 1: Sử dụng routing thông thường (đơn giản nhất)
Truy cập: `http://localhost:3000/dashboard`

### Option 2: Test subdomain trên local
1. Chỉnh sửa file `/etc/hosts` (macOS/Linux) hoặc `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 dashboard.localhost
127.0.0.1 localhost
```

2. Chạy Next.js trên port 3000:
```bash
cd frontend
npm run dev
```

3. Truy cập:
- `http://localhost:3000` - Trang chủ
- `http://dashboard.localhost:3000` - Dashboard (subdomain)

## 2. Production - Cấu hình DNS

### Bước 1: Cấu hình DNS Records
Truy cập vào dashboard của nhà cung cấp domain (GoDaddy, Namecheap, Cloudflare, etc.) và thêm DNS record:

#### Nếu dùng Server với IP cố định:
```
Type: A Record
Name: dashboard
Value: [IP_SERVER_CỦA_BẠN]
TTL: Auto hoặc 3600
```

#### Nếu dùng Vercel/Netlify:
```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com (hoặc domain của hosting)
TTL: Auto
```

### Bước 2: Deploy lên Vercel (Recommended)

1. **Cài đặt Vercel CLI** (nếu chưa có):
```bash
npm i -g vercel
```

2. **Deploy project**:
```bash
cd frontend
vercel
```

3. **Thêm domain vào Vercel**:
- Vào Vercel Dashboard > Project Settings > Domains
- Thêm domain: `yourdomain.com`
- Thêm subdomain: `dashboard.yourdomain.com`

4. **Cấu hình trong Vercel**:
Vercel sẽ tự động xử lý subdomain routing dựa trên file `middleware.ts`

### Bước 3: Cấu hình Environment Variables
Đảm bảo các biến môi trường được set đúng:

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
```

## 3. Cấu hình với Nginx (Nếu tự host)

```nginx
# Main domain
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Dashboard subdomain
server {
    listen 80;
    server_name dashboard.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000/dashboard;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 4. Kiểm tra cấu hình

### Test DNS:
```bash
# Kiểm tra DNS đã trỏ đúng chưa
nslookup dashboard.yourdomain.com
dig dashboard.yourdomain.com

# Hoặc dùng ping
ping dashboard.yourdomain.com
```

### Test Subdomain Routing:
1. Truy cập `https://yourdomain.com` - Xem trang chủ
2. Đăng nhập
3. Click vào profile > Dashboard
4. Hoặc truy cập trực tiếp `https://dashboard.yourdomain.com`

## 5. Cấu hình cho các môi trường khác

### Docker:
```yaml
# docker-compose.yml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.dashboard.rule=Host(`dashboard.yourdomain.com`)"
```

## 6. Troubleshooting

### Subdomain không hoạt động:
1. Kiểm tra DNS đã propagate chưa (có thể mất 24-48 giờ)
2. Xóa cache browser: Ctrl/Cmd + Shift + R
3. Kiểm tra middleware.ts có được deploy không
4. Xem logs của server/Vercel

### CORS errors:
Thêm subdomain vào CORS whitelist trong backend:
```javascript
// backend/index.js
const allowedOrigins = [
  'http://localhost:3000',
  'https://yourdomain.com',
  'https://dashboard.yourdomain.com'
];
```

## 7. Best Practices

1. **Luôn dùng HTTPS** trong production
2. **Cấu hình SSL/TLS** cho cả domain và subdomain
3. **Set up redirects** từ HTTP sang HTTPS
4. **Monitor DNS propagation** sau khi thay đổi
5. **Backup cấu hình** trước khi thay đổi

## Tóm tắt

- ✅ **Development**: Dùng `localhost:3000/dashboard`
- ✅ **Local Subdomain Test**: Sửa `/etc/hosts`
- ✅ **Production**: Cấu hình DNS + Deploy lên Vercel
- ✅ **Self-hosted**: Dùng Nginx reverse proxy

Nếu có vấn đề gì, hãy check:
1. DNS records đã đúng chưa
2. File middleware.ts có hoạt động không
3. Environment variables đã set chưa
4. Logs của server/hosting
