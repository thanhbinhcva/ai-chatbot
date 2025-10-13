# Automated Market - AI Chatbot & Logo API

Project tích hợp 2 services:
- **AI Chatbot**: Python FastAPI service sử dụng LangChain và Google Gemini
- **API Find Image**: Node.js Express API cho việc tìm kiếm và quản lý logo

## 📋 Yêu cầu

- Docker Desktop (hoặc Docker Engine + Docker Compose)
- Git

## 🚀 Cài đặt và Chạy

### 1. Clone repository

```bash
git clone <your-repo-url>
cd automated-market
```

### 2. Cấu hình môi trường

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với các thông tin của bạn:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/market_db
R2_BASE_URL=https://your-r2-storage-url.com
```

### 3. Build và chạy với Docker Compose

```bash
# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy ở chế độ background
docker-compose up -d --build
```

### 4. Kiểm tra services

- **AI Chatbot API**: http://localhost:8000
  - Health check: http://localhost:8000/health
  - API docs: http://localhost:8000/docs

- **API Find Image**: http://localhost:3000
  - Health check: http://localhost:3000/health

## 🛠️ Các lệnh Docker hữu ích

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f ai-chatbot
docker-compose logs -f api-find-img

# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v

# Restart một service
docker-compose restart ai-chatbot

# Build lại một service cụ thể
docker-compose build ai-chatbot

# Chạy lệnh trong container
docker-compose exec ai-chatbot bash
docker-compose exec api-find-img sh
```

## 📁 Cấu trúc Project

```
.
├── docker-compose.yml          # Docker Compose configuration
├── .env                        # Environment variables (không commit)
├── .env.example               # Environment template
├── .dockerignore              # Docker ignore file
├── README.md                  # Documentation
├── ai-chatbot/                # Python AI Chatbot service
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   └── ...
└── API_find-img/              # Node.js API service
    ├── Dockerfile
    ├── package.json
    ├── server.js
    └── ...
```

## 🔧 Development

### Chạy riêng lẻ từng service

```bash
# Chỉ chạy AI Chatbot
docker-compose up ai-chatbot

# Chỉ chạy API Find Image
docker-compose up api-find-img
```

### Hot reload

Cả hai services đều được cấu hình với hot reload:
- **Python**: uvicorn với flag `--reload`
- **Node.js**: có thể thêm nodemon trong development

Code changes sẽ tự động được phát hiện và reload.

## 🔐 Bảo mật

- Không commit file `.env` vào Git
- Đảm bảo các API keys được giữ bí mật
- Trong production, nên sử dụng secrets management service

## 📝 API Documentation

### AI Chatbot API

Xem chi tiết tại: http://localhost:8000/docs (Swagger UI)

### API Find Image

Xem chi tiết trong file `API_find-img/API_GUIDE.md`

## 🐛 Troubleshooting

### Port đã được sử dụng

Nếu port 8000 hoặc 3000 đã được sử dụng, sửa trong `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Thay 8001 bằng port trống
```

### Container không start

```bash
# Xem logs để debug
docker-compose logs

# Xóa và build lại
docker-compose down
docker-compose up --build
```

## 📞 Liên hệ

Nếu có vấn đề, vui lòng tạo issue trên repository.
