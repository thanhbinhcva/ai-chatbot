# 🚀 HƯỚNG DẪN POSTMAN - QUICK FIX

## ⚠️ LỖI 404 - NGUYÊN NHÂN

Bạn chưa có **sessionId**! URL đang là:
```
http://localhost:3000/api/workflow/replace-with-actual-session-id/logo
                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                    Cần thay bằng sessionId thật!
```

---

## ✅ CÁCH FIX (3 BƯỚC)

### Bước 1: Import Collection Mới
1. Mở Postman
2. Click **Import**
3. Chọn file: `postman_collection.json` (đã update)
4. Import xong!

### Bước 2: Chạy Initialize
1. Click vào **"1. Initialize Session"**
2. Click **Send**
3. Xem Response:
```json
{
  "success": true,
  "data": {
    "sessionId": "abc123def...",  // ← SessionId này!
    "category": "Door",
    "logos": [...]
  }
}
```

4. Check Console (dưới cùng):
```
✅ SessionId saved: abc123def...
✅ You can now run the next steps!
```

### Bước 3: Chạy Các Bước Tiếp
**GIỜ ĐÃ CÓ THỂ CHẠY TIẾP!**

1. **"2. Select Logo"** → Chọn logo → Get colors
2. **"3. Select Color"** → Chọn màu → Get layouts
3. **"4. Select Layout"** → Chọn layout → Get backgrounds
4. **"5. Select Background"** → Chọn background → Get customization
5. **"6. Customize Content"** → Sửa text/color/font
6. **"7. Finalize Export"** → Lấy final JSON

---

## 📝 BODY MẪU CHO TỪNG BƯỚC

### 1. Initialize ✅ (Đã có sẵn)
```json
{
  "session_id": "62e3f3d3",
  "dealer_id": "0986899001",
  "brand_name_full": "Nhôm kính An Phát",
  "main_products": ["cửa nhôm", "cửa kính"],
  // ... (đã có đầy đủ trong collection)
}
```

### 2. Select Logo ✅ (Đã có sẵn)
```json
{
  "logoId": "Door-1",
  "category": "Door",
  "variant": 1
}
```

### 3. Select Color ✅ (Đã có sẵn)
```json
{
  "color": "blue",
  "colorUrl": "https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/image-logo/Door/door_1/door_1_blue.svg"
}
```

### 4. Select Layout ✅ (Đã có sẵn)
```json
{
  "layoutId": "avatar-1"
}
```

### 5. Select Background ✅ (Đã có sẵn)
**Option 1: Color**
```json
{
  "backgroundId": "color-1",
  "type": "color",
  "value": "#FFFFFF"
}
```

**Option 2: Image**
```json
{
  "backgroundId": "image-1",
  "type": "image",
  "value": "https://pub-899d2a26777749e09d0cc4628befdc61.r2.dev/Background/background_1.jpg"
}
```

### 6. Customize Content ✅ (Đã có sẵn)
```json
{
  "brandName": "Nhôm Kính An Phát - Premium",
  "slogan": "Chất Lượng Là Danh Dự",
  "phoneNumber": "0986899001",
  "location": "212 Quang Trung, Hà Đông, Hà Nội",
  "textColor": "#0066CC",
  "textFont": "Arial Bold"
}
```

### 7. Finalize Export ✅
**Không cần body** - Chỉ Send!

---

## 🎯 TIP: Chạy Nhanh

### Dùng Runner
1. Click **Runner** (góc trên)
2. Chọn collection **"Logo Selection API - New Flow"**
3. Bỏ tick **"5b. Select Background (Image)"** (optional)
4. Bỏ tick **"Utils: ..."** (các utils)
5. Click **Run**
6. Xem tất cả chạy tự động! ⚡

### Hoặc Chạy Từng Bước
Click **Send** theo thứ tự từ 1 → 7

---

## 🐛 Troubleshooting

### Lỗi: "Invalid step"
```json
{
  "success": false,
  "message": "Invalid step. Current step is: color"
}
```
**Fix:** Bạn đang skip bước! Phải chạy đúng thứ tự 1→2→3→4→5→6→7

### Lỗi: "Session not found"
```json
{
  "success": false,
  "message": "Session not found"
}
```
**Fix:** 
1. Check variable `{{sessionId}}` có giá trị chưa
2. Chạy lại **"1. Initialize Session"**

### Lỗi: "Layout must be selected"
```json
{
  "success": false,
  "message": "Layout must be selected"
}
```
**Fix:** Bạn chưa chạy **"4. Select Layout"**! Phải chọn layout trước background.

---

## ✅ CHECK STATUS

Muốn biết đang ở bước nào?

**Run:** `Utils: Get Session Status`

**Response:**
```json
{
  "currentStep": "color",
  "currentStepIndex": 2,
  "totalSteps": 5,
  "completedSteps": ["logo", "color"]
}
```

---

## 🎉 SUCCESS OUTPUT

Sau bước **"7. Finalize Export"**, bạn sẽ nhận:

```json
{
  "success": true,
  "data": {
    "briefId": "unique-id...",
    "sessionId": "abc123...",
    "chosenLogoUrl": "https://...",
    "chosenColor": "blue",
    "chosenLayout": { ... },
    "chosenBackground": { ... },
    "customization": {
      "brandName": "Nhôm Kính An Phát - Premium",
      "slogan": "Chất Lượng Là Danh Dự",
      "textColor": "#0066CC",
      "textFont": "Arial Bold"
    },
    "assetsToExport": [
      {
        "layoutId": "avatar-1",
        "customizations": {
          "brand_name": {
            "text": "Nhôm Kính An Phát - Premium",
            "font": "Arial Bold",
            "color": "#0066CC"
          },
          // ... all fields with font & color
        }
      }
    ]
  }
}
```

**🎯 HOÀN TẤT!**

---

*Last Updated: 13/10/2025*
