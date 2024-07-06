import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Alert, FlatList } from "react-native";

import { playerAddByGroup } from "@storage/play/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/play/PlayerStorageDTO";
import { playersGetByGroupAndTeam } from "@storage/play/playersGetByGroupAndTeam";

import { AppError } from "@utils/AppError";

import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { ButtonIcon } from "@components/ButtonIcon";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

type RoutesParams = {
  group: string;
}

export const Players = () => {
  const [newPlayerName, setNewPlayerName] = useState<string>(''); 
  const [team, setTeam] = useState<string>('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RoutesParams;

  const handleAddPlayer = async () => {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert("Nova Pessoa", "Informe o nome da pessoa para adicionar.")
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);
      featchPlayersByTeam();
      
      
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova Pessoa", error.message);
      } else {
        console.log(error);
        Alert.alert("Nova Pessoa", "Não foi possível adicionar.")
      }
    }
  }

  const featchPlayersByTeam = async () => {
    try {
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam)
      
    } catch (error) {
      console.log(error);
      Alert.alert("Pessoas", "Não foi possível carregar as pessoas filtradas do time selecionado.");
    }
  }

  useEffect(() => {
    featchPlayersByTeam()
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input 
          onChangeText={setNewPlayerName}
          placeholder="Nome da pessoa" 
          autoCorrect={false} 
        />

        <ButtonIcon 
          icon="add"
          onPress={handleAddPlayer} 
        />

      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>

      <FlatList 
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard 
            name={item.name}
            onRemove={() => {}}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty 
            message="Não há pessoas nesse time."
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          players.length === 0 && { flex: 1 }
        ]}
      />

      <Button 
        title="Remover Turma"
        type="SECONDARY"
      />
    </Container>
  );
};
