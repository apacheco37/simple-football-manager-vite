import { useContext } from "react";
import { Box, Link, List, ListItem } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { SaveGameContext } from "./savegame-layout";

const Leagues = () => {
  const {
    saveGame: { leagues },
  } = useContext(SaveGameContext);

  return (
    <Box>
      <List>
        {leagues.map((league) => (
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
