# Bài 2: Tính Số Fibonacci Thứ 50

## Thuật toán

Sử dụng **Dynamic Programming bottom-up** với mảng `dp[]`:

```
F(0) = 0, F(1) = 1
F(i) = F(i-1) + F(i-2)  với i từ 2 đến n
```

- Dùng **BigInt** để xử lý số lớn (F(50) vượt giới hạn `Number.MAX_SAFE_INTEGER`).
- Có thêm phiên bản **O(1) space** chỉ giữ 2 giá trị trước đó.

## Độ phức tạp

| Phương pháp | Thời gian | Không gian |
|-------------|-----------|------------|
| DP mảng (`fibonacci`) | **O(n)** | **O(n)** |
| DP tối ưu (`fibonacciOptimized`) | **O(n)** | **O(1)** |

So với đệ quy thuần O(2^n) hoặc memoization O(n) time + O(n) space (call stack), DP bottom-up hiệu quả và ổn định hơn.

## Cách chạy

```bash
cd bai2-fibonacci
npm install
node fibonacci.js    # Chạy demo + benchmark
npm test             # Chạy unit test
```

## Kết quả kiểm tra

| n | F(n) | Kết quả |
|---|------|---------|
| 10 | 55 | PASS |
| 20 | 6,765 | PASS |
| 50 | 12,586,269,025 | PASS |

## Thời gian thực thi (trung bình 10 lần chạy)

| n | Thời gian trung bình |
|---|---------------------|
| 10 | ~0.002 ms |
| 20 | ~0.003 ms |
| 50 | ~0.005 ms |

`console.time('fibonacci(50)')` → **~0.03 ms** (dưới ngưỡng 1 ms).

## Kết quả Unit Test

```
PASS fibonacci.test.js
  ✓ fibonacci(0) = 0n
  ✓ fibonacci(1) = 1n
  ...
  ✓ fibonacci(50) = 12586269025n
  ✓ F(50) chạy dưới 1ms trung bình
```

## Cấu trúc file

```
bai2-fibonacci/
├── fibonacci.js       # Thuật toán + benchmark
├── fibonacci.test.js  # Unit test (Jest)
├── package.json
└── README.md
```
