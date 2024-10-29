import { useContext } from "react";
import { EigthGameContextData, GameContext } from "./GameContext"; // Adjust the import path as necessary

export const useGameContext = (): EigthGameContextData => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
