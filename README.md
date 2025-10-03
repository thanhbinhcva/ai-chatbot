# 🤖 Chatbot Gemini - Tư vấn Logo & Slogan cho Đại lý Nhôm Kính

Dự án này xây dựng một chatbot sử dụng **LangChain** + **Gemini API** để tư vấn thương hiệu (logo, slogan, phong cách thiết kế) cho các đại lý nhôm kính nhỏ tại Việt Nam.  
Chatbot sẽ thu thập thông tin từ khách hàng thông qua hội thoại tự nhiên, sau đó tạo ra một bản **hồ sơ thương hiệu** dưới dạng JSON.

---

## 🚀 Tính năng chính
- Trò chuyện tự nhiên với khách hàng, hỏi từng câu một.
- Thu thập thông tin cần thiết cho việc xây dựng thương hiệu:
  - Tên thương hiệu / công ty
  - Địa chỉ
  - Số điện thoại
  - Dịch vụ chính
  - Cơ cấu sản phẩm
  - Khách hàng mục tiêu
  - Lợi thế cạnh tranh
  - Giá trị cốt lõi
  - Mong muốn phát triển (3 năm tới)
  - Phong cách logo
  - Màu sắc chủ đạo
  - Doanh thu trung bình
  - Khẩu hiệu / slogan
- Tự động tạo **tóm tắt thương hiệu** và hỏi khách hàng xác nhận.
- Sau khi xác nhận, hệ thống trích xuất thông tin thành JSON và lưu vào file `brand_profile.json`.

---

## 🛠️ Cài đặt

### 1. Clone dự án
```bash
git clone https://github.com/your-username/ai-chatbot-branding.git
cd ai-chatbot-branding
```
### 2. Tạo môi trường ảo (tuỳ chọn)
```bash
conda create -n langchain-chat python=3.10 -y
conda activate langchain-chat
```
### 3. Cài đặt thư viện
```bash
pip install -r requirements.txt
```
### 4. Thiết lập API key
- Lấy API key từ Google AI Studio
- Tạo file .env trong thư mục gốc và thêm dòng:
```bash
GEMINI_API_KEY=your_api_key_here
```
Cách chạy chatbot
```bash
python main.py
```
Ví dụ hội thoại
🤖 Chatbot Gemini - Tư vấn thương hiệu

Bot: Xin chào anh/chị! Tôi là trợ lý AI, chuyên giúp các chủ xưởng nhôm kính xây dựng thương hiệu.
Trong vài phút, tôi sẽ giúp anh/chị có ý tưởng Logo và Slogan chuyên nghiệp để khách hàng tin tưởng hơn và nhớ đến mình nhiều hơn.
Mình bắt đầu ngay nhé?

Bạn: ok
Bot: Trước tiên, anh/chị có thể cho tôi biết tên công ty hoặc xưởng của mình không ạ?
...
Bot: Đây là bản tóm tắt thương hiệu. Anh/chị thấy đã đúng và đủ chưa, hay cần chỉnh sửa thêm?

Cấu trúc JSON đầu ra
```bash
{
  "session_id": "a1b2c3d4",
  "dealer_id": "0912345678",
  "brand_name_full": "Nhôm Kính Thanh Phát",
  "location": "Hà Nội",
  "main_services": ["Thi công cửa nhôm kính", "Mặt dựng"],
  "product_portfolio": ["Cửa đi", "Cửa sổ", "Vách ngăn"],
  "target_customers": ["Gia đình", "Chung cư", "Doanh nghiệp nhỏ"],
  "competitive_advantage": ["Giá cả cạnh tranh", "Dịch vụ bảo hành 24/7"],
  "core_values": ["Tận tâm", "Uy tín"],
  "slogan": "Vững chắc từng công trình",
  "future_vision": ["Mở rộng sang thị trường miền Trung"],
  "logo_style": ["Hiện đại", "Đơn giản"],
  "main_color": ["Xanh dương – tin cậy"],
  "revenue": "200 triệu / tháng"
}

```
