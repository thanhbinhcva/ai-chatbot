# database_gen_ser.py
from pymongo import MongoClient
from bson import ObjectId
import os
# --- Kết nối MongoDB ---

mongo_uri = os.getenv("MONGO_URI")
mongo_db_name = os.getenv("MONGO_DB", "brand_assistant")

client = MongoClient(mongo_uri)
db = client[mongo_db_name]
collection = db["brand_profiles"]

def get_latest_brand_profile():
    """Lấy brand profile mới nhất từ MongoDB"""
    doc = collection.find_one(sort=[("_id", -1)])
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

def get_brand_profile_by_id(session_id ):
    """Lấy profile theo ID cụ thể"""
    try:
        doc = collection.find_one({"session_id": ObjectId(session_id )})
        
        if doc:
            doc["session_id"] = str(doc["session_id"])
        return doc
    except Exception:
        return None
