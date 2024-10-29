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
            <Tile value={cell} rowIndex={rowIndex} cellIndex={cellIndex} />
          ))}
        </React.Fragment>
      ))}
      {/* {board.flatMap((row, rowIndex) =>
        row.map(
          (tile, tileIndex) =>
            tile && <Tile key={`${rowIndex}-${tileIndex}`} value={tile} />
        )
      )} */}
    </Container>
  );
}
