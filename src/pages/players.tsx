import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { SaveGameContext } from "./savegame-layout";
import { useLiveQuery } from "dexie-react-hooks";

const Players = () => {
  const {
    saveGameDB: { playersDB, teamsDB },
    saveGame: { id },
  } = useContext(SaveGameContext);
  const { teamid } = useParams();

  const teamPlayers = useLiveQuery(
    () => playersDB.where({ teamID: Number(teamid) }).toArray(),
    [teamid],
    []
  );

  const team = useLiveQuery(() => teamsDB.get(Number(teamid)), [teamid]);

  const columns = [
    "First Name",
    "Last Name",
    "Age",
    "Skill",
    "Position",
    "See Details",
  ];

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{team?.name} Players</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {teamPlayers?.map((player) => (
              <TableRow
                key={player.id}
                // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {player.firstName}
                </TableCell>
                <TableCell>{player.lastName}</TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell>{player.skill}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>
                  <Link to={`/save-games/${id}/players/${player.id}`}>
                    <VisibilityIcon />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Players;
