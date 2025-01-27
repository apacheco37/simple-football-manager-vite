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
import { useContext, useState } from "react";
import { SaveGameContext } from "./savegame-layout";

const Schedule = () => {
  const {
    saveGame: { leagues, teams },
  } = useContext(SaveGameContext);
  const [selectedLeagueId, setSelectedLeagueId] = useState(leagues[0].id);

  const teamNames = teams.reduce((acc, team) => {
    acc[team.id] = team.name;
    return acc;
  }, {} as Record<number, string>);

  return (
    <Box>
      <Typography variant="h6">Schedule</Typography>
      <Box flexDirection={"row"} display="flex" gap={2} alignItems={"center"}>
        <Typography variant="body1">Select a league:</Typography>
        <Select
          id="demo-simple-select"
          value={selectedLeagueId}
          size="small"
          onChange={(e) => setSelectedLeagueId(e.target.value as number)}
          sx={{ minWidth: 200, marginTop: 2 }}
        >
          {leagues.map((league) => (
            <MenuItem key={league.id} value={league.id}>
              {league.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <List>
        {leagues
          .find((league) => league.id === selectedLeagueId)
          ?.seasons.map((season) =>
            season.fixture
              .sort((a, b) => a.day - b.day)
              .map((matchDay) => (
                <Box key={matchDay.day} sx={{ marginTop: 2 }}>
                  <Typography variant="h6">Day {matchDay.day}</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Home</TableCell>
                        <TableCell>Away</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {matchDay.matches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>{teamNames[match.homeTeamID]}</TableCell>
                          <TableCell>{teamNames[match.awayTeamID]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ))
          )}
      </List>
    </Box>
  );
};

export default Schedule;
