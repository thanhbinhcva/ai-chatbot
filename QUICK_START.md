# 🚀 Quick Start - Test với Postman

## 📥 Import Collection trong 3 bước

### Bước 1: Mở Postman
![Open Postman]

### Bước 2: Click Import
- Click nút **Import** ở góc trên bên trái
- Chọn file `Asset_Service_Postman_Collection.json`
- Click **Import**

### Bước 3: Sẵn sàng test!
Collection **"Asset Service - 6 APIs"** sẽ xuất hiện

---

## 🎯 6 APIs Đơn Giản

```
📂 Asset Service - 6 APIs
  │
  ├── 1. Health Check                  GET  /health
  ├── 2. Get Emblems                   GET  /api/v1/logo/emblem/search
  ├── 3. Get Emblem Variants           GET  /api/v1/logo/emblem/variant/search?emblemId=E001
  ├── 4. Get Layout Categories         GET  /api/v1/logo/layout/category
  ├── 5. Get Layouts by Category       GET  /api/v1/logo/layout/search?categoryID=C101
  └── 6. Get Backgrounds               GET  /api/v1/logo/background/search
```

---

## ⚡ Test ngay (30 giây)

### 1. Start Server
```bash
npm start
```

### 2. Test API đầu tiên
- Click vào **1. Health Check**
- Click nút **Send**
- Xem response ✅

### 3. Test tiếp 5 APIs còn lại
- Click → Send → Xem response
- Đơn giản vậy thôi! 🎉

---

## 📝 Ví dụ Response

### API 1: Health Check
```json
{
  "status": "OK",
  "service": "Asset Service",
  "version": "1.0.0"
}
```

### API 2: Get Emblems
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
    }
  ]
}
```

### API 3: Get Emblem Variants
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
    }
  ]
}
```

---

## 🎨 Customize

### Thử emblem khác:
API 3: Đổi `emblemId=E001` → `E002` hoặc `E003`

### Thử category khác:
API 5: Đổi `categoryID=C101` → `C102`, `C103`, `C104`...

---

## ✅ Checklist

- [ ] Đã import collection
- [ ] Server đang chạy (`npm start`)
- [ ] Test API 1: Health Check ✅
- [ ] Test API 2: Get Emblems ✅
- [ ] Test API 3: Get Variants ✅
- [ ] Test API 4: Get Categories ✅
- [ ] Test API 5: Get Layouts ✅
- [ ] Test API 6: Get Backgrounds ✅

---

## 🆘 Cần giúp?

**Server không chạy?**
```bash
cd /Users/phammtuan/Assert_service
npm install
npm start
```

**Không thấy collection?**
- Import lại file `Asset_Service_Postman_Collection.json`

**API trả về lỗi?**
- Kiểm tra URL: `http://localhost:3000`
- Kiểm tra server có running không

---

Đơn giản vậy thôi! 🎉
