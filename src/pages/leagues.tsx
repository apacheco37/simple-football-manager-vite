import { useContext } from "react";
import { Box, Link, List, ListItem } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { SaveGameContext } from "./savegame-layout";
import { useLiveQuery } from "dexie-react-hooks";

const Leagues = () => {
  const {
    saveGameDB: { leaguesDB },
  } = useContext(SaveGameContext);

  const leagues = useLiveQuery(() => leaguesDB.toArray());

  return (
    <Box>
      <List>
        {leagues?.map((league) => (
          <ListItem key={league.id}>
            <Link component={RouterLink} to={`${league.id}`}>
              {league.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Leagues;
