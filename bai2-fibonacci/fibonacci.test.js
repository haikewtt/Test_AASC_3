const { fibonacci, fibonacciOptimized, benchmark } = require('./fibonacci');

describe('Fibonacci', () => {
  const cases = [
    [0, 0n],
    [1, 1n],
    [2, 1n],
    [5, 5n],
    [10, 55n],
    [20, 6765n],
    [50, 12586269025n],
  ];

  test.each(cases)('fibonacci(%i) = %s', (n, expected) => {
    expect(fibonacci(n)).toBe(expected);
    expect(fibonacciOptimized(n)).toBe(expected);
  });

  it('F(50) chạy dưới 1ms trung bình', () => {
    const avgMs = benchmark(fibonacci, 50, 10);
    expect(avgMs).toBeLessThan(1);
  });
});
