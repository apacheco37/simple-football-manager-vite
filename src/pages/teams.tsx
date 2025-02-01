import { Link, List, ListItem, Typography } from "@mui/material";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import { SaveGameContext } from "./savegame-layout";
import { useLiveQuery } from "dexie-react-hooks";

const Teams = () => {
  const {
    saveGameDB: { teamsDB },
  } = useContext(SaveGameContext);

  const teams = useLiveQuery(() => teamsDB.toArray(), [], []);

  return (
    <>
      <Typography variant="h6">Teams:</Typography>
      <List>
        {teams.map((team) => (
          <ListItem key={team.id}>
            <Link component={RouterLink} to={`${team.id}/players`}>
              {team.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Teams;
