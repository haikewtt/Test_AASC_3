#!/usr/bin/env bash
# Script kiểm tra API bằng curl - Bài 1 Task Management
BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "========================================"
echo "  Bài 1 - Task API Curl Test"
echo "  Base URL: $BASE_URL"
echo "========================================"

echo ""
echo "[1] POST /tasks - Tạo task mới"
CREATE_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"First Task","description":"Test task description","status":"To Do"}')
echo "$CREATE_RESP"
TASK_ID=$(echo "$CREATE_RESP" | grep -v HTTP_STATUS | python -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

echo ""
echo "[2] POST /tasks - Validation (title rỗng -> 400)"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":""}'

echo ""
echo "[3] GET /tasks - Lấy danh sách"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/tasks"

if [ -n "$TASK_ID" ]; then
  echo ""
  echo "[4] GET /tasks/:id - Lấy task theo ID ($TASK_ID)"
  curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/tasks/$TASK_ID"

  echo ""
  echo "[5] PATCH /tasks/:id - Cập nhật task"
  curl -s -w "\nHTTP Status: %{http_code}\n" -X PATCH "$BASE_URL/tasks/$TASK_ID" \
    -H "Content-Type: application/json" \
    -d '{"status":"In Progress","description":"In progress now"}'

  echo ""
  echo "[6] DELETE /tasks/:id - Xóa task"
  curl -s -w "\nHTTP Status: %{http_code}\n" -X DELETE "$BASE_URL/tasks/$TASK_ID"

  echo ""
  echo "[7] GET /tasks/:id - Task đã xóa (404)"
  curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/tasks/$TASK_ID"
fi

echo ""
echo "[8] Seed 100 tasks & đo thời gian GET /tasks"
for i in $(seq 1 100); do
  curl -s -X POST "$BASE_URL/tasks" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Perf task $i\",\"description\":\"Load test\"}" > /dev/null
done
curl -s -w "\nHTTP Status: %{http_code} | Time: %{time_total}s\n" -o /dev/null "$BASE_URL/tasks"

echo ""
echo "[9] GET /docs - Swagger UI"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" "$BASE_URL/docs"

echo ""
echo "========================================"
echo "  Hoàn tất kiểm tra curl"
echo "========================================"
