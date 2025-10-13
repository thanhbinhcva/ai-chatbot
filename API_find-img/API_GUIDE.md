# 📘 API Documentation - Logo Selection

**Version:** 1.0.0 | **Status:** ✅ READY | **Test:** 18/18 PASSED

---

## 🚀 Quick Start

```bash
# 1. Install & Run
npm install
npm start

# 2. Test
node examples/testNewFlow.js
```

Server: http://localhost:3000

---

## 🎯 API Flow (6 Steps)

```
1. POST /api/workflow/initialize          → logos[]
2. POST /api/workflow/:id/logo           → colors[]
3. POST /api/workflow/:id/color          → layouts[]
4. POST /api/workflow/:id/layout         → backgrounds[]
5. POST /api/workflow/:id/background     → customization
6. POST /api/workflow/:id/customization  → updated
7. POST /api/workflow/:id/export         → final JSON
```

**Extras:**
- `GET /api/workflow/:id/status` - Check status
- `POST /api/workflow/:id/reset` - Reset step
- `GET /health` - Health check

---

## 📝 API Examples

### 1. Initialize
```bash
POST /api/workflow/initialize
Content-Type: application/json

{
  "brand_name": "Nhôm Kính An Phát",
  "slogan": "Chất Lượng Dẫn Đầu",
  "phone": "0986899001",
  "location": "212 Quang Trung, Hà Đông",
  "main_products": ["cửa nhôm", "cửa kính"],
  "logo_style": ["Hiện đại"],
  "main_color": ["xanh dương"]
}

Response:
{
  "success": true,
  "data": {
    "sessionId": "abc123",
    "category": "Door",
    "totalLogos": 10,
    "logos": [
      {
        "id": "Door-1",
        "name": "door_1",
        "url": "https://.../door_1_original.svg"
      }
    ]
  }
}
```

### 2. Select Logo
```bash
POST /api/workflow/abc123/logo

{
  "logoId": "Door-1",
  "category": "Door",
  "variant": 1
}

Response: { colors: [...] }
```

### 3. Select Color
```bash
POST /api/workflow/abc123/color

{
  "color": "blue",
  "colorUrl": "https://.../door_1_blue.svg"
}

Response: { layouts: [...] }
```

### 4. Select Layout
```bash
POST /api/workflow/abc123/layout

{
  "layoutId": "avatar-1"
}

Response: { backgrounds: [...] }
```

### 5. Select Background
```bash
POST /api/workflow/abc123/background

{
  "backgroundId": "color-1",
  "type": "color",
  "value": "#FFFFFF"
}

Response: { currentCustomization: {...} }
```

### 6. Customize
```bash
POST /api/workflow/abc123/customization

{
  "brandName": "Nhôm Kính An Phát",
  "slogan": "Chất Lượng Là Danh Dự",
  "phoneNumber": "0986899001",
  "location": "212 Quang Trung, Hà Đông",
  "textColor": "#0066CC",
  "textFont": "Arial Bold"
}

Response: { customization: {...}, canExport: true }
```

### 7. Export
```bash
POST /api/workflow/abc123/export

Response:
{
  "briefId": "xyz789",
  "sessionId": "abc123",
  "chosenLogoUrl": "...",
  "chosenColor": "blue",
  "chosenLayout": { id: "avatar-1", name: "Avatar 1", ... },
  "chosenBackground": { type: "color", value: "#FFFFFF" },
  "customization": {
    "brandName": "Nhôm Kính An Phát",
    "slogan": "Chất Lượng Là Danh Dự",
    "phoneNumber": "0986899001",
    "location": "212 Quang Trung, Hà Đông",
    "textColor": "#0066CC",
    "textFont": "Arial Bold"
  },
  "assetsToExport": [
    {
      "layoutId": "avatar-1",
      "outputFileName": "avatar_avatar_1.pdf",
      "format": "pdf",
      "customizations": {
        "layoutLink": "...",
        "brand_name": {
          "text": "Nhôm Kính An Phát",
          "font": "Arial Bold",
          "color": "#0066CC"
        },
        "slogan": { "text": "...", "font": "...", "color": "..." },
        "phone_number": { "text": "...", "font": "...", "color": "..." },
        "location": { "text": "...", "font": "...", "color": "..." },
        "color": "...",
        "background": { "type": "color", "value": "#FFFFFF" },
        "logo": "..."
      }
    }
  ],
  "createdAt": "2025-10-13T...",
  "completedAt": "2025-10-13T..."
}
```

