import { Link, List, ListItem, Typography } from "@mui/material";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import { LeagueContext } from "./leaguelayout";

const Teams = () => {
  const { league } = useContext(LeagueContext);

  return (
    <>
      <Typography variant="h6">Teams:</Typography>
      <List>
        {league.teams.map((team) => (
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
