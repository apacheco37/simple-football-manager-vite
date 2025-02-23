import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Box, Typography } from "@mui/material";

import { SaveGameContext } from "./savegame-layout";

const MatchDetails = () => {
  const { matchid } = useParams();
  const {
    saveGameDB: { matchesDB, teamsDB },
  } = useContext(SaveGameContext);

  const match = useLiveQuery(() => matchesDB.get(Number(matchid)), [matchid]);
  const teams = useLiveQuery(() => {
    if (match?.homeTeamID && match?.awayTeamID) {
      return teamsDB.bulkGet([match?.homeTeamID, match?.awayTeamID]);
    }
    return [];
  }, [match?.homeTeamID, match?.awayTeamID]);

  if (!match) {
    return <div>Match Not Found</div>;
  }

  const homeGoals = match.events?.homeTeam.filter(
    (event) => event.type === "goal"
  ).length;
  const awayGoals = match.events?.awayTeam.filter(
    (event) => event.type === "goal"
  ).length;

  return (
    <Box>
      {
        <Typography variant="h4">{`${teams?.[0]?.name} ${homeGoals ?? ""} - ${
          awayGoals ?? ""
        } ${teams?.[1]?.name}`}</Typography>
      }
    </Box>
  );
};

export default MatchDetails;
