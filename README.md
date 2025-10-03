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

### 2. Tạo môi trường ảo (tuỳ chọn)
conda create -n langchain-chat python=3.10 -y
conda activate langchain-chat
