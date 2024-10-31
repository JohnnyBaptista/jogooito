# Projeto Resolver Quebra-Cabeça de 8 Peças

Este projeto implementa uma solução para o jogo do quebra-cabeça de 8 peças, um problema clássico de rearranjo de peças numeradas em um tabuleiro. O programa permite que os usuários embaralhem o tabuleiro, escolham várias heurísticas de busca e tentem resolver o quebra-cabeça encontrando a sequência de movimentos necessária para chegar à solução final.

> ### Acesse ao trabalho pelo site [clicando aqui](https://jogooito.vercel.app)

## Requisitos do Projeto

### 1. Configuração Inicial

O tabuleiro começa no estado resolvido, com as peças organizadas na ordem correta. O usuário define um número de movimentos aleatórios para embaralhar o tabuleiro.

### 2. Técnicas de Busca e Heurísticas

O projeto implementa várias técnicas de busca para resolver o quebra-cabeça embaralhado:

- **Busca Aleatória**: Aplica movimentos aleatórios para resolver o quebra-cabeça, fornecendo um caminho de solução imprevisível.
- **Heurística de Um Nível (Busca em largura)**: Usa uma heurística que avalia possíveis movimentos em um único nível para guiar o quebra-cabeça em direção à solução.
- **Heurística de Dois Níveis (Busca A\*)**: Implementa o algoritmo A\*, analisando dois níveis de movimentos para determinar o caminho mais curto até a solução.
- **Heurística Personalizada (Busca Gulosa)**: Aplica uma heurística personalizada baseada na distância mínima do estado objetivo, otimizando os movimentos para reduzir o número de passos até a solução.

### 3. Registro de Desempenho

O código registra o número total de movimentos e iterações necessárias para cada heurística resolver o quebra-cabeça, ajudando a avaliar a eficiência de cada abordagem.

### 4. Prevenção de Loops

Para evitar loops infinitos, o programa acompanha os últimos movimentos, garantindo que movimentos repetidos não revertam o quebra-cabeça para estados anteriores.

## Componentes Principais

- **GameContext**: Gerencia o estado do jogo, incluindo o tabuleiro, contagem de movimentos, iterações globais e aplicação das heurísticas.
- **Funções de Heurísticas**: Implementam as diferentes abordagens de busca, como Busca Aleatória, Busca A\* e Busca Gulosa.

Este README fornece uma visão geral das funcionalidades e requisitos do projeto para o jogo dos 8 quadradinhos.