---

## 📊 Data Structure

### Available Categories
10 categories với 10 logos mỗi loại:
- Door (Cửa)
- House (Nhà)
- Building/Tower (Tòa nhà)
- Window (Cửa sổ)
- Roof (Mái nhà)
- Lock/Security (Khóa/Bảo mật)
- Shield (Khiên)
- Gear/Mechanism (Bánh răng)
- Rolling Door/Shutter (Cửa cuốn)
- Abstract Geometric

### Colors (9)
blue, brown, gold, green, grey, orange, red, white, yellow

### Layouts (20)
- Avatar (5): avatar-1 to avatar-5
- Billboard (5): billboard-1 to billboard-5
- Card (5): card-1 to card-5
- Cover (5): cover-1 to cover-5

### Backgrounds (26)
- Colors (9): Trắng, Đen, Xám, Xanh dương, Xanh lá, Đỏ, Vàng, Cam, Tím
- Images (17): background_1.jpg to background_17.jpg

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
PORT=3000

# ⭐ QUAN TRỌNG: R2 Public URL (Tất cả assets lấy từ đây)
R2_BASE_URL=https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev

# Optional: R2 API credentials (chỉ cần khi upload files)
R2_ENDPOINT_URL=https://a3f44228b8f32f7ce44889973622504e.r2.cloudflarestorage.com
R2_BUCKET_NAME=image-logo
R2_ACCESS_KEY_ID=9ee4605eeaf6e140154c32e0944b1c25
R2_SECRET_ACCESS_KEY=fb21b3e02ea4ec8425f3b60d50cacb550d1f87ca4910a40531ddb40a4c9e167d
R2_PUBLIC_DOMAIN=pub-899d2a26777749e09d0cc4628befdc61.r2.dev
R2_REGION=auto
```

**API chỉ cần `R2_BASE_URL` để hoạt động!** Các credentials khác dành cho tương lai nếu cần upload.

### Sample URLs Generated
```
Logo:       https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/image-logo/Door/door_1/door_1_original.svg
Color:      https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/image-logo/Door/door_1/door_1_blue.svg
Layout:     https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Layout/Avatar/avatar_1.svg
Background: https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Background/background_1.jpg
```

### R2 Folder Structure
```
image-logo/
├── image-logo/
│   ├── Door/
│   │   ├── door_1/
│   │   │   ├── door_1_original.svg
│   │   │   ├── door_1_blue.svg
│   │   │   ├── door_1_brown.svg
│   │   │   └── ... (9 colors)
│   │   └── door_2/ ... door_10/
│   ├── House/ ... Building/ ... Window/ ...
│   └── (10 categories total)
├── Layout/
│   ├── Avatar/
│   │   ├── avatar_1.svg
│   │   └── avatar_1_thumb.jpg
│   ├── Billboard/ Card/ Cover/
│   └── (20 layouts total)
└── Background/
    ├── background_1.jpg ... background_17.jpg
    └── (17 backgrounds)
```

---

## ✅ Validation Results

**18/18 Checks PASSED:**

```
✅ briefId exists
✅ sessionId exists
✅ chosenLogoUrl exists
✅ chosenColor exists
✅ chosenLayout exists (object, not array)
✅ chosenBackground exists
✅ customization exists (6 fields)
✅ assetsToExport is array with items
✅ layoutLink in customizations
✅ brand_name has text/font/color
✅ slogan has text/font/color
✅ phone_number has text/font/color
✅ location has text/font/color
✅ color URL in customizations
✅ background in customizations
✅ logo URL in customizations
✅ text color applied
✅ text font applied
```

**Test Output:**
```
📝 Step 1: Initialize Session        ✅
🎯 Step 2: Select Logo               ✅
🌈 Step 3: Select Color              ✅
📐 Step 4: Select Layout             ✅
🖼️  Step 5: Select Background        ✅
✏️  Step 6: Customize Content        ✅
📊 Step 7: Finalize Export           ✅

