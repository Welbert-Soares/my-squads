import { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";

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
import { Loading } from "@components/Loading";

type RoutesParams = {
  group: string;
}

export const Players = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newPlayerName, setNewPlayerName] = useState<string>(''); 
  const [team, setTeam] = useState<string>('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const navigation = useNavigation();
  const route = useRoute();

  const newPlayerNameInputRef = useRef<TextInput>(null);

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

      newPlayerNameInputRef.current?.blur();

      setNewPlayerName('');
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
      setIsLoading(true);

      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
      setIsLoading(false);
      
    } catch (error) {
      console.log(error);
      Alert.alert("Pessoas", "Não foi possível carregar as pessoas filtradas do time selecionado.");
    }
  }

  const handlePlayerRemove = async (playerName: string) => {
    try {
      await playerRemoveByGroup(playerName, group);
      featchPlayersByTeam();

    } catch (error) {
      console.log(error);
      Alert.alert("Remover Pessoa", "Não foi possível remover a pessoa.");
    }
  }

  const groupRemove = async () => {
    try {
      await groupRemoveByName(group);

      navigation.navigate("groups")
    } catch (error) {
      console.log(error);
      Alert.alert("Remover turma", "Não foi possível remover a turma.");
    }
  }

  const handleGroupRemove = async () => {
    Alert.alert("Remover turma", "Deseja realmente remover a turma?", 
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => groupRemove()}
      ]
    );
  };

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
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="Nome da pessoa" 
          autoCorrect={false} 
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
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
      
      {
        isLoading ? <Loading /> : 
      
        <FlatList 
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard 
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
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
      }

      <Button 
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  );
};
