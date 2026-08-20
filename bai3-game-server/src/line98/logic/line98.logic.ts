export const GRID_SIZE = 9;
export const COLORS = 5;
export const NEW_BALLS = 3;
export const MIN_LINE = 5;

export type Grid = number[][];

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array<number>(GRID_SIZE).fill(0),
  );
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function getEmptyCells(grid: Grid): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

export function randomColor(): number {
  return Math.floor(Math.random() * COLORS) + 1;
}

export function addRandomBalls(
  grid: Grid,
  count: number,
): { grid: Grid; added: { row: number; col: number; color: number }[] } {
  const next = cloneGrid(grid);
  const empty = getEmptyCells(next);
  const added: { row: number; col: number; color: number }[] = [];
  const n = Math.min(count, empty.length);

  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * empty.length);
    const [row, col] = empty.splice(idx, 1)[0];
    const color = randomColor();
    next[row][col] = color;
    added.push({ row, col, color });
  }

  return { grid: next, added };
}

export function hasPath(
  grid: Grid,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean {
  if (grid[fromRow][fromCol] === 0 || grid[toRow][toCol] !== 0) return false;
  if (fromRow === toRow && fromCol === toCol) return false;

  const visited = Array.from({ length: GRID_SIZE }, () =>
    Array<boolean>(GRID_SIZE).fill(false),
  );
  const queue: [number, number][] = [[fromRow, fromCol]];
  visited[fromRow][fromCol] = true;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === toRow && c === toCol) return true;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) continue;
      if (visited[nr][nc]) continue;
      const isTarget = nr === toRow && nc === toCol;
      if (grid[nr][nc] === 0 || isTarget) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }

  return false;
}

export function findLineCells(grid: Grid): Set<string> {
  const toClear = new Set<string>();
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const color = grid[r][c];
      if (color === 0) continue;

      for (const [dr, dc] of dirs) {
        const cells: [number, number][] = [[r, c]];
        let nr = r + dr;
        let nc = c + dc;
        while (
          nr >= 0 &&
          nr < GRID_SIZE &&
          nc >= 0 &&
          nc < GRID_SIZE &&
          grid[nr][nc] === color
        ) {
          cells.push([nr, nc]);
          nr += dr;
          nc += dc;
        }
        if (cells.length >= MIN_LINE) {
          cells.forEach(([cr, cc]) => toClear.add(`${cr},${cc}`));
        }
      }
    }
  }

  return toClear;
}

export function clearLines(grid: Grid): { grid: Grid; cleared: number } {
  const cells = findLineCells(grid);
  if (cells.size === 0) return { grid: cloneGrid(grid), cleared: 0 };

  const next = cloneGrid(grid);
  cells.forEach((key) => {
    const [r, c] = key.split(',').map(Number);
    next[r][c] = 0;
  });
  return { grid: next, cleared: cells.size };
}

export function findValidMoves(
  grid: Grid,
): { fromRow: number; fromCol: number; toRow: number; toCol: number }[] {
  const moves: {
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  }[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) continue;
      for (const [er, ec] of getEmptyCells(grid)) {
        if (hasPath(grid, r, c, er, ec)) {
          moves.push({ fromRow: r, fromCol: c, toRow: er, toCol: ec });
        }
      }
    }
  }
  return moves;
}

export function suggestMove(grid: Grid) {
  const moves = findValidMoves(grid);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

export function moveBall(
  grid: Grid,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): Grid | null {
  if (!hasPath(grid, fromRow, fromCol, toRow, toCol)) return null;
  const next = cloneGrid(grid);
  next[toRow][toCol] = next[fromRow][fromCol];
  next[fromRow][fromCol] = 0;
  return next;
}

export function createInitialGrid(): Grid {
  const { grid } = addRandomBalls(createEmptyGrid(), 5);
  return grid;
}

export interface MoveResult {
  grid: Grid;
  cleared: number;
  added: { row: number; col: number; color: number }[];
  gameOver: boolean;
  score: number;
}

export function applyMove(
  grid: Grid,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  currentScore = 0,
): MoveResult | null {
  const afterMove = moveBall(grid, fromRow, fromCol, toRow, toCol);
  if (!afterMove) return null;

  let next = afterMove;
  let totalCleared = 0;
  const firstClear = clearLines(next);
  next = firstClear.grid;
  totalCleared += firstClear.cleared;

  const spawn = addRandomBalls(next, NEW_BALLS);
  next = spawn.grid;

  const secondClear = clearLines(next);
  next = secondClear.grid;
  totalCleared += secondClear.cleared;

  const score = currentScore + totalCleared;
  const hasMoves = findValidMoves(next).length > 0;
  const hasEmpty = getEmptyCells(next).length > 0;
  const gameOver = !hasMoves || !hasEmpty;

  return {
    grid: next,
    cleared: totalCleared,
    added: spawn.added,
    gameOver,
    score,
  };
}
