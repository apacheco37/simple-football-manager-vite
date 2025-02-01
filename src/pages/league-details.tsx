import { Link, List, ListItem, Typography } from "@mui/material";
import { useContext } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import { SaveGameContext } from "./savegame-layout";

const LeagueDetails = () => {
  const { leagueid } = useParams();
  const {
    saveGameDB: { teamsDB },
  } = useContext(SaveGameContext);
  const leagueTeams = useLiveQuery(() =>
    teamsDB.where({ leagueID: Number(leagueid) }).toArray()
  );

  return (
    <>
      <Typography variant="h6">Teams:</Typography>
      <List>
        {leagueTeams?.map((team) => (
          <ListItem key={team.id}>
            <Link component={RouterLink} to={/* `${team.id}/players` */ ""}>
              {team.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default LeagueDetails;
