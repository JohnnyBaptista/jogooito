import { useContext } from "react";
import { EigthGameContextData } from "./types";
import { GameContext } from "./GameContext";

export const useGameContext = (): EigthGameContextData => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
