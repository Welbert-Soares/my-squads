import { Container } from "./styles";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";

export const Players = () => {
  return (
    <Container>
      <Header showBackButton />

      <Highlight 
        title="Nome da turma"
        subtitle="adicione a galera e separe os times"
      />
      
    </Container>
  );
};
