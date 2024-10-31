import React from "react";
import {
  Container,
  Header,
  SummaryContainer,
  InfoLabel,
} from "../Summary/styles";
import CustomInputComponent from "../CustomInput";
import { useGameContext } from "../../context/useGame";
import CustomButton from "../CustomButton/styles";

const BoardHeuristicController: React.FC = () => {
  const {
    globalIterationsCount,
    shuffleBoard,
    shuffleCount,
    setShuffleCount,
    applyHeuristic,
    setGlobalIterationsCount,
  } = useGameContext();
  const handleSuffle = async (qnt: number) => {
    await shuffleBoard(qnt);
  };

  const handleApplyHeuristic = (
    heuristic: "one-level" | "two-levels" | "custom" | "random"
  ) => {
    applyHeuristic(heuristic);
  };

  return (
    <Container style={{ width: "750px" }}>
      <Header>Controles</Header>
      <SummaryContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InfoLabel>Movimentos para embaralhar:</InfoLabel>
          <CustomInputComponent
            defaultValue={shuffleCount}
            onChange={(e) => setShuffleCount(Number(e.target.value))}
            type="number"
            placeholder="Enter number of shuffle moves"
          />
        </div>
        <CustomButton
          backgroundColor=" #1e0f46;"
          onClick={() => handleSuffle(shuffleCount)}
        >
          Embaralhar
        </CustomButton>
        <div
          style={{
            marginTop: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InfoLabel>Max. de Iterações:</InfoLabel>
          <CustomInputComponent
            type="number"
            onChange={(e) => setGlobalIterationsCount(Number(e.target.value))}
            defaultValue={globalIterationsCount}
            placeholder="Enter max iterations for heuristics"
          />
        </div>
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "25px",
            flex: 1,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <CustomButton onClick={() => handleApplyHeuristic("random")}>
            Heurística aleatória
          </CustomButton>
          <CustomButton onClick={() => handleApplyHeuristic("one-level")}>
            Heurística de um nível
          </CustomButton>
          <CustomButton onClick={() => handleApplyHeuristic("two-levels")}>
            Heurística de dois níveis
          </CustomButton>
          <CustomButton onClick={() => handleApplyHeuristic("custom")}>
            Heurística personalizada
          </CustomButton>
        </div>
      </SummaryContainer>
    </Container>
  );
};

export default BoardHeuristicController;
