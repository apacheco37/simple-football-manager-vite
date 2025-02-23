import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { List, Stack, Typography } from "@mui/material";

import { SaveGameContext } from "./savegame-layout";

const MatchDetails = () => {
  const { matchid } = useParams();
  const {
    saveGameDB: { matchesDB, teamsDB, playersDB },
  } = useContext(SaveGameContext);

  const match = useLiveQuery(() => matchesDB.get(Number(matchid)), [matchid]);
  const teams = useLiveQuery(() => {
    if (match?.homeTeamID && match?.awayTeamID) {
      return teamsDB.bulkGet([match?.homeTeamID, match?.awayTeamID]);
    }
    return [];
  }, [match?.homeTeamID, match?.awayTeamID]);

  const players = useLiveQuery(() => {
    const playerIDs = match?.events?.homeTeam
      .map((event) => event.player1ID)
      .concat(match?.events?.awayTeam.map((event) => event.player1ID));
    return playerIDs?.length ? playersDB.bulkGet(playerIDs) : [];
  }, [match?.events]);

  if (!match) {
    return <div>Match Not Found</div>;
  }

  const eventsOrderedByTime =
    match.events?.homeTeam
      .concat(match.events?.awayTeam)
      .sort((a, b) => a.minute - b.minute) ?? [];

  const homeGoals = match.events?.homeTeam.filter(
    (event) => event.type === "goal"
  ).length;
  const awayGoals = match.events?.awayTeam.filter(
    (event) => event.type === "goal"
  ).length;

  return (
    <Stack spacing={2}>
      {
        <Typography variant="h4">{`${teams?.[0]?.name} ${homeGoals ?? ""} - ${
          awayGoals ?? ""
        } ${teams?.[1]?.name}`}</Typography>
      }
      <Typography variant="h6">Events:</Typography>
      <List>
        {eventsOrderedByTime.map((event, index) => (
          <Typography key={index}>
            {event.minute} - {event.type} -{" "}
            {
              players?.find((player) => event.player1ID === player?.id)
                ?.lastName
            }
          </Typography>
        ))}
      </List>
    </Stack>
  );
};

export default MatchDetails;
