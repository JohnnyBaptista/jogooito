/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useIsFirstRender } from "../hooks/useIsFirstRender";
import { calculateTotalManhattanDistance } from "./utils"; // Função auxiliar para calcular distância de Manhattan
import { BoardState, Cell, EightGameBoard, Position } from "./types";

export interface EigthGameContextData {
  board: EightGameBoard;
  checkCompleted: () => boolean;
  move: (rowIndex: number, cellIndex: number) => void;
  isShuffled: boolean;
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
  const [currentMoveCount, setCurrentMoveCount] = useState(0);
  const [globalIterationsCount, setGlobalIterationsCount] = useState(0);

  const [board, setBoard] = useState(DEFAULT_BOARD_POSITIONS);
  const [isShuffled, setIsShuffled] = useState(false);
  const isFirstRender = useIsFirstRender();

  const checkCompleted = (toCheckBoard: EightGameBoard = board) => {
    if (
      toCheckBoard[0][0] === 1 &&
      toCheckBoard[0][1] === 2 &&
      toCheckBoard[0][2] === 3 &&
      toCheckBoard[1][0] === 4 &&
      toCheckBoard[1][1] === 5 &&
      toCheckBoard[1][2] === 6 &&
      toCheckBoard[2][0] === 7 &&
      toCheckBoard[2][1] === 8 &&
      toCheckBoard[2][2] === null
    ) {
      setIsShuffled(false);
      return true;
    }
    return false;
  };

