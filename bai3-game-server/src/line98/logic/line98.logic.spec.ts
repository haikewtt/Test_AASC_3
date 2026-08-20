import {
  applyMove,
  clearLines,
  createEmptyGrid,
  createInitialGrid,
  findValidMoves,
  GRID_SIZE,
  hasPath,
  MIN_LINE,
} from './line98.logic';

describe('Line98 Logic', () => {
  it('tạo grid ban đầu 9x9 với 5 bóng', () => {
    const grid = createInitialGrid();
    expect(grid.length).toBe(GRID_SIZE);
    expect(grid[0].length).toBe(GRID_SIZE);
    const balls = grid.flat().filter((c) => c > 0).length;
    expect(balls).toBe(5);
  });

  it('hasPath trả về true khi có đường đi trống', () => {
    const grid = createEmptyGrid();
    grid[0][0] = 1;
    expect(hasPath(grid, 0, 0, 0, 2)).toBe(true);
  });

  it('hasPath trả về false khi ô đích không trống', () => {
    const grid = createEmptyGrid();
    grid[0][0] = 1;
    grid[0][2] = 2;
    expect(hasPath(grid, 0, 0, 0, 2)).toBe(false);
  });

  it('hasPath trả về false khi ô nguồn trống', () => {
    const grid = createEmptyGrid();
    expect(hasPath(grid, 0, 0, 0, 2)).toBe(false);
  });

  it('clearLines xóa hàng 5 bóng cùng màu', () => {
    const grid = createEmptyGrid();
    for (let c = 0; c < MIN_LINE; c++) grid[0][c] = 3;
    const { cleared, grid: next } = clearLines(grid);
    expect(cleared).toBe(MIN_LINE);
    expect(next[0].every((v) => v === 0)).toBe(true);
  });

  it('applyMove trả về null với nước đi không hợp lệ', () => {
    const grid = createEmptyGrid();
    grid[0][0] = 1;
    grid[0][2] = 2;
    expect(applyMove(grid, 0, 0, 0, 2)).toBeNull();
  });

  it('findValidMoves tìm được nước đi hợp lệ', () => {
    const grid = createEmptyGrid();
    grid[4][4] = 1;
    const moves = findValidMoves(grid);
    expect(moves.length).toBeGreaterThan(0);
  });
});
