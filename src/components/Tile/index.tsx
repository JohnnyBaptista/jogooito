import { useGameContext } from "../../context/useGame";
import { Container } from "./styles";

interface TileProps {
  value: number | null;
  rowIndex: number;
  cellIndex: number;
}

export default function Tile({ value, rowIndex, cellIndex }: TileProps) {
  const { move } = useGameContext();

  const handleClick = () => {
    move(rowIndex, cellIndex);
  };

  return (
    <Container isNull={!value} onClick={() => handleClick()}>
      {value ?? ""}
    </Container>
  );
}
