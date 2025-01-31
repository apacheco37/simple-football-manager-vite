import { useContext } from "react";
import { useParams } from "react-router-dom";

import { SaveGameContext } from "./savegame-layout";
import { Typography } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";

const PlayerDetails = () => {
  const { playerid } = useParams();
  const {
    saveGameDB: { players },
  } = useContext(SaveGameContext);

  const player = useLiveQuery(() => players.get(Number(playerid)));

  if (!player) {
    return <></>;
  }

  return (
    <div>
      <Typography variant="h4">{`${player.firstName} ${player.lastName}`}</Typography>
      <Typography>{`${player.position}, ${player.age} years old `}</Typography>
      <Typography>{`Skill: ${player.skill}`}</Typography>
    </div>
  );
};

export default PlayerDetails;
