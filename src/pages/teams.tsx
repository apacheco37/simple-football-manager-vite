import { List, ListItem } from "@mui/material";

import { useContext } from "react";
import { LeagueContext } from "./leaguelayout";

const Teams = () => {
  const { league } = useContext(LeagueContext);

  return (
    <>
      Teams:
      <List>
        {league.teams.map((team) => (
          <ListItem key={team.id}>{team.name}</ListItem>
        ))}
      </List>
    </>
  );
};

export default Teams;
