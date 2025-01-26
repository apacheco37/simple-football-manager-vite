import { Link, List, ListItem, Typography } from "@mui/material";
import { useContext } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { SaveGameContext } from "./savegame-layout";

const LeagueDetails = () => {
  const { leagueid } = useParams();
  const {
    saveGame: { teams },
  } = useContext(SaveGameContext);

  const leagueTeams = teams.filter(
    (teams) => teams.leagueID === Number(leagueid)
  );

  return (
    <>
      <Typography variant="h6">Teams:</Typography>
      <List>
        {leagueTeams.map((team) => (
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
