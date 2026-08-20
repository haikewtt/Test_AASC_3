import {
  applyCaroMove,
  BOARD_SIZE,
  checkWinner,
  createBoard,
  isValidMove,
  WIN_COUNT,
} from './caro.logic';

describe('Caro Logic', () => {
  it('tạo bàn cờ 15x15', () => {
    const board = createBoard();
    expect(board.length).toBe(BOARD_SIZE);
    expect(board[0].length).toBe(BOARD_SIZE);
  });

  it('isValidMove cho ô trống', () => {
    const board = createBoard();
    expect(isValidMove(board, 7, 7)).toBe(true);
  });

  it('isValidMove từ chối ô đã đánh', () => {
    const board = createBoard();
    board[7][7] = 'X';
    expect(isValidMove(board, 7, 7)).toBe(false);
  });

  it('checkWinner phát hiện 5 quân ngang', () => {
    const board = createBoard();
    for (let c = 0; c < WIN_COUNT; c++) board[7][c] = 'X';
    expect(checkWinner(board, 7, WIN_COUNT - 1, 'X')).toBe('X');
  });

  it('checkWinner phát hiện 5 quân dọc', () => {
    const board = createBoard();
    for (let r = 0; r < WIN_COUNT; r++) board[r][3] = 'O';
    expect(checkWinner(board, WIN_COUNT - 1, 3, 'O')).toBe('O');
  });

  it('applyCaroMove đổi lượt khi chưa thắng', () => {
    const board = createBoard();
    const result = applyCaroMove(board, 5, 5, 'X');
    expect(result?.board[5][5]).toBe('X');
    expect(result?.winner).toBeNull();
  });

  it('applyCaroMove phát hiện người thắng', () => {
    const board = createBoard();
    for (let c = 0; c < WIN_COUNT - 1; c++) board[0][c] = 'X';
    const result = applyCaroMove(board, 0, WIN_COUNT - 1, 'X');
    expect(result?.winner).toBe('X');
  });
});
