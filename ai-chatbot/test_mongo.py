from pymongo import MongoClient
from dotenv import load_dotenv
import os

# 1️⃣ Load biến môi trường từ .env
load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
mongo_db_name = os.getenv("MONGO_DB", "brand_assistant")

# 2️⃣ Kết nối MongoDB
try:
    client = MongoClient(mongo_uri)
    db = client[mongo_db_name]
    print("✅ Kết nối MongoDB thành công!")
    print("📂 Danh sách collection:", db.list_collection_names())
except Exception as e:
    print("❌ Lỗi kết nối MongoDB:", e)
