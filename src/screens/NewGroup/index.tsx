import { useNavigation } from "@react-navigation/native";

import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

export const NewGroup = () => {

  const navigation = useNavigation();

  const handleNew = () => {
    navigation.navigate('players', { group: 'Turma do Fundão' });
  }
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
          placeholder="Nome da turma"
        />

        <Button 
          title="Criar"
          style={{ marginTop: 20 }}
          onPress={handleNew}
        />
      </Content>
    </Container>
  )
}