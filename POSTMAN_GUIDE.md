# 📮 Hướng dẫn Test API với Postman

## 🎯 Tổng quan

File `Asset_Service_Postman_Collection.json` chứa **6 APIs đơn giản** để test Asset Service:

1. **Health Check** - Kiểm tra server
2. **Get Emblems** - Lấy danh sách emblems
3. **Get Emblem Variants** - Lấy màu sắc của emblem
4. **Get Layout Categories** - Lấy danh mục layouts
5. **Get Layouts by Category** - Lấy layouts trong danh mục
6. **Get Backgrounds** - Lấy danh sách backgrounds

## 📥 Bước 1: Import Collection vào Postman

### Cách 1: Import từ File

1. Mở **Postman**
2. Click nút **Import** (góc trên bên trái)
3. Chọn tab **File**
4. Kéo thả file `Asset_Service_Postman_Collection.json` hoặc click **Choose Files** và chọn file
5. Click **Import**

### Cách 2: Import từ JSON Raw

1. Mở **Postman**
2. Click nút **Import**
3. Chọn tab **Raw text**
4. Copy toàn bộ nội dung file `Asset_Service_Postman_Collection.json` và paste vào
5. Click **Continue** → **Import**

---

## ⚙️ Bước 2: Cấu hình Environment (Optional)

Collection đã có sẵn biến:
- `base_url`: `http://localhost:3000` (mặc định)

### Để thay đổi base_url:

1. Click vào collection **Asset Service - 6 APIs**
2. Chọn tab **Variables**
3. Thay đổi `base_url` nếu server chạy ở port khác (VD: `http://localhost:8080`)

---

## 🚀 Bước 3: Chạy Server

Trước khi test, hãy đảm bảo server đang chạy:

```bash
cd /Users/phammtuan/Assert_service
npm install
npm start
```

Server sẽ chạy tại `http://localhost:3000`

---

## 🧪 Bước 4: Test APIs

Thực hiện lần lượt 6 APIs:

### 1. Health Check ✅
- Kiểm tra server hoạt động
- Expected: Status 200

### 2. Get Emblems
- Lấy danh sách tất cả emblems
- Response: E001, E002, E003

### 3. Get Emblem Variants
- URL có sẵn: `emblemId=E001`
- Có thể thay đổi thành `E002` hoặc `E003`
- Response: Danh sách màu sắc (blue, red, green...)

### 4. Get Layout Categories
- Lấy tất cả categories
- Response: Avatar, Billboard, Business Card...

### 5. Get Layouts by Category
- URL có sẵn: `categoryID=C101` (Avatar)
- Có thể thay đổi: `C102` (Billboard), `C103` (Business Card)...
- Response: Danh sách layouts và components

### 6. Get Backgrounds
- Lấy tất cả backgrounds
- Response: B301, B302, B303, B304

---

## 🔥 Bước 5: Run Collection (Optional)

### Chạy toàn bộ 6 APIs cùng lúc:

1. Click vào collection **Asset Service - 6 APIs**
2. Click nút **Run**
3. Click **Run Asset Service - 6 APIs**

Postman sẽ tự động chạy tuần tự cả 6 APIs và hiển thị kết quả.

---

## 🎨 Customize Requests

### Thay đổi emblemId:

Vào **3. Get Emblem Variants**
- Sửa query param `emblemId` từ `E001` → `E002` hoặc `E003`

### Thay đổi categoryID:

Vào **5. Get Layouts by Category**
- Sửa query param `categoryID` từ `C101` → `C102`, `C103`, `C104`...

---

## 📝 Response Examples

### Success Response (Emblem Search):
```json
{
  "results": [
    {
      "uid": "E001",
      "type": "emblem",
      "category": "door",
      "url": "https://assert-service.com/emblems/door.png"
    }
  ],
  "session_status": {
    "current_step": "emblem_selection",
    "expected_step": "emblem_selection"
  }
}
```

### Error Response (Missing Parameter):
```json
{
  "error": "Bad Request",
  "message": "emblemId query parameter is required"
}
```

---

## 🐛 Troubleshooting

### Lỗi: "Could not get response"
- ✅ Kiểm tra server đang chạy: `npm start`
- ✅ Kiểm tra URL: `http://localhost:3000`

### Lỗi: "emblemId is required"
- ✅ Kiểm tra query parameter có giá trị không

### Lỗi: "Category not found"
- ✅ Sử dụng categoryID hợp lệ: C101, C102, C103...

---

## 💡 Tips

1. **Xem Response đẹp**: Click tab **Pretty** trong response
2. **Copy cURL**: Click **Code** → **cURL** để export sang cURL command
3. **Save Response**: Click **Save as Example** để lưu response mẫu

---

## 🎯 Quick Start

1. ✅ Import collection vào Postman
2. ✅ Start server: `npm start`
3. ✅ Test lần lượt 6 APIs
4. ✅ Done!

Happy Testing! 🚀
