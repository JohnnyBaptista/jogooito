import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useIsFirstRender } from "../hooks/useIsFirstRender";
import { randomSearch } from "../heuristics/randomSearch";
import { customHeuristic } from "../heuristics/customHeuristic";
import { oneLevelSearch } from "../heuristics/oneLevelSearch";
import { twoLevelSearch } from "../heuristics/twoLevelSearch";

export type Cell = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;
export type EightGameBoard = Cell[][];
export interface EigthGameContextData {
  board: EightGameBoard;
  checkCompleted: () => boolean;
  move: (rowIndex: number, cellIndex: number) => void;
  isShuffled: boolean;
  shuffleBoard: (iterationQnt: number) => Promise<void>;
  applyHeuristic: (
    type: "random" | "one-level" | "two-levels" | "custom"
  ) => void;
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
  const moveHistory = useRef<{ row: number; col: number }[]>([]);
  const moveCounts = useRef<{ [key: string]: number }>({
    random: 0,
    "one-level": 0,
    "two-levels": 0,
    custom: 0,
  });

  const [board, setBoard] = useState(DEFAULT_BOARD_POSITIONS);
  const [isShuffled, setIsShuffled] = useState(false);
  const isFirstRender = useIsFirstRender();

  const checkCompleted = useCallback(() => {
    return (
      board[0][0] === 1 &&
      board[0][1] === 2 &&
      board[0][2] === 3 &&
      board[1][0] === 4 &&
      board[1][1] === 5 &&
      board[1][2] === 6 &&
      board[2][0] === 7 &&
      board[2][1] === 8 &&
      board[2][2] === null
    );
  }, [board]);

  const isLoop = (row: number, col: number) => {
    return moveHistory.current.some(
      (prevMove) => prevMove.row === row && prevMove.col === col
    );
  };

  const applyHeuristic = async (
    type: "random" | "one-level" | "two-levels" | "custom"
  ) => {
    while (!checkCompleted()) {
      let newBoard = board;

      // Aplica a heurística e busca evitar loops
      for (let i = 0; i < 50; i++) {
        switch (type) {
          case "random":
            newBoard = randomSearch(board);
            break;
          case "one-level":
            newBoard = oneLevelSearch(board);
            break;
          case "two-levels":
            newBoard = twoLevelSearch(board);
            break;
          case "custom":
            newBoard = customHeuristic(board);
            break;
        }

        const emptyPosition = newBoard
          .flatMap((row, i) =>
            row.map((cell, j) => (cell === null ? { row: i, col: j } : null))
          )
          .find((pos) => pos !== null);

        if (emptyPosition && !isLoop(emptyPosition.row, emptyPosition.col)) {
          moveHistory.current.push(emptyPosition); // Adiciona posição atual ao histórico
          if (moveHistory.current.length > 8) moveHistory.current.shift(); // Mantém histórico de 8 movimentos

          moveCounts.current[type]++; // Incrementa contador de movimentos
          setBoard(newBoard);
          await new Promise((resolve) => setTimeout(resolve, 200)); // Intervalo para visualização dos movimentos
          break;
        }
      }
    }
    getReport(); // Exibe o relatório ao final
  };

  const move = (rowIndex: number, cellIndex: number) => {
    console.log("Movendo celula:", { rowIndex, cellIndex });
    setBoard((prev) => {
      const emptyPosition = prev
        .flatMap((row, i) =>
          row.map((cell, j) => (cell === null ? { row: i, col: j } : null))
        )
        .find((pos) => pos !== null);

      if (!emptyPosition) return prev;

      const { row: emptyRow, col: emptyCol } = emptyPosition;

      if (
        (rowIndex === emptyRow &&
          (cellIndex === emptyCol + 1 || cellIndex === emptyCol - 1)) ||
        (cellIndex === emptyCol &&
          (rowIndex === emptyRow + 1 || rowIndex === emptyRow - 1))
      ) {
        const newBoard = prev.map((row) => [...row]);
        newBoard[emptyRow][emptyCol] = newBoard[rowIndex][cellIndex];
        newBoard[rowIndex][cellIndex] = null;

        moveHistory.current.push({ row: rowIndex, col: cellIndex });
        if (moveHistory.current.length > 8) moveHistory.current.shift();

        return newBoard;
      }

      return prev;
    });
  };

  const getReport = useCallback(() => {
    console.log("Movimentos necessários para resolver o tabuleiro:");
    console.log(`Heurística aleatória: ${moveCounts.current["random"]}`);
    console.log(`Heurística de um nível: ${moveCounts.current["one-level"]}`);
    console.log(
      `Heurística de dois níveis: ${moveCounts.current["two-levels"]}`
    );
    console.log(`Heurística personalizada: ${moveCounts.current["custom"]}`);
  }, []);

  const getAdjecentCells = (i: number, j: number) => {
    const arr = [];
    if (i - 1 >= 0) arr.push({ row: i - 1, col: j }); // Up
    if (j - 1 >= 0) arr.push({ row: i, col: j - 1 }); // Left
    if (j + 1 <= 2) arr.push({ row: i, col: j + 1 }); // Right
    if (i + 1 <= 2) arr.push({ row: i + 1, col: j }); // Down
    return arr;
  };

  const shuffleBoard = useCallback(
    async (qtd: number) => {
      setIsShuffled(true);
      console.log("Embaralhando tabuleiro...");
      // Gera a sequência de movimentos
      function start() {
        const tempBoard = board.map((row) => [...row]);
        let empty = { row: 2, col: 2 };
        let prevEmpty = null;
        const currentMoveHistory = [];

        for (let iteracoes = 0; iteracoes < qtd; iteracoes++) {
          // Localiza a posição vazia
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (tempBoard[i][j] === null) {
                empty = { row: i, col: j };
              }
            }
          }

          // Obtém as células adjacentes
          const adj = getAdjecentCells(empty.row, empty.col);

          // Seleciona uma célula adjacente que não seja a posição anterior (evita loop)
          let random;
          do {
            random = Math.floor(Math.random() * adj.length);
          } while (
            prevEmpty &&
            adj[random].row === prevEmpty.row &&
            adj[random].col === prevEmpty.col
          );

          // Define a nova posição anterior
          prevEmpty = { ...empty };

          // Realiza a troca
          const swapRow = adj[random].row;
          const swapCol = adj[random].col;
          [tempBoard[empty.row][empty.col], tempBoard[swapRow][swapCol]] = [
            tempBoard[swapRow][swapCol],
            tempBoard[empty.row][empty.col],
          ];

          // Adiciona o movimento à lista
          currentMoveHistory.push({ row: swapRow, col: swapCol });
        }

        return currentMoveHistory;
      }

      // Função recursiva para aplicar movimentos com espera
      const moves = start();
      console.log("Movimentos gerados:", moves);
      const applyMoveWithDelay = async (index = 0) => {
        if (index >= moves.length) {
          setIsShuffled(false);
          moveHistory.current = [];
          return;
        }

        const { row, col } = moves[index];
        move(row, col); // Executa o movimento
        await new Promise((resolve) => setTimeout(resolve, 500)); // Espera 500ms

        applyMoveWithDelay(index + 1); // Próximo movimento
      };

      applyMoveWithDelay();
    },
    [board, setBoard, move]
  );

  useEffect(() => {
    if (isFirstRender) return;
    if (checkCompleted()) {
      setTimeout(() => alert("You win"), 500);
    }
  }, [board, checkCompleted]);

  return (
    <GameContext.Provider
      value={{
        board,
        checkCompleted,
        move, // Implementar se necessário
        isShuffled,
        shuffleBoard,
        applyHeuristic,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
