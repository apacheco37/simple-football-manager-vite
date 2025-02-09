import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { SaveGameContext } from "./savegame-layout";

const Standings = () => {
  const {
    saveGameDB: { teamsDB, leaguesDB, standingsDB, seasonsDB },
    saveGame: { humanTeamID },
  } = useContext(SaveGameContext);
  const [selectedLeagueID, setSelectedLeagueID] = useState<number | "">("");
  const [selectedSeasonID, setSelectedSeasonID] = useState<number | "">("");

  const teamNames = useLiveQuery(() => teamsDB.toArray(), [], []).reduce(
    (acc, team) => {
      acc[team.id!] = team.name;
      return acc;
    },
    {} as Record<number, string>
  );

  const leagues = useLiveQuery(() => leaguesDB.toArray(), [], []);

  useEffect(() => {
    if (leagues.length) {
      setSelectedLeagueID(leagues[0].id!);
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
    if (seasons.length) {
      setSelectedSeasonID(seasons[0].id!);
    }
  }, [seasons]);

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
    <Box>
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Team</TableCell>
            {/* <TableCell>Played</TableCell> */}
            <TableCell>Won</TableCell>
            <TableCell>Drawn</TableCell>
            <TableCell>Lost</TableCell>
            <TableCell>Goals For</TableCell>
            <TableCell>Goals Against</TableCell>
            <TableCell>Goal Difference</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {standings &&
            Object.entries(standings.teams)
              .sort((a, b) =>
                b[1].points !== a[1].points
                  ? b[1].points - a[1].points
                  : b[1].goalsFor -
                    b[1].goalsAgainst -
                    (a[1].goalsFor - a[1].goalsAgainst)
              )
              .map(([teamID, teamStats], index) => (
                <TableRow key={teamID}>
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {teamNames[Number(teamID)]}
                  </TableCell>
                  {/* <TableCell sx={{ fontWeight: isHumanTeam(teamID) ? "bold" : undefined }}>{standing[1].played}</TableCell> */}
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {teamStats.wins}
                  </TableCell>
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {teamStats.draws}
                  </TableCell>
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {teamStats.losses}
                  </TableCell>
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {teamStats.goalsFor}
                  </TableCell>
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {teamStats.goalsAgainst}
                  </TableCell>
                  <TableCell sx={humanTeamCellStyle(teamID)}>
                    {teamStats.goalsFor - teamStats.goalsAgainst}
                  </TableCell>
                  <TableCell>{teamStats.points}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Standings;
