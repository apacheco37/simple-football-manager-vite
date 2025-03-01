import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Box,
  List,
  ListItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import { SaveGameContext } from "./savegame-layout";
import { Player, TeamLineup } from "../db/db";

const MatchDetails = () => {
  const { matchid } = useParams();
  const {
    saveGameDB: { matchesDB, teamsDB, playersDB },
  } = useContext(SaveGameContext);
  const [activeSection, setActiveSection] = useState(0);

  const match = useLiveQuery(() => matchesDB.get(Number(matchid)), [matchid]);
  const teams = useLiveQuery(() => {
    if (match?.homeTeamID && match?.awayTeamID) {
      return teamsDB.bulkGet([match?.homeTeamID, match?.awayTeamID]);
    }
    return [];
  }, [match?.homeTeamID, match?.awayTeamID]);

  const homePlayers = useLiveQuery<Player[], Player[]>(
    () =>
      playersDB
        .filter((player) => player.teamID === match?.homeTeamID)
        .toArray(),
    [match?.homeTeamID],
    []
  );

  const awayPlayers = useLiveQuery<Player[], Player[]>(
    () =>
      playersDB
        .filter((player) => player.teamID === match?.awayTeamID)
        .toArray(),
    [match?.awayTeamID],
    []
  );

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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeSection}
          onChange={(_e, newValue) => setActiveSection(newValue)}
        >
          <Tab label="Events" />
          <Tab label="Ratings" />
          <Tab label="Lineups" />
        </Tabs>
      </Box>
      {activeSection === 0 && (
        <List>
          {eventsOrderedByTime.map((event, index) => (
            <Typography key={index}>
              {event.minute}' - {event.type} -{" "}
              {
                [...homePlayers, ...awayPlayers].find(
                  (player) => event.player1ID === player?.id
                )?.lastName
              }
            </Typography>
          ))}
        </List>
      )}
      {activeSection === 1 && (
        <Stack direction={"row"} spacing={2}>
          <Stack spacing={2}>
            <Typography>
              Goalkeeping: {match.ratings?.homeTeam.goalkeeping}
            </Typography>
            <Typography>Defense: {match.ratings?.homeTeam.defense}</Typography>
            <Typography>
              Midfield: {match.ratings?.homeTeam.midfield}
            </Typography>
            <Typography>Attack: {match.ratings?.homeTeam.attack}</Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography>
              Goalkeeping: {match.ratings?.awayTeam.goalkeeping}
            </Typography>
            <Typography>Defense: {match.ratings?.awayTeam.defense}</Typography>
            <Typography>
              Midfield: {match.ratings?.awayTeam.midfield}
            </Typography>
            <Typography>Attack: {match.ratings?.awayTeam.attack}</Typography>
          </Stack>
        </Stack>
      )}
      {activeSection === 2 && (
        <Stack direction={"row"}>
          <MatchDetailsLineup
            teamLineup={match.lineups?.homeTeam}
            players={homePlayers}
          />
          <MatchDetailsLineup
            teamLineup={match.lineups?.awayTeam}
            players={awayPlayers}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default MatchDetails;

const MatchDetailsLineup = ({
  teamLineup,
  players,
}: {
  teamLineup?: TeamLineup;
  players: Player[];
}) => {
  const {
    saveGame: { id },
  } = useContext(SaveGameContext);

  if (!teamLineup) {
    return <div>Lineup not found</div>;
  }

  return (
    <Stack>
      <Typography variant="h6">Goalkeeper:</Typography>
      <List>
        <ListItem
          key={teamLineup.goalkeeperID}
          component={Link}
          to={`/save-games/${id}/players/${teamLineup.goalkeeperID}`}
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >{`GK - ${
          players.find((player) => player.id === teamLineup.goalkeeperID)
            ?.lastName
        }`}</ListItem>
      </List>
      <Typography variant="h6">Defenders:</Typography>
      <List>
        {teamLineup.defenders.map((defender) => (
          <ListItem
            key={defender.playerID}
            component={Link}
            to={`/save-games/${id}/players/${defender.playerID}`}
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >{`${defender.position} - ${
            players.find((player) => player.id === defender.playerID)?.lastName
          }`}</ListItem>
        ))}
      </List>
      <Typography variant="h6">Midfielders:</Typography>
      <List>
        {teamLineup.midfielders.map((midfielder) => (
          <ListItem
            key={midfielder.playerID}
            component={Link}
            to={`/save-games/${id}/players/${midfielder.playerID}`}
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >{`${midfielder.position} - ${
            players.find((player) => player.id === midfielder.playerID)
              ?.lastName
          }`}</ListItem>
        ))}
      </List>
      <Typography variant="h6">Strikers:</Typography>
      <List>
        {teamLineup.strikers.map((striker) => (
          <ListItem
            key={striker.playerID}
            component={Link}
            to={`/save-games/${id}/players/${striker.playerID}`}
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >{`${striker.position} - ${
            players.find((player) => player.id === striker.playerID)?.lastName
          }`}</ListItem>
        ))}
      </List>
    </Stack>
  );
};
