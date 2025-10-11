from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import json
from main import (
    main_chain, memory, extract_info,
    save_brand_profile, recommend_logo,
    generate_logo_with_ai, google_api_key
)

app = FastAPI(title="AI Brand Assistant API")

# --- Request/Response Models ---

class ChatRequest(BaseModel):
    user_input: str

class ChatResponse(BaseModel):
    bot_reply: str

class FinalizeResponse(BaseModel):
    brand_profile: dict
    logo_info: dict | None = None


# --- Chat API ---
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """Nhận tin nhắn từ người dùng và trả phản hồi từ chatbot"""
    try:
        response = main_chain.invoke({"user_input": req.user_input})
        reply = response["text"]
        return ChatResponse(bot_reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Finalize API ---
@app.post("/finalize", response_model=FinalizeResponse)
def finalize_chat():
    """Khi khách hàng xác nhận 'đúng và đủ', tổng hợp dữ liệu & sinh logo"""
    try:
        final_summary = memory.load_memory_variables({})["history"]
        brand_profile = extract_info(final_summary)
        save_brand_profile(brand_profile)

        # --- Phân nhánh sinh logo ---
        logo_info = None
        logo_shape_text = " ".join(brand_profile.get("logo_shape", [])).lower()

        if any(keyword in logo_shape_text for keyword in [
            "cách điệu", "tên thương hiệu", "wordmark", "logo chữ", "logotype"
        ]):
            print("🤖 Tạo logo AI vì khách hàng muốn logo cách điệu tên thương hiệu...")
            path = generate_logo_with_ai(brand_profile, google_api_key=google_api_key, output_path="generated_logo.png")
            logo_info = {"type": "ai_generated", "file_path": path}
        else:
            suggestion = recommend_logo(final_summary)
            logo_info = {
                "type": "predefined",
                "category": suggestion["recommended_category"],
                "reason": suggestion["reason"],
                "folder_path": suggestion["folder_path"]
            }

        return FinalizeResponse(brand_profile=brand_profile, logo_info=logo_info)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Run server ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
