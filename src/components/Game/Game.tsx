import { GameProvider } from "../../context/GameContext";
import Board from "../Board";
import { GameContainer } from "./styles";

export default function Game() {
  return (
    <GameProvider>
      <GameContainer>
        <Board />
      </GameContainer>
    </GameProvider>
  );
}
