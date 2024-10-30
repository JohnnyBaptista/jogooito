/* eslint-disable @typescript-eslint/ban-ts-comment */
// heuristics/heuristicTwo.ts
import { EightGameBoard } from "../context/GameContext";
import { calculateDistance } from "./utils";

export const twoLevelSearch = (board: EightGameBoard): EightGameBoard => {
  const emptyPosition = board
    .flatMap((row, i) => row.map((cell, j) => (cell === null ? [i, j] : null)))
    .filter((pos) => pos !== null)[0];

  if (!emptyPosition) return board;

  const [emptyRow, emptyCol] = emptyPosition;
  const adjacentMoves = [
    [emptyRow - 1, emptyCol],
    [emptyRow + 1, emptyCol],
    [emptyRow, emptyCol - 1],
    [emptyRow, emptyCol + 1],
  ];

  let bestMove = null;
  let minDistance = Infinity;

  adjacentMoves.forEach(([row, col]) => {
    if (
      row >= 0 &&
      row < 3 &&
      col >= 0 &&
      col < 3 &&
      board[row][col] !== null
    ) {
      const newBoard = board.map((r) => [...r]);
      newBoard[emptyRow][emptyCol] = newBoard[row][col];
      newBoard[row][col] = null;

      const innerEmptyPosition = [row, col];
      const innerMoves = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];

      innerMoves.forEach(([innerRow, innerCol]) => {
        if (
          innerRow >= 0 &&
          innerRow < 3 &&
          innerCol >= 0 &&
          innerCol < 3 &&
          newBoard[innerRow][innerCol] !== null
        ) {
          const simulatedBoard = newBoard.map((r) => [...r]);
          simulatedBoard[innerEmptyPosition[0]][innerEmptyPosition[1]] =
            simulatedBoard[innerRow][innerCol];
          simulatedBoard[innerRow][innerCol] = null;

          const distance = calculateDistance(simulatedBoard);
          if (distance < minDistance) {
            minDistance = distance;
            bestMove = { from: [row, col], to: [emptyRow, emptyCol] };
          }
        }
      });
    }
  });

  if (bestMove) {
    //@ts-expect-error
    const [fromRow, fromCol] = bestMove.from;
    //@ts-expect-error
    const [toRow, toCol] = bestMove.to;
    const newBoard = board.map((row) => [...row]);
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = null;
    return newBoard;
  }

  return board;
};
