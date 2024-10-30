// heuristics/customHeuristic.ts
import { EightGameBoard } from "../context/GameContext";
import { calculateDistance } from "./utils";

export const customHeuristic = (board: EightGameBoard): EightGameBoard => {
  // Implementação da heurística personalizada
  // Adapte conforme sua necessidade
  // Exemplo: considerar uma métrica que priorize a organização na primeira linha
  calculateDistance(board); // Utilize a função auxiliar para calcular a distância de Manhattan
  return board; // Retorne o novo estado do tabuleiro após aplicar a heurística
};
