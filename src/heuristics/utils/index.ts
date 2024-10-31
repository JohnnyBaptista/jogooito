/* eslint-disable @typescript-eslint/no-unused-vars */
// heuristics/utils.ts
import { EightGameBoard } from "../../context/GameContext";

export const calculateDistance = (board: EightGameBoard): number => {
  let distance = 0;
  let position = 1;

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== null) {
        // Converte a célula para número para cálculo
        const cellValue = Number(cell);
        distance += Math.pow(position - cellValue, 2);
      } else {
        // Considera a posição 9 para a célula vazia
        distance += Math.pow(position - 9, 2);
      }
      position++;
    });
  });

  return distance;
};

// Calcula a distância de Manhattan para uma célula específica
const calculateManhattanDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

// Função para calcular a distância total do tabuleiro para o estado objetivo
export const calculateTotalManhattanDistance = (
  board: EightGameBoard
): number => {
  let distance = 0;

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== null) {
        // Calcula a posição alvo da célula no tabuleiro objetivo
        const targetX = Math.floor((cell - 1) / board.length);
        const targetY = (cell - 1) % board.length;
        distance += calculateManhattanDistance(i, j, targetX, targetY);
      }
    });
  });

  return distance;
};
