#!/usr/bin/env bash
BASE_URL="${BASE_URL:-http://localhost:3002}"

echo "========================================"
echo "  Bài 3 - Game Server Curl Test"
echo "  Base URL: $BASE_URL"
echo "========================================"

echo ""
echo "[1] POST /auth/register"
REG=$(curl -s -w "\nHTTP:%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"curl_player","password":"123456"}')
echo "$REG"
TOKEN=$(echo "$REG" | grep -v HTTP | python -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "[2] POST /auth/login (fallback)"
  REG=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"curl_player","password":"123456"}')
  TOKEN=$(echo "$REG" | python -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")
fi

AUTH="Authorization: Bearer $TOKEN"

echo ""
echo "[3] PATCH /users/profile"
curl -s -w "\nHTTP: %{http_code}\n" -X PATCH "$BASE_URL/users/profile" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"nickname":"Curl Gamer","email":"curl@test.com"}'

echo ""
echo "[4] POST /line98 - Tạo game"
GAME=$(curl -s -X POST "$BASE_URL/line98" -H "$AUTH")
echo "$GAME"
GAME_ID=$(echo "$GAME" | python -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$GAME_ID" ]; then
  echo ""
  echo "[5] GET /line98/:id/hint"
  curl -s -w "\nHTTP: %{http_code}\n" "$BASE_URL/line98/$GAME_ID/hint" -H "$AUTH"
fi

echo ""
echo "[6] POST /caro/matchmaking"
curl -s -w "\nHTTP: %{http_code}\n" -X POST "$BASE_URL/caro/matchmaking" -H "$AUTH"

echo ""
echo "[7] Static pages"
curl -s -o /dev/null -w "Home: %{http_code}\n" "$BASE_URL/"
curl -s -o /dev/null -w "Line98: %{http_code}\n" "$BASE_URL/line98.html"
curl -s -o /dev/null -w "Caro: %{http_code}\n" "$BASE_URL/caro.html"

echo ""
echo "========================================"
echo "  Hoàn tất"
echo "========================================"
