import { Button, List, ListItem, TextField, Typography } from "@mui/material";
import "./App.css";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db/db";
import { useState } from "react";
import { createNewLeague } from "./utils/utils";

function App() {
  const [newLeagueNameInput, setNewLeagueNameInput] = useState("");
  const leagues = useLiveQuery(() => db.leagues.toArray());

  const handleCreateLeague = async () => {
    if (!newLeagueNameInput) return;

    try {
      await db.leagues.add(createNewLeague(newLeagueNameInput));

      setNewLeagueNameInput("");
    } catch (error) {
      console.log("Failed to create the new league.", error);
    }
  };

  return (
    <>
      <TextField
        value={newLeagueNameInput}
        onChange={(e) => {
          setNewLeagueNameInput(e.target.value);
        }}
        placeholder={"League Name"}
      />
      <Button variant="outlined" onClick={handleCreateLeague}>
        Create New League
      </Button>
      <Typography>Or load an existing one</Typography>
      <List>
        {leagues?.map((league) => (
          <ListItem key={league.id}>{league.name}</ListItem>
        ))}
      </List>
    </>
  );
}

export default App;
