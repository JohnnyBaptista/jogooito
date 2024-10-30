// heuristics/randomSearch.ts
import { EightGameBoard } from "../context/GameContext";

export const randomSearch = (board: EightGameBoard): EightGameBoard => {
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

  const validMoves = adjacentMoves.filter(
    ([row, col]) => row >= 0 && row < 3 && col >= 0 && col < 3
  );

  const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  const [moveRow, moveCol] = randomMove;

  const newBoard = board.map((row) => [...row]);
  newBoard[emptyRow][emptyCol] = newBoard[moveRow][moveCol];
  newBoard[moveRow][moveCol] = null;

  return newBoard;
};
