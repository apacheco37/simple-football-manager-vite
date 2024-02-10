import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

import { db } from "../db/db";
import { createNewGame } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const SaveGames = () => {
  const [newSaveGameNameInput, setNewSaveGameNameInput] = useState("");
  const saveGames = useLiveQuery(() => db.saveGame.toArray());
  const navigate = useNavigate();

  const handleCreateSaveGame = async () => {
    if (!newSaveGameNameInput) return;

    try {
      const id = await db.saveGame.add(
        createNewGame(newSaveGameNameInput, 4, 16, 20)
      );

      setNewSaveGameNameInput("");
      handleLoadSaveGame(id as number);
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
      </Stack>
      <Typography variant="h6">Or load an existing one:</Typography>
      <List>
        {saveGames?.map((saveGame) => (
          <ListItem key={saveGame.id}>
            <Button onClick={() => handleLoadSaveGame(saveGame.id!)}>
              {saveGame.name}
            </Button>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default SaveGames;
