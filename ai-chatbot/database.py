from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

# --- Kết nối MongoDB ---
mongo_uri = os.getenv("MONGO_URI")
mongo_db_name = os.getenv("MONGO_DB", "brand_assistant")

client = MongoClient(mongo_uri)
db = client[mongo_db_name]
collection = db["brand_profiles"]

def save_to_mongo(data: dict):
    """Lưu brand_profile vào MongoDB"""
    try:
        result = collection.insert_one(data)
        return str(result.inserted_id)  # ✅ convert ObjectId -> string
    except Exception as e:
        print(f"❌ Lỗi khi lưu MongoDB: {e}")
        return None
def get_brand_profile_by_session(session_id: str):
    """
    🔍 Lấy thông tin brand_profile từ MongoDB theo session_id.
    """
    try:
        result = collection.find_one({"session_id": session_id})
        if not result:
            print(f"⚠️ Không tìm thấy hồ sơ với session_id: {session_id}")
            return None

        # Convert ObjectId sang string
        result["_id"] = str(result["_id"])
        return result

    except Exception as e:
        print(f"❌ Lỗi khi lấy brand_profile theo session_id: {e}")
        return None