# Bài 1: NestJS Task Management API

## Giải thích NestJS

### Modules, Controllers, Services

| Thành phần | Vai trò |
|------------|---------|
| **Modules** | Đơn vị tổ chức ứng dụng. Mỗi module gom nhóm Controller, Service và các dependency liên quan (ví dụ: `TasksModule`). |
| **Controllers** | Xử lý HTTP request/response, định tuyến endpoint, gọi Service để thực thi logic. |
| **Services** | Chứa business logic, tương tác với database. Được inject vào Controller qua Dependency Injection. |

### TypeScript trong NestJS

NestJS được xây dựng hoàn toàn trên TypeScript, tận dụng:

- **Static typing**: Phát hiện lỗi compile-time, autocomplete tốt hơn.
- **Decorators** (`@Controller`, `@Injectable`, `@Get`): Khai báo metadata cho framework.
- **Interfaces & DTOs**: Định nghĩa cấu trúc dữ liệu rõ ràng cho request/response.
- **Enums**: Type-safe cho các giá trị cố định (ví dụ: `TaskStatus`).

## Cấu trúc thư mục (MVC)

```
src/
├── config/
│   └── database.config.ts        # Cấu hình TypeORM + SQLite
├── tasks/
│   ├── entities/
│   │   └── task.entity.ts        # Model (schema Task - TypeORM entity)
│   ├── controllers/
│   │   └── tasks.controller.ts   # Controller (HTTP handlers)
│   ├── services/
│   │   ├── tasks.service.ts      # Service (business logic)
│   │   └── tasks.service.spec.ts # Unit test
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   └── update-task.dto.ts
│   ├── enums/
│   │   └── task-status.enum.ts
│   └── tasks.module.ts           # Module
├── app.module.ts
└── main.ts
```

## Cách chạy ứng dụng

```bash
cd bai1-task-api
npm install
npm run start:dev
```

Server chạy tại: **http://localhost:3000**

## Swagger API Documentation

Truy cập: **http://localhost:3000/docs**

## API Endpoints

| Method | Endpoint | Mô tả | HTTP Status |
|--------|----------|-------|-------------|
| POST | `/tasks` | Tạo task mới | 201 |
| GET | `/tasks` | Lấy danh sách task | 200 |
| GET | `/tasks/:id` | Lấy task theo ID | 200 |
| PATCH | `/tasks/:id` | Cập nhật task | 200 |
| DELETE | `/tasks/:id` | Xóa task | 204 |

## Kiểm tra bằng curl

```bash
# 1. Tạo task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task mới","description":"Mô tả","status":"To Do"}'

# 2. Lấy danh sách
curl http://localhost:3000/tasks

# 3. Lấy theo ID (thay {id} bằng UUID thực tế)
curl http://localhost:3000/tasks/{id}

# 4. Cập nhật
curl -X PATCH http://localhost:3000/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'

# 5. Xóa
curl -X DELETE http://localhost:3000/tasks/{id}

# 6. Validation - title rỗng (trả về 400)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":""}'
```

Hoặc chạy script tự động:

```bash
bash scripts/curl-test.sh
```

## Chạy Unit Test

```bash
npm test
```

## Validation

- `title` bắt buộc, không được rỗng (sử dụng `ValidationPipe` + `class-validator`).
- `status` phải thuộc enum: `To Do`, `In Progress`, `Done`.

## Database

SQLite (`tasks.db`) với TypeORM (`better-sqlite3`), tự động sync schema khi khởi động.
