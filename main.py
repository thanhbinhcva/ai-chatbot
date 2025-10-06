import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
import re
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

# 4. Định nghĩa các giai đoạn
stages = {
    "intro": """
Bạn là một trợ lý AI thân thiện, chuyên giúp các chủ xưởng nhôm kính nhỏ ở Việt Nam xây dựng thương hiệu.
Hãy chào khách hàng ngắn gọn, giải thích lợi ích và mời họ bắt đầu.
""",

    "basic_info": """
{history}
Hãy hỏi tiếp một câu để lấy thông tin cơ bản (tên công ty, dịch vụ chính, khách hàng mục tiêu).
""",

    "competitive_advantage": """
{history}
Hãy hỏi tiếp một câu về lợi thế cạnh tranh của công ty.
""",

    "core_values": """
{history}
Hãy hỏi tiếp về giá trị cốt lõi hoặc tầm nhìn 3 năm tới.
""",

    "style_preferences": """
{history}
Hãy hỏi một câu về phong cách logo hoặc màu sắc chủ đạo (tùy thông tin nào chưa có).
""",

    "summary": """
{history}
Hãy viết một đoạn tóm tắt thương hiệu dựa trên thông tin đã có:
- Tên thương hiệu
- Dịch vụ chính
- Khách hàng mục tiêu
- Lợi thế cạnh tranh
- Giá trị cốt lõi
- Tầm nhìn
- Phong cách logo
- Màu sắc

Kết thúc bằng câu hỏi xác nhận:
"Anh/chị thấy phần tóm tắt này đã đúng và đủ chưa, hay cần chỉnh sửa thêm không ạ?"
"""
}

# 5. Tạo chain
chains = {
    name: LLMChain(llm=llm, prompt=ChatPromptTemplate.from_template(template), memory=memory, verbose=False)
    for name, template in stages.items()
}

# 6. Hàm trích xuất thông tin thành JSON
def extract_info(conversation: str):
    extract_prompt = ChatPromptTemplate.from_template("""
    Bạn là một hệ thống trích xuất dữ liệu. 
    Phân tích toàn bộ đoạn hội thoại sau và CHỈ trả về JSON hợp lệ, không thêm chữ nào ngoài JSON.
    Nếu không có thông tin, để trống hoặc mảng rỗng.

    Đầu ra JSON phải theo đúng cấu trúc này:
    {{
    "session_id": "tạo id ngẫu nhiên",
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
    response = extract_chain.invoke({"conversation": conversation})

    text = response.get("text", "").strip()

    # Lấy đúng đoạn JSON trong text (phòng khi model vẫn "nói thêm")
    import re
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("❌ extract_info: Model không trả về JSON.\nKết quả:", text)

    return json.loads(match.group())

# 7. Hàm lưu JSON
def save_brand_profile(data, filename="brand_profile.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Hồ sơ thương hiệu đã lưu vào {filename}")

# 8. Chạy hội thoại
def run_chatbot():
    print("🤖 Chatbot Gemini - Tư vấn thương hiệu\n")
    collected_info = {"logo_style": None, "main_color": None}

    for stage_name, chain in chains.items():
        print(f"--- {stage_name.upper()} ---")
        user_input = input("Bạn: ") if stage_name != "intro" else "Xin chào"
        response = chain.invoke({"user_input": user_input})
        print("Bot:", response["text"])

        # Kiểm tra nếu user đã nhập phong cách logo hoặc màu
        if "logo" in user_input.lower():
            collected_info["logo_style"] = user_input
        if "xanh" in user_input.lower() or "đỏ" in user_input.lower() or "màu" in user_input.lower():
            collected_info["main_color"] = user_input

        # Nếu đã có đủ logo_style + main_color thì dừng vòng lặp và gợi ý logo luôn
        if collected_info["logo_style"] and collected_info["main_color"]:
            print("\n✅ Đã có thông tin về logo style và màu sắc. Tiến hành gợi ý logo...\n")

            final_summary = memory.load_memory_variables({})["history"]

            # Trích xuất JSON
            brand_profile = extract_info(final_summary)
            save_brand_profile(brand_profile)

            # Gợi ý logo
            logo_suggestion = recommend_logo(final_summary)
            print("\n🎨 Logo đề xuất cho thương hiệu của anh/chị:")
            print("👉 Nhóm logo:", logo_suggestion["recommended_category"])
            print("📌 Lý do:", logo_suggestion["reason"])
            print("📂 Folder:", logo_suggestion["folder_path"])
            return  # Thoát luôn, không hỏi tiếp

    # Nếu đi hết flow mà chưa đủ info -> fallback sang summary như cũ
    while True:
        user_input = input("Bạn: ")
        if any(word in user_input.lower() for word in ["đúng", "đủ", "chính xác", "ok", "oke", "rồi"]):
            print("Bot: Tuyệt vời! Rất vui vì đã giúp anh/chị định hình thương hiệu. 🚀")

            final_summary = memory.load_memory_variables({})["history"]
            brand_profile = extract_info(final_summary)
            save_brand_profile(brand_profile)

            logo_suggestion = recommend_logo(final_summary)
            print("\n🎨 Logo đề xuất cho thương hiệu của anh/chị:")
            print("👉 Nhóm logo:", logo_suggestion["recommended_category"])
            print("📌 Lý do:", logo_suggestion["reason"])
            print("📂 Folder:", logo_suggestion["folder_path"])
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

# Map nhóm logo -> folder
logo_folders = {
    "Abstract geometric": "logos/abstract_geometric/",
    "Building/Tower": "logos/building_tower/",
    "Door": "logos/door/",
    "Gear/mechanism": "logos/gear/",
    "House": "logos/house/",
    "Lock/security": "logos/lock/",
    "Rolling door/shutter": "logos/rolling_door/",
    "Roof": "logos/roof/",
    "Shield": "logos/shield/",
    "Window": "logos/window/"
}

# 10. Hàm gợi ý logo
def recommend_logo(conversation: str):
    prompt = ChatPromptTemplate.from_template("""
Bạn là một chuyên gia thương hiệu.
Dựa trên toàn bộ đoạn hội thoại sau, hãy chọn duy nhất 1 nhóm logo phù hợp nhất.

Danh sách nhóm logo có sẵn:
- Abstract geometric
- Building/Tower
- Door
- Gear/mechanism
- House
- Lock/security
- Rolling door/shutter
- Roof
- Shield
- Window

⚠️ Chỉ trả về JSON hợp lệ theo đúng cấu trúc:
{{
  "recommended_category": "tên nhóm logo",
  "reason": "giải thích ngắn gọn"
}}

Đoạn hội thoại:
{conversation}
""")

    chain = LLMChain(llm=llm, prompt=prompt, verbose=False)
    response = chain.invoke({"conversation": conversation})

    text = response.get("text", "").strip()

    # Bóc JSON bằng regex

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("❌ recommend_logo: Model không trả về JSON.\nKết quả:", text)

    result = json.loads(match.group())

    # Thêm folder path
    folder_path = logo_folders.get(result["recommended_category"], "logos/abstract_geometric/")
    result["folder_path"] = folder_path
    return result

if __name__ == "__main__":
    run_chatbot()
