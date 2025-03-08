import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Stack,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSaveGamesDB } from "../db/db";
import { createNewGame } from "../utils/data-creation";
import Dexie from "dexie";

const SaveGames = () => {
  const saveGamesDB = getSaveGamesDB();
  const [newSaveGameNameInput, setNewSaveGameNameInput] = useState("");
  const [randomizeTeams, setRandomizeTeams] = useState(false);
  const [spectatorMode, setSpectatorMode] = useState(false);
  const [openDeleteAllConfirmationDialog, setOpenDeleteAllConfirmationDialog] =
    useState(false);
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

  const handleDeleteAllSaveGames = async () => {
    await saveGamesDB.clear();
    const dbNames = await Dexie.getDatabaseNames();
    await Promise.all(dbNames.map((dbName) => Dexie.delete(dbName)));
  };

  const handleConfirmDeleteAllSaveGames = async () => {
    await handleDeleteAllSaveGames();
    setOpenDeleteAllConfirmationDialog(false);
  };

  const handleClickOpenDeleteAllConfirmationDialog = () => {
    setOpenDeleteAllConfirmationDialog(true);
  };

  const handleCloseDeleteAllConfirmationDialog = () => {
    setOpenDeleteAllConfirmationDialog(false);
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
      {(saveGames?.length ?? 0) > 0 && (
        <Button
          variant="outlined"
          onClick={handleClickOpenDeleteAllConfirmationDialog}
          sx={{ maxWidth: "fit-content" }}
          color="error"
        >
          Delete All Save Games
        </Button>
      )}
      <Dialog
        open={openDeleteAllConfirmationDialog}
        onClose={handleCloseDeleteAllConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm All Save Games Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all save games? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteAllConfirmationDialog}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteAllSaveGames} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default SaveGames;
