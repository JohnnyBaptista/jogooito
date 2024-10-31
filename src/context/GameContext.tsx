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
import {
  calculateDistance,
  calculateTotalManhattanDistance,
} from "../heuristics/utils"; // Função auxiliar para calcular distância de Manhattan

type Position = { row: number; col: number };
export type Cell = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;
export type EightGameBoard = Cell[][];
export interface EigthGameContextData {
  board: EightGameBoard;
  checkCompleted: () => boolean;
  move: (rowIndex: number, cellIndex: number) => void;
  isShuffled: boolean;
  shuffleBoard: (
    iterationQnt: number,
    hasDelay?: boolean
  ) => Promise<{ row: number; col: number }[] | undefined>;
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
  const [moveHistory2, setMoveHistory2] = useState<
    { row: number; col: number }[]
  >([]);
  const moveCounts = useRef<{ [key: string]: number }>({
    random: 0,
    "one-level": 0,
    "two-levels": 0,
    custom: 0,
  });

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

        // Adiciona o movimento à lista

        currentMoveHistory.push({ row: swapRow, col: swapCol });
      }

      return { currentMoveHistory, newBoard: tempBoard };
    }

    // Função recursiva para aplicar movimentos com espera
    const { currentMoveHistory: moves, newBoard } = start();
    // console.log("Movimentos gerados:", moves);
    const applyMoveWithDelay = async (index = 0) => {
      if (index >= moves.length) {
        return;
      }

      if (hasDelay) {
        const { row, col } = moves[index];
        move(row, col); // Executa o movimento
        console.log("entrou no deleaaay");
        await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 500ms
      }

      applyMoveWithDelay(index + 1); // Próximo movimento
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

  const randomSearch = async (brd: EightGameBoard = board, i = 0) => {
    const maxIterations = 1_500_000;
    if (i === maxIterations) {
      console.log("Max iterations reached");
      return { i, brd };
    }

    const shuffledBoard = await shuffleBoard(1, false, brd);
    const isCompleted = checkCompleted(shuffledBoard as EightGameBoard);
    if (isCompleted) {
      return { i, brd: shuffledBoard };
    }
    i++;
    return randomSearch(shuffledBoard as EightGameBoard, i);
  };

  const breadthFirstSearch = async (initialBoard: EightGameBoard) => {
    const queue: { board: EightGameBoard; path: EightGameBoard[] }[] = [
      { board: initialBoard, path: [initialBoard] },
    ];
    const visited = new Set<string>();
    visited.add(JSON.stringify(initialBoard));

    while (queue.length > 0) {
      const { board, path } = queue.shift()!;

      // Verifica se o estado atual é o estado objetivo
      if (checkCompleted(board)) {
        // Atualiza o estado do tabuleiro para o estado objetivo e retorna o número de movimentos
        setBoard(board);
        console.log("Solução encontrada em", path.length - 1, "movimentos:");
        path.forEach((step, index) => {
          console.log(`Passo ${index}:`);
          console.log(step.map((row) => row.join(" ")).join("\n"), "\n");
        });
        return path.length - 1;
      }

      // Gera todos os filhos do estado atual e os adiciona na fila
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

  // Função para gerar filhos do estado atual
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

  // Função para encontrar a posição da célula vazia no tabuleiro
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

  const applyHeuristic = async (
    type: "random" | "one-level" | "two-levels" | "custom"
  ) => {
    console.log("Aplicando heuristica");
    // let newBoard = board;
    // let currentHistory: Array<{ row: number; col: number }> = [];

    // Aplica a heurística e busca evitar loops

    switch (type) {
      case "random": {
        console.log("Heuritica Aleatória");
        const result = await randomSearch();
        setBoard(result.brd as EightGameBoard);
        break;
      }
      case "one-level": {
        console.log("Heuritica de um nível");
        // await startLevelSearch(board);
        console.log({ moveHistory2 });
        break;
      }

      case "two-levels":
        console.log("Heurística de dois níveis");
        // await secondLevelHeuristics(board);
        break;
      case "custom":
        console.log("Heurística de Busca em Largura");
        await breadthFirstSearch(board);
        break;
      default:
        throw new Error("Invalid heuristic type");
    }
    // console.log({ currentHistory, newBoard });

    // for (const movePos of currentHistory) {
    //   move(movePos.row, movePos.col); // Chama o método move para cada posição no histórico
    //   // await new Promise((resolve) => setTimeout(resolve, 200)); // Intervalo para visualização dos movimentos
    // }
    getReport(); // Exibe o relatório ao final
  };

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
