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
export type Heuristics = "random" | "one-level" | "two-levels" | "custom";

export interface EigthGameContextData {
  board: EightGameBoard;
  checkCompleted: () => boolean;
  move: (rowIndex: number, cellIndex: number) => void;
  isShuffled: boolean;
  globalIterationsCount: number;
  shuffleCount: number;
  chosenHeuristic: Heuristics | null;
  setChosenHeuristic: React.Dispatch<React.SetStateAction<Heuristics | null>>;
  setShuffleCount: React.Dispatch<React.SetStateAction<number>>;
  setGlobalIterationsCount: React.Dispatch<React.SetStateAction<number>>;
  shuffleBoard: (
    qtd: number,
    hasDelay?: boolean,
    currentBoard?: EightGameBoard
  ) => Promise<
    | Cell[][]
    | {
        row: number;
        col: number;
      }[]
    | undefined
  >;
  applyHeuristic: (
    type: "random" | "one-level" | "two-levels" | "custom"
  ) => void;
  currentMoveCount: number;
  isResolving: boolean;
}
