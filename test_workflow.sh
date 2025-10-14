#!/bin/bash

# Test workflow hoàn chỉnh cho Asset Service với Session Tracking
# Cách sử dụng: chmod +x test_workflow.sh && ./test_workflow.sh

BASE_URL="http://localhost:3000"

echo "🚀 Bắt đầu test workflow Asset Service"
echo "========================================"
echo ""

# 1. Khởi tạo Session
echo "1️⃣  Khởi tạo session mới..."
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/logo/session/init")
SESSION_ID=$(echo $SESSION_RESPONSE | grep -o '"session_id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Session ID: $SESSION_ID"
echo "$SESSION_RESPONSE" | jq '.' 2>/dev/null || echo "$SESSION_RESPONSE"
echo ""
sleep 1

# 2. Lấy danh sách Emblems
echo "2️⃣  Lấy danh sách emblems..."
curl -s "$BASE_URL/api/v1/logo/emblem/search?sessionId=$SESSION_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/logo/emblem/search?sessionId=$SESSION_ID"
echo ""
sleep 1

# 3. Chọn Emblem E001
echo "3️⃣  Chọn emblem E001..."
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"emblemId\":\"E001\"}" | jq '.' 2>/dev/null || \
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"emblemId\":\"E001\"}"
echo ""
sleep 1

# 4. Lấy Variants của Emblem E001
echo "4️⃣  Lấy variants của emblem E001..."
curl -s "$BASE_URL/api/v1/logo/emblem/variant/search?emblemId=E001&sessionId=$SESSION_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/logo/emblem/variant/search?emblemId=E001&sessionId=$SESSION_ID"
echo ""
sleep 1

# 5. Chọn Variant V001
echo "5️⃣  Chọn variant V001 (blue)..."
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"variantId\":\"V001\"}" | jq '.' 2>/dev/null || \
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"variantId\":\"V001\"}"
echo ""
sleep 1

# 6. Lấy danh mục Layout
echo "6️⃣  Lấy danh mục layouts..."
curl -s "$BASE_URL/api/v1/logo/layout/category?sessionId=$SESSION_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/logo/layout/category?sessionId=$SESSION_ID"
echo ""
sleep 1

# 7. Chọn Category C101 (Avatar)
echo "7️⃣  Chọn category C101 (Avatar)..."
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"layoutCategoryId\":\"C101\"}" | jq '.' 2>/dev/null || \
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"layoutCategoryId\":\"C101\"}"
echo ""
sleep 1

# 8. Lấy Layouts trong Category Avatar
echo "8️⃣  Lấy layouts trong category Avatar..."
curl -s "$BASE_URL/api/v1/logo/layout/search?categoryID=C101&sessionId=$SESSION_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/logo/layout/search?categoryID=C101&sessionId=$SESSION_ID"
echo ""
sleep 1

# 9. Chọn Layout L201
echo "9️⃣  Chọn layout L201..."
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"layoutId\":\"L201\"}" | jq '.' 2>/dev/null || \
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"layoutId\":\"L201\"}"
echo ""
sleep 1

# 10. Lấy danh sách Background
echo "🔟 Lấy danh sách backgrounds..."
curl -s "$BASE_URL/api/v1/logo/background/search?sessionId=$SESSION_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/logo/background/search?sessionId=$SESSION_ID"
echo ""
sleep 1

# 11. Chọn Background B301
echo "1️⃣1️⃣  Chọn background B301..."
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"backgroundId\":\"B301\"}" | jq '.' 2>/dev/null || \
curl -s -X PUT "$BASE_URL/api/v1/logo/session/update" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"backgroundId\":\"B301\"}"
echo ""
sleep 1

# 12. Kiểm tra Status cuối cùng
echo "1️⃣2️⃣  Kiểm tra status cuối cùng..."
curl -s "$BASE_URL/api/v1/logo/session/status?sessionId=$SESSION_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/logo/session/status?sessionId=$SESSION_ID"
echo ""

echo ""
echo "========================================"
echo "✅ Hoàn thành test workflow!"
echo "📊 Session ID: $SESSION_ID"
echo "🎯 Status: completed"
