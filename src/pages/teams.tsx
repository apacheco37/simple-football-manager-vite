import { List, ListItem } from "@mui/material";
import { useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../db/db";

const Teams = () => {
  const { leagueid } = useParams();
  console.log(leagueid);
  const league = useLiveQuery(() => db.leagues.get(Number(leagueid!)));
  console.log(league?.name);

  return (
    <>
      Teams:
      <List>
        {league?.teams.map((team) => (
          <ListItem key={team.id}>{team.name}</ListItem>
        ))}
      </List>
    </>
  );
};

export default Teams;
