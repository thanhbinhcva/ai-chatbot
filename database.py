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
