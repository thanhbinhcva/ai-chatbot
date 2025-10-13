# 🔗 Kết Nối AI Chatbot với API_find-img

## 📋 Mô tả

Module này giúp kết nối output từ `ai-chatbot` (file `brand_profile.json`) với API `API_find-img` để tạo logo tự động.

## 🎯 Workflow

```
ai-chatbot (main.py)
    ↓
brand_profile.json
    ↓
api_connector.py → API_find-img (http://localhost:3000)
    ↓
Logos → Colors → Layouts → Backgrounds → Customize → Export
    ↓
final_export.json
```

## 📁 Files Mới

1. **`api_connector.py`** - Module kết nối với API
2. **`test_full_workflow.py`** - Demo toàn bộ workflow tự động
3. **`API_CONNECTION.md`** - File hướng dẫn này

## 🚀 Cách Sử Dụng

### Bước 1: Cài Đặt Dependencies

```bash
cd /Users/phammtuan/Project/ai-chatbot
pip install -r requirements.txt
```

### Bước 2: Chạy Chatbot để tạo Brand Profile

```bash
python main.py
```

Sau khi trò chuyện xong, file `brand_profile.json` sẽ được tạo ra.

### Bước 3: Khởi Động API_find-img

Mở terminal mới:

```bash
cd /Users/phammtuan/Project/API_find-img
npm install
npm start
```

API sẽ chạy tại: `http://localhost:3000`

### Bước 4: Chạy Demo Workflow

Quay lại terminal của ai-chatbot:

```bash
python test_full_workflow.py
```

Script này sẽ tự động:
1. Load `brand_profile.json`
2. Kết nối với API
3. Chọn logo, màu, layout, background
4. Customize thông tin
5. Export final JSON

Kết quả được lưu trong `final_export.json`

## 🔧 Sử Dụng Manual

Nếu muốn control từng bước:

```python
from api_connector import APIConnector, load_brand_profile

# 1. Load brand profile
brand_profile = load_brand_profile("brand_profile.json")

# 2. Khởi tạo connector
connector = APIConnector(api_base_url="http://localhost:3000")

# 3. Initialize workflow
result = connector.initialize_workflow(brand_profile)
logos = result['data']['logos']

# 4. Select logo
connector.select_logo(
    logo_id="Door-1",
    category="Door",
    variant=1
)

# 5. Select color
connector.select_color(
    color="blue",
    color_url="https://..."
)

# 6. Select layout
connector.select_layout(layout_id="billboard-1")

# 7. Select background
connector.select_background(
    background_id="bg-1",
    background_url="https://..."
)

# 8. Customize
connector.customize({
    'brandName': 'Nhôm kính An Phát',
    'slogan': 'Chất lượng Vàng',
    'phone': '0986899001',
    'location': '212 Quang Trung',
    'primaryColor': '#0066CC',
    'secondaryColor': '#FFFFFF'
})

# 9. Export
final_result = connector.export_final()
```

## 📊 API Methods

### `initialize_workflow(brand_profile)`
- Khởi tạo workflow với brand profile
- Trả về: Danh sách logos

### `select_logo(logo_id, category, variant)`
- Chọn logo
- Trả về: Danh sách colors

### `select_color(color, color_url)`
- Chọn màu
- Trả về: Danh sách layouts

### `select_layout(layout_id)`
- Chọn layout
- Trả về: Danh sách backgrounds

### `select_background(background_id, background_url)`
- Chọn background
- Trả về: Form customization

### `customize(customization_data)`
- Customize text và colors
- Trả về: Confirmation

### `export_final()`
- Export final JSON
- Trả về: JSON data để download/sử dụng

### `get_status()`
- Lấy status hiện tại của workflow

### `reset_to_step(step)`
- Reset về một bước cụ thể

## 🐛 Troubleshooting

### API không kết nối được

```bash
# Check API có chạy không
curl http://localhost:3000/health

# Hoặc
python -c "import requests; print(requests.get('http://localhost:3000/health').json())"
```

### Brand profile không load được

Kiểm tra file `brand_profile.json` có đúng format không:
```json
{
  "session_id": "...",
  "brand_name_full": "...",
  "location": "...",
  ...
}
```

### Module requests không có

```bash
pip install requests
```

## 📝 Output Files

Sau khi chạy workflow, sẽ có các files:

1. **`workflow_results.json`** - Kết quả trung gian
2. **`final_export.json`** - Kết quả cuối cùng, ready để sử dụng

## 🎨 Tích Hợp vào Main Flow

Để tích hợp vào flow chính của chatbot, thêm vào cuối file `main.py`:

```python
# Sau khi tạo brand_profile.json
from api_connector import APIConnector

# Khởi tạo và gửi sang API
connector = APIConnector()
result = connector.initialize_workflow(brand_profile)

if result.get('success'):
    print("\n✅ Brand profile đã được gửi sang API_find-img!")
    print(f"Session ID: {connector.session_id}")
    print(f"Có thể tiếp tục chọn logo tại: http://localhost:3000")
```

## 💡 Tips

1. **Auto-select**: Demo script tự động chọn option đầu tiên cho mỗi bước
2. **Manual selection**: Sử dụng các methods riêng lẻ để control từng bước
3. **Reset**: Dùng `reset_to_step()` nếu muốn quay lại một bước nào đó
4. **Status**: Dùng `get_status()` để check workflow hiện tại ở đâu

## 🔄 Next Steps

1. Build UI để user có thể chọn logo/màu/layout
2. Tích hợp vào chatbot flow
3. Thêm validation và error handling
4. Deploy cả hai services lên cloud

## 📞 Support

Nếu có vấn đề, check:
1. API có đang chạy không (port 3000)
2. Brand profile có đúng format không
3. Dependencies đã cài đủ chưa
