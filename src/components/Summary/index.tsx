import React from "react";
import {
  Container,
  Header,
  SummaryContainer,
  InfoLabel,
  InfoValue,
} from "./styles";
import { useGameContext } from "../../context/useGame";
import { Heuristics } from "../../context/types";

interface SummaryProps {
  title: string;
}

const Summary: React.FC<SummaryProps> = ({ title }) => {
  const {
    chosenHeuristic,
    currentMoveCount,
    isShuffled,
    isResolving,
    checkCompleted,
  } = useGameContext();
  const isCompleted = !isShuffled ? false : checkCompleted();
  const heuristicLabelMap: Record<Heuristics, string> = {
    "one-level": "Heurística de um nível - Busca em Largura",
    "two-levels": "Heurística de dois níveis - Busca A*",
    custom: "Heurística customizada - Busca Gulosa",
    random: "Heurítica aleatória - Força bruta",
  };

  const getStatusValue = () => {
    console.log({ isShuffled, isCompleted, isResolving });
    if (!isShuffled && !isCompleted) {
      return "Não embaralhado / Resolvido";
    }
    if (isResolving) {
      return "Resolvendo";
    }
    if (isShuffled && !isCompleted && !isResolving) {
      return "Embaralhado";
    }
  };
  return (
    <Container>
      <Header>{title}</Header>
      <SummaryContainer>
        <div>
          <InfoLabel>Heuristica escolhida: </InfoLabel>
          <InfoValue>
            {chosenHeuristic
              ? heuristicLabelMap[chosenHeuristic as Heuristics]
              : "Nenhuma heuristica escolhida"}{" "}
          </InfoValue>
        </div>
        <div>
          <InfoLabel>Numero de iterações: </InfoLabel>
          <InfoValue>{currentMoveCount}</InfoValue>
        </div>
        <div>
          <InfoLabel>Status do tabuleiro: </InfoLabel>
          <InfoValue>{getStatusValue()}</InfoValue>
        </div>
      </SummaryContainer>
    </Container>
  );
};

export default Summary;
