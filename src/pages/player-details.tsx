import { useContext } from "react";
import { useParams } from "react-router-dom";

import { SaveGameContext } from "./savegame-layout";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import TypographyLink from "../components/typography-link";
import CountryFlag from "../components/country-flag";
import PositionChip from "../components/position-chip";

const PlayerDetails = () => {
  const { playerid } = useParams();
  const {
    saveGameDB: { playersDB, teamsDB },
  } = useContext(SaveGameContext);

  const player = useLiveQuery(() => playersDB.get(Number(playerid)));
  const team = useLiveQuery(
    () => (player?.teamID ? teamsDB.get(player.teamID) : undefined),
    [player]
  );

  if (!player) {
    return <></>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <CountryFlag countryCode={player.nationalityCode} />
        <Typography variant="h4">{`${player.firstName} ${player.lastName}`}</Typography>
      </Stack>
      <TableContainer component={Paper} sx={{ width: "30%" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Team</TableCell>
              <TableCell>
                <TypographyLink
                  text={team?.name ?? ""}
                  link={`teams/${player.teamID}/players`}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
              <TableCell>
                {<PositionChip position={player.position} />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Age</TableCell>
              <TableCell>{player.age} years old</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Skill</TableCell>
              <TableCell>{player.skill}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default PlayerDetails;
