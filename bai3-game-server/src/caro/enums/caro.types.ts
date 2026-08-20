export enum CaroStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  FINISHED = 'finished',
}

export type CaroPlayer = 'X' | 'O';
export type CaroCell = '' | 'X' | 'O';
export type CaroBoard = CaroCell[][];

export interface CaroMoveRecord {
  row: number;
  col: number;
  player: CaroPlayer;
  timestamp: string;
}
