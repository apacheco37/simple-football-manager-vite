import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { ALL_FORMATIONS, Formation, Player, Position } from "../db/db";
import { SaveGameContext } from "./savegame-layout";
import { calculatePlayerSkillInPosition } from "../utils/positions";

const Lineup = () => {
  const {
    saveGameDB: { playersDB, teamLineupsDB },
    saveGame: { humanTeamID },
  } = useContext(SaveGameContext);

  const [selectedFormation, setSelectedFormation] = useState<Formation>(
    ALL_FORMATIONS[0]
  );
  const [goalkeeperID, setGoalkeeperID] = useState<number[]>([]);
  const [defendersIDs, setDefendersIDs] = useState<number[]>([]);
  const [midfieldersIDs, setMidfieldersIDs] = useState<number[]>([]);
  const [strikersIDs, setStrikersIDs] = useState<number[]>([]);
  const [lineupIncompleteDialog, setLineupIncompleteDialog] = useState(false);

  const teamPlayers = useLiveQuery(
    () => playersDB.filter((player) => player.teamID === humanTeamID).toArray(),
    [humanTeamID],
    [] as Player[]
  );

  const teamLineup = useLiveQuery(
    () => teamLineupsDB.get(humanTeamID!), // TODO: better way to check this page is not accessed if there is no human team
    [humanTeamID],
    null
  );

  useEffect(() => {
    if (teamLineup) {
      setSelectedFormation(
        ALL_FORMATIONS.find(
          (formation) =>
            formation.defenders.length === teamLineup.defenders.length &&
            formation.midfielders.length === teamLineup.midfielders.length &&
            formation.strikers.length === teamLineup.strikers.length
        ) ?? ALL_FORMATIONS[0]
      );
      setGoalkeeperID([teamLineup.goalkeeperID]);
      setDefendersIDs(
        teamLineup.defenders.map((defender) => defender.playerID)
      );
      setMidfieldersIDs(
        teamLineup.midfielders.map((midfielder) => midfielder.playerID)
      );
      setStrikersIDs(teamLineup.strikers.map((striker) => striker.playerID));
    }
  }, [teamLineup]);

  const selectedPlayersIDs = useMemo(() => {
    const players = new Set<number>();
    if (goalkeeperID.length) {
      players.add(goalkeeperID[0]);
    }
    if (defendersIDs.length) {
      defendersIDs.forEach((id) => players.add(id));
    }
    if (midfieldersIDs.length) {
      midfieldersIDs.forEach((id) => players.add(id));
    }
    if (strikersIDs.length) {
      strikersIDs.forEach((id) => players.add(id));
    }
    return players;
  }, [goalkeeperID, defendersIDs, midfieldersIDs, strikersIDs]);

  const handleSave = () => {
    if (
      !isLineupComplete(
        selectedFormation,
        goalkeeperID,
        defendersIDs,
        midfieldersIDs,
        strikersIDs
      )
    ) {
      setLineupIncompleteDialog(true);
      return;
    }
    teamLineupsDB.put({
      teamID: humanTeamID!,
      goalkeeperID: goalkeeperID[0],
      defenders: defendersIDs.map((id, index) => ({
        position: selectedFormation.defenders[index],
        playerID: id,
      })),
      midfielders: midfieldersIDs.map((id, index) => ({
        position: selectedFormation.midfielders[index],
        playerID: id,
      })),
      strikers: strikersIDs.map((id, index) => ({
        position: selectedFormation.strikers[index],
        playerID: id,
      })),
    });
  };

  const handleReset = () => {
    setGoalkeeperID([]);
    setDefendersIDs([]);
    setMidfieldersIDs([]);
    setStrikersIDs([]);
  };

  return (
    <Stack direction={"column"} spacing={2}>
      <Dialog
        open={lineupIncompleteDialog}
        onClose={() => setLineupIncompleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Incomplete Lineup</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All positions must be filled before saving the lineup.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLineupIncompleteDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4">Lineup</Typography>
      <Stack direction={"row"} spacing={2}>
        <Typography alignSelf={"center"}>Formation:</Typography>
        <Select
          value={selectedFormation.name}
          onChange={(e) => {
            setGoalkeeperID([]);
            setDefendersIDs([]);
            setMidfieldersIDs([]);
            setStrikersIDs([]);
            setSelectedFormation(
              ALL_FORMATIONS.find(
                (formation) => formation.name === e.target.value
              ) ?? ALL_FORMATIONS[0]
            );
          }}
          size="small"
          sx={{ maxWidth: "20%" }}
        >
          {ALL_FORMATIONS.map(({ name }) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Stack>
      <PlayersInLine
        allPlayers={teamPlayers}
        selectedPlayersIDs={selectedPlayersIDs}
        positions={["GK"]}
        playerIDsInLine={goalkeeperID}
        onChange={setGoalkeeperID}
      />
      <PlayersInLine
        allPlayers={teamPlayers}
        selectedPlayersIDs={selectedPlayersIDs}
        positions={selectedFormation.defenders}
        playerIDsInLine={defendersIDs}
        onChange={setDefendersIDs}
      />
      <PlayersInLine
        allPlayers={teamPlayers}
        selectedPlayersIDs={selectedPlayersIDs}
        positions={selectedFormation.midfielders}
        playerIDsInLine={midfieldersIDs}
        onChange={setMidfieldersIDs}
      />
      <PlayersInLine
        allPlayers={teamPlayers}
        selectedPlayersIDs={selectedPlayersIDs}
        positions={selectedFormation.strikers}
        playerIDsInLine={strikersIDs}
        onChange={setStrikersIDs}
      />
    </Stack>
  );
};

export default Lineup;

const PlayersInLine = ({
  allPlayers,
  selectedPlayersIDs,
  positions,
  playerIDsInLine,
  onChange,
}: {
  allPlayers: Player[];
  selectedPlayersIDs: Set<number>;
  positions: Position[];
  playerIDsInLine: number[];
  onChange: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const selectionItems = [];

  for (let i = positions.length - 1; i >= 0; i--) {
    selectionItems.push(
      <Stack direction={"column"} minWidth={"15%"}>
        <Typography textAlign={"center"}>{positions[i]}</Typography>
        <Select
          value={playerIDsInLine[i] ?? ""}
          key={`defenders-${i}`} // TODO: fix key
          size="small"
          onChange={(e) => {
            onChange((previousValues) => {
              const newState = [...previousValues];
              newState[i] = Number(e.target.value);
              return newState;
            });
          }}
        >
          {allPlayers
            .sort((a, b) => b.skill - a.skill)
            .map((player) => (
              <MenuItem
                key={player.id}
                value={player.id}
                selected={player.id === playerIDsInLine[i]}
                disabled={selectedPlayersIDs.has(player.id!)}
              >
                {`${player.lastName} - ${
                  player.position
                } - ${calculatePlayerSkillInPosition(
                  player.skill,
                  player.position,
                  positions[i]
                ).toFixed(1)}`}
              </MenuItem>
            ))}
        </Select>
      </Stack>
    );
  }

  return (
    <Stack direction={"row"} spacing={2} justifyContent={"center"}>
      {selectionItems}
    </Stack>
  );
};

const isLineupComplete = (
  selectedFormation: Formation,
  goalkeeperID: number[],
  defendersIDs: number[],
  midfieldersIDs: number[],
  strikersIDs: number[]
) => {
  return (
    goalkeeperID.filter((id) => id ?? null !== null).length === 1 &&
    defendersIDs.filter((id) => id ?? null !== null).length ===
      selectedFormation.defenders.length &&
    midfieldersIDs.filter((id) => id ?? null !== null).length ===
      selectedFormation.midfielders.length &&
    strikersIDs.filter((id) => id ?? null !== null).length ===
      selectedFormation.strikers.length
  );
};
