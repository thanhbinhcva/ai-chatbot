import os
import json
import uuid
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain

# 1. Load API key
load_dotenv()
google_api_key = os.getenv("GEMINI_API_KEY")

# 2. Khởi tạo Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    temperature=0.4,
    google_api_key=google_api_key
)

# 3. Bộ nhớ hội thoại
memory = ConversationBufferMemory(memory_key="history", input_key="user_input")

# 4. Prompt tổng hợp (gom hết các stages)
main_prompt = ChatPromptTemplate.from_template("""
Bạn là một trợ lý AI thân thiện, chuyên giúp các chủ xưởng nhôm kính nhỏ ở Việt Nam xây dựng thương hiệu.

Nhiệm vụ:
- Trò chuyện tự nhiên, hỏi từng câu một, dựa theo câu trả lời trước để hỏi tiếp.
- Hãy lần lượt thu thập đủ các thông tin sau:
  1. Tên thương hiệu/công ty
  2. Địa chỉ
  3. Số điện thoại (nếu có)
  4. Dịch vụ chính
  5. Cơ cấu sản phẩm
  6. Khách hàng mục tiêu
  7. Lợi thế cạnh tranh
  8. Giá trị cốt lõi
  9. Mong muốn phát triển trong 3 năm tới
 10. Phong cách logo
 11. Màu sắc chủ đạo
 12. Doanh thu trung bình theo tháng/năm
 13. Khẩu hiệu / slogan

Khi đã đủ thông tin → viết một đoạn tóm tắt thương hiệu rõ ràng và ngắn gọn.
Kết thúc bằng câu hỏi xác nhận:
"Anh/chị thấy phần tóm tắt này đã đúng và đủ chưa, hay cần chỉnh sửa thêm không ạ?"

{history}
Người dùng: {user_input}
Bot:
""")

# 5. Chain duy nhất
main_chain = LLMChain(llm=llm, prompt=main_prompt, memory=memory, verbose=False)

# 6. Hàm trích xuất JSON
def extract_info(conversation: str):
    session_id = str(uuid.uuid4())[:8]
    extract_prompt = ChatPromptTemplate.from_template("""
Bạn là hệ thống trích xuất dữ liệu. 
Hãy phân tích đoạn hội thoại sau và xuất ra JSON theo đúng cấu trúc dưới đây.
Chỉ trả về JSON hợp lệ, không thêm text ngoài JSON.

{{
  "session_id": "{session_id}",
  "dealer_id": "số điện thoại nếu có, nếu không thì để trống",
  "brand_name_full": "",
  "location": "",
  "main_services": [],
  "product_portfolio": [],
  "target_customers": [],
  "competitive_advantage": [],
  "core_values": [],
  "slogan": "",
  "future_vision": [],
  "logo_style": [],
  "main_color": [],
  "revenue": ""
}}

Đoạn hội thoại:
{conversation}
""")
    extract_chain = LLMChain(llm=llm, prompt=extract_prompt, verbose=False)
    response = extract_chain.invoke({"conversation": conversation, "session_id": session_id})
    raw_text = response.get("text", "").strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        print("⚠️ Không parse được JSON, lưu raw text thay thế.")
        return {"session_id": session_id, "raw_output": raw_text}

# 7. Hàm lưu JSON
def save_brand_profile(data, filename="brand_profile.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Hồ sơ thương hiệu đã lưu vào {filename}")

# 8. Chạy hội thoại
def run_chatbot():
    print("🤖 Chatbot Gemini - Tư vấn thương hiệu\n")

    # Khởi động hội thoại
    user_input = "Xin chào"
    response = main_chain.invoke({"user_input": user_input})
    print("Bot:", response["text"])

    # Vòng lặp hội thoại
    while True:
        user_input = input("Bạn: ")
        response = main_chain.invoke({"user_input": user_input})
        print("Bot:", response["text"])

        # Nếu bot đã tóm tắt và hỏi xác nhận
        if "đúng và đủ" in response["text"].lower() or "chỉnh sửa" in response["text"].lower():
            break

    # Xử lý xác nhận
    while True:
        user_input = input("Bạn: ")
        if any(word in user_input.lower() for word in ["đúng", "đủ", "chính xác", "ok", "oke", "rồi"]):
            print("Bot: Tuyệt vời! Rất vui vì đã giúp anh/chị định hình thương hiệu. 🚀")
            final_summary = memory.load_memory_variables({})["history"]
            brand_profile = extract_info(final_summary)
            save_brand_profile(brand_profile)
            break
        else:
            fix_prompt = ChatPromptTemplate.from_template("""
{history}
Khách hàng chưa hài lòng với bản tóm tắt, họ muốn chỉnh sửa: "{feedback}".
Hãy viết lại bản tóm tắt thương hiệu đầy đủ và chính xác hơn, sau đó hỏi lại họ xác nhận.
""")
            fix_chain = LLMChain(llm=llm, prompt=fix_prompt, memory=memory, verbose=False)
            response = fix_chain.invoke({"user_input": user_input, "feedback": user_input})
            print("Bot:", response["text"])

if __name__ == "__main__":
    run_chatbot()
