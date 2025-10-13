import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# Load API key từ .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Khởi tạo Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",   # hoặc "gemini-1.5-pro-latest"
    temperature=0.7,
    google_api_key=api_key
)

# Gọi thử 1 câu
response = llm.invoke("Xin chào, bạn có hoạt động không?")
print("🤖 Gemini trả lời:", response.content)
