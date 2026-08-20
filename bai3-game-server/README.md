# Bài 3: Game Server với NestJS

Server game hỗ trợ quản lý tài khoản, **Line 98** và **Cờ Caro X O** với WebSocket thời gian thực.

## Cấu trúc thư mục (MVC)

```
src/
├── config/
│   ├── database.config.ts      # TypeORM + SQLite
│   └── jwt.config.ts           # JWT configuration
├── auth/                       # Xác thực
│   ├── controllers/            # HTTP: register, login
│   ├── services/               # Business logic + bcrypt
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── users/                      # Quản lý tài khoản
│   ├── entities/user.entity.ts # Model
│   ├── controllers/            # PATCH profile
│   ├── services/
│   └── dto/
├── line98/                     # Game Line 98
│   ├── entities/               # Model (schema)
│   ├── controllers/            # HTTP handlers
│   ├── services/               # Business logic
│   ├── gateways/               # WebSocket
│   ├── logic/                  # Thuật toán + unit test
│   ├── dto/
│   └── enums/
├── caro/                       # Game Cờ Caro
│   ├── entities/
│   ├── controllers/
│   ├── services/
│   ├── gateways/
│   ├── logic/
│   ├── dto/
│   └── enums/
├── app.module.ts
└── main.ts
public/                         # Client HTML5 Canvas
├── index.html
├── line98.html
├── caro.html
└── js/
```

## Cách chạy

```bash
cd bai3-game-server
npm install
npm run start:dev
```

Mở trình duyệt: **http://localhost:3002**

## Tính năng

### Quản lý tài khoản
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/register` | Đăng ký (bcrypt) |
| POST | `/auth/login` | Đăng nhập → JWT |
| PATCH | `/users/profile` | Cập nhật email, nickname (JWT) |

### Line 98
- Lưới 9×9, 5 màu bóng, xóa hàng 5+, sinh 3 bóng/lượt
- WebSocket namespace `/line98`
- Nút trợ giúp gợi ý nước đi
- Lưu trạng thái SQLite

### Cờ Caro X O
- Bàn 15×15, thắng khi 5 quân liên tiếp
- Ghép cặp ngẫu nhiên qua WebSocket `/caro`
- Lưu lịch sử trận đấu

## Unit Test

```bash
npm test
```

- `line98/logic/line98.logic.spec.ts` — 7 tests
- `caro/logic/caro.logic.spec.ts` — 7 tests

## Kiểm tra bằng curl

```bash
bash scripts/curl-test.sh
```

Hoặc thủ công:

```bash
# Đăng ký
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","password":"123456"}'

# Cập nhật profile
curl -X PATCH http://localhost:3002/users/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Pro Gamer"}'
```

## Client

| Trang | URL |
|-------|-----|
| Login | http://localhost:3002/ |
| Line 98 | http://localhost:3002/line98.html |
| Cờ Caro | http://localhost:3002/caro.html |
