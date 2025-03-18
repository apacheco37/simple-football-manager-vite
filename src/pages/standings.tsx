import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useRef, useState } from "react";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";

import { SaveGameContext } from "./savegame-layout";
import Table from "../components/table";
import TypographyLink from "../components/typography-link";

const Standings = () => {
  const {
    saveGameDB: { teamsDB, leaguesDB, standingsDB, seasonsDB },
    saveGame: { humanTeamID },
  } = useContext(SaveGameContext);
  const [selectedLeagueID, setSelectedLeagueID] = useState<number | "">("");
  const [selectedSeasonID, setSelectedSeasonID] = useState<number | "">("");
  const initialLeagueSet = useRef(false);
  const initialSeasonSet = useRef(false);

  const teamNames = useLiveQuery(() => teamsDB.toArray(), [], []).reduce(
    (acc, team) => {
      acc[team.id!] = team.name;
      return acc;
    },
    {} as Record<number, string>
  );

  const leagues = useLiveQuery(() => leaguesDB.toArray(), [], []);

  useEffect(() => {
    if (!initialLeagueSet.current && leagues.length) {
      setSelectedLeagueID(leagues[0].id!);
      initialLeagueSet.current = true;
    }
  }, [leagues]);

  const seasons = useLiveQuery(
    () =>
      selectedLeagueID !== ""
        ? seasonsDB.where({ leagueID: selectedLeagueID }).toArray()
        : [],
    [selectedLeagueID],
    []
  );

  useEffect(() => {
    if (!initialSeasonSet.current && seasons.length && leagues.length) {
      const league = leagues.find((league) => league.id === selectedLeagueID);
      setSelectedSeasonID(league ? league.currentSeasonID! : seasons[0].id!);
      initialSeasonSet.current = true;
    }
  }, [leagues, seasons, selectedLeagueID]);

  const standings = useLiveQuery(
    () =>
      selectedSeasonID !== ""
        ? standingsDB.get({ seasonID: selectedSeasonID })
        : undefined,
    [selectedSeasonID]
  );

  const humanTeamCellStyle = (teamID: string) =>
    Number(teamID) === humanTeamID ? { fontWeight: "bold" } : {};

  return (
    <Stack spacing={2}>
      <Box flexDirection={"row"} display="flex" gap={2} alignItems={"center"}>
        <Typography variant="body1">League:</Typography>
        <Select
          value={selectedLeagueID}
          size="small"
          onChange={(e) => {
            setSelectedLeagueID(e.target.value as number);
          }}
          sx={{ minWidth: 200, marginTop: 2 }}
        >
          {leagues.map((league) => (
            <MenuItem key={league.id} value={league.id}>
              {league.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body1">Season:</Typography>
        <Select
          value={selectedSeasonID}
          size="small"
          onChange={(e) => {
            setSelectedSeasonID(e.target.value as number);
          }}
          sx={{ minWidth: 200, marginTop: 2 }}
        >
          {seasons.map((season) => (
            <MenuItem key={season.id} value={season.id}>
              {season.year}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Table
        columns={[
          { render: (_, index) => index + 1, label: "Position" },
          {
            render: ({ id }) => (
              <TypographyLink
                text={teamNames[Number(id)]}
                link={`teams/${id}/players`}
              />
            ),
            label: "Team",
          },
          {
            render: ({ wins, draws, losses }) => wins + draws + losses,
            label: "Played",
          },
          { key: "wins", label: "Won" },
          { key: "draws", label: "Drawn" },
          { key: "losses", label: "Lost" },
          { key: "goalsFor", label: "Goals For" },
          { key: "goalsAgainst", label: "Goals Against" },
          {
            render: (teamStats) => teamStats.goalsFor - teamStats.goalsAgainst,
            label: "Goal Difference",
          },
          { key: "points", label: "Points" },
        ]}
        cellStyle={(teamStats) => humanTeamCellStyle(teamStats.id)}
        rows={Object.entries(standings?.teams ?? [])
          .sort((a, b) =>
            b[1].points !== a[1].points
              ? b[1].points - a[1].points
              : b[1].goalsFor -
                b[1].goalsAgainst -
                (a[1].goalsFor - a[1].goalsAgainst)
          )
          .map(([teamID, teamStats]) => ({ id: teamID, ...teamStats }))}
      />
    </Stack>
  );
};

export default Standings;
