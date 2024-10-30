// heuristics/utils.ts
import { EightGameBoard } from "../../context/GameContext";

export const calculateDistance = (board: EightGameBoard): number => {
  let distance = 0;

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== null) {
        const expectedRow = Math.floor((cell - 1) / 3);
        const expectedCol = (cell - 1) % 3;
        distance += Math.abs(expectedRow - i) + Math.abs(expectedCol - j);
      }
    });
  });

  return distance;
};
