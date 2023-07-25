import { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { LeagueContext } from "./leaguelayout";

const Players = () => {
  const {
    league: { players },
  } = useContext(LeagueContext);
  const { teamid } = useParams();

  const teamPlayers = players.filter(
    (player) => player.teamID === Number(teamid!)
  );

  const columns = ["First Name", "Last Name", "Age", "Skill", "Position"];

  return (
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
          {teamPlayers.map((player) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Players;
