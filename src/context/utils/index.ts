/* eslint-disable @typescript-eslint/no-unused-vars */

import { EightGameBoard } from "../types";

// função para calcular a distância "gananciosa" de um tabuleiro do jogo dos oito
export const calculateGreedyDistance = (board: EightGameBoard): number => {
  let distance = 0;
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== null) {
        // calcula a posição objetivo da célula no tabuleiro (posição X e Y)
        const targetX = Math.floor((cell - 1) / 3); // posição objetivo em X
        const targetY = (cell - 1) % 3; // posição objetivo em Y
        // soma a distância da célula até sua posição objetivo
        distance += Math.abs(i - targetX) + Math.abs(j - targetY);
      }
    });
  });
  return distance;
};

// função para calcular a distância total ao quadrado das posições das células
export const calculateDistance = (board: EightGameBoard): number => {
  let distance = 0;
  let position = 1;

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== null) {
        // converte a célula para número para cálculo
        const cellValue = Number(cell);
        // soma o quadrado da diferença entre a posição atual e o valor da célula
        distance += Math.pow(position - cellValue, 2);
      } else {
        // considera a posição 9 para a célula vazia
        distance += Math.pow(position - 9, 2);
      }
      position++;
    });
  });

  return distance;
};

export const calculateDistanceBetweenCells = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  // retorna a soma das diferenças absolutas das coordenadas X e Y
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

// função para calcular a distância total do tabuleiro para o estado objetivo
export const calculateTotalDistance = (board: EightGameBoard): number => {
  let distance = 0;

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== null) {
        // Calcula a posição alvo da célula no tabuleiro objetivo
        const targetX = Math.floor((cell - 1) / board.length);
        const targetY = (cell - 1) % board.length;
        // Soma a distância  da célula até sua posição objetivo
        distance += calculateDistanceBetweenCells(i, j, targetX, targetY);
      }
    });
  });

  return distance;
};
