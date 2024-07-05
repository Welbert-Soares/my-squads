import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

export const NewGroup = () => {
  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <Highlight 
          title="Nova turma"
          subtitle="Crie a turma para adicionar as pessoas"
        />
        
        <Input 

        />

        <Button 
          title="Criar"
          style={{ marginTop: 20 }}
        />
      </Content>
    </Container>
  )
}