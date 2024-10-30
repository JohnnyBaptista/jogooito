import React from "react";
import { useGameContext } from "../../context/useGame";
import Tile from "../Tile";
import { Container } from "./styles";

export default function Board() {
  const { board } = useGameContext();

  return (
    <Container>
      {board.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <Tile
              key={cellIndex}
              value={cell}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
            />
          ))}
        </React.Fragment>
      ))}
    </Container>
  );
}
