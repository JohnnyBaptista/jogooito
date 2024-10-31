export type Cell = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;
export type EightGameBoard = Cell[][];
export type Position = { row: number; col: number };
export interface BoardState {
  board: EightGameBoard;
  path: EightGameBoard[];
  gCost: number;
  hCost: number;
  fCost: number;
}
