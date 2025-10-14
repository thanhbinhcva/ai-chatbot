# 🔄 Workflow Hệ thống Session Tracking

## Tổng quan

Hệ thống tracking giúp theo dõi từng bước người dùng trong quy trình chọn logo, đảm bảo workflow tuần tự và có thể quay lại bất kỳ bước nào.

## 📊 Luồng xử lý (Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                    1. KHỞI TẠO SESSION                      │
│                POST /api/v1/logo/session/init               │
│                  current_step: emblem_selection             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              2. CHỌN BIỂU TƯỢNG (EMBLEM)                    │
│           GET /api/v1/logo/emblem/search                    │
│          PUT /api/v1/logo/session/update                    │
│                  { emblemId: "E001" }                       │
│                  current_step: variant_selection            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│             3. CHỌN MÀU SẮC (VARIANT)                       │
│    GET /api/v1/logo/emblem/variant/search?emblemId=E001    │
│          PUT /api/v1/logo/session/update                    │
│                  { variantId: "V001" }                      │
│            current_step: layout_category_selection          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│          4. CHỌN DANH MỤC LAYOUT (CATEGORY)                 │
│           GET /api/v1/logo/layout/category                  │
│          PUT /api/v1/logo/session/update                    │
│              { layoutCategoryId: "C101" }                   │
│               current_step: layout_selection                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                5. CHỌN LAYOUT CỤ THỂ                        │
│      GET /api/v1/logo/layout/search?categoryID=C101        │
│          PUT /api/v1/logo/session/update                    │
│                  { layoutId: "L201" }                       │
│             current_step: background_selection              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│               6. CHỌN BACKGROUND                            │
│         GET /api/v1/logo/background/search                  │
│          PUT /api/v1/logo/session/update                    │
│               { backgroundId: "B301" }                      │
│               current_step: completed                       │
│                   completed: true                           │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Các bước chi tiết

### Bước 1: Khởi tạo Session
```bash
POST /api/v1/logo/session/init
```
**Mục đích:** Tạo session mới và bắt đầu tracking workflow

**Response:**
```json
{
  "session_id": "session-xxx",
  "current_step": "emblem_selection",
  "selected_emblem_id": null,
  "selected_variant_id": null,
  "selected_layout_category_id": null,
  "selected_layout_id": null,
  "selected_background_id": null,
  "completed": false
}
```

---

### Bước 2: Chọn Emblem
```bash
GET /api/v1/logo/emblem/search?sessionId=session-xxx
PUT /api/v1/logo/session/update
Body: { "sessionId": "session-xxx", "emblemId": "E001" }
```

**Kết quả:**
- `selected_emblem_id` = "E001"
- `current_step` = "variant_selection"

---

### Bước 3: Chọn Variant (Màu sắc)
```bash
GET /api/v1/logo/emblem/variant/search?emblemId=E001&sessionId=session-xxx
PUT /api/v1/logo/session/update
Body: { "sessionId": "session-xxx", "variantId": "V001" }
```

**Kết quả:**
- `selected_variant_id` = "V001"
- `current_step` = "layout_category_selection"

---

### Bước 4: Chọn Layout Category
```bash
GET /api/v1/logo/layout/category?sessionId=session-xxx
PUT /api/v1/logo/session/update
Body: { "sessionId": "session-xxx", "layoutCategoryId": "C101" }
```

**Kết quả:**
- `selected_layout_category_id` = "C101"
- `current_step` = "layout_selection"

---

### Bước 5: Chọn Layout cụ thể
```bash
GET /api/v1/logo/layout/search?categoryID=C101&sessionId=session-xxx
PUT /api/v1/logo/session/update
Body: { "sessionId": "session-xxx", "layoutId": "L201" }
```

**Kết quả:**
- `selected_layout_id` = "L201"
- `current_step` = "background_selection"

---

### Bước 6: Chọn Background
```bash
GET /api/v1/logo/background/search?sessionId=session-xxx
PUT /api/v1/logo/session/update
Body: { "sessionId": "session-xxx", "backgroundId": "B301" }
```

**Kết quả:**
- `selected_background_id` = "B301"
- `current_step` = "completed"
- `completed` = true

---

## 🔍 Kiểm tra Status bất kỳ lúc nào

```bash
GET /api/v1/logo/session/status?sessionId=session-xxx
```

Response cho biết:
- Người dùng đang ở bước nào (`current_step`)
- Đã chọn những gì (`selected_*`)
- Đã hoàn thành chưa (`completed`)

---

## 💡 Use Cases

### 1. Người dùng quay lại giữa chừng
```javascript
// Frontend có thể check status và redirect đến đúng bước
const response = await fetch('/api/v1/logo/session/status?sessionId=xxx');
const { status } = await response.json();

switch(status.current_step) {
  case 'emblem_selection': 
    // Hiển thị trang chọn emblem
    break;
  case 'variant_selection':
    // Hiển thị trang chọn màu
    break;
  // ...
}
```

### 2. Validate workflow tuần tự
```javascript
// API response bao gồm session_status
{
  "results": [...],
  "session_status": {
    "current_step": "layout_selection",
    "expected_step": "variant_selection"  // Warning: không đúng thứ tự
  }
}
```

### 3. Tạo progress bar
```javascript
const steps = [
  'emblem_selection',
  'variant_selection', 
  'layout_category_selection',
  'layout_selection',
  'background_selection',
  'completed'
];

const currentStepIndex = steps.indexOf(status.current_step);
const progress = (currentStepIndex / (steps.length - 1)) * 100;
// Progress: 0%, 20%, 40%, 60%, 80%, 100%
```

---

## 🧪 Test với Script

Chạy file `test_workflow.sh` để test toàn bộ workflow:

```bash
chmod +x test_workflow.sh
./test_workflow.sh
```

Script sẽ:
1. Tự động tạo session
2. Thực hiện từng bước tuần tự
3. Hiển thị kết quả mỗi bước
4. Kiểm tra status cuối cùng

---

## 📝 Lưu ý

1. **Session ID:** Cần lưu trữ ở client (localStorage, cookie, Redux store...)
2. **Timeout:** Hiện tại session lưu trong memory, sẽ mất khi restart server. Trong production nên dùng Redis/Database
3. **Validation:** Nên thêm validation để đảm bảo workflow tuần tự (VD: không thể chọn background trước khi chọn emblem)
4. **Optional sessionId:** Các API vẫn hoạt động bình thường nếu không truyền sessionId (backward compatible)
