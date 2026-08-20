/**
 * Tính số Fibonacci thứ n bằng Dynamic Programming (mảng) và BigInt.
 * F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)
 *
 * @param {number} n - Chỉ số Fibonacci (n >= 0)
 * @returns {bigint} Số Fibonacci thứ n
 */
function fibonacci(n) {
  if (n < 0) {
    throw new RangeError('n phải >= 0');
  }
  if (n === 0) return 0n;
  if (n === 1) return 1n;

  const dp = new Array(n + 1);
  dp[0] = 0n;
  dp[1] = 1n;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/**
 * Phiên bản tối ưu không gian O(1): chỉ giữ 2 giá trị trước đó.
 */
function fibonacciOptimized(n) {
  if (n < 0) {
    throw new RangeError('n phải >= 0');
  }
  if (n === 0) return 0n;
  if (n === 1) return 1n;

  let prev = 0n;
  let curr = 1n;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

/**
 * Đo thời gian thực thi trung bình qua nhiều lần chạy.
 */
function benchmark(fn, n, runs = 10) {
  const label = `fib(${n}) x${runs}`;
  const start = performance.now();

  for (let i = 0; i < runs; i++) {
    fn(n);
  }

  const totalMs = performance.now() - start;
  return totalMs / runs;
}

// Giá trị Fibonacci đã biết để kiểm tra tính đúng
const KNOWN = {
  10: 55n,
  20: 6765n,
  50: 12586269025n,
};

console.log('=== Bài 2: Fibonacci với Dynamic Programming + BigInt ===\n');

// Kiểm tra tính đúng đắn
console.log('--- Kiểm tra kết quả ---');
for (const n of [10, 20, 50]) {
  const result = fibonacci(n);
  const expected = KNOWN[n];
  const ok = result === expected ? 'PASS' : 'FAIL';
  console.log(`F(${n}) = ${result} [${ok}]`);
}

console.log('\n--- Thời gian thực thi (DP mảng, trung bình 10 lần) ---');
for (const n of [10, 20, 50]) {
  const avgMs = benchmark(fibonacci, n, 10);
  console.log(`F(${n}): ${avgMs.toFixed(6)} ms/lần`);
}

console.log('\n--- console.time demo cho F(50) ---');
console.time('fibonacci(50)');
const f50 = fibonacci(50);
console.timeEnd('fibonacci(50)');
console.log(`F(50) = ${f50}`);

console.log('\n--- So sánh O(n) space vs O(1) space ---');
const avgArray = benchmark(fibonacci, 50, 10);
const avgOptimized = benchmark(fibonacciOptimized, 50, 10);
console.log(`DP mảng O(n) space:  ${avgArray.toFixed(6)} ms/lần`);
console.log(`DP O(1) space:       ${avgOptimized.toFixed(6)} ms/lần`);

module.exports = { fibonacci, fibonacciOptimized, benchmark };