  const move = (rowIndex: number, cellIndex: number) => {
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

  const getReport = useCallback(
    (heuristic?: string) => {
      console.log(`Relatório - Heuristica ${heuristic}:`);
      console.log("Total de movimentos:", currentMoveCount);
      console.log("Total de iterações:", globalIterationsCount);
      console.log("Movimentos por heurística:");
    },
    [currentMoveCount, globalIterationsCount]
  );

  const getAdjecentCells = (i: number, j: number) => {
    const arr = [];
    if (i - 1 >= 0) arr.push({ row: i - 1, col: j }); // Up
    if (j - 1 >= 0) arr.push({ row: i, col: j - 1 }); // Left
    if (j + 1 <= 2) arr.push({ row: i, col: j + 1 }); // Right
    if (i + 1 <= 2) arr.push({ row: i + 1, col: j }); // Down
    return arr;
  };

  const isLoop = (n: number, arr: number[]) => {
    const lastN = arr.slice(-n);
    return arr
      .slice(0, -n)
      .some(
        (e, i) => e === lastN[0] && lastN.every((ee, j) => ee === arr[i + j])
      );
  };

  const shuffleBoard = async (
    qtd: number,
    hasDelay: boolean = true,
    currentBoard?: EightGameBoard
  ) => {
    setIsShuffled(true);
    const myBoard = currentBoard || board;
    // Gera a sequência de movimentos
    function start() {
      const tempBoard = myBoard.map((row) => [...row]);
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
        let attempts = 0;
        do {
          random = Math.floor(Math.random() * adj.length);
          attempts++;
        } while (
          (prevEmpty &&
            adj[random].row === prevEmpty.row &&
            adj[random].col === prevEmpty.col) ||
          (isLoop(2, [adj[random].row, adj[random].col]) && attempts < 10)
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

        currentMoveHistory.push({ row: swapRow, col: swapCol });
      }

      return { currentMoveHistory, newBoard: tempBoard };
    }

    // Função recursiva para aplicar movimentos com espera
    const { currentMoveHistory: moves, newBoard } = start();

    const applyMoveWithDelay = async (index = 0) => {
      if (index >= moves.length) {
        return;
      }

      if (hasDelay) {
        const { row, col } = moves[index];
        move(row, col); // Executa o movimento
        await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 500ms
      }

      applyMoveWithDelay(index + 1); // próximo movimento
      return moves;
    };

    return hasDelay ? applyMoveWithDelay() : newBoard;
  };

  useEffect(() => {
    if (isFirstRender && !isShuffled) return;
    if (checkCompleted()) {
      setTimeout(() => console.log("tabuleiro completou"), 500);
    }
  }, [board, checkCompleted]);

  const breadthFirstSearch = async (initialBoard: EightGameBoard) => {
    const queue: { board: EightGameBoard; path: EightGameBoard[] }[] = [
      { board: initialBoard, path: [initialBoard] },
    ];
    const visited = new Set<string>();
    visited.add(JSON.stringify(initialBoard));

    while (queue.length > 0) {
      const { board, path } = queue.shift()!;

      // verifica se o estado atual é o estado objetivo
      if (checkCompleted(board)) {
        // atualiza o estado do tabuleiro para o estado objetivo e retorna o número de movimentos
        setBoard(board);
        console.log("Solução encontrada em", path.length - 1, "movimentos:");
        path.forEach((step, index) => {
          console.log(`Passo ${index}:`);
          console.log(step.map((row) => row.join(" ")).join("\n"), "\n");
        });
        return path.length - 1;
      }

      // gera todos os filhos do estado atual e os adiciona na fila
      const children = generateChildren(board);
      for (const child of children) {
        const childKey = JSON.stringify(child);
        if (!visited.has(childKey)) {
          visited.add(childKey);
          queue.push({ board: child, path: [...path, child] });
        }
      }
    }

    console.log("Nenhuma solução encontrada.");
    return -1;
  };

  // gera filhos do estado atual
  const generateChildren = (board: EightGameBoard): EightGameBoard[] => {
    const children: EightGameBoard[] = [];
    const { row, col } = findEmptyPosition(board);
    const moves = getAdjecentCells(row, col); // Usa a função getAdjecentCells

    for (const { row: moveRow, col: moveCol } of moves) {
      const newBoard = board.map((r) => [...r]);
      [newBoard[row][col], newBoard[moveRow][moveCol]] = [
        newBoard[moveRow][moveCol],
        newBoard[row][col],
      ];
      children.push(newBoard);
    }
    return children;
  };

  // encontra a posição da célula vazia no tabuleiro
  const findEmptyPosition = (board: EightGameBoard): Position => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          return { row, col };
        }
      }
    }
    throw new Error("Empty cell not found");
  };

  const aStarSearch = async (
    initialBoard: EightGameBoard
  ): Promise<EightGameBoard[] | null> => {
    const openList: BoardState[] = [];
    const closedSet = new Set<string>();

    // Inicializa o estado inicial
    openList.push({
      board: initialBoard,
      path: [initialBoard],
      gCost: 0,
      hCost: calculateTotalManhattanDistance(initialBoard),
      fCost: calculateTotalManhattanDistance(initialBoard),
    });

    while (openList.length > 0) {
      // Ordena a lista aberta pelo menor fCost
      openList.sort((a, b) => a.fCost - b.fCost);
      const currentState = openList.shift()!;

      // Verifica se o estado atual é o estado objetivo
      if (checkCompleted(currentState.board)) {
        return currentState.path; // Caminho para a solução encontrado
      }

      // Adiciona o estado atual ao conjunto fechado
      closedSet.add(JSON.stringify(currentState.board));

      // Gera filhos (movimentos possíveis)
      const children = generateMoves(currentState.board);

      for (const child of children) {
        const childKey = JSON.stringify(child);
        if (closedSet.has(childKey)) continue; // Ignora estados já visitados

        // Calcula o custo do caminho (gCost) e o custo estimado (hCost)
        const gCost = currentState.gCost + 1;
        const hCost = calculateTotalManhattanDistance(child);
        const fCost = gCost + hCost;

        // Adiciona o filho à lista aberta com seu estado atualizado
        openList.push({
          board: child,
          path: [...currentState.path, child],
          gCost,
          hCost,
          fCost,
        });
      }
    }

    return null; // Nenhuma solução encontrada
  };

  const generateMoves = (board: EightGameBoard): EightGameBoard[] => {
    const possibleMoves: EightGameBoard[] = [];

    let emptyX = -1;
    let emptyY = -1;

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === null) {
          emptyX = i;
          emptyY = j;
        }
      });
    });

    // Movimentos possíveis: cima, baixo, esquerda, direita
    const moves = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ];

    moves.forEach((move) => {
      const newX = emptyX + move.x;
      const newY = emptyY + move.y;

      if (
        newX >= 0 &&
        newX < board.length &&
        newY >= 0 &&
        newY < board.length
      ) {
        const newBoard = board.map((row) => row.slice());
        [newBoard[emptyX][emptyY], newBoard[newX][newY]] = [
          newBoard[newX][newY],
          newBoard[emptyX][emptyY],
        ];
        possibleMoves.push(newBoard);
      }
    });

    return possibleMoves;
  };

  const randomSearch = async (
    board: EightGameBoard,
    maxIterations: number = 10000
  ): Promise<{ board: EightGameBoard; iterations: number } | null> => {
    let currentBoard = board;
    const visitedStates = new Set<string>();
    let iterations = 0;

    while (!checkCompleted(currentBoard) && iterations < maxIterations) {
      // Adiciona o estado atual aos visitados
      visitedStates.add(JSON.stringify(currentBoard));

      // Gera movimentos aleatórios e evita ciclos
      const possibleMoves = generateMoves(currentBoard);
      const unvisitedMoves = possibleMoves.filter(
        (move) => !visitedStates.has(JSON.stringify(move))
      );

      const nextMove =
        unvisitedMoves.length > 0
          ? unvisitedMoves[Math.floor(Math.random() * unvisitedMoves.length)]
          : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      currentBoard = nextMove;
      iterations++;
    }
    setCurrentMoveCount(iterations);
    // Retorna o estado final e o número de iterações se o objetivo foi alcançado
    return checkCompleted(currentBoard)
      ? { board: currentBoard, iterations }
      : null;
  };

  const calculateGreedyDistance = (board: EightGameBoard): number => {
    let distance = 0;
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== null) {
          const targetX = Math.floor((cell - 1) / 3); // posição objetivo em X
          const targetY = (cell - 1) % 3; // posição objetivo em Y
          distance += Math.abs(i - targetX) + Math.abs(j - targetY);
        }
      });
    });
    return distance;
  };

  const greedyManhattanSearch = async (
    board: EightGameBoard,
    maxIterations: number = 1_000_000
  ): Promise<{ board: EightGameBoard; iterations: number } | null> => {
    let currentBoard = board;
    let iterations = 0;

    while (!checkCompleted(currentBoard) && iterations < maxIterations) {
      const possibleMoves = generateMoves(currentBoard);

      let bestMove = possibleMoves[0];
      let minDistance = calculateGreedyDistance(bestMove);

      possibleMoves.forEach((move) => {
        const distance = calculateGreedyDistance(move);
        if (distance < minDistance) {
          minDistance = distance;
          bestMove = move;
        }
      });

      currentBoard = bestMove;
      iterations++;
    }
    setCurrentMoveCount(iterations);
    return checkCompleted(currentBoard)
      ? { board: currentBoard, iterations }
      : null;
  };

  const applyHeuristic = async (
    type: "random" | "one-level" | "two-levels" | "custom"
  ) => {
    setCurrentMoveCount(0);
    const heuristicLabelMap: Record<typeof type, string> = {
      random: "Heurística aleatória",
      "one-level": "Heurística de um nível",
      "two-levels": "Heurística de dois níveis",
      custom: "Heurística personalizada",
    };
    console.log("Escolhendo heuriística:", heuristicLabelMap[type]);

    switch (type) {
      case "random": {
        console.log("Heurística de Busca Aleatória");
        const result = await randomSearch(board, 1_000_000);
        if (result) {
          setBoard(result.board);
          console.log(
            "Solução encontrada em",
            result.iterations,
            "iteração(ões)."
          );
        } else {
          console.log("Solução não encontrada dentro do limite de iterações.");
        }
        break;
      }
      case "one-level": {
        console.log("Heuritica de um nível");
        await breadthFirstSearch(board);
        break;
      }

      case "two-levels": {
        console.log("Heurística A* para resolver o tabuleiro");
        const path = await aStarSearch(board);
        if (path) {
          for (const state of path) {
            setBoard(state); // Atualiza o tabuleiro para cada movimento
            await new Promise((resolve) => setTimeout(resolve, 100)); // Animação opcional
          }
        } else {
          console.log("Solução não encontrada.");
        }
        break;
      }
      case "custom": {
        console.log("Heurística de Busca em Largura");
        const result = await greedyManhattanSearch(board);
        if (result) {
          setBoard(result.board);
          console.log(
            "Solução encontrada em",
            result.iterations,
            "iteração(ões)."
          );
        } else {
          console.log("Solução não encontrada dentro do limite de iterações.");
        }
        break;
      }

      default:
        throw new Error("Invalid heuristic type");
    }

    getReport();
  };

  return (
    <GameContext.Provider
      value={{
        board,
        checkCompleted,
        move,
        isShuffled,
        shuffleBoard,
        setGlobalIterationsCount,
        applyHeuristic,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