🎉 All tests passed successfully!
```

---

## 🔑 Key Changes (vs Old Version)

| Aspect | Old | New |
|--------|-----|-----|
| **Flow** | Logo→Color→Background→Layout | Logo→Color→**Layout→Background**→Customize→Export |
| **Steps** | 4 | 6 |
| **Layout** | Multiple (array) | Single (object) |
| **Customization** | None | Yes (text/color/font) |
| **Export** | In selectLayout | Separate endpoint |

---

## 🛠️ Project Structure

```
API_find-img/
├── server.js                  # Entry point
├── controllers/
│   └── workflowController.js # HTTP handlers
├── services/
│   ├── sessionService.js     # Session management
│   ├── logoService.js        # Logo logic
│   └── exportService.js      # Export logic
├── routes/
│   └── workflow.js           # API routes
├── config/
│   └── constants.js          # Data (logos/colors/layouts)
├── examples/
│   ├── testNewFlow.js        # Automated test ⭐
│   ├── testData.js           # Sample data
│   └── demo.html             # Demo UI
└── .env                      # Configuration
```

---

## 🧪 Testing

### Automated Test
```bash
node examples/testNewFlow.js
```

### Manual Test (cURL)
```bash
# 1. Initialize
curl -X POST http://localhost:3000/api/workflow/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Test Company",
    "phone": "0123456789",
    "main_products": ["cửa nhôm"]
  }'

# Get sessionId from response, then continue with other steps
```

### Postman
1. Import `postman_collection.json`
2. Update sessionId variable
3. Run requests in order

---

## 🐛 Error Handling

### Common Errors

**404 - Session not found**
```json
{
  "success": false,
  "message": "Session not found"
}
```
→ Check sessionId

**400 - Wrong step**
```json
{
  "success": false,
  "message": "Invalid step. Expected 'color', currently at 'logo'"
}
```
→ Follow step order

**400 - Missing fields**
```json
{
  "success": false,
  "message": "Missing required field: logoId"
}
```
→ Check request body

**500 - Server error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```
→ Check server logs

---

## 📞 Support

### Test Failed?
```bash
# Check server is running
curl http://localhost:3000/health

# Check logs
tail -f server.log

# Restart server
npm start
```

### Need Help?
- Check test script: `examples/testNewFlow.js`
- Check sample data: `examples/testData.js`
- Check demo UI: `examples/demo.html`

---

## 🚀 Deployment

### Production Checklist
- [x] Environment variables configured
- [x] R2 credentials working
- [ ] Add authentication (optional)
- [ ] Add rate limiting (optional)
- [ ] Replace in-memory storage with Redis (optional)
- [ ] Add monitoring/logging (optional)

### Deploy to Server
```bash
# On server
git clone <repo>
cd API_find-img
npm install
cp .env.example .env
# Edit .env with production values
npm start

# Or use PM2
npm install -g pm2
pm2 start server.js --name logo-api
pm2 save
```

---

## 📈 Performance

- **Response time:** < 1s per request
- **Concurrent users:** Limited by in-memory storage (use Redis for production)
- **Asset loading:** Served from Cloudflare R2 CDN

---

## 🎉 Summary

**API sẵn sàng sử dụng!**

✅ Flow: Logo → Color → Layout → Background → Customize → Export  
✅ Input validation: Complete  
✅ Output format: Correct  
✅ Tests: 18/18 passed  

**Start:** `npm start`  
**Test:** `node examples/testNewFlow.js`

---

*Last Updated: 13/10/2025 | Version: 1.0.0*
