# Asset Service - RESTful API

Dịch vụ quản lý tài sản Logo với 5 API RESTful sử dụng Node.js và Express.js.

## 🏗️ Kiến trúc Database (ERD)

```
asset (uid, type: emblem/layout/background)
  ↓
category (uid, asset_id FK, name)
  ↓
├─ emblem (uid, category_id FK, url, name)
│    ↓
│    variant (uid, emblem_id FK, url, name)
├─ layout (uid, category_id FK, url, details object)
└─ background (uid, category_id FK, url)
```

## 📦 Cài đặt

### 1. Cài đặt Dependencies

```bash
npm install
```

Hoặc cài đặt thủ công:

```bash
npm install express
```

Để phát triển với auto-reload:

```bash
npm install --save-dev nodemon
```

### 2. Chạy Ứng dụng

**Chế độ Production:**
```bash
npm start
```

**Chế độ Development (với auto-reload):**
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

## 🔌 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "service": "Asset Service",
  "version": "1.0.0",
  "timestamp": "2025-10-14T..."
}
```

---

## 🎯 Session Management (Status Tracking)

Hệ thống theo dõi bước người dùng đang thực hiện trong quy trình chọn logo.

### Workflow Steps:
1. `emblem_selection` - Chọn biểu tượng
2. `variant_selection` - Chọn màu sắc của biểu tượng
3. `layout_category_selection` - Chọn danh mục layout
4. `layout_selection` - Chọn layout cụ thể
5. `background_selection` - Chọn background
6. `completed` - Hoàn thành

### 📌 Khởi tạo Session mới

```http
POST /api/v1/logo/session/init
```

**Response:**
```json
{
  "success": true,
  "session_id": "session-1728912345678-abc123def",
  "status": {
    "session_id": "session-1728912345678-abc123def",
    "current_step": "emblem_selection",
    "selected_emblem_id": null,
    "selected_variant_id": null,
    "selected_layout_category_id": null,
    "selected_layout_id": null,
    "selected_background_id": null,
    "completed": false,
    "created_at": "2025-10-14T...",
    "updated_at": "2025-10-14T..."
  }
}
```

### 📌 Lấy trạng thái Session

```http
GET /api/v1/logo/session/status?sessionId={id}
```

**Response:**
```json
{
  "success": true,
  "status": {
    "session_id": "session-1728912345678-abc123def",
    "current_step": "variant_selection",
    "selected_emblem_id": "E001",
    "selected_variant_id": null,
    "selected_layout_category_id": null,
    "selected_layout_id": null,
    "selected_background_id": null,
    "completed": false,
    "created_at": "2025-10-14T...",
    "updated_at": "2025-10-14T..."
  }
}
```

### 📌 Cập nhật trạng thái Session

```http
PUT /api/v1/logo/session/update
Content-Type: application/json

