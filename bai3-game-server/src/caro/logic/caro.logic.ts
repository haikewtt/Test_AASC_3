import type { CaroBoard, CaroPlayer } from '../enums/caro.types';

export const BOARD_SIZE = 15;
export const WIN_COUNT = 5;

export type Player = CaroPlayer;
export type Cell = '' | 'X' | 'O';
export type Board = CaroBoard;

export function createBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array<Cell>(BOARD_SIZE).fill(''),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isValidMove(board: Board, row: number, col: number): boolean {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    return false;
  }
  return board[row][col] === '';
}

export function placeMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): Board {
  const next = cloneBoard(board);
  next[row][col] = player;
  return next;
}

export function checkWinner(
  board: Board,
  row: number,
  col: number,
  player: Player,
): Player | null {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of dirs) {
    let count = 1;

    let r = row + dr;
    let c = col + dc;
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      board[r][c] === player
    ) {
      count++;
      r += dr;
      c += dc;
    }

    r = row - dr;
    c = col - dc;
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      board[r][c] === player
    ) {
      count++;
      r -= dr;
      c -= dc;
    }

    if (count >= WIN_COUNT) return player;
  }

  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== ''));
}

export function applyCaroMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): { board: Board; winner: Player | null; draw: boolean } | null {
  if (!isValidMove(board, row, col)) return null;

  const next = placeMove(board, row, col, player);
  const winner = checkWinner(next, row, col, player);
  const draw = !winner && isBoardFull(next);

  return { board: next, winner, draw };
}
