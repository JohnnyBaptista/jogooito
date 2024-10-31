import { GameProvider } from "../../context/GameContext";

import Board from "../Board";
import BoardHeuristicController from "../BoardHeuristicController";

import Summary from "../Summary";
import { GameContainer } from "./styles";

function Game() {
  const BoardAndSummary = () => (
    <div
      style={{
        display: "flex",
        gap: 60,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Board />
      <BoardHeuristicController />
    </div>
  );

  return (
    <GameContainer>
      <div
        style={{
          display: "flex",
          gap: 60,
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        <BoardAndSummary />

        <Summary title="Relatório" />
      </div>
    </GameContainer>
  );
}

const WrappedGame = () => (
  <GameProvider>
    <Game />
  </GameProvider>
);

export default WrappedGame;
