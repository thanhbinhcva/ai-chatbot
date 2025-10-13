# 📘 Logo Selection API

**Version:** 1.0.0 | **Status:** ✅ PRODUCTION READY | **Tests:** 18/18 PASSED

API để chọn logo theo luồng: **Logo → Color → Layout → Background → Customize → Export**

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Run server
npm start

# 3. Test API
node examples/testNewFlow.js
```

Server: http://localhost:3000

---

## 📖 Full Documentation

**👉 XEM TẠI: [API_GUIDE.md](./API_GUIDE.md) ⭐**

File duy nhất chứa toàn bộ hướng dẫn:
- ✅ API Flow & Endpoints
- ✅ Request/Response Examples
- ✅ Configuration (R2)
- ✅ Data Structure
- ✅ Testing Guide
- ✅ Deployment
- ✅ Error Handling

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

---

## 📊 Test Results

```
🧪 Logo Selection API - New Workflow Test

✅ Step 1: Initialize Session
✅ Step 2: Select Logo
✅ Step 3: Select Color
✅ Step 4: Select Layout
✅ Step 5: Select Background
✅ Step 6: Customize Content
✅ Step 7: Finalize Export

🎉 All 18/18 validation checks PASSED!
```

---

## 🔧 Configuration

```bash
# .env file
PORT=3000

# ⭐ Tất cả assets lấy từ R2 public URL
R2_BASE_URL=https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev
```

**Chỉ cần R2_BASE_URL!** API sẽ tự generate URLs cho logos, colors, layouts, backgrounds.

---

## 📁 Project Structure

```
API_find-img/
├── API_GUIDE.md ⭐          # Complete documentation
├── server.js                # Entry point
├── controllers/             # HTTP handlers
├── services/                # Business logic
├── routes/                  # API routes
├── config/                  # Constants
├── examples/
│   ├── testNewFlow.js ⭐   # Automated test
│   ├── testData.js         # Sample data
│   └── demo.html           # Demo UI
└── .env                    # Configuration
```

---

## 🧪 Testing

### Automated Test (Recommended)
```bash
node examples/testNewFlow.js
```

### Manual Test (cURL)
```bash
curl -X POST http://localhost:3000/api/workflow/initialize \
  -H "Content-Type: application/json" \
  -d '{"brand_name":"Test","phone":"0123","main_products":["cửa nhôm"]}'
```

### Postman
Import `postman_collection.json` và run theo thứ tự

---

## 📚 Available Data

- **Categories:** 10 (Door, House, Building, Window, Roof, Lock, Shield, Gear, Rolling Door, Abstract)
- **Logos:** 10 per category = 100 total
- **Colors:** 9 (blue, brown, gold, green, grey, orange, red, white, yellow)
- **Layouts:** 20 (Avatar, Billboard, Card, Cover - 5 each)
- **Backgrounds:** 26 (9 colors + 17 images)

---

## 🎉 Summary

**✅ API hoàn thành và validated 100%!**

- Flow: Logo → Color → Layout → Background → Customize → Export
- Input validation: Complete
- Output format: Correct
- Tests: 18/18 passed
- R2 configured: Ready

**📖 Full Guide:** [API_GUIDE.md](./API_GUIDE.md)

---

*Last Updated: 13/10/2025*
