import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";

import { SaveGameContext } from "./savegame-layout";
import { useLiveQuery } from "dexie-react-hooks";
import Table, { Column } from "../components/table";
import { Player } from "../db/db";
import { stringSorter } from "../utils/sorting";

const Players = () => {
  const {
    saveGameDB: { playersDB, teamsDB },
    saveGame: { id },
  } = useContext(SaveGameContext);
  const { teamid } = useParams();

  const teamPlayers = useLiveQuery<Player[], Player[]>(
    () => playersDB.where({ teamID: Number(teamid) }).toArray(),
    [teamid],
    []
  );

  const team = useLiveQuery(() => teamsDB.get(Number(teamid)), [teamid]);

  const columns: Column<Player>[] = [
    {
      key: "firstName",
      label: "First Name",
      sortable: true,
      sorter: (a, b, sorter) => stringSorter(a.firstName, b.firstName, sorter),
    },
    { key: "lastName", label: "Last Name" },
    { key: "age", label: "Age" },
    { key: "skill", label: "Skill" },
    { key: "position", label: "Position" },
  ];

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{team?.name} Players</Typography>
      <Table
        columns={columns}
        rows={teamPlayers}
        basePath={`/save-games/${id}/players`}
      />
    </Stack>
  );
};

export default Players;
