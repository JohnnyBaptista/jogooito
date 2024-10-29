import { createContext, useState, ReactNode, useCallback } from "react";

export type EightGameBoard = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null)[][];

export interface EigthGameContextData {
  board: EightGameBoard;
  isCompleted: () => boolean;
  move: (rowIndex: number, cellIndex: number) => void;
  moveWithDelay: (rowIndex: number, cellIndex: number) => void;
}

export const GameContext = createContext<EigthGameContextData | undefined>(
  undefined
);

const DEFAULT_BOARD_POSITIONS: EightGameBoard = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, null],
];

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState(DEFAULT_BOARD_POSITIONS);

  const isCompleted = useCallback(() => {
    return board.every((row, rowIndex) =>
      row.every(
        (cell, cellIndex) =>
          cell === DEFAULT_BOARD_POSITIONS[rowIndex][cellIndex]
      )
    );
  }, [board]);

  console.log({ board });

  const move = useCallback(
    (rowIndex: number, cellIndex: number) => {
      const newBoard = board.map((row) => [...row]);
      const emptyCell = { row: 0, cell: 0 };

      board.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
          if (cell === null) {
            emptyCell.row = rIndex;
            emptyCell.cell = cIndex;
          }
        });
      });

      if (
        (rowIndex === emptyCell.row &&
          (cellIndex === emptyCell.cell + 1 ||
            cellIndex === emptyCell.cell - 1)) ||
        (cellIndex === emptyCell.cell &&
          (rowIndex === emptyCell.row + 1 || rowIndex === emptyCell.row - 1))
      ) {
        newBoard[emptyCell.row][emptyCell.cell] = board[rowIndex][cellIndex];
        newBoard[rowIndex][cellIndex] = null;
        setBoard(newBoard);
      }
    },
    [board, setBoard]
  );

  const moveWithDelay = useCallback(
    (rowIndex: number, cellIndex: number) => {
      setTimeout(() => {
        move(rowIndex, cellIndex);
      }, 500);
    },
    [move]
  );
  return (
    <GameContext.Provider value={{ board, isCompleted, move, moveWithDelay }}>
      {children}
    </GameContext.Provider>
  );
};