{
  "sessionId": "session-1728912345678-abc123def",
  "emblemId": "E001"
}
```

**Body Parameters:**
- `sessionId` (required): ID của session
- `emblemId` (optional): ID emblem đã chọn
- `variantId` (optional): ID variant đã chọn
- `layoutCategoryId` (optional): ID category layout đã chọn
- `layoutId` (optional): ID layout đã chọn
- `backgroundId` (optional): ID background đã chọn

**Response:**
```json
{
  "success": true,
  "status": {
    "session_id": "session-1728912345678-abc123def",
    "current_step": "variant_selection",
    "selected_emblem_id": "E001",
    "selected_variant_id": null,
    "selected_layout_category_id": null,
    "selected_layout_id": null,
    "selected_background_id": null,
    "completed": false,
    "created_at": "2025-10-14T...",
    "updated_at": "2025-10-14T..."
  }
}
```

---

### 1️⃣ Lấy danh sách Biểu tượng (Emblems)

```http
GET /api/v1/logo/emblem/search
GET /api/v1/logo/emblem/search?sessionId={id}
```

**Query Parameters:**
- `sessionId` (optional): ID của session để tracking

**Response:**
```json
{
  "results": [
    {
      "uid": "E001",
      "type": "emblem",
      "category": "door",
      "url": "https://assert-service.com/emblems/door.png"
    },
    {
      "uid": "E002",
      "type": "emblem",
      "category": "windows",
      "url": "https://assert-service.com/emblems/windows.png"
    },
    {
      "uid": "E003",
      "type": "emblem",
      "category": "houses",
      "url": "https://assert-service.com/emblems/houses.png"
    }
  ],
  "session_status": {
    "current_step": "emblem_selection",
    "expected_step": "emblem_selection"
  }
}
```

---

### 2️⃣ Lấy danh sách Màu của Biểu tượng

```http
GET /api/v1/logo/emblem/variant/search?emblemId=E001
GET /api/v1/logo/emblem/variant/search?emblemId=E001&sessionId={id}
```

**Query Parameters:**
- `emblemId` (required): ID của emblem
- `sessionId` (optional): ID của session để tracking

**Response:**
```json
{
  "emblemId": "E001",
  "results": [
    {
      "variantID": "V001",
      "url": "https://assert-service.com/variants/E001_blue.png",
      "name": "blue"
    },
    {
      "variantID": "V002",
      "url": "https://assert-service.com/variants/E001_red.png",
      "name": "red"
    },
    {
      "variantID": "V003",
      "url": "https://assert-service.com/variants/E001_green.png",
      "name": "green"
    }
  ],
  "session_status": {
    "current_step": "variant_selection",
    "expected_step": "variant_selection"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Bad Request",
  "message": "emblemId query parameter is required"
}
```

**Error Response (404):**
```json
{
  "error": "Not Found",
  "message": "Emblem with ID E999 not found"
}
```

---

### 3️⃣ Lấy danh sách Danh mục Layout

```http
GET /api/v1/logo/layout/category
GET /api/v1/logo/layout/category?sessionId={id}
```

**Query Parameters:**
- `sessionId` (optional): ID của session để tracking

**Response:**
```json
{
  "results": [
    {
      "categoryID": "C101",
      "categoryName": "Avatar"
    },
    {
      "categoryID": "C102",
      "categoryName": "Billboard"
    },
    {
      "categoryID": "C103",
      "categoryName": "Business Card"
    },
    {
      "categoryID": "C104",
      "categoryName": "Poster"
    },
    {
      "categoryID": "C105",
      "categoryName": "Social Media"
    },
    {
      "categoryID": "C106",
      "categoryName": "Brochure"
    }
  ],
  "session_status": {
    "current_step": "layout_category_selection",
    "expected_step": "layout_category_selection"
  }
}
```

---

### 4️⃣ Lấy danh sách Layout trong một Danh mục

```http
GET /api/v1/logo/layout/search?categoryID=C101
GET /api/v1/logo/layout/search?categoryID=C101&sessionId={id}
```

**Query Parameters:**
- `categoryID` (required): ID của category
- `sessionId` (optional): ID của session để tracking

**Response:**
```json
{
  "categoryID": "C101",
  "categoryName": "Avatar",
  "results": [
    {
      "layoutID": "L201",
      "layoutURL": "https://assert-service.com/layouts/avatar_1.svg",
      "components": {
        "text_position": "0,0",
        "logo_size": "50x50",
        "element_count": 3
      }
    },
    {
      "layoutID": "L202",
      "layoutURL": "https://assert-service.com/layouts/avatar_2.svg",
      "components": {
        "text_position": "10,10",
        "logo_size": "60x60",
        "element_count": 2
      }
    }
  ],
  "session_status": {
    "current_step": "layout_selection",
    "expected_step": "layout_selection"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Bad Request",
  "message": "categoryID query parameter is required"
}
```

**Error Response (404):**
```json
{
  "error": "Not Found",
  "message": "Category with ID C999 not found"
}
```

---

### 5️⃣ Lấy danh sách Background

```http
GET /api/v1/logo/background/search
GET /api/v1/logo/background/search?sessionId={id}
```

**Query Parameters:**
- `sessionId` (optional): ID của session để tracking

**Response:**
```json
{
  "results": [
    {
      "backgroundID": "B301",
      "backgroundURL": "https://assert-service.com/backgrounds/pattern_1.png"
    },
    {
      "backgroundID": "B302",
      "backgroundURL": "https://assert-service.com/backgrounds/gradient_2.jpg"
    },
    {
      "backgroundID": "B303",
      "backgroundURL": "https://assert-service.com/backgrounds/solid_3.png"
    },
    {
      "backgroundID": "B304",
      "backgroundURL": "https://assert-service.com/backgrounds/texture_4.jpg"
    }
  ],
  "session_status": {
    "current_step": "background_selection",
    "expected_step": "background_selection"
  }
}
```

---

## 🧪 Testing với cURL

### Workflow hoàn chỉnh với Session Tracking:

```bash
# 1. Khởi tạo session mới
SESSION_RESPONSE=$(curl -X POST http://localhost:3000/api/v1/logo/session/init)
SESSION_ID=$(echo $SESSION_RESPONSE | grep -o '"session_id":"[^"]*"' | cut -d'"' -f4)
echo "Session ID: $SESSION_ID"

# 2. Lấy danh sách emblems
curl "http://localhost:3000/api/v1/logo/emblem/search?sessionId=$SESSION_ID"

# 3. Cập nhật: Chọn emblem E001
curl -X PUT http://localhost:3000/api/v1/logo/session/update \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"emblemId\":\"E001\"}"

# 4. Lấy variants của emblem E001
curl "http://localhost:3000/api/v1/logo/emblem/variant/search?emblemId=E001&sessionId=$SESSION_ID"

# 5. Cập nhật: Chọn variant V001
curl -X PUT http://localhost:3000/api/v1/logo/session/update \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"variantId\":\"V001\"}"

# 6. Lấy danh mục layouts
curl "http://localhost:3000/api/v1/logo/layout/category?sessionId=$SESSION_ID"

# 7. Cập nhật: Chọn category C101
curl -X PUT http://localhost:3000/api/v1/logo/session/update \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"layoutCategoryId\":\"C101\"}"

# 8. Lấy layouts trong category Avatar
curl "http://localhost:3000/api/v1/logo/layout/search?categoryID=C101&sessionId=$SESSION_ID"

# 9. Cập nhật: Chọn layout L201
curl -X PUT http://localhost:3000/api/v1/logo/session/update \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"layoutId\":\"L201\"}"

# 10. Lấy danh sách backgrounds
curl "http://localhost:3000/api/v1/logo/background/search?sessionId=$SESSION_ID"

# 11. Cập nhật: Chọn background B301
curl -X PUT http://localhost:3000/api/v1/logo/session/update \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"backgroundId\":\"B301\"}"

# 12. Kiểm tra status cuối cùng
curl "http://localhost:3000/api/v1/logo/session/status?sessionId=$SESSION_ID"
```

### Testing cơ bản (không dùng session):

```bash
# Health check
curl http://localhost:3000/health

# API 1: Lấy danh sách emblems
curl http://localhost:3000/api/v1/logo/emblem/search

# API 2: Lấy variants của emblem E001
curl "http://localhost:3000/api/v1/logo/emblem/variant/search?emblemId=E001"

# API 3: Lấy danh mục layouts
curl http://localhost:3000/api/v1/logo/layout/category

# API 4: Lấy layouts trong category Avatar
curl "http://localhost:3000/api/v1/logo/layout/search?categoryID=C101"

# API 5: Lấy danh sách backgrounds
curl http://localhost:3000/api/v1/logo/background/search
```

## 🧪 Testing với Postman

### Import Postman Collection (Recommended)

Chúng tôi đã chuẩn bị sẵn một **Postman Collection** hoàn chỉnh với 13 APIs và automated tests:

1. Mở Postman
2. Click **Import** → Chọn file `Asset_Service_Postman_Collection.json`
3. Collection sẽ có sẵn tất cả endpoints và biến môi trường

**📖 Xem hướng dẫn chi tiết:** [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)

### Manual Testing

Hoặc import các endpoint sau vào collection thủ công:

1. `GET http://localhost:3000/api/v1/logo/emblem/search`
2. `GET http://localhost:3000/api/v1/logo/emblem/variant/search?emblemId=E001`
3. `GET http://localhost:3000/api/v1/logo/layout/category`
4. `GET http://localhost:3000/api/v1/logo/layout/search?categoryID=C101`
5. `GET http://localhost:3000/api/v1/logo/background/search`

## 📊 Mock Data Structure

Service sử dụng mock data theo ERD:

- **3 Emblems** (door, windows, houses)
- **7 Variants** (màu sắc khác nhau cho các emblems)
- **6 Layout Categories** (Avatar, Billboard, Business Card, Poster, Social Media, Brochure)
- **6 Layouts** (với details components)
- **4 Backgrounds** (patterns và gradients)

## 🛠️ Công nghệ

- **Node.js** (ES6+)
- **Express.js** ^4.18.2
- **Port mặc định:** 3000

## � Tài liệu bổ sung

- **[WORKFLOW.md](./WORKFLOW.md)** - Hướng dẫn chi tiết về workflow và session tracking
- **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Hướng dẫn test API với Postman Collection
- **[test_workflow.sh](./test_workflow.sh)** - Script tự động test workflow bằng cURL

## 📦 Files trong Project

```
Assert_service/
├── asset_service.js                          # Main service file
├── package.json                              # Dependencies
├── README.md                                 # Documentation chính
├── WORKFLOW.md                               # Chi tiết workflow
├── POSTMAN_GUIDE.md                          # Hướng dẫn Postman
├── Asset_Service_Postman_Collection.json     # Postman collection
├── test_workflow.sh                          # cURL test script
└── .gitignore                                # Git ignore
```

## �📝 License

MIT
