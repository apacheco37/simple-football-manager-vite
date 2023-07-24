import { TextField, Button, Typography, List, ListItem } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

import { db } from "../db/db";
import { createNewLeague } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const Leagues = () => {
  const [newLeagueNameInput, setNewLeagueNameInput] = useState("");
  const leagues = useLiveQuery(() => db.leagues.toArray());
  const navigate = useNavigate();

  const handleCreateLeague = async () => {
    if (!newLeagueNameInput) return;

    try {
      const id = await db.leagues.add(
        createNewLeague(newLeagueNameInput, 16, 20)
      );

      setNewLeagueNameInput("");
      handleLoadLeague(id as number);
    } catch (error) {
      console.log("Failed to create the new league.", error);
    }
  };

  const handleLoadLeague = (leagueID: number) => {
    navigate(`${leagueID}/teams`);
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
          <ListItem key={league.id}>
            <Button onClick={() => handleLoadLeague(league.id!)}>
              {league.name}
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Leagues;
