import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Stack,
  Checkbox,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSaveGamesDB } from "../db/db";
import { createNewGame } from "../utils/utils";

const SaveGames = () => {
  const saveGamesDB = getSaveGamesDB();
  const [newSaveGameNameInput, setNewSaveGameNameInput] = useState("");
  const [randomizeTeams, setRandomizeTeams] = useState(false);
  const [spectatorMode, setSpectatorMode] = useState(false);
  const navigate = useNavigate();

  const saveGames = useLiveQuery(() => saveGamesDB.toArray());

  const handleCreateSaveGame = async () => {
    if (!newSaveGameNameInput) return;

    try {
      const saveGameID = await createNewGame(
        newSaveGameNameInput,
        randomizeTeams,
        spectatorMode
      );

      setNewSaveGameNameInput("");
      handleLoadSaveGame(saveGameID);
    } catch (error) {
      console.log("Failed to create the new save game.", error);
    }
  };

  const handleLoadSaveGame = (saveGameID: number) => {
    navigate(`${saveGameID}/teams`);
  };

  return (
    <Stack spacing={4}>
      <Stack direction={"row"} spacing={2}>
        <TextField
          value={newSaveGameNameInput}
          onChange={(e) => {
            setNewSaveGameNameInput(e.target.value);
          }}
          placeholder={"Save Game Name"}
        />
        <Button variant="outlined" onClick={handleCreateSaveGame}>
          Create New Save Game
        </Button>
        <Checkbox
          checked={randomizeTeams}
          onChange={(e) => setRandomizeTeams(e.target.checked)}
        />
        <Typography alignContent={"center"} marginLeft={"0 !important"}>
          Randomize Teams
        </Typography>
        <Checkbox
          checked={spectatorMode}
          onChange={(e) => setSpectatorMode(e.target.checked)}
        />
        <Typography alignContent={"center"} marginLeft={"0 !important"}>
          Spectator Mode
        </Typography>
      </Stack>
      <Typography variant="h6">Or load an existing one:</Typography>
      <List>
        {saveGames?.map((saveGame) => (
          <ListItem key={saveGame.id}>
            <Button onClick={() => handleLoadSaveGame(saveGame.id!)}>
              {saveGame.name}
            </Button>
            <Typography variant="subtitle2">{`(created: ${saveGame.creationDate?.toLocaleString()})`}</Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default SaveGames;
