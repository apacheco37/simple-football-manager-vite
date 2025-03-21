import { Box, List, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useMemo, useState } from "react";

import { SaveGameContext } from "./savegame-layout";
import Table from "../components/table";

const Schedule = () => {
  const {
    saveGameDB: { leaguesDB, teamsDB, matchesDB, seasonsDB },
    saveGame: { humanTeamID, id },
  } = useContext(SaveGameContext);
  const [selectedLeagueID, setSelectedLeagueID] = useState<number | "">("");
  const [selectedSeasonID, setSelectedSeasonID] = useState<number | "">("");
  const [selectedMatchDay, setSelectedMatchDay] = useState<number | "">("");

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

  const selectedSeasonDays = useMemo(() => {
    const season = seasons.find((s) => s.id === selectedSeasonID);
    return season?.days;
  }, [selectedSeasonID, seasons]);

  const seasonDaysSelectOptions = useMemo(() => {
    if (!selectedSeasonDays) return [];

    return Array.from({ length: selectedSeasonDays }, (_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        {i + 1}
      </MenuItem>
    ));
  }, [selectedSeasonDays]);

  const matches = useLiveQuery(
    () =>
      selectedSeasonID !== "" && selectedMatchDay !== ""
        ? matchesDB
            .where({ seasonID: selectedSeasonID, day: selectedMatchDay })
            .toArray()
        : [],
    [selectedSeasonID, selectedMatchDay],
    []
  );

  const humanTeamCellStyle = (homeTeamID: number, awayTeamID: number) =>
    homeTeamID === humanTeamID || awayTeamID === humanTeamID
      ? { fontWeight: "bold" }
      : {};

  return (
    <Box>
      <Typography variant="h6">Schedule</Typography>
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
        <Typography variant="body1">Match Day:</Typography>
        <Select
          value={selectedMatchDay}
          size="small"
          onChange={(e) => setSelectedMatchDay(e.target.value as number)}
          sx={{ minWidth: 200, marginTop: 2 }}
        >
          {...seasonDaysSelectOptions}
        </Select>
      </Box>
      <List>
        {!selectedMatchDay && (
          <Typography variant="subtitle1">
            Select a match day to see matches.
          </Typography>
        )}
        {selectedMatchDay && (
          <Stack key={selectedMatchDay} sx={{ marginTop: 2 }} spacing={2}>
            <Typography variant="h6">Day {selectedMatchDay}</Typography>
            <Table
              columns={[
                {
                  render: (match) => (
                    <Typography
                      sx={humanTeamCellStyle(
                        match.homeTeamID,
                        match.awayTeamID
                      )}
                    >
                      {teamNames[match.homeTeamID]}{" "}
                      {match.events?.homeTeam?.length}
                    </Typography>
                  ),
                  label: "Home",
                },
                {
                  render: (match) => (
                    <Typography
                      sx={humanTeamCellStyle(
                        match.homeTeamID,
                        match.awayTeamID
                      )}
                    >
                      {teamNames[match.awayTeamID]}{" "}
                      {match.events?.awayTeam?.length}
                    </Typography>
                  ),
                  label: "Away",
                },
              ]}
              rows={matches}
              basePath={`/save-games/${id}/matches`}
            />
          </Stack>
        )}
      </List>
    </Box>
  );
};

export default Schedule;
