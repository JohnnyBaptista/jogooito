import { GameProvider } from "../../context/GameContext";
import { useGameContext } from "../../context/useGame";
import Board from "../Board";
import CustomButton from "../CustomButton";
import { GameContainer } from "./styles";

function Game() {
  const { shuffleBoard, applyHeuristic } = useGameContext();
  const handleSuffle = async (qnt: number) => {
    await shuffleBoard(qnt);
  };

  return (
    <GameContainer>
      <div
        style={{
          display: "flex",
          gap: 60,
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <CustomButton onClick={() => handleSuffle(5)}>
            Embaralhar
          </CustomButton>
          <CustomButton onClick={() => applyHeuristic("random")}>
            Heurística aleatória
          </CustomButton>
          <CustomButton onClick={() => applyHeuristic("one-level")}>
            Heurística de um nível
          </CustomButton>
          <CustomButton onClick={() => applyHeuristic("two-levels")}>
            Heurística de dois níveis
          </CustomButton>
          <CustomButton onClick={() => applyHeuristic("custom")}>
            Heurística personalizada
          </CustomButton>
        </div>
        <Board />
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
