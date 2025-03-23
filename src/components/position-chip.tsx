import { Chip } from "@mui/material";
import { Position } from "../db/db";
import { useMemo } from "react";

const PositionChip = ({ position }: { position: Position }) => {
  // kinda dumb but works for now
  const color = useMemo(() => {
    switch (position) {
      case "GK":
        return "success";
      case "DF-C":
      case "DF-R":
      case "DF-L":
        return "info";
      case "MF-C":
      case "MF-L":
      case "MF-R":
        return "warning";
      case "ST-C":
      case "ST-L":
      case "ST-R":
        return "error";
      default:
        return "default";
    }
  }, [position]);

  return <Chip label={position} color={color} size="small" />;
};

export default PositionChip;
