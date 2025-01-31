import {
  Box,
  List,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { SaveGameContext } from "./savegame-layout";

const Schedule = () => {
  const {
    saveGameDB: {
      seasons: seasonsDB,
      leagues: leaguesDB,
      teams,
      matchDays: matchDaysDB,
      matches: matchesDB,
    },
  } = useContext(SaveGameContext);
  const [selectedLeagueID, setSelectedLeagueID] = useState<number>(1);
  const [selectedMatchDayID, setSelectedMatchDayID] = useState<string>("");

  const teamNames = useLiveQuery(() => teams.toArray(), [], []).reduce(
    (acc, team) => {
      acc[team.id!] = team.name;
      return acc;
    },
    {} as Record<number, string>
  );

  const leagues = useLiveQuery(() => leaguesDB.toArray(), [], []);

  const season = useLiveQuery(
    () => seasonsDB.where({ leagueID: selectedLeagueID }).first(),
    [selectedLeagueID]
  );

  const matchDays = useLiveQuery(
    () =>
      season?.id
        ? matchDaysDB.where({ seasonID: season.id }).sortBy("day")
        : [],
    [season?.id],
    []
  );

  const matches = useLiveQuery(
    () => matchesDB.where({ matchDayID: selectedMatchDayID }).toArray(),
    [selectedMatchDayID],
    []
  );

  const selectedMatchDay = useMemo(
    () => matchDays.find((matchDay) => matchDay.id === selectedMatchDayID),
    [matchDays, selectedMatchDayID]
  );

  return (
    <Box>
      <Typography variant="h6">Schedule</Typography>
      <Box flexDirection={"row"} display="flex" gap={2} alignItems={"center"}>
        <Typography variant="body1">Select a league:</Typography>
        <Select
          value={selectedLeagueID}
          size="small"
          onChange={(e) => {
            setSelectedMatchDayID("");
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
        <Typography variant="body1">Select a match day:</Typography>
        <Select
          value={selectedMatchDayID}
          size="small"
          onChange={(e) => setSelectedMatchDayID(e.target.value)}
          sx={{ minWidth: 200, marginTop: 2 }}
        >
          {matchDays.map((matchDay) => (
            <MenuItem key={matchDay.id} value={matchDay.id}>
              {matchDay.day}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <List>
        {!selectedMatchDayID && (
          <Typography variant="subtitle1">
            Select a match day to see matches.
          </Typography>
        )}
        {selectedMatchDayID && selectedMatchDay && (
          <Box key={selectedMatchDay.day} sx={{ marginTop: 2 }}>
            <Typography variant="h6">Day {selectedMatchDay.day}</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Home</TableCell>
                  <TableCell>Away</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{teamNames[match.homeTeamID]}</TableCell>
                    <TableCell>{teamNames[match.awayTeamID]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default Schedule;
