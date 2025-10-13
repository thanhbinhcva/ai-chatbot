from fastapi import FastAPI, HTTPException, Header, Query
from pydantic import BaseModel
import uvicorn
import json
import re
from typing import Optional
from main import (
    main_chain, memory, extract_info,
    save_brand_profile, recommend_logo,
    generate_logo_with_ai, google_api_key
)
from database import save_to_mongo
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from datetime import datetime

from database import get_brand_profile_by_session

app = FastAPI(title="AI Brand Assistant API")

# --- Request/Response Models ---
class ChatRequest(BaseModel):
    user_input: str

class ChatResponse(BaseModel):
    bot_reply: str
    finalized: bool = False
    brand_profile: dict | None = None
    logo_info: dict | None = None


# --- HÀM PHÂN TÍCH NGỮ CẢNH XÁC NHẬN ---
def should_finalize(conversation_history: str, last_user_input: str) -> bool:
    """
    Dùng Gemini để xác định xem người dùng có thực sự xác nhận finalize hay không.
    Không fix cứng từ khóa.
    """
    check_prompt = ChatPromptTemplate.from_template("""
    Bạn là hệ thống phân tích hội thoại giữa người dùng và trợ lý AI xây dựng thương hiệu.
    Dựa vào toàn bộ đoạn hội thoại trước đó và tin nhắn mới nhất của người dùng,
    hãy quyết định xem người dùng có đang XÁC NHẬN rằng bản tóm tắt hồ sơ thương hiệu là "đúng và đủ",
    tức là họ muốn hoàn tất và lưu lại kết quả, hay chỉ đang nói đồng ý ở ngữ cảnh khác.

    Chỉ trả về JSON hợp lệ:
    {{
        "finalize": true hoặc false
    }}

    ----
    Lịch sử hội thoại:
    {conversation}

    Tin nhắn mới nhất của người dùng:
    {user_input}
    """)

    chain = LLMChain(llm=main_chain.llm, prompt=check_prompt, verbose=False)
    response = chain.invoke({"conversation": conversation_history, "user_input": last_user_input})
    raw_text = response.get("text", "").strip()

    match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if not match:
        return False
    try:
        result = json.loads(match.group())
        return result.get("finalize", False)
    except Exception:
        return False


# --- CHAT API ---
@app.post("/api/chat/message", response_model=ChatResponse)
def chat_message(req: ChatRequest, x_session_id: Optional[str] = Header(None)):
    """
    Endpoint: /api/chat/message
    - Nhận tin nhắn từ người dùng và trả phản hồi từ chatbot.
    - Nếu người dùng xác nhận finalize → tự động tổng hợp hồ sơ và lưu DB.
    - Cần header: X-Session-ID
    """
    try:
        if not x_session_id:
            raise HTTPException(status_code=400, detail="Thiếu header X-Session-ID")

        # ✅ Thêm session ID vào bộ nhớ (nếu bạn muốn lưu riêng cho từng session)
        # Hiện tại dùng ConversationBufferMemory toàn cục, có thể mở rộng đa phiên.

        response = main_chain.invoke({"user_input": req.user_input})
        reply = response["text"]

        # Lấy lịch sử hội thoại
        history_data = memory.load_memory_variables({}).get("history", "")

        # ✅ Kiểm tra xem người dùng có thực sự muốn finalize không
        if should_finalize(history_data, req.user_input):
            finalized_data = auto_finalize()
            return ChatResponse(
                bot_reply="Tuyệt vời! Em đã tổng hợp hồ sơ và lưu lại cho anh/chị. 🚀",
                finalized=True,
                brand_profile=finalized_data["brand_profile"],
                logo_info=finalized_data["logo_info"]
            )

        # Nếu chưa finalize → chỉ trả phản hồi chatbot
        return ChatResponse(bot_reply=reply, finalized=False)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- FINALIZE API ---
@app.post("/api/briefs", response_model=ChatResponse)
def create_brief(x_session_id: Optional[str] = Header(None)):
    """
    Endpoint: /api/briefs
    - Khi người dùng đã xác nhận, tổng hợp dữ liệu & sinh logo.
    - Cần header: X-Session-ID
    """
    try:
        if not x_session_id:
            raise HTTPException(status_code=400, detail="Thiếu header X-Session-ID")

        finalized_data = auto_finalize()
        return ChatResponse(
            bot_reply="✅ Hồ sơ đã được tổng hợp và lưu thành công.",
            finalized=True,
            brand_profile=finalized_data["brand_profile"],
            logo_info=finalized_data["logo_info"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# --- HEALTH CHECK API ---
@app.get("/health")
def health_check(sessionId: Optional[str] = Query(None)):
    """
    API: /health
    - Kiểm tra tình trạng API.
    - Có thể nhận sessionId qua query params (?sessionId=...).
    """
    brand_profile = get_brand_profile_by_session(sessionId)
    return {
        "success": True,
        "message": "API is running",
        "timestamp": datetime.utcnow().isoformat(),
        "sessionId": sessionId or None,
        "brand_profile": brand_profile
    }


# --- CORE FINALIZE LOGIC ---
def auto_finalize():
    """Dùng chung cho cả chat auto và API /api/briefs"""
    try:
        final_summary = memory.load_memory_variables({})["history"]
        if not final_summary:
            raise ValueError("Không có dữ liệu hội thoại để tổng hợp.")

        # ✅ Trích xuất thông tin từ hội thoại
        brand_profile = extract_info(final_summary)
        save_brand_profile(brand_profile)  # Lưu JSON local

        # ✅ Lưu vào MongoDB
        inserted_id = save_to_mongo(brand_profile)
        if inserted_id:
            brand_profile["_id"] = str(inserted_id)
        print(f"✅ Brand profile đã lưu MongoDB với ID: {inserted_id}")

        # --- Sinh logo ---
        logo_info = None
        logo_shape_text = " ".join(brand_profile.get("logo_shape", [])).lower()

        if any(keyword in logo_shape_text for keyword in [
            "cách điệu", "tên thương hiệu", "wordmark", "logo chữ", "logotype"
        ]):
            print("🤖 Tạo logo AI vì khách hàng muốn logo cách điệu tên thương hiệu...")
            path = generate_logo_with_ai(
                brand_profile,
                google_api_key=google_api_key,
                output_path="generated_logo.png"
            )
            logo_info = {"type": "ai_generated", "file_path": path}
        else:
            suggestion = recommend_logo(final_summary)
            logo_info = {
                "type": "predefined",
                "category": suggestion["recommended_category"],
                "reason": suggestion["reason"],
                "folder_path": suggestion["folder_path"]
            }

        return {"brand_profile": brand_profile, "logo_info": logo_info}

    except Exception as e:
        print("❌ Lỗi khi finalize:", str(e))
        raise


# --- RUN SERVER ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
