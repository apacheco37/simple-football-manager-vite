import { useContext } from "react";
import { useParams } from "react-router-dom";

import { SaveGameContext } from "./savegame-layout";
import { Typography } from "@mui/material";

const PlayerDetails = () => {
  const { playerid } = useParams();
  const {
    saveGame: { players },
  } = useContext(SaveGameContext);

  const player = players.filter((player) => player.id === Number(playerid!))[0];

  return (
    <div>
      <Typography variant="h4">{`${player.firstName} ${player.lastName}`}</Typography>
      <Typography>{`${player.position}, ${player.age} years old `}</Typography>
      <Typography>{`Skill: ${player.skill}`}</Typography>
    </div>
  );
};

export default PlayerDetails;
